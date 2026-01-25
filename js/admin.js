document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('admin-product-list');
    const modal = document.getElementById('admin-modal');
    const addBtn = document.getElementById('add-product-btn');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('product-form');
    const modalTitle = document.getElementById('modal-title');

    // Load products from LocalStorage (Moved up for scope access)
    let products = [];
    try {
        products = JSON.parse(localStorage.getItem('void_products')) || [];
    } catch (e) {
        products = [];
    }

    // --- Login Logic -----------------------------------------------------------
    const loginOverlay = document.getElementById('admin-login-overlay');
    const loginForm = document.getElementById('admin-login-form');
    const protectedElements = document.querySelectorAll('header, main, footer');

    function loadDashboard() {
        protectedElements.forEach(el => el.style.display = '');
        renderTable();
        updateStats();
    }

    // Check if already logged in this session
    if (sessionStorage.getItem('void_admin_auth') === 'true') {
        if(loginOverlay) loginOverlay.style.display = 'none';
        loadDashboard();
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('admin-user').value.trim();
            const pass = document.getElementById('admin-pass').value.trim();

            if (user.toUpperCase() === 'ADMIN' && pass.toUpperCase() === 'MH') {
                sessionStorage.setItem('void_admin_auth', 'true');
                if(loginOverlay) loginOverlay.style.display = 'none';
                loadDashboard();
            } else {
                alert('Invalid credentials');
            }
        });
    }

    // Password Toggle
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    toggle.classList.remove('fa-eye');
                    toggle.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    toggle.classList.remove('fa-eye-slash');
                    toggle.classList.add('fa-eye');
                }
            }
        });
    });

    function saveProducts() {
        try {
            localStorage.setItem('void_products', JSON.stringify(products));
            renderTable();
            updateStats();
        } catch (e) {
            if (e.name === 'QuotaExceededError' || e.code === 22) {
                alert('Storage full! Please use smaller images (under 500KB) or delete old products.');
            } else {
                alert('Error saving product: ' + e.message);
            }
        }
    }

    function updateStats() {
        const totalProducts = products.length;
        const totalValue = products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);
        const avgPrice = totalProducts > 0 ? (totalValue / totalProducts) : 0;

        // Find top category
        const categories = {};
        products.forEach(p => {
            const cat = p.category || 'Uncategorized';
            categories[cat] = (categories[cat] || 0) + 1;
        });
        
        const topCategory = Object.keys(categories).length > 0 
            ? Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b) 
            : '-';

        document.getElementById('stat-total-products').textContent = totalProducts;
        document.getElementById('stat-total-value').textContent = `$${totalValue.toFixed(2)}`;
        document.getElementById('stat-avg-price').textContent = `$${avgPrice.toFixed(2)}`;
        document.getElementById('stat-top-category').textContent = topCategory;
    }

    function renderTable() {
        productList.innerHTML = '';
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>$${parseFloat(product.price).toFixed(2)}</td>
                <td>${product.category || 'N/A'}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            productList.appendChild(tr);
        });
    }

    // Expose functions to global scope for onclick handlers
    window.deleteProduct = (id) => {
        if(confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== id);
            saveProducts();
        }
    };

    window.editProduct = (id) => {
        const product = products.find(p => p.id === id);
        if(product) {
            document.getElementById('product-id').value = product.id;
            document.getElementById('p-name').value = product.name;
            document.getElementById('p-price').value = product.price;
            document.getElementById('p-category').value = product.category;
            document.getElementById('p-desc').value = product.description;
            document.getElementById('p-colors').value = (product.colors || []).join(', ');
            document.getElementById('p-sizes').value = (product.sizes || []).join(', ');
            document.getElementById('p-new-arrival').checked = product.newArrival || false;
            document.getElementById('p-image').value = ''; // Clear file input
            const currentImg = product.image || '';
            document.getElementById('p-image-url').value = currentImg.startsWith('data:') ? '' : currentImg;
            
            modalTitle.textContent = 'Edit Product';
            modal.style.display = 'flex';
        }
    };

    // Modal Logic
    addBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('product-id').value = '';
        modalTitle.textContent = 'Add Product';
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('product-id').value;
        const name = document.getElementById('p-name').value;
        const price = parseFloat(document.getElementById('p-price').value);
        const category = document.getElementById('p-category').value;
        const description = document.getElementById('p-desc').value;
        const colorsInput = document.getElementById('p-colors').value;
        const sizesInput = document.getElementById('p-sizes').value;
        const newArrival = document.getElementById('p-new-arrival').checked;
        const imageFile = document.getElementById('p-image').files[0];
        const imageUrl = document.getElementById('p-image-url').value.trim();

        const readFileAsDataURL = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        };

        let imageDataUrl = null;
        if (imageFile) {
            imageDataUrl = await readFileAsDataURL(imageFile);
        } else if (imageUrl) {
            imageDataUrl = imageUrl;
        }

        const colors = colorsInput ? colorsInput.split(',').map(c => c.trim()).filter(c => c) : ['#000000', '#ffffff'];
        const sizes = sizesInput ? sizesInput.split(',').map(s => s.trim()).filter(s => s) : ['S', 'M', 'L', 'XL'];

        if (id) {
            // Edit
            const index = products.findIndex(p => p.id == id);
            if (index !== -1) {
                const updatedProduct = { 
                    ...products[index], 
                    name, price, category, description, colors, sizes, newArrival
                };
                if (imageDataUrl) {
                    updatedProduct.image = imageDataUrl;
                }
                delete updatedProduct.modelPath;
                products[index] = updatedProduct;
            }
        } else {
            // Add
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            const newProduct = {
                id: newId,
                name,
                price,
                category,
                description,
                image: imageDataUrl,
                colors: colors,
                sizes: sizes,
                newArrival: newArrival
            };
            products.push(newProduct);
        }

        saveProducts();
        modal.style.display = 'none';
        form.reset();
    });

    // Initial Render is handled by loadDashboard

    // --- Scroll Animations -----------------------------------------------------
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.stat-card, .admin-header, .admin-table, .footer-section');
    elements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
});