// ============================================
// SCRIPT.JS - Global Functions & Cart System
// ============================================

// Data metode pembayaran
const paymentDetails = {
    "gopay": { name: "GoPay", account: "0812-3456-7890", holder: "YOUR.I SCENT" },
    "ovo": { name: "OVO", account: "0812-3456-7891", holder: "YOUR.I SCENT" },
    "dana": { name: "Dana", account: "0812-3456-7892", holder: "YOUR.I SCENT" },
    "shopeepay": { name: "ShopeePay", account: "0812-3456-7893", holder: "YOUR.I SCENT" },
    "bca": { name: "BCA", account: "1234567890", holder: "YOUR.I SCENT" },
    "mandiri": { name: "Mandiri", account: "0987654321", holder: "YOUR.I SCENT" },
    "bri": { name: "BRI", account: "5566778899", holder: "YOUR.I SCENT" },
    "bni": { name: "BNI", account: "1122334455", holder: "YOUR.I SCENT" }
};

// Global variables
let cart = [];
let selectedPaymentMethod = "";
let selectedPaymentDetail = "";

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(amount);
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    if (!notification || !notificationMessage) return;
    
    notificationMessage.textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

// Load HTML includes (header & footer)
function loadHTML(id, path) {
    fetch(path)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            if (id === 'header-container') {
                document.dispatchEvent(new CustomEvent('headerLoaded'));
            }
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// ============================================
// CART FUNCTIONS
// ============================================

// Add to cart
function addToCart(product, size, price) {
    const existingItem = cart.find(item => item.id === product.id && item.size === size);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ 
            id: product.id, 
            name: product.name, 
            size: size, 
            price: price, 
            image: product.image, 
            quantity: 1 
        });
    }
    updateCart();
    showNotification(`${product.name} (${size}) ditambahkan ke keranjang!`);
}

// Update cart
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartCount) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Keranjang Anda kosong</p></div>';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.size}</p>
                <p class="cart-item-price">${formatRupiah(item.price)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.size}', -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.size}', 1)">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id}, '${item.size}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = formatRupiah(total);
    if (cartSummary) cartSummary.style.display = 'block';
}

// Update quantity
function updateQuantity(productId, size, change) {
    const item = cart.find(i => i.id === productId && i.size === size);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId, size);
        } else {
            updateCart();
        }
    }
}

// Remove from cart
function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    updateCart();
    showNotification('Produk dihapus dari keranjang');
}

// ============================================
// PAYMENT FUNCTIONS
// ============================================

// Show payment detail modal
function showPaymentDetail(method) {
    const paymentDetailModal = document.getElementById('paymentDetailModal');
    const paymentDetailTitle = document.getElementById('paymentDetailTitle');
    const paymentDetailContent = document.getElementById('paymentDetailContent');
    
    if (!paymentDetailModal) return;
    
    selectedPaymentMethod = method;
    
    let content = '';
    let title = '';
    
    if (method === 'e-wallet') {
        title = 'Pilih E-Wallet';
        content = `
            <div class="payment-sub-options">
                <div class="payment-sub-option" data-detail="gopay">
                    <i class="fas fa-wallet"></i>
                    <span>GoPay</span>
                </div>
                <div class="payment-sub-option" data-detail="ovo">
                    <i class="fas fa-wallet"></i>
                    <span>OVO</span>
                </div>
                <div class="payment-sub-option" data-detail="dana">
                    <i class="fas fa-wallet"></i>
                    <span>Dana</span>
                </div>
                <div class="payment-sub-option" data-detail="shopeepay">
                    <i class="fas fa-wallet"></i>
                    <span>ShopeePay</span>
                </div>
            </div>`;
    } else if (method === 'bank') {
        title = 'Pilih Bank';
        content = `
            <div class="payment-sub-options">
                <div class="payment-sub-option" data-detail="bca">
                    <i class="fas fa-university"></i>
                    <span>BCA</span>
                </div>
                <div class="payment-sub-option" data-detail="mandiri">
                    <i class="fas fa-university"></i>
                    <span>Mandiri</span>
                </div>
                <div class="payment-sub-option" data-detail="bri">
                    <i class="fas fa-university"></i>
                    <span>BRI</span>
                </div>
                <div class="payment-sub-option" data-detail="bni">
                    <i class="fas fa-university"></i>
                    <span>BNI</span>
                </div>
            </div>`;
    } else if (method === 'qris') {
        title = 'Pembayaran QRIS';
        content = `
            <div style="text-align: center; padding: 20px;">
                <div style="background: #f5f5f5; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                    <i class="fas fa-qrcode" style="font-size: 120px; color: var(--secondary-color);"></i>
                </div>
                <h4 style="margin-bottom: 10px;">Scan QR Code</h4>
                <p style="color: var(--light-text);">Gunakan aplikasi e-wallet atau mobile banking untuk scan QR code di atas</p>
            </div>`;
    } else if (method === 'cod') {
        title = 'Cash on Delivery (COD)';
        content = `
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-hand-holding-usd" style="font-size: 80px; color: var(--primary-color); margin-bottom: 20px;"></i>
                <h4 style="margin-bottom: 10px;">Bayar Saat Barang Diterima</h4>
                <p style="color: var(--light-text); margin-bottom: 20px;">Siapkan uang tunai sesuai total pembayaran. Pembayaran dilakukan langsung kepada kurir saat barang diterima.</p>
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                    <p style="color: #856404; margin: 0;"><i class="fas fa-info-circle"></i> Pastikan Anda berada di lokasi pengiriman saat kurir tiba</p>
                </div>
            </div>`;
    }
    
    if (paymentDetailTitle) paymentDetailTitle.textContent = title;
    if (paymentDetailContent) paymentDetailContent.innerHTML = content;
    
    paymentDetailModal.classList.add('active');
    
    // Event listeners untuk sub-options
    document.querySelectorAll('.payment-sub-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.payment-sub-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedPaymentDetail = this.getAttribute('data-detail');
        });
    });
}

