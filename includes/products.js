// ============================================
// PRODUCTS.JS - Product Data & Functions
// ============================================

// Data produk parfum
const products = [
    {
        id: 1,
        name: "Mykonos Sorrento",
        category: "Men's Fragrance",
        description: "Aroma maskulin dengan campuran segar bergamot dan pedas lada",
        notes: {
            top: ["Fizzy Grapefruit", "Bergamot", "Mandarin Orange", "Magnolia", "Ginger"],
            middle: ["Fizzy Grapefruit", "Neroli", "Ginger", "Powdery Notes", "Water Notes"],
            base: ["Fizzy Grapefruit", "Amber", "Musk", "Cedar", "Patchouli", "Orris Root"]
        },
        image: "img/products/sorrento.jpeg",
        sizes: [
            { volume: "2ml", price: 16000 },
            { volume: "5ml", price: 35000 },
            { volume: "10ml", price: 60000 }
        ]
    },
    {
        id: 2,
        name: "Chanel Coco Mademoiselle",
        category: "Women's Fragrance",
        description: "Elegan dan feminin dengan sentuhan oriental yang sensual",
        notes: {
            top: ["Orange", "Mandarin", "Bergamot"],
            middle: ["Rose", "Jasmine", "Lychee"],
            base: ["Patchouli", "Vanilla", "Vetiver"]
        },
        image: "img/products/chanel-coco.jpg",
        sizes: [
            { volume: "2ml", price: 16000 },
            { volume: "5ml", price: 35000 },
            { volume: "10ml", price: 60000 }
        ]
    },
    {
        id: 3,
        name: "Tom Ford Oud Wood",
        category: "Unisex Fragrance",
        description: "Aroma kayu oud eksotis dengan sentuhan vanilla yang hangat",
        notes: {
            top: ["Rosewood", "Cardamom"],
            middle: ["Oud Wood", "Sandalwood"],
            base: ["Vanilla", "Tonka Bean", "Amber"]
        },
        image: "img/products/tom-ford-oud.jpg",
        sizes: [
            { volume: "2ml", price: 16000 },
            { volume: "5ml", price: 35000 },
            { volume: "10ml", price: 60000 }
        ]
    },
];

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" 
                alt="${product.name}" 
                class="product-image"
                onerror="this.src='https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'; this.style.opacity='0.5';">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                
                <!-- Notes Toggle Button -->
                <button class="notes-toggle" data-product-id="${product.id}">
                    <span><i class="fas fa-flask"></i> Lihat Notes</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                
                <!-- Notes Dropdown Content -->
                <div class="product-notes-detailed" id="notes-${product.id}">
                    <div class="notes-group">
                        <div class="notes-label">Top Notes</div>
                        <div class="notes-list">
                            ${product.notes.top.map(note => `<span class="note-tag top">${note}</span>`).join('')}
                        </div>
                    </div>
                    <div class="notes-group">
                        <div class="notes-label">Middle Notes</div>
                        <div class="notes-list">
                            ${product.notes.middle.map(note => `<span class="note-tag middle">${note}</span>`).join('')}
                        </div>
                    </div>
                    <div class="notes-group">
                        <div class="notes-label">Base Notes</div>
                        <div class="notes-list">
                            ${product.notes.base.map(note => `<span class="note-tag base">${note}</span>`).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="size-selector">
                    <div class="size-label">Pilih Ukuran:</div>
                    <div class="size-options" data-product-id="${product.id}">
                        ${product.sizes.map((size, index) => `
                            <div class="size-option ${index === 0 ? 'selected' : ''}" data-size="${size.volume}" data-price="${size.price}">
                                <div class="size-volume">${size.volume}</div>
                                <div class="size-price">${formatRupiah(size.price)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <button class="add-to-cart" data-product-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                </button>
            </div>
        </div>
    `).join('');

    // Event listeners untuk size options
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Event listeners untuk notes toggle
    document.querySelectorAll('.notes-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const notesContent = document.getElementById(`notes-${productId}`);
            
            // Toggle active class
            this.classList.toggle('active');
            notesContent.classList.toggle('active');
        });
    });

    // Event listeners untuk add to cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const product = products.find(p => p.id === productId);
            const sizeOptions = document.querySelector(`.size-options[data-product-id="${productId}"]`);
            const selectedSize = sizeOptions.querySelector('.size-option.selected');
            const size = selectedSize.getAttribute('data-size');
            const price = parseInt(selectedSize.getAttribute('data-price'));
            addToCart(product, size, price);
        });
    });
}

// Initialize products saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderProducts);