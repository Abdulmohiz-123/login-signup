document.addEventListener('DOMContentLoaded', () => {
    /* -------------------------------------------------------------------------- */
    /*                                Theme Logic                                 */
    /* -------------------------------------------------------------------------- */
    const themeToggleBtns = document.querySelectorAll('#theme-toggle');
    const body = document.body;
    
    // Check LocalStorage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.setAttribute('data-theme', currentTheme);
        updateThemeIcons(currentTheme);
    }

    function updateThemeIcons(theme) {
        themeToggleBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (theme === 'light') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'light') {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                updateThemeIcons('dark');
            } else {
                body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                updateThemeIcons('light');
            }
        });
    });

    /* -------------------------------------------------------------------------- */
    /*                                DOM Elements                                */
    /* -------------------------------------------------------------------------- */
    // Check if we are on Login Page
    const loginToggle = document.getElementById('login-toggle');
    const signupToggle = document.getElementById('signup-toggle');
    const toggleSlider = document.querySelector('.toggle-slider');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Toggle Password Icons
    const togglePassIcons = document.querySelectorAll('.toggle-pass');

    // Inputs
    const signupName = document.getElementById('signup-name');
    const signupEmail = document.getElementById('signup-email');
    const signupPass = document.getElementById('signup-pass');
    const signupBtn = document.getElementById('signup-btn');

    const loginEmail = document.getElementById('login-email');
    const loginPass = document.getElementById('login-pass');
    const loginBtn = document.getElementById('login-btn');

    // Password Strength UI
    const passwordCriteriaList = document.querySelector('.password-criteria');
    const strengthBarLine = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const passwordStrengthBox = document.querySelector('.password-strength');

    const criteriaItems = {
        length: document.querySelector('li[data-criteria="length"]'),
        upper: document.querySelector('li[data-criteria="upper"]'),
        number: document.querySelector('li[data-criteria="number"]'),
        special: document.querySelector('li[data-criteria="special"]')
    };

    /* -------------------------------------------------------------------------- */
    /*                                Form Toggling                               */
    /* -------------------------------------------------------------------------- */
    function switchForm(formType) {
        if (formType === 'login') {
            loginToggle.classList.add('active');
            signupToggle.classList.remove('active');
            toggleSlider.style.left = '5px';

            loginForm.classList.add('active-form');
            signupForm.classList.remove('active-form');
        } else {
            signupToggle.classList.add('active');
            loginToggle.classList.remove('active');
            toggleSlider.style.left = 'calc(50% + 0px)';

            signupForm.classList.add('active-form');
            loginForm.classList.remove('active-form');
        }
        // Clear errors when switching
        clearErrors();
    }

    loginToggle.addEventListener('click', () => switchForm('login'));
    signupToggle.addEventListener('click', () => switchForm('signup'));

    /* -------------------------------------------------------------------------- */
    /*                           Password Visibility                              */
    /* -------------------------------------------------------------------------- */
    togglePassIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const input = e.target.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });

    /* -------------------------------------------------------------------------- */
    /*                                Validation                                  */
    /* -------------------------------------------------------------------------- */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Helper: Show/Hide Error
    function setError(input, message) {
        const group = input.parentElement;
        const msgDisplay = group.querySelector('.error-msg');
        group.classList.add('error');
        group.classList.remove('success');
        msgDisplay.innerText = message;
    }

    function setSuccess(input) {
        const group = input.parentElement;
        const msgDisplay = group.querySelector('.error-msg');
        group.classList.remove('error');
        group.classList.add('success');
        msgDisplay.innerText = '';
    }

    function clearErrors() {
        document.querySelectorAll('.input-group').forEach(group => {
            group.classList.remove('error', 'success');
            const msg = group.querySelector('.error-msg');
            if (msg) msg.innerText = '';
        });
        // Reset password strength UI
        passwordStrengthBox.style.display = 'none';
        passwordCriteriaList.style.display = 'none';
    }

    // Logic for Password Strength
    function checkPasswordStrength(password) {
        const rules = {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        let passedCount = 0;

        // Update Criteria List UI
        for (const [key, passed] of Object.entries(rules)) {
            const item = criteriaItems[key];
            if (passed) {
                item.classList.add('valid');
                item.classList.remove('invalid');
                passedCount++;
            } else {
                item.classList.remove('valid');
                item.classList.add('invalid');
            }
        }

        // Show Strength Meter
        passwordStrengthBox.style.display = 'block';
        passwordCriteriaList.style.display = 'block';

        // Percentage
        const strengthPercent = (passedCount / 4) * 100;
        strengthBarLine.style.width = `${strengthPercent}%`;

        // Color & Text
        if (passedCount <= 2) {
            strengthBarLine.style.background = '#ff7675'; // Weak (Red)
            strengthText.innerText = 'Weak';
            strengthText.style.color = '#ff7675';
        } else if (passedCount === 3) {
            strengthBarLine.style.background = '#ffeaa7'; // Medium (Yellow)
            strengthText.innerText = 'Medium';
            strengthText.style.color = '#ffeaa7';
        } else {
            strengthBarLine.style.background = '#55efc4'; // Strong (Green)
            strengthText.innerText = 'Strong';
            strengthText.style.color = '#55efc4';
        }

        return passedCount === 4;
    }

    // Real-time Validation Listeners (Signup)

    // Name
    signupName.addEventListener('input', () => {
        if (signupName.value.trim().length > 0) setSuccess(signupName);
        else setError(signupName, "Name is required");
        checkSignupValidity();
    });

    // Email
    signupEmail.addEventListener('input', () => {
        if (emailRegex.test(signupEmail.value.trim())) setSuccess(signupEmail);
        else setError(signupEmail, "Invalid email address");
        checkSignupValidity();
    });

    // Password
    signupPass.addEventListener('input', () => {
        const isValid = checkPasswordStrength(signupPass.value);
        if (isValid) setSuccess(signupPass);
        else {
            // Don't show red border immediately while typing complex password, rely on strength meter
            // Only show success border when fully valid
            const group = signupPass.parentElement;
            group.classList.remove('success');
            group.classList.remove('error');
        }
        checkSignupValidity();
    });

    function checkSignupValidity() {
        const isNameValid = signupName.value.trim().length > 0;
        const isEmailValid = emailRegex.test(signupEmail.value.trim());
        const isPassValid = checkPasswordStrength(signupPass.value); // Recalculate boolean

        signupBtn.disabled = !(isNameValid && isEmailValid && isPassValid);
    }

    /* -------------------------------------------------------------------------- */
    /*                                Submission                                  */
    /* -------------------------------------------------------------------------- */

    // Mock Submit Function
    function mockSubmit(btn, successMsg) {
        btn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            btn.classList.remove('loading');
            // alert(successMsg); // Removed alert for smoother UX
            
            // Redirect
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        mockSubmit(signupBtn, "Account created successfully! Welcome aboard.");
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Basic check for Login
        if (emailRegex.test(loginEmail.value.trim()) && loginPass.value.length > 0) {
            mockSubmit(loginBtn, "Login Successful! Redirecting...");
        } else {
            setError(loginEmail, "Please enter valid credentials");
            // Shake animation
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
        }
    });

    // Initial Login Validation (Optional, just to clear states)
    loginEmail.addEventListener('input', () => {
        if (emailRegex.test(loginEmail.value.trim())) setSuccess(loginEmail);
        else setError(loginEmail, "Invalid email");
    });

    /* -------------------------------------------------------------------------- */
    /*                                Dashboard Logic                             */
    /* -------------------------------------------------------------------------- */
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if(confirm('Are you sure you want to logout?')) {
                window.location.href = 'index.html';
            }
        });
    }

    // Dynamic User Name (Mock)
    const userNameDisplay = document.getElementById('user-name-display');
    if (userNameDisplay) {
        userNameDisplay.innerText = "Moiz"; 
    }
});