// ============================================
// PROFILE FUNCTION
// ============================================

function showProfilePage() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3><i class="fas fa-user"></i> Profil</h3>
                <span class="close-modal" id="closeProfileModal">&times;</span>
            </div>
            <div class="modal-body">
                <div style="text-align: center; padding: 20px;">
                    <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #d4af37, #c29d2e); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-user" style="font-size: 40px; color: white;"></i>
                    </div>
                    <h2 style="margin-bottom: 30px;">Profil Pengguna</h2>
                    <div style="max-width: 400px; margin: 0 auto; background: white; padding: 25px; border-radius: 10px; box-shadow: var(--card-shadow); text-align: left;">
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: var(--secondary-color); margin-bottom: 5px;">Nama</h4>
                            <p>Pelanggan your.i scent</p>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: var(--secondary-color); margin-bottom: 5px;">Email</h4>
                            <p>customer@youriscent.com</p>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: var(--secondary-color); margin-bottom: 5px;">Member Sejak</h4>
                            <p>Januari 2025</p>
                        </div>
                        <div>
                            <h4 style="color: var(--secondary-color); margin-bottom: 5px;">Keranjang</h4>
                            <p>${cart.length} produk</p>
                        </div>
                    </div>
                    <button class="add-to-cart" style="margin-top: 20px;" onclick="showNotification('Fitur lengkap segera hadir!')">
                        <i class="fas fa-edit"></i> Edit Profil
                    </button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(modal);
    document.getElementById('closeProfileModal').addEventListener('click', () => document.body.removeChild(modal));
    modal.addEventListener('click', (e) => { if (e.target === modal) document.body.removeChild(modal); });
}

// ============================================
// EVENT LISTENERS INITIALIZATION
// ============================================

