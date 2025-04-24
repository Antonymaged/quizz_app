// Local user storage
const users = JSON.parse(localStorage.getItem('users')) || [];

// DOM Elements
const container = document.getElementById('container');
const signUpButton = document.getElementById('signUpOverlay');
const signInButton = document.getElementById('signInOverlay');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const demoSignIn = document.getElementById('demoSignIn');
const demoSignUp = document.getElementById('demoSignUp');
const avatarInput = document.getElementById('avatar');
const avatarPreview = document.getElementById('avatar');

// Event Listeners
signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

signInForm.addEventListener('submit', handleLogin);
signUpForm.addEventListener('submit', handleSignUp);
demoSignIn.addEventListener('click', handleDemoLogin);
demoSignUp.addEventListener('click', handleDemoSignUp);
avatarInput.addEventListener('change', handleAvatarUpload);

// Functions
function handleLogin(e) {
    e.preventDefault();
    const email = signInForm.email.value;
    const password = signInForm.password.value;
    const signInBtn = document.getElementById('signInButton');
    
    signInBtn.disabled = true;
    signInBtn.textContent = 'Loading...';
    
    // Simulate network delay
    setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            showToast(`Welcome back, ${user.username}!`, 'success');
            window.location.href = './Quiz.html';
        } else {
            showToast('Invalid email or password', 'error');
        }
        
        signInBtn.disabled = false;
        signInBtn.textContent = 'Sign In';
    }, 1000);
}

function handleSignUp(e) {
    e.preventDefault();
    const username = signUpForm.username.value;
    const email = signUpForm.email.value;
    const password = signUpForm.password.value;
    const signUpBtn = document.getElementById('signUpButton');
    
    signUpBtn.disabled = true;
    signUpBtn.textContent = 'Loading...';
    
    // Simulate network delay
    setTimeout(() => {
        if (users.some(u => u.email === email)) {
            showToast('Email already registered', 'error');
        } else {
            const newUser = {
                username,
                email,
                password,
                avatar: avatarPreview.src,
                id: Date.now().toString(),
                blocked: []
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            showToast('Account created successfully!', 'success');
            container.classList.remove('right-panel-active');
            signInForm.email.value = email;
            signInForm.password.value = password;
            window.location.href = './Quiz.html';
        }
        
        signUpBtn.disabled = false;
        signUpBtn.textContent = 'Sign Up';
    }, 1000);
}

function handleDemoLogin() {
    signInForm.email.value = 'demo@example.com';
    signInForm.password.value = 'password';
    handleLogin({ preventDefault: () => {} });
}

function handleDemoSignUp() {
    signUpForm.username.value = 'Demo User';
    signUpForm.email.value = `demo${Math.floor(Math.random() * 1000)}@example.com`;
    signUpForm.password.value = 'password';
    avatarPreview.src = 'avatar.png';
}

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            avatarPreview.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function showToast(message, type) {
    const background = type === 'success' 
        ? 'linear-gradient(to right, #00b09b, #96c93d)'
        : 'linear-gradient(to right, #ff5f6d, #ffc371)';
    
    Toastify({
        text: message,
        className: type,
        style: { background }
    }).showToast();
}

// Initialize with a demo user if none exists
if (users.length === 0) {
    users.push({
        username: 'Demo User',
        email: 'demo@example.com',
        password: 'password',
        avatar: 'avatar.png',
        id: '1',
        blocked: []
    });
    localStorage.setItem('users', JSON.stringify(users));
}
