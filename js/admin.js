import { products } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- State & Data ----------------------------------------------------------
    const State = {
        products: [...products],
        isLoggedIn: false
    };

    // --- Utils -----------------------------------------------------------------
    const qs = (s) => document.querySelector(s);
    const qsa = (s) => document.querySelectorAll(s);
    const formatPrice = (p) => `$${parseFloat(p).toFixed(2)}`;

    // --- Theme Module ----------------------------------------------------------
    const Theme = {
        current: localStorage.getItem('voxera_theme') || 'dark',
        
        init: () => {
            Theme.apply(Theme.current);
            const btn = qs('#theme-toggle');
            if (btn) btn.onclick = Theme.toggle;
        },

        toggle: () => {
            Theme.current = Theme.current === 'dark' ? 'light' : 'dark';
            localStorage.setItem('voxera_theme', Theme.current);
            Theme.apply(Theme.current);
        },

        apply: (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            const icon = qs('#theme-toggle i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    };

    // --- Localization Module ---------------------------------------------------
    const Localization = {
        lang: localStorage.getItem('voxera_lang') || 'en',
        translations: {
            en: {
                adminAccess: "Admin Access", username: "Username", password: "Password", login: "Login",
                backToSite: "Back to Site", dashboardOverview: "Dashboard Overview",
                totalProducts: "Total Products", totalValue: "Total Inventory Value", avgPrice: "Average Price", topCategory: "Top Category",
                productManagement: "Product Management", addNewProduct: "Add New Product",
                thId: "ID", thName: "Name", thPrice: "Price", thCategory: "Category", thActions: "Actions",
                modalAddTitle: "Add Product", modalEditTitle: "Edit Product",
                lblProductName: "Product Name", lblPrice: "Price ($)", lblCategory: "Category",
                lblColors: "Colors (Hex codes, comma separated)", lblSizes: "Sizes (Comma separated)",
                lblNewArrival: "Feature in New Arrivals", lblDescription: "Description",
                lblImageFile: "Product Image (File)", lblImageUrl: "Or Product Image (URL)", btnSave: "Save Product",
                footerAdmin: "VOXERA ADMIN", internalSystem: "Internal Management System", quickLinks: "Quick Links",
                home: "Home", shop: "Shop", allRightsReserved: "All Rights Reserved."
            },
            ar: {
                adminAccess: "دخول المسؤول", username: "اسم المستخدم", password: "كلمة المرور", login: "تسجيل الدخول",
                backToSite: "العودة للموقع", dashboardOverview: "نظرة عامة على اللوحة",
                totalProducts: "إجمالي المنتجات", totalValue: "قيمة المخزون", avgPrice: "متوسط السعر", topCategory: "الفئة الأفضل",
                productManagement: "إدارة المنتجات", addNewProduct: "إضافة منتج جديد",
                thId: "المعرف", thName: "الاسم", thPrice: "السعر", thCategory: "الفئة", thActions: "الإجراءات",
                modalAddTitle: "إضافة منتج", modalEditTitle: "تعديل منتج",
                lblProductName: "اسم المنتج", lblPrice: "السعر ($)", lblCategory: "الفئة",
                lblColors: "الألوان (رموز Hex، مفصولة بفواصل)", lblSizes: "المقاسات (مفصولة بفواصل)",
                lblNewArrival: "عرض في 'وصل حديثاً'", lblDescription: "الوصف",
                lblImageFile: "صورة المنتج (ملف)", lblImageUrl: "أو صورة المنتج (رابط)", btnSave: "حفظ المنتج",
                footerAdmin: "مسؤول فوكسيرا", internalSystem: "نظام الإدارة الداخلي", quickLinks: "روابط سريعة",
                home: "الرئيسية", shop: "المتجر", allRightsReserved: "جميع الحقوق محفوظة."
            }
        },

        init: () => {
            Localization.apply(Localization.lang);
            const btn = qs('#lang-toggle');
            if (btn) btn.onclick = Localization.toggle;
        },

        toggle: () => {
            Localization.lang = Localization.lang === 'en' ? 'ar' : 'en';
            localStorage.setItem('voxera_lang', Localization.lang);
            Localization.apply(Localization.lang);
        },

        apply: (lang) => {
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = lang;
            const t = Localization.translations[lang];
            qsa('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (t[key]) el.textContent = t[key];
            });
            const btn = qs('#lang-toggle');
            if (btn) btn.textContent = lang === 'en' ? 'AR' : 'EN';
        }
    };

    // --- UI Manager ------------------------------------------------------------
    const UI = {
        loadDashboard: () => {
            qsa('header, main, footer').forEach(el => el.style.display = '');
            UI.renderTable();
            UI.updateStats();
            UI.initAnimations();
        },

        updateStats: () => {
            const total = State.products.length;
            const value = State.products.reduce((sum, p) => sum + (p.price || 0), 0);
            
            // Calculate top category
            const counts = {};
            State.products.forEach(p => {
                const cat = p.category || 'Uncategorized';
                counts[cat] = (counts[cat] || 0) + 1;
            });
            const topCat = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || '-';

            qs('#stat-total-products').textContent = total;
            qs('#stat-total-value').textContent = formatPrice(value);
            qs('#stat-avg-price').textContent = formatPrice(total ? value / total : 0);
            qs('#stat-top-category').textContent = topCat;
        },

        renderTable: () => {
            const tbody = qs('#admin-product-list');
            if (!tbody) return;

            const fragment = document.createDocumentFragment();
            State.products.forEach(p => {
                const tr = document.createElement('tr');
                tr.dataset.id = p.id;
                tr.innerHTML = `
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${formatPrice(p.price)}</td>
                    <td>${p.category || 'N/A'}</td>
                    <td>
                        <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                fragment.appendChild(tr);
            });
            tbody.innerHTML = '';
            tbody.appendChild(fragment);
        },

        openModal: (title, product = null) => {
            const modal = qs('#admin-modal');
            const form = qs('#product-form');
            if (!modal || !form) return;

            // Use translation for title if possible, or fallback
            qs('#modal-title').textContent = title === 'Add Product' ? Localization.translations[Localization.lang].modalAddTitle : Localization.translations[Localization.lang].modalEditTitle;
            form.reset();

            if (product) {
                qs('#product-id').value = product.id;
                qs('#p-name').value = product.name;
                qs('#p-price').value = product.price;
                qs('#p-category').value = product.category;
                qs('#p-desc').value = product.description;
                qs('#p-colors').value = (product.colors || []).join(', ');
                qs('#p-sizes').value = (product.sizes || []).join(', ');
                qs('#p-new-arrival').checked = !!product.newArrival;
                qs('#p-image-url').value = (product.image && !product.image.startsWith('data:')) ? product.image : '';
            } else {
                qs('#product-id').value = '';
            }
            modal.style.display = 'flex';
        },

        initAnimations: () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            qsa('.stat-card, .admin-header, .admin-table, .footer-section').forEach(el => {
                el.classList.add('reveal');
                observer.observe(el);
            });
        }
    };

    // --- Actions ---------------------------------------------------------------
    const Actions = {
        deleteProduct: (id) => {
            if (confirm('Delete this product?')) {
                State.products = State.products.filter(p => p.id !== id);
                UI.renderTable();
                UI.updateStats();
            }
        },

        saveProduct: async (e) => {
            e.preventDefault();
            const id = qs('#product-id').value;
            const file = qs('#p-image').files[0];
            
            let image = qs('#p-image-url').value.trim();
            if (file) {
                image = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
            }

            const productData = {
                name: qs('#p-name').value,
                price: parseFloat(qs('#p-price').value),
                category: qs('#p-category').value,
                description: qs('#p-desc').value,
                colors: qs('#p-colors').value.split(',').map(s => s.trim()).filter(Boolean),
                sizes: qs('#p-sizes').value.split(',').map(s => s.trim()).filter(Boolean),
                newArrival: qs('#p-new-arrival').checked,
                image: image || null
            };

            if (id) {
                const idx = State.products.findIndex(p => p.id == id);
                if (idx !== -1) {
                    State.products[idx] = { ...State.products[idx], ...productData };
                    if (!image) State.products[idx].image = State.products[idx].image; // Keep old if no new
                }
            } else {
                const newId = State.products.length ? Math.max(...State.products.map(p => p.id)) + 1 : 1;
                State.products.push({ id: newId, ...productData });
            }

            qs('#admin-modal').style.display = 'none';
            UI.renderTable();
            UI.updateStats();
        }
    };

    // --- Event Listeners -------------------------------------------------------
    
    // Login
    const loginForm = qs('#admin-login-form');
    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            const u = qs('#admin-user').value.trim().toUpperCase();
            const p = qs('#admin-pass').value.trim().toUpperCase();
            if (u === 'ADMIN' && p === 'MH') {
                qs('#admin-login-overlay').style.display = 'none';
                UI.loadDashboard();
            } else {
                alert('Invalid credentials');
            }
        };
    }

    // Table Actions (Delegation)
    const list = qs('#admin-product-list');
    if (list) {
        list.onclick = (e) => {
            const btn = e.target.closest('.action-btn');
            if (!btn) return;
            const id = parseInt(e.target.closest('tr').dataset.id);
            
            if (btn.classList.contains('delete-btn')) Actions.deleteProduct(id);
            if (btn.classList.contains('edit-btn')) {
                const p = State.products.find(prod => prod.id === id);
                if (p) UI.openModal('Edit Product', p);
            }
        };
    }

    // Modal Controls
    const addBtn = qs('#add-product-btn');
    const closeBtn = qs('.close-modal');
    const modal = qs('#admin-modal');
    const form = qs('#product-form');

    if (addBtn) addBtn.onclick = () => UI.openModal('Add Product');
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
    if (modal) window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    if (form) form.onsubmit = Actions.saveProduct;

    // Password Toggle
    qsa('.password-toggle').forEach(t => {
        t.onclick = () => {
            const input = qs(`#${t.dataset.target}`);
            if (input) {
                const isPass = input.type === 'password';
                input.type = isPass ? 'text' : 'password';
                t.className = `far fa-eye${isPass ? '-slash' : ''} password-toggle`;
            }
        };
    });

    // Init Theme & Localization
    Theme.init();
    Localization.init();
});