/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

// Super Admin Email
const SUPER_ADMIN_EMAIL = 'sagalaarief@gmail.com';

/**
 * Cloud Function: List All Users from Firebase Authentication
 * Only accessible by Admin and Super Admin
 */
export const listAllUsers = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to access this function.'
    );
  }

  const callerUid = context.auth.uid;

  try {
    // Get caller's role from Firestore
    const callerDoc = await db.collection('users').doc(callerUid).get();
    const callerRole = callerDoc.exists ? callerDoc.data()?.role : 'visitor';

    // Only admin and super admin can list users
    if (callerRole !== 'admin') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only administrators can access user list.'
      );
    }

    // List all users from Firebase Authentication
    const listUsersResult = await auth.listUsers(1000); // Max 1000 users per call
    
    const users = await Promise.all(
      listUsersResult.users.map(async (userRecord) => {
        // Get role from Firestore
        const userDoc = await db.collection('users').doc(userRecord.uid).get();
        
        let role = 'visitor'; // Default role
        
        if (userDoc.exists) {
          role = userDoc.data()?.role || 'visitor';
        } else {
          // If user doesn't exist in Firestore, create with default role
          const defaultRole = userRecord.email === SUPER_ADMIN_EMAIL ? 'admin' : 'visitor';
          await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email: userRecord.email || '',
            displayName: userRecord.displayName || '',
            role: defaultRole,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          role = defaultRole;
        }

        return {
          uid: userRecord.uid,
          email: userRecord.email || '',
          displayName: userRecord.displayName || '',
          role: role,
          isSuperAdmin: userRecord.email === SUPER_ADMIN_EMAIL
        };
      })
    );

    return { users };
  } catch (error: any) {
    console.error('Error listing users:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to list users: ' + error.message
    );
  }
});

/**
 * Cloud Function: Update User Role
 * Only accessible by Admin and Super Admin
 */
export const updateUserRole = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to update roles.'
    );
  }

  const callerUid = context.auth.uid;
  const { targetUid, newRole } = data;

  // Validate input
  if (!targetUid || !newRole) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing targetUid or newRole parameter.'
    );
  }

  if (!['admin', 'user', 'visitor'].includes(newRole)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid role. Must be admin, user, or visitor.'
    );
  }

  try {
    // Get caller's role
    const callerDoc = await db.collection('users').doc(callerUid).get();
    const callerRole = callerDoc.exists ? callerDoc.data()?.role : 'visitor';

    // Only admin can update roles
    if (callerRole !== 'admin') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only administrators can update user roles.'
      );
    }

    // Get target user info
    const targetUserRecord = await auth.getUser(targetUid);
    const targetEmail = targetUserRecord.email;

    // Prevent changing Super Admin role
    if (targetEmail === SUPER_ADMIN_EMAIL) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Cannot modify Super Admin role.'
      );
    }

    // Update role in Firestore
    await db.collection('users').doc(targetUid).update({
      role: newRole,
      updatedAt: new Date().toISOString()
    });

    return { 
      success: true, 
      message: `Role updated to ${newRole} successfully.` 
    };
  } catch (error: any) {
    console.error('Error updating user role:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to update role: ' + error.message
    );
  }
});

/**
 * Auth Trigger: Auto-create Firestore document when new user signs up
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const uid = user.uid;
  const email = user.email || '';
  const displayName = user.displayName || '';

  // Determine default role
  const defaultRole = email === SUPER_ADMIN_EMAIL ? 'admin' : 'visitor';

  try {
    // Create user document in Firestore
    await db.collection('users').doc(uid).set({
      uid: uid,
      email: email,
      displayName: displayName,
      role: defaultRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log(`User ${email} created with role: ${defaultRole}`);
  } catch (error) {
    console.error('Error creating user document:', error);
  }
});
