// Common Functions for all pages

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');

    if (!notification || !notificationMessage) return;

    // Set message and style
    notificationMessage.textContent = message;

    // Set color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    notification.style.background = colors[type] || colors.info;

    // Show notification
    notification.style.display = 'block';
    notification.style.animation = 'slideIn 0.3s ease';

    // Auto hide after 5 seconds
    setTimeout(hideNotification, 5000);
}

function hideNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.style.display = 'none';
    }
}

// Toggle Mobile Menu
function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function (event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.menu-btn');

    if (mobileMenu && mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(event.target) &&
        !menuBtn.contains(event.target)) {
        mobileMenu.classList.remove('active');
    }
});

// Login Modal Functions
function toggleLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.toggle('active');
    }
}

async function handleGoogleLogin() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        showNotification('Google Login Successful!', 'success');

        // Sync with backend
        const token = await user.getIdToken();
        localStorage.setItem('auth_token', token);

        // Call backend to ensure user exists
        const apiResponse = await window.api.post('/auth/login', {});

        // Save user info locally
        localStorage.setItem('current_user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            username: user.displayName || user.email.split('@')[0],
            picture: user.photoURL
        }));

        toggleLogin();
        updateUIForLogin();

    } catch (error) {
        console.error('Google Login Error:', error);
        showNotification(error.message, 'error');
    }
}

function selectRole(role) {
    const buttons = document.querySelectorAll('.role-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (event && event.target) {
        event.target.closest('.role-btn').classList.add('active');
    }
}

async function handleLogin(event) {
    if (event) event.preventDefault();

    const emailInput = document.getElementById('username'); // Using username field as email
    const passwordInput = document.getElementById('password');
    const submitBtn = document.querySelector('.submit-btn');

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        showNotification('Please fill all fields', 'error');
        return;
    }

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }

        // Firebase Login
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Sync with backend
        const token = await user.getIdToken();
        localStorage.setItem('auth_token', token);

        // Call backend to ensure user exists in DB
        const apiResponse = await window.api.post('/auth/login', {});

        showNotification('Login successful!', 'success');

        // Save user info locally for UI
        localStorage.setItem('current_user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            username: apiResponse.user ? apiResponse.user.name : email.split('@')[0]
        }));

        toggleLogin();
        updateUIForLogin();

    } catch (error) {
        console.error('Login Error:', error);
        let msg = 'Login failed. Please check credentials.';
        if (error.code === 'auth/user-not-found') msg = 'User not found.';
        if (error.code === 'auth/wrong-password') msg = 'Invalid password.';
        if (error.code === 'auth/invalid-email') msg = 'Invalid email format.';
        showNotification(msg, 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        }
    }
}

async function handleRegister() {
    const email = prompt("Enter your email:");
    const password = prompt("Enter a password (min 6 chars):");

    if (!email || !password) return;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        showNotification('Account created! Logging in...', 'success');

        // Auto login after register
        const user = userCredential.user;
        const token = await user.getIdToken();
        localStorage.setItem('auth_token', token);

        await window.api.post('/auth/login', {});

        localStorage.setItem('current_user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            username: email.split('@')[0]
        }));

        updateUIForLogin();

    } catch (error) {
        console.error('Register Error:', error);
        showNotification(error.message, 'error');
    }
}

function showRegister() {
    toggleLogin();
    setTimeout(handleRegister, 500);
}

function updateUIForLogin() {
    const userJson = localStorage.getItem('current_user');
    if (!userJson) return;

    const user = JSON.parse(userJson);
    const loginBtns = document.querySelectorAll('.btn-login');
    loginBtns.forEach(btn => {
        btn.innerHTML = `<i class="fas fa-user"></i> ${user.username}`;
        btn.onclick = () => {
            if (confirm('Logout?')) {
                auth.signOut();
                localStorage.removeItem('current_user');
                localStorage.removeItem('auth_token');
                window.location.reload();
            }
        };
    });
}

// Check login status on load
document.addEventListener('DOMContentLoaded', () => {
    // Other init code...
    updateUIForLogin();
});

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function () {
    // Close notifications when clicked
    const notification = document.getElementById('notification');
    if (notification) {
        notification.addEventListener('click', hideNotification);
    }

    // Close modal when clicking outside
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                toggleLogin();
            }
        });
    }

    // Set current year in footer if exists
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});