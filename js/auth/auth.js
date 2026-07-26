import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification,
    signInWithPopup,
    GoogleAuthProvider,
    fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "../config/firebase.js";

// Helper to translate Firebase error codes into clean UI messages
function getErrorMessage(errorCode) {
    switch (errorCode) {
         case 'auth/user-not-found': return 'No account found with this email.';
        case 'auth/wrong-password': return 'Incorrect password. Please try again.';
        case 'auth/email-already-in-use': return 'An account already exists with this email.';
        case 'auth/weak-password': return 'Password should be at least 6 characters.';
        case 'auth/too-many-requests': return 'Too many failed attempts. Please wait a moment.';
        case 'auth/network-request-failed': return 'Network error. Check your internet connection.';
        case 'auth/popup-closed-by-user': return 'Google sign-in was cancelled.';
        case 'auth/account-exists-with-different-credential': return 'An account already exists with the same email but a different sign-in method.';
        
        // 🆕 ADD THIS CASE:
        case 'auth/unauthorized-domain': return 'This domain is not authorized for Google sign-in. Please contact the site owner.';
        
        default: return 'An unexpected error occurred. Please try again.';
    }
}

// 1. SIGN UP with Email Verification
export async function signUpUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user);
        
        // Automatically log them out until they verify their email
        await signOut(auth);

        return {
            success: true,
            message: 'Verification email sent! Please check your inbox and verify before logging in.'
        };
    } catch (error) {
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
}

// 2. LOGIN (with Email Verification Check)
export async function logInUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if email is verified
        if (!user.emailVerified) {
            // Sign them out immediately
            await signOut(auth);
            return {
                success: false,
                error: 'Please verify your email first. Check your inbox (and spam folder) for the verification link.'
            };
        }

        return {
            success: true,
            user: user
        };
    } catch (error) {
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
}

// 3. LOGOUT
export async function logOutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: 'Could not log out. Please try again.'
        };
    }
}

// 4. PASSWORD RESET
export async function resetUserPassword(email) {
    try {
        // Optional: Check if email exists before sending reset (improves UX)
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length === 0) {
            return {
                success: false,
                error: 'No account found with this email address.'
            };
        }

        await sendPasswordResetEmail(auth, email);
        return {
            success: true,
            message: 'Password reset email sent! Check your inbox.'
        };
    } catch (error) {
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
}

// 5. GOOGLE OAUTH (Social Login)
export async function signInWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        // Google users are automatically verified, so we don't need the emailVerified check.
        return {
            success: true,
            user: result.user,
            message: `Welcome, ${result.user.displayName || 'User'}!`
        };
    } catch (error) {
        // Handle specific popup errors
        if (error.code === 'auth/popup-closed-by-user') {
            return { success: false, error: 'Sign-in cancelled.' };
        }
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
}