function initializeHeaderEvents() {
    // Get all modal and button elements
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModal = document.getElementById('closePaymentModal');
    const confirmPayment = document.getElementById('confirmPayment');
    const paymentDetailModal = document.getElementById('paymentDetailModal');
    const closePaymentDetailModal = document.getElementById('closePaymentDetailModal');
    const proceedPayment = document.getElementById('proceedPayment');
    const paymentConfirmationModal = document.getElementById('paymentConfirmationModal');
    const closePaymentConfirmationModal = document.getElementById('closePaymentConfirmationModal');
    const whatsappConfirmBtn = document.getElementById('whatsappConfirmBtn');
    const whatsappModal = document.getElementById('whatsappModal');
    const closeWhatsappModal = document.getElementById('closeWhatsappModal');
    const whatsappFloat = document.getElementById('whatsappFloat');
    const helpIcon = document.querySelector('.help-icon');
    const threeDotsMenu = document.querySelector('.three-dots-menu');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    // Hamburger Menu
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileNav = document.getElementById('mobileNav');
    
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerMenu.contains(e.target) && !mobileNav.contains(e.target)) {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }

    // Cart modal
    if (cartIcon) cartIcon.addEventListener('click', () => cartModal.classList.add('active'));
    if (closeCart) closeCart.addEventListener('click', () => cartModal.classList.remove('active'));
    if (cartModal) cartModal.addEventListener('click', (e) => { if (e.target === cartModal) cartModal.classList.remove('active'); });

    // Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Keranjang Anda kosong');
                return;
            }
            cartModal.classList.remove('active');
            paymentModal.classList.add('active');
        });
    }

    // Payment modal
    if (closePaymentModal) closePaymentModal.addEventListener('click', () => paymentModal.classList.remove('active'));
    if (paymentModal) paymentModal.addEventListener('click', (e) => { if (e.target === paymentModal) paymentModal.classList.remove('active'); });

    // Payment options
    document.querySelectorAll('.payment-option').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('#paymentModal .payment-option').forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Confirm payment
    if (confirmPayment) {
        confirmPayment.addEventListener('click', () => {
            const selected = document.querySelector('#paymentModal .payment-option.selected');
            if (!selected) {
                showNotification('Silakan pilih metode pembayaran terlebih dahulu');
                return;
            }
            paymentModal.classList.remove('active');
            showPaymentDetail(selected.getAttribute('data-method'));
        });
    }

    // Payment detail modal
    if (closePaymentDetailModal) closePaymentDetailModal.addEventListener('click', () => paymentDetailModal.classList.remove('active'));
    if (paymentDetailModal) paymentDetailModal.addEventListener('click', (e) => { if (e.target === paymentDetailModal) paymentDetailModal.classList.remove('active'); });

    // Proceed payment
    if (proceedPayment) {
        proceedPayment.addEventListener('click', () => {
            if (selectedPaymentMethod === 'qris' || selectedPaymentMethod === 'cod') {
                paymentDetailModal.classList.remove('active');
                const msg = selectedPaymentMethod === 'qris' 
                    ? "Mohon segera kirim bukti pembayaran QRIS dan alamat Anda ke WhatsApp kami."
                    : "Pesanan akan dikirim. Siapkan pembayaran tunai. Kirim alamat lengkap ke WhatsApp kami.";
                document.getElementById('confirmationMessage').textContent = msg;
                paymentConfirmationModal.classList.add('active');
            } else {
                if (!selectedPaymentDetail) {
                    showNotification(`Pilih ${selectedPaymentMethod === 'e-wallet' ? 'e-wallet' : 'bank'} terlebih dahulu`);
                    return;
                }
                paymentDetailModal.classList.remove('active');
                const data = paymentDetails[selectedPaymentDetail];
                document.getElementById('confirmationMessage').textContent = 
                    `Transfer ke ${data.name} (${data.account}) dan kirim bukti pembayaran + alamat ke WhatsApp kami.`;
                paymentConfirmationModal.classList.add('active');
            }
        });
    }

    // Confirmation modal
    if (closePaymentConfirmationModal) closePaymentConfirmationModal.addEventListener('click', () => paymentConfirmationModal.classList.remove('active'));
    if (paymentConfirmationModal) paymentConfirmationModal.addEventListener('click', (e) => { if (e.target === paymentConfirmationModal) paymentConfirmationModal.classList.remove('active'); });

    // WhatsApp confirm
    if (whatsappConfirmBtn) {
        whatsappConfirmBtn.addEventListener('click', () => {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const items = cart.map(item => `${item.name} - ${item.size} (${item.quantity}x)`).join(', ');
            let paymentText = selectedPaymentMethod === 'qris' ? 'QRIS' : selectedPaymentMethod === 'cod' ? 'COD' : `${paymentDetails[selectedPaymentDetail].name} (${paymentDetails[selectedPaymentDetail].account})`;
            const message = `Halo your.i scent, saya sudah melakukan pembayaran ${formatRupiah(total)} via ${paymentText} untuk: ${items}. Berikut bukti pembayaran dan alamat:`;
            window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
            cart = [];
            updateCart();
            paymentConfirmationModal.classList.remove('active');
            showNotification('Terima kasih! Kirim bukti pembayaran via WhatsApp');
        });
    }

    // Three dots menu
    if (threeDotsMenu && dropdownMenu) {
        threeDotsMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });
        document.addEventListener('click', () => dropdownMenu.classList.remove('active'));
    }

    // Dropdown menu items
    const profileLink = document.getElementById('profileLink');
    const ordersLink = document.getElementById('ordersLink');
    const settingsLink = document.getElementById('settingsLink');

    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            showProfilePage();
            if (dropdownMenu) dropdownMenu.classList.remove('active');
        });
    }

    if (ordersLink) {
        ordersLink.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.classList.add('active');
            if (dropdownMenu) dropdownMenu.classList.remove('active');
        });
    }

    if (settingsLink) {
        settingsLink.addEventListener('click', (e) => {
            e.preventDefault();
            const footer = document.querySelector('footer');
            if (footer) footer.scrollIntoView({ behavior: 'smooth' });
            if (dropdownMenu) dropdownMenu.classList.remove('active');
        });
    }

    // Help icon
    if (helpIcon) {
        helpIcon.addEventListener('click', () => {
            if (whatsappModal) whatsappModal.classList.add('active');
        });
    }

    // WhatsApp float & modal
    if (whatsappFloat) whatsappFloat.addEventListener('click', () => whatsappModal.classList.add('active'));
    if (closeWhatsappModal) closeWhatsappModal.addEventListener('click', () => whatsappModal.classList.remove('active'));
    if (whatsappModal) whatsappModal.addEventListener('click', (e) => { if (e.target === whatsappModal) whatsappModal.classList.remove('active'); });

    updateCart();
}

// Initialize header events when header is loaded
document.addEventListener('headerLoaded', initializeHeaderEvents);