// ============================================
// SCRIPT.JS - WITH AUTHENTICATION
// ============================================

console.log('🚀 Script.js loaded!');

// Global cart
let cart = [];

// Load from localStorage
const savedCart = localStorage.getItem('cart');
if (savedCart) {
    try {
        cart = JSON.parse(savedCart);
        console.log('📦 Cart loaded:', cart);
    } catch (e) {
        cart = [];
    }
}

// ============================================
// UTILITIES
// ============================================

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(amount);
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    if (!notification || !notificationMessage) {
        console.log('📢', message);
        return;
    }
    
    notification.className = `notification notification-${type}`;
    notificationMessage.textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

function loadHTML(id, path) {
    fetch(path)
        .then(r => r.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            if (id === 'header-container') initHeader();
        })
        .catch(e => console.error('Error:', e));
}

// ============================================
// CART
// ============================================

function addToCart(product, size, price) {
    const existing = cart.find(item => item.id === product.id && item.size === size);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ 
            id: product.id, 
            name: product.name, 
            size, 
            price, 
            image: product.image, 
            quantity: 1 
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showNotification(`${product.name} (${size}) ditambahkan!`);
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartCount) return;
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (!cartItems) return;
    
    if (!cart.length) {
        cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Keranjang kosong</p></div>';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60'">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.size}</p>
                <p class="cart-item-price">${formatRupiah(item.price)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.size}', -1)"><i class="fas fa-minus"></i></button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.size}', 1)"><i class="fas fa-plus"></i></button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id}, '${item.size}')"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = formatRupiah(total);
    if (cartSummary) cartSummary.style.display = 'block';
}

function updateQuantity(productId, size, change) {
    const item = cart.find(i => i.id === productId && i.size === size);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId, size);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    }
}

function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showNotification('Produk dihapus');
}

// ============================================
// HEADER INIT
// ============================================

function initHeader() {
    console.log('🔧 Init header...');
    
    // Update user display
    updateUserDisplay();
    
    // Cart
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartIcon && cartModal) {
        cartIcon.onclick = () => cartModal.classList.add('active');
    }
    if (closeCart && cartModal) {
        closeCart.onclick = () => cartModal.classList.remove('active');
        cartModal.onclick = (e) => { if (e.target === cartModal) cartModal.classList.remove('active'); };
    }
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (!cart.length) {
                showNotification('Keranjang kosong', 'warning');
                return;
            }
            window.location.href = 'checkout.html';
        };
    }
    
    // Help
    const helpIcon = document.querySelector('.help-icon');
    const whatsappModal = document.getElementById('whatsappModal');
    const closeWhatsappModal = document.getElementById('closeWhatsappModal');
    const whatsappFloat = document.getElementById('whatsappFloat');
    
    if (helpIcon && whatsappModal) {
        helpIcon.onclick = () => whatsappModal.classList.add('active');
    }
    if (closeWhatsappModal && whatsappModal) {
        closeWhatsappModal.onclick = () => whatsappModal.classList.remove('active');
        whatsappModal.onclick = (e) => { if (e.target === whatsappModal) whatsappModal.classList.remove('active'); };
    }
    if (whatsappFloat && whatsappModal) {
        whatsappFloat.onclick = () => whatsappModal.classList.add('active');
    }
    
    // Three dots menu (for non-logged in users)
    const threeDots = document.getElementById('threeDotsMenu');
    const dropdown = threeDots ? threeDots.querySelector('.dropdown-menu') : null;
    
    if (threeDots && dropdown) {
        threeDots.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        };
        document.addEventListener('click', () => dropdown.classList.remove('active'));
    }
    
    // User menu links (for logged in users)
    const profileMenuLink = document.getElementById('profileMenuLink');
    const ordersMenuLink = document.getElementById('ordersMenuLink');
    const wishlistMenuLink = document.getElementById('wishlistMenuLink');
    const settingsMenuLink = document.getElementById('settingsMenuLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (profileMenuLink) {
        profileMenuLink.onclick = (e) => {
            e.preventDefault();
            showNotification('Fitur Profil sedang dalam pengembangan', 'info');
        };
    }
    
    if (ordersMenuLink) {
        ordersMenuLink.onclick = (e) => {
            e.preventDefault();
            showNotification('Fitur Pesanan sedang dalam pengembangan', 'info');
        };
    }
    
    if (wishlistMenuLink) {
        wishlistMenuLink.onclick = (e) => {
            e.preventDefault();
            showNotification('Fitur Wishlist sedang dalam pengembangan', 'info');
        };
    }
    
    if (settingsMenuLink) {
        settingsMenuLink.onclick = (e) => {
            e.preventDefault();
            showNotification('Fitur Pengaturan sedang dalam pengembangan', 'info');
        };
    }
    
    if (logoutLink) {
        logoutLink.onclick = (e) => {
            e.preventDefault();
            if (confirm('Apakah Anda yakin ingin logout?')) {
                if (typeof logout === 'function') {
                    logout();
                } else {
                    localStorage.removeItem('currentUser');
                    showNotification('Logout berhasil!', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }
            }
        };
    }
    
    // Hamburger
    const hamburger = document.getElementById('hamburgerMenu');
    const mobileNav = document.getElementById('mobileNav');
    
    if (hamburger && mobileNav) {
        hamburger.onclick = () => mobileNav.classList.toggle('active');
    }
    
    updateCart();
    console.log('✅ Header ready');
}

// ============================================
// USER DISPLAY
// ============================================

function updateUserDisplay() {
    const userMenu = document.getElementById('userMenu');
    const loginBtn = document.getElementById('loginBtn');
    const threeDotsMenu = document.getElementById('threeDotsMenu');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    
    // Get current user
    let currentUser = null;
    if (typeof getCurrentUser === 'function') {
        currentUser = getCurrentUser();
    } else {
        // Fallback: load from localStorage directly
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            try {
                currentUser = JSON.parse(userJson);
            } catch (e) {
                currentUser = null;
            }
        }
    }
    
    if (currentUser) {
        // User logged in
        if (userMenu) userMenu.style.display = 'block';
        if (loginBtn) loginBtn.style.display = 'none';
        if (threeDotsMenu) threeDotsMenu.style.display = 'none';
        
        // Update user info
        if (userName) userName.textContent = currentUser.name;
        if (userEmail) userEmail.textContent = currentUser.email;
        
        console.log('👤 Logged in as:', currentUser.name);
    } else {
        // User not logged in
        if (userMenu) userMenu.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'block';
        if (threeDotsMenu) threeDotsMenu.style.display = 'block';
        
        console.log('🚪 Not logged in');
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM ready');
    setTimeout(updateCart, 100);
});