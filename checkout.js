// ============================================
// CHECKOUT.JS - SUPER ROBUST VERSION
// ============================================

let shippingCost = 15000;
let selectedPayment = '';
let orderData = {};

console.log('🚀 Checkout.js loaded!');

// Fallback functions
if (typeof showNotification !== 'function') {
    window.showNotification = function(msg, type = 'success') { 
        console.log('📢 Notification:', msg, type);
        alert(msg); 
    };
}
if (typeof formatRupiah !== 'function') {
    window.formatRupiah = function(amount) {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(amount);
    };
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM loaded, initializing checkout...');
    
    // Load cart from localStorage
    if (typeof cart === 'undefined' || !cart) {
        window.cart = [];
        const saved = localStorage.getItem('cart');
        if (saved) {
            try { 
                window.cart = JSON.parse(saved);
                console.log('📦 Cart loaded from localStorage:', window.cart);
            } 
            catch (e) { 
                window.cart = [];
                console.log('⚠️ Failed to load cart from localStorage');
            }
        }
    }
    
    setTimeout(() => {
        console.log('🔧 Initializing components...');
        loadCart();
        initForm();
        initPaymentModal();
        console.log('✅ All components initialized!');
    }, 200);
});

// ============================================
// LOAD CART
// ============================================

function loadCart() {
    const container = document.getElementById('orderItems');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    let currentCart = window.cart || cart || [];
    if (!currentCart || currentCart.length === 0) {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try { 
                currentCart = JSON.parse(saved);
                window.cart = currentCart;
            } catch (e) { currentCart = []; }
        }
    }
    
    if (!currentCart || currentCart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <i class="fas fa-shopping-cart" style="font-size: 48px; color: #999; margin-bottom: 15px;"></i>
                <p style="color: #999;">Keranjang kosong</p>
                <a href="katalog.html" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">
                    Mulai belanja <i class="fas fa-arrow-right"></i>
                </a>
            </div>`;
        subtotalEl.textContent = formatRupiah(0);
        totalEl.textContent = formatRupiah(shippingCost);
        return;
    }
    
    container.innerHTML = currentCart.map(item => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.name}" class="order-item-image" 
                 onerror="this.src='https://via.placeholder.com/80?text=No+Image'">
            <div class="order-item-details">
                <h4>${item.name}</h4>
                <p>${item.size}</p>
                <div class="order-item-price">
                    <span class="order-item-quantity">${item.quantity}x</span>
                    <span class="order-item-total">${formatRupiah(item.price * item.quantity)}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    const subtotal = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalEl.textContent = formatRupiah(subtotal);
    totalEl.textContent = formatRupiah(subtotal + shippingCost);
}

// ============================================
// FORM
// ============================================

function initForm() {
    console.log('📝 Initializing form...');
    const form = document.getElementById('expressCheckoutForm');
    
    if (!form) {
        console.error('❌ Form not found!');
        return;
    }
    
    console.log('✅ Form found:', form);
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('🎯 Form submitted!');
        
        if (validate()) {
            console.log('✅ Validation passed, showing payment modal...');
            showPaymentModal();
        } else {
            console.log('❌ Validation failed');
        }
    });
    
    console.log('✅ Form event listener attached');
}

function validate() {
    console.log('🔍 Validating form...');
    
    // Email
    const email = document.getElementById('email');
    console.log('Email element:', email);
    console.log('Email value:', email ? email.value : 'NOT FOUND');
    if (!email || !email.value.trim() || !email.value.includes('@')) {
        console.log('❌ Email validation failed');
        showNotification('Email tidak valid (harus ada @)', 'error');
        if (email) email.focus();
        return false;
    }
    
    // Phone
    const phone = document.getElementById('phone');
    console.log('Phone value:', phone ? phone.value : 'NOT FOUND');
    if (!phone || !phone.value.trim() || phone.value.trim().length < 10) {
        console.log('❌ Phone validation failed');
        showNotification('Nomor telepon min 10 digit', 'error');
        if (phone) phone.focus();
        return false;
    }
    
    // Full name
    const fullname = document.getElementById('fullname');
    console.log('Fullname value:', fullname ? fullname.value : 'NOT FOUND');
    if (!fullname || !fullname.value.trim()) {
        console.log('❌ Fullname validation failed');
        showNotification('Nama harus diisi', 'error');
        if (fullname) fullname.focus();
        return false;
    }
    
    // Address
    const address = document.getElementById('address');
    console.log('Address value:', address ? address.value : 'NOT FOUND');
    if (!address || !address.value.trim()) {
        console.log('❌ Address validation failed');
        showNotification('Alamat harus diisi', 'error');
        if (address) address.focus();
        return false;
    }
    
    // City
    const city = document.getElementById('city');
    console.log('City value:', city ? city.value : 'NOT FOUND');
    if (!city || !city.value.trim()) {
        console.log('❌ City validation failed');
        showNotification('Kota harus diisi', 'error');
        if (city) city.focus();
        return false;
    }
    
    // Province
    const province = document.getElementById('province');
    console.log('Province value:', province ? province.value : 'NOT FOUND');
    if (!province || !province.value || province.value === '') {
        console.log('❌ Province validation failed');
        showNotification('Provinsi harus dipilih', 'error');
        if (province) province.focus();
        return false;
    }
    
    // Postal code
    const postalcode = document.getElementById('postalcode');
    console.log('Postalcode value:', postalcode ? postalcode.value : 'NOT FOUND');
    if (!postalcode || !postalcode.value.trim()) {
        console.log('❌ Postalcode validation failed');
        showNotification('Kode pos harus diisi', 'error');
        if (postalcode) postalcode.focus();
        return false;
    }
    
    console.log('✅ All validations passed!');
    return true;
}

// ============================================
// PAYMENT MODAL
// ============================================

function initPaymentModal() {
    console.log('💳 Initializing payment modal...');
    
    const modal = document.getElementById('paymentModal');
    const close = document.getElementById('closePaymentModal');
    const cards = document.querySelectorAll('.payment-method-card');
    const confirm = document.getElementById('confirmPaymentBtn');
    
    console.log('Modal element:', modal);
    console.log('Close button:', close);
    console.log('Payment cards found:', cards.length);
    console.log('Confirm button:', confirm);
    
    if (close) {
        close.onclick = () => {
            console.log('❌ Closing payment modal');
            modal.classList.remove('active');
        };
    }
    
    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) {
                console.log('❌ Closing payment modal (click outside)');
                modal.classList.remove('active');
            }
        };
    }
    
    cards.forEach((card, index) => {
        card.onclick = () => {
            console.log(`💳 Payment method selected: ${card.dataset.method}`);
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedPayment = card.dataset.method;
            console.log('Current selected payment:', selectedPayment);
        };
        console.log(`Card ${index + 1} initialized:`, card.dataset.method);
    });
    
    if (confirm) {
        confirm.onclick = () => {
            console.log('🔘 Confirm button clicked');
            console.log('Selected payment:', selectedPayment);
            
            if (!selectedPayment) {
                console.log('⚠️ No payment method selected');
                showNotification('Pilih metode pembayaran dulu!', 'warning');
                return;
            }
            
            console.log('✅ Processing payment...');
            processPayment();
        };
    }
    
    console.log('✅ Payment modal initialized');
}

function showPaymentModal() {
    console.log('🎬 Opening payment modal...');
    const modal = document.getElementById('paymentModal');
    
    if (!modal) {
        console.error('❌ Payment modal not found!');
        alert('Error: Modal tidak ditemukan!');
        return;
    }
    
    modal.classList.add('active');
    console.log('✅ Payment modal opened');
    console.log('Modal classes:', modal.className);
}

function processPayment() {
    console.log('💰 Processing payment with method:', selectedPayment);
    
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.remove('active');
        console.log('✅ Payment modal closed');
    }
    
    showNotification('Memproses pembayaran...', 'info');
    
    setTimeout(() => {
        console.log('✅ Payment processed, showing success modal...');
        showSuccess();
    }, 1000);
}

// ============================================
// SUCCESS MODAL
// ============================================

function showSuccess() {
    const modal = document.getElementById('successModal');
    const orderId = 'YIS' + Date.now();
    
    let currentCart = window.cart || cart || [];
    if (!currentCart || currentCart.length === 0) {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try { currentCart = JSON.parse(saved); } 
            catch (e) { currentCart = []; }
        }
    }
    
    const subtotal = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + shippingCost;
    
    const methods = {
        gopay: 'GoPay', ovo: 'OVO', dana: 'DANA', shopeepay: 'ShopeePay',
        bca: 'Bank BCA', mandiri: 'Bank Mandiri', qris: 'QRIS', cod: 'COD'
    };
    
    // Simpan data untuk WA
    orderData = {
        orderId: orderId,
        items: currentCart,
        subtotal: subtotal,
        ongkir: shippingCost,
        total: total,
        payment: methods[selectedPayment] || selectedPayment,
        customer: {
            name: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: `${document.getElementById('address').value}, ${document.getElementById('city').value}, ${document.getElementById('province').value} ${document.getElementById('postalcode').value}`
        }
    };
    
    // Update modal
    document.getElementById('orderId').textContent = orderId;
    document.getElementById('paymentMethod').textContent = methods[selectedPayment] || '-';
    document.getElementById('orderTotal').textContent = formatRupiah(total);
    document.getElementById('customerName').textContent = orderData.customer.name;
    document.getElementById('customerEmail').textContent = orderData.customer.email;
    document.getElementById('customerPhone').textContent = orderData.customer.phone;
    document.getElementById('customerAddress').textContent = orderData.customer.address;
    
    modal.classList.add('active');
    
    // Clear cart
    window.cart = [];
    if (typeof cart !== 'undefined') cart = [];
    localStorage.removeItem('cart');
    if (typeof updateCart === 'function') updateCart();
    
    showNotification('Pesanan berhasil!', 'success');
    
    // Init WA button
    const waBtn = document.getElementById('confirmWhatsAppBtn');
    if (waBtn) waBtn.onclick = sendToWhatsApp;
    
    // Close modal
    const close = document.getElementById('closeSuccessModal');
    if (close) {
        close.onclick = () => {
            modal.classList.remove('active');
            window.location.href = 'index.html';
        };
    }
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            window.location.href = 'index.html';
        }
    };
}

// ============================================
// WHATSAPP CONFIRMATION
// ============================================

function sendToWhatsApp() {
    const items = orderData.items.map(item => 
        `- ${item.name} (${item.size}) x${item.quantity} = ${formatRupiah(item.price * item.quantity)}`
    ).join('\n');
    
    const msg = `Halo your.i scent! 👋

Saya sudah melakukan pemesanan:

*Order ID:* ${orderData.orderId}
*Metode Pembayaran:* ${orderData.payment}

*Detail Pesanan:*
${items}

*Subtotal:* ${formatRupiah(orderData.subtotal)}
*Ongkir:* ${formatRupiah(orderData.ongkir)}
*Total:* ${formatRupiah(orderData.total)}

*Data Pelanggan:*
Nama: ${orderData.customer.name}
Email: ${orderData.customer.email}
Telepon: ${orderData.customer.phone}
Alamat: ${orderData.customer.address}

Mohon info lebih lanjut untuk pembayaran. Terima kasih! 🙏`;
    
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, '_blank');
    showNotification('Mengarahkan ke WhatsApp...', 'success');
}