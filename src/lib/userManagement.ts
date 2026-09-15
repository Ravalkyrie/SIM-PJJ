/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AppUser, UserRole, SUPER_ADMIN_EMAIL } from '../types';

/**
 * Get user role from Firestore
 */
export async function getUserRole(uid: string, email: string): Promise<UserRole> {
  try {
    // Check if super admin
    if (email === SUPER_ADMIN_EMAIL) {
      return 'admin';
    }

    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as AppUser;
      return userData.role || 'visitor';
    }
    
    // Default role for new users
    return 'visitor';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'visitor';
  }
}

/**
 * Initialize user in Firestore (called on first login)
 */
export async function initializeUser(user: User): Promise<AppUser> {
  const uid = user.uid;
  const email = user.email || '';
  
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // User exists, return existing data
      return userDoc.data() as AppUser;
    }
    
    // Check if user exists by email (manual addition)
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // User was manually added, update with uid
      const existingUserDoc = querySnapshot.docs[0];
      const existingUserData = existingUserDoc.data() as AppUser;
      
      const updatedUser: AppUser = {
        ...existingUserData,
        uid,
        updatedAt: new Date().toISOString()
      };
      
      // Delete old document and create new with correct uid
      await deleteDoc(doc(db, 'users', existingUserDoc.id));
      await setDoc(userDocRef, updatedUser);
      
      console.log(`✅ User linked: ${email} with role: ${existingUserData.role}`);
      return updatedUser;
    }
    
    // New user not in system, give visitor role by default
    const role: UserRole = email === SUPER_ADMIN_EMAIL ? 'admin' : 'visitor';
    
    const newUser: AppUser = {
      uid,
      email,
      displayName: user.displayName || email.split('@')[0],
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(userDocRef, newUser);
    console.log(`✅ User initialized: ${email} with role: ${role}`);
    
    return newUser;
  } catch (error) {
    console.error('Error initializing user:', error);
    throw error;
  }
}

/**
 * List all users from Firestore (manual additions)
 */
export async function listAllUsers(): Promise<AppUser[]> {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const users: AppUser[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as AppUser);
    });
    
    return users;
  } catch (error) {
    console.error('Error listing users:', error);
    throw error;
  }
}

/**
 * Add new user manually (Admin only)
 */
export async function addUserManually(email: string, role: UserRole): Promise<void> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Format email tidak valid');
    }

    // Check if email already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('User sudah terdaftar');
    }

    // Create temporary uid (will be replaced when user logs in)
    const tempUid = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newUser: AppUser = {
      uid: tempUid,
      email,
      displayName: email.split('@')[0],
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', tempUid), newUser);
    console.log(`✅ User added manually: ${email} with role: ${role}`);
  } catch (error: any) {
    console.error('Error adding user manually:', error);
    throw error;
  }
}

/**
 * Update user role (Admin only)
 */
export async function updateUserRole(uid: string, newRole: UserRole): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      role: newRole,
      updatedAt: new Date().toISOString()
    });
    console.log(`✅ User role updated to: ${newRole}`);
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

/**
 * Delete user from Firestore (Admin only)
 * Note: This only removes the user from access management, not from Firebase Auth
 */
export async function deleteUser(uid: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'users', uid));
    console.log(`✅ User access removed from system`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Get full user data
 */
export async function getAppUser(uid: string): Promise<AppUser | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as AppUser;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting app user:', error);
    return null;
  }
}

/**
 * Check if user has permission
 */
export function hasPermission(userRole: UserRole, requiredPermission: 'read' | 'write' | 'delete' | 'manage_users'): boolean {
  const permissions = {
    admin: ['read', 'write', 'delete', 'manage_users'],
    user: ['read', 'write', 'delete'],
    visitor: ['read']
  };
  
  return permissions[userRole]?.includes(requiredPermission) || false;
}

/**
 * Check if user can access route
 */
export function canAccessRoute(userRole: UserRole, route: string): boolean {
  // Admin can access all routes
  if (userRole === 'admin') return true;
  
  // Visitor restrictions
  if (userRole === 'visitor') {
    const restrictedRoutes = ['/log-aktivitas', '/hak-akses', '/kontrak/tambah'];
    return !restrictedRoutes.some(r => route.startsWith(r));
  }
  
  // User restrictions
  if (userRole === 'user') {
    const restrictedRoutes = ['/hak-akses'];
    return !restrictedRoutes.some(r => route.startsWith(r));
  }
  
  return false;
}
