import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "../config/firebase.js";
import { logOutUser } from "../auth/auth.js";

export function initSessionListener() {
    
    onAuthStateChanged(auth, (user) => {
        // Helper function to safely toggle elements
        const safeToggle = (id, displayStyle) => {
            const el = document.getElementById(id);
            if (el) el.style.display = displayStyle;
        };

        if (user) {
            console.log("User is logged in:", user.email);
            
            // --- UPDATE DASHBOARD WITH USER INFO ---
            const emailEl = document.getElementById('user-email');
            const uidEl = document.getElementById('user-uid');
            const verifiedBadge = document.getElementById('user-verified-badge');
            const providerEl = document.getElementById('user-provider');

            if (emailEl) emailEl.textContent = user.email;
            if (uidEl) uidEl.textContent = user.uid;
            
            if (verifiedBadge) {
                if (user.emailVerified) {
                    verifiedBadge.innerHTML = '✅ Verified <span class="badge badge-verified">Verified</span>';
                } else {
                    verifiedBadge.innerHTML = '❌ Unverified <span class="badge badge-unverified">Verify Email</span>';
                }
            }

            if (providerEl) {
                // Get the first provider (Google, Password, etc.)
                const providerData = user.providerData[0];
                providerEl.textContent = providerData ? providerData.providerId : 'Email/Password';
            }

            // --- NAVIGATION TOGGLES ---
            safeToggle('nav-dashboard', 'inline');
            safeToggle('nav-login', 'none');
            safeToggle('nav-signup', 'none');
            safeToggle('logout-btn', 'inline');

            // Redirect if on login/signup pages
            if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
                window.location.href = 'dashboard.html';
            }

        } else {
            console.log("User is logged out.");
            
            safeToggle('nav-dashboard', 'none');
            safeToggle('nav-login', 'inline');
            safeToggle('nav-signup', 'inline');
            safeToggle('logout-btn', 'none');

            // Redirect if on dashboard
            if (window.location.pathname.includes('dashboard.html')) {
                window.location.href = 'login.html';
            }
        }
    });
}

export function attachLogoutListeners() {
    const logoutBtns = document.querySelectorAll('#logout-btn, #logout-btn-dash');
    logoutBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', async () => {
                await logOutUser();
            });
        }
    });
}