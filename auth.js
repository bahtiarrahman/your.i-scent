// ============================================
// AUTH.JS - Authentication System (LocalStorage)
// ============================================

console.log('🔐 Auth.js loaded!');

// ============================================
// AUTH STATE
// ============================================

let currentUser = null;

// Load current user from localStorage
function loadCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
        try {
            currentUser = JSON.parse(userJson);
            console.log('👤 Current user loaded:', currentUser.name);
            return currentUser;
        } catch (e) {
            console.error('Error loading user:', e);
            currentUser = null;
        }
    }
    return null;
}

// Save current user to localStorage
function saveCurrentUser(user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('💾 User saved:', user.name);
}

// Clear current user
function clearCurrentUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    console.log('🚪 User logged out');
}

// ============================================
// REGISTER
// ============================================

function register(name, email, password, phone) {
    console.log('📝 Registering user:', email);
    
    // Validasi
    if (!name || !email || !password || !phone) {
        return { success: false, message: 'Semua field harus diisi!' };
    }
    
    if (password.length < 6) {
        return { success: false, message: 'Password minimal 6 karakter!' };
    }
    
    if (!email.includes('@')) {
        return { success: false, message: 'Email tidak valid!' };
    }
    
    if (phone.length < 10) {
        return { success: false, message: 'Nomor telepon minimal 10 digit!' };
    }
    
    // Get existing users
    const users = getAllUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email sudah terdaftar!' };
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // In real app, this should be hashed!
        phone: phone,
        createdAt: new Date().toISOString(),
        orders: [],
        wishlist: []
    };
    
    // Save to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    console.log('✅ User registered successfully');
    return { success: true, message: 'Registrasi berhasil!', user: newUser };
}

// ============================================
// LOGIN
// ============================================

function login(email, password) {
    console.log('🔑 Login attempt:', email);
    
    // Validasi
    if (!email || !password) {
        return { success: false, message: 'Email dan password harus diisi!' };
    }
    
    // Get all users
    const users = getAllUsers();
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return { success: false, message: 'Email atau password salah!' };
    }
    
    // Save current user
    saveCurrentUser(user);
    
    console.log('✅ Login successful');
    return { success: true, message: 'Login berhasil!', user: user };
}

// ============================================
// LOGOUT
// ============================================

function logout() {
    console.log('👋 Logging out...');
    clearCurrentUser();
    
    // Redirect to home
    window.location.href = 'index.html';
}

// ============================================
// HELPERS
// ============================================

function getAllUsers() {
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
        try {
            return JSON.parse(usersJson);
        } catch (e) {
            console.error('Error parsing users:', e);
        }
    }
    return [];
}

function isLoggedIn() {
    return currentUser !== null;
}

function getCurrentUser() {
    return currentUser;
}

function requireLogin(redirectUrl = 'login.html') {
    if (!isLoggedIn()) {
        console.log('🚫 Access denied - login required');
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

// ============================================
// UPDATE USER DATA
// ============================================

function updateUserProfile(updates) {
    if (!currentUser) {
        return { success: false, message: 'User not logged in!' };
    }
    
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
        return { success: false, message: 'User not found!' };
    }
    
    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user
    saveCurrentUser(users[userIndex]);
    
    return { success: true, message: 'Profile updated!', user: users[userIndex] };
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadCurrentUser();
    console.log('✅ Auth system ready');
});