import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

/**
 * Login user with email and password
 */
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Login berhasil:', userCredential.user.email);
    return userCredential.user;
  } catch (error: any) {
    console.error('❌ Login gagal:', error);
    
    // Translate error messages to Indonesian
    let errorMessage = 'Login gagal';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Email tidak terdaftar';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Password salah';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Format email tidak valid';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Akun telah dinonaktifkan';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Terlalu banyak percobaan login. Coba lagi nanti';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Koneksi internet bermasalah';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Email atau password salah';
        break;
      default:
        errorMessage = error.message || 'Login gagal';
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Register new user (Admin only - for creating accounts)
 */
export const registerUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ User berhasil dibuat:', userCredential.user.email);
    return userCredential.user;
  } catch (error: any) {
    console.error('❌ Registrasi gagal:', error);
    
    let errorMessage = 'Registrasi gagal';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Email sudah terdaftar';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Format email tidak valid';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password terlalu lemah (minimal 6 karakter)';
        break;
      default:
        errorMessage = error.message || 'Registrasi gagal';
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Logout current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('✅ Logout berhasil');
  } catch (error: any) {
    console.error('❌ Logout gagal:', error);
    throw new Error(error.message || 'Logout gagal');
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('✅ Email reset password terkirim');
  } catch (error: any) {
    console.error('❌ Reset password gagal:', error);
    
    let errorMessage = 'Reset password gagal';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Email tidak terdaftar';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Format email tidak valid';
        break;
      default:
        errorMessage = error.message || 'Reset password gagal';
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
