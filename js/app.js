// This file initializes the entire app when any HTML page loads.
import { initSessionListener, attachLogoutListeners } from './listeners/session.js';

// Import auth functions
import { signUpUser, logInUser, resetUserPassword, signInWithGoogle, logOutUser } from './auth/auth.js';
import { showError, clearError, setLoading } from './utils/dom.js';

// 1. Start the global session listener immediately.
initSessionListener();

// 2. Attach logout listeners.
attachLogoutListeners();

// 3. Add event listeners to forms ONLY if they exist on this page.
document.addEventListener('DOMContentLoaded', () => {
    
    // --- LOGIN FORM LOGIC ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorEl = 'login-error';
            const btnId = 'login-btn';

            // Clear old errors & show loading
            clearError(errorEl);
            setLoading(btnId, true);

            const result = await logInUser(email, password);

            setLoading(btnId, false);
            
            if (!result.success) {
                showError(errorEl, result.error);
            } else {
                // Success! The session listener (session.js) will automatically redirect to dashboard.
                console.log('Login successful!');
            }
        });
    }

    // --- SIGNUP FORM LOGIC ---
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const errorEl = 'signup-error';
            const btnId = 'signup-btn';

            clearError(errorEl);
            setLoading(btnId, true);

            const result = await signUpUser(email, password);

            setLoading(btnId, false);
            
            if (!result.success) {
                showError(errorEl, result.error);
            } else {
                // Show success message (it's a signup, so we stay on the page to tell them to check email)
                // Override the error div to look like a success message.
                const errorDiv = document.getElementById(errorEl);
                errorDiv.style.display = 'block';
                errorDiv.style.background = '#dcfce7';
                errorDiv.style.color = '#166534';
                errorDiv.style.borderLeftColor = '#22c55e';
                errorDiv.textContent = result.message;
                
                // Clear the form
                document.getElementById('signup-email').value = '';
                document.getElementById('signup-password').value = '';
            }
        });
    }

    // --- GOOGLE BUTTON LOGIC ---
    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            // Find which error div to use (could be on login or signup page)
            const errorEl = document.getElementById('login-error') ? 'login-error' : 'signup-error';
            clearError(errorEl);
            
            // Disable button visually
            googleBtn.disabled = true;
            googleBtn.textContent = 'Connecting...';

            const result = await signInWithGoogle();

            googleBtn.disabled = false;
            googleBtn.innerHTML = 'Sign in with Google'; // Reset inner HTML (removes the "G" pseudo if we set textContent, but better to reset fully)
            googleBtn.textContent = 'Sign in with Google';
            // Re-apply the pseudo element styling by resetting innerHTML properly (or just let it be).
            // Actually, setting textContent removes the ::before pseudo entirely. Let's just set innerHTML.
            googleBtn.innerHTML = 'Sign in with Google';

            if (!result.success) {
                showError(errorEl, result.error);
            } else {
                // Success! Session listener will redirect.
                console.log('Google sign-in successful!');
            }
        });
    }

    // --- PASSWORD RESET LOGIC ---
    const resetLink = document.getElementById('reset-password-link');
    if (resetLink) {
        resetLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = prompt("Enter your email to reset your password:");
            if (email) {
                const errorEl = document.getElementById('login-error') || document.getElementById('signup-error');
                if (errorEl) clearError(errorEl.id);

                const result = await resetUserPassword(email);
                
                if (result.success) {
                    alert(result.message); // Simple alert for reset, since it's a prompt flow.
                } else {
                    if (errorEl) showError(errorEl.id, result.error);
                }
            }
        });
    }
});