import { products, collections } from './data.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration & Data --------------------------------------------------
    const CONFIG = {
        fallbackImage: 'asset/image/placeholder.jpg',
        scrollThreshold: 300,
        itemsPerPage: 6
    };

    // --- State Management ------------------------------------------------------
    const State = {
        cart: [],
        users: JSON.parse(localStorage.getItem('voxera_users')) || [],
        currentUser: JSON.parse(localStorage.getItem('voxera_user')) || null,
        orders: {},
        products: [...products],
        collections: [...collections],
        itemsToShow: CONFIG.itemsPerPage,
        scrollObserver: null,
        isParallaxTicking: false
    };

    // --- Utilities -------------------------------------------------------------
    const Utils = {
        qs: (selector, parent = document) => parent.querySelector(selector),
        qsa: (selector, parent = document) => parent.querySelectorAll(selector),

        formatPrice: (price) => `$${parseFloat(price).toFixed(2)}`,

        // Safe image loader with fallback
        getImage: (url) => url || CONFIG.fallbackImage,

        // Debounce for performance
        debounce: (func, wait) => {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
    };

    // --- Theme Module ----------------------------------------------------------
    const Theme = {
        current: localStorage.getItem('voxera_theme') || 'dark',

        init: () => {
            Theme.apply(Theme.current);
            const btn = Utils.qs('#theme-toggle');
            if (btn) btn.onclick = Theme.toggle;
        },

        toggle: () => {
            Theme.current = Theme.current === 'dark' ? 'light' : 'dark';
            localStorage.setItem('voxera_theme', Theme.current);
            Theme.apply(Theme.current);
        },

        apply: (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            const icon = Utils.qs('#theme-toggle i');
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
                home: "Home", shop: "Shop", about: "About", contact: "Contact", faq: "FAQ",
                heroTitle: "Voxera", heroSubtitle: "Clothing as structure. Style as evolution.", discover: "Discover More",
                newArrivals: "New Arrivals", lookbook: "Style Lookbook", collections: "Collections",
                aboutTitle: "ABOUT Voxera",
                aboutText1: "Voxera is a fashion label built around form, fit, and expression. We create contemporary garments that balance minimal aesthetics with strong identity.",
                aboutText2: "Every piece is thoughtfully constructed using quality materials and produced in limited quantities, focusing on durability, sustainability, and timeless wear.",
                testimonials: "What Our Users Say",
                contactTitle: "Get in Touch", contactSub: "Have a question or a collaboration idea? Drop us a line.",
                name: "Your Name", email: "Your Email", message: "Your Message", send: "Send Message",
                newsletter: "Subscribe for the latest drops.", subscribe: "Subscribe", emailPlaceholder: "Enter your email",
                cartTitle: "Your Cart", total: "Total", checkout: "Checkout",
                size: "Size:", color: "Color:", addToCart: "Add to Cart",
                // Auth & Common
                login: "Login", signUp: "Sign Up", emailAddr: "Email Address", password: "Password", fullName: "Full Name",
                forgotPassword: "Forgot Password?", resetPassword: "Reset Password", sendResetLink: "Send Reset Link",
                backToLogin: "Back to Login", createAccount: "Create Account", profilePhotoOptional: "Profile Photo (Optional)",
                enterEmailReset: "Enter your email address and we'll send you a link to reset your password.",
                // Checkout
                checkoutPageTitle: "Checkout", billingDetails: "Billing Details", address: "Address", city: "City",
                zipCode: "Zip Code", country: "Country", yourOrder: "Your Order", proceedPayment: "Proceed to Payment",
                paymentDetails: "Payment Details", cardNumber: "Card Number", expiryDate: "Expiry Date", cvc: "CVC",
                cardholderName: "Cardholder Name", payNow: "Pay Now", totalAmount: "Total Amount:",
                // Profile
                myProfile: "My Profile", editProfile: "Edit Profile", personalInfo: "Personal Info", myOrders: "My Orders",
                signOut: "Sign Out", phoneNumber: "Phone Number", shippingAddress: "Shipping Address", memberSince: "Member Since",
                orderHistory: "Order History", saveChanges: "Save Changes", profilePhotoUrl: "Profile Photo (URL)",
                orUploadPhoto: "Or Upload Photo", loginPromptTitle: "Please Log In", loginPromptText: "You must be logged in to view your profile.",
                backToHome: "Back to Home", noPastOrders: "No past orders.", notProvided: "Not provided",
                footerMotto: "Future Forms, Present Fashion.",
                footerMottoShort: "Present Fashion.",
                quickLinks: "Quick Links", admin: "Admin", followUs: "Follow Us", newsletterTitle: "Newsletter", allRightsReserved: "All Rights Reserved.",
                // Collection/Shop Page
                allProducts: "All Products",
                searchPlaceholder: "Search products...",
                sortByDefault: "Sort by: Default",
                sortPriceAsc: "Price: Low to High",
                sortPriceDesc: "Price: High to Low",
                loadMore: "Load More",
                // FAQ Page
                faqTitle: "Frequently Asked Questions",
                faqQ1: "How does the digital sizing work?",
                faqA1: "Our clothing is designed with standard international sizing. For our digital-only items, files are compatible with most major 3D avatars and metaverse platforms.",
                faqQ2: "Do you ship internationally?",
                faqA2: "Yes, Voxera ships to over 50 countries worldwide. Shipping times vary based on location, but typically range from 5-10 business days.",
                faqQ3: "What is the return policy?",
                faqA3: "Physical items can be returned within 30 days of receipt if they are unworn and in original packaging. Digital assets are non-refundable once downloaded.",
                faqQ4: "Are the materials sustainable?",
                faqA4: "Absolutely. We use a blend of recycled synthetics and organic cottons. Our goal is to minimize our carbon footprint while maximizing durability."
            },
            ar: {
                home: "الرئيسية", shop: "المتجر", about: "من نحن", contact: "تواصل معنا", faq: "الأسئلة الشائعة",
                heroTitle: "Vexora", heroSubtitle: "الأزياء كبنية. الأسلوب كتطور.", discover: "اكتشف المزيد",
                newArrivals: "وصل حديثاً", lookbook: "معرض الأناقة", collections: "المجموعات",
                aboutTitle: "عن فوكسيرا",
                aboutText1: "فوكسيرا هي علامة تجارية للأزياء مبنية حول الشكل والملاءمة والتعبير. نصنع ملابس معاصرة توازن بين الجماليات البسيطة والهوية القوية.",
                aboutText2: "يتم تصميم كل قطعة بعناية باستخدام مواد عالية الجودة وإنتاجها بكميات محدودة، مع التركيز على المتانة والاستدامة.",
                testimonials: "ماذا يقول عملاؤنا",
                contactTitle: "تواصل معنا", contactSub: "لديك سؤال أو فكرة للتعاون؟ راسلنا.",
                name: "الاسم", email: "البريد الإلكتروني", message: "الرسالة", send: "إرسال الرسالة",
                newsletter: "اشترك للحصول على أحدث الإصدارات.", subscribe: "اشترك", emailPlaceholder: "أدخل بريدك الإلكتروني",
                cartTitle: "عربة التسوق", total: "المجموع", checkout: "الدفع",
                size: "المقاس:", color: "اللون:", addToCart: "أضف إلى العربة",
                // Auth & Common
                login: "تسجيل الدخول", signUp: "إنشاء حساب", emailAddr: "البريد الإلكتروني", password: "كلمة المرور", fullName: "الاسم الكامل",
                forgotPassword: "نسيت كلمة المرور؟", resetPassword: "إعادة تعيين كلمة المرور", sendResetLink: "إرسال رابط إعادة التعيين",
                backToLogin: "العودة لتسجيل الدخول", createAccount: "إنشاء الحساب", profilePhotoOptional: "صورة الملف الشخصي (اختياري)",
                enterEmailReset: "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.",
                // Checkout
                checkoutPageTitle: "الدفع", billingDetails: "تفاصيل الفاتورة", address: "العنوان", city: "المدينة",
                zipCode: "الرمز البريدي", country: "الدولة", yourOrder: "طلبك", proceedPayment: "متابعة الدفع",
                paymentDetails: "تفاصيل الدفع", cardNumber: "رقم البطاقة", expiryDate: "تاريخ الانتهاء", cvc: "رمز التحقق (CVC)",
                cardholderName: "اسم حامل البطاقة", payNow: "ادفع الآن", totalAmount: "المبلغ الإجمالي:",
                // Profile
                myProfile: "ملفي الشخصي", editProfile: "تعديل الملف الشخصي", personalInfo: "المعلومات الشخصية", myOrders: "طلباتي",
                signOut: "تسجيل الخروج", phoneNumber: "رقم الهاتف", shippingAddress: "عنوان الشحن", memberSince: "عضو منذ",
                orderHistory: "سجل الطلبات", saveChanges: "حفظ التغييرات", profilePhotoUrl: "صورة الملف الشخصي (رابط)",
                orUploadPhoto: "أو رفع صورة", loginPromptTitle: "يرجى تسجيل الدخول", loginPromptText: "يجب عليك تسجيل الدخول لعرض ملفك الشخصي.",
                backToHome: "العودة للرئيسية", noPastOrders: "لا توجد طلبات سابقة.", notProvided: "غير متوفر",
                footerMotto: "أشكال المستقبل، أزياء الحاضر.",
                footerMottoShort: "أزياء الحاضر.",
                quickLinks: "روابط سريعة", admin: "المسؤول", followUs: "تابعنا", newsletterTitle: "النشرة البريدية", allRightsReserved: "جميع الحقوق محفوظة.",
                // Collection/Shop Page
                allProducts: "جميع المنتجات",
                searchPlaceholder: "ابحث عن منتجات...",
                sortByDefault: "الترتيب: افتراضي",
                sortPriceAsc: "السعر: من الأقل للأعلى",
                sortPriceDesc: "السعر: من الأعلى للأقل",
                loadMore: "تحميل المزيد",
                // FAQ Page
                faqTitle: "الأسئلة الشائعة",
                faqQ1: "كيف يعمل التحجيم الرقمي؟",
                faqA1: "تم تصميم ملابسنا بأحجام دولية قياسية. بالنسبة للعناصر الرقمية فقط، تتوافق الملفات مع معظم الصور الرمزية ثلاثية الأبعاد ومنصات الميتافيرس الرئيسية.",
                faqQ2: "هل تشحنون دوليًا؟",
                faqA2: "نعم، تشحن فوكسيرا إلى أكثر من 50 دولة حول العالم. تختلف أوقات الشحن حسب الموقع، ولكنها تتراوح عادةً من 5 إلى 10 أيام عمل.",
                faqQ3: "ما هي سياسة الإرجاع؟",
                faqA3: "يمكن إرجاع العناصر المادية في غضون 30 يومًا من استلامها إذا لم يتم ارتداؤها وفي عبوتها الأصلية. الأصول الرقمية غير قابلة للاسترداد بمجرد تنزيلها.",
                faqQ4: "هل المواد مستدامة؟",
                faqA4: "بالتأكيد. نحن نستخدم مزيجًا من المواد الاصطناعية المعاد تدويرها والقطن العضوي. هدفنا هو تقليل بصمتنا الكربونية مع زيادة المتانة."
            }
        },

        init: () => {
            Localization.apply(Localization.lang);
            const btn = Utils.qs('#lang-toggle');
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
            Utils.qsa('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (t[key]) el.textContent = t[key];
            });
            Utils.qsa('[data-i18n-placeholder]').forEach(el => {
                const key = el.dataset.i18nPlaceholder;
                if (t[key]) el.placeholder = t[key];
            });

            const btn = Utils.qs('#lang-toggle');
            if (btn) btn.textContent = lang === 'en' ? 'AR' : 'EN';
        }
    };

    // --- Cart Module -----------------------------------------------------------
    const Cart = {
        createItemElement: (item) => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            // Create a unique but consistent ID for the item based on its properties
            const itemIdentifier = `${item.id}-${item.color.replace('#', '')}-${item.size}`;
            el.dataset.itemId = itemIdentifier;
            el.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Size: ${item.size} / Color: <span style="display: inline-block; width: 12px; height: 12px; background-color: ${item.color}; border-radius: 50%;"></span></p>
                    <p>${Utils.formatPrice(item.price)} <span class="item-quantity">x ${item.quantity}</span></p>
                </div>
                <button class="remove-item" data-id="${item.id}" data-color="${item.color}" data-size="${item.size}">&times;</button>
            `;
            return el;
        },

        add: (productId, color, size) => {
            const product = State.products.find(p => p.id === productId);
            if (!product) return;

            const existingItem = State.cart.find(item =>
                item.id === productId && item.color === color && item.size === size
            );

            const container = Utils.qs('.cart-items');

            if (existingItem) {
                existingItem.quantity++;
                // Update existing element in DOM
                const itemIdentifier = `${existingItem.id}-${existingItem.color.replace('#', '')}-${existingItem.size}`;
                const existingItemEl = container.querySelector(`[data-item-id="${itemIdentifier}"]`);
                if (existingItemEl) {
                    const quantityEl = existingItemEl.querySelector('.item-quantity');
                    if (quantityEl) quantityEl.textContent = `x ${existingItem.quantity}`;
                    // Flash animation
                    gsap.fromTo(existingItemEl, { scale: 1 }, { scale: 1.05, yoyo: true, repeat: 1, duration: 0.2, ease: 'power1.inOut' });
                }
            } else {
                const newItem = { ...product, quantity: 1, color, size };
                State.cart.push(newItem);

                // If cart was empty, remove the message
                const emptyMsg = container.querySelector('p');
                if (emptyMsg && State.cart.length === 1) emptyMsg.remove();

                // Add new element to DOM with animation
                const newItemEl = Cart.createItemElement(newItem);
                container.appendChild(newItemEl);
                gsap.from(newItemEl, { opacity: 0, x: 50, duration: 0.4, ease: 'power3.out' });
            }

            Cart.updateTotals();
            Cart.toggle(true);

            // Animate cart count icon
            gsap.fromTo('.cart-count', { scale: 1 }, { scale: 1.5, yoyo: true, repeat: 1, duration: 0.2 });
        },

        remove: (productId, color, size) => {
            const itemIdentifier = `${productId}-${color.replace('#', '')}-${size}`;
            const container = Utils.qs('.cart-items');
            const itemEl = container.querySelector(`[data-item-id="${itemIdentifier}"]`);

            if (itemEl) {
                gsap.to(itemEl, {
                    opacity: 0, x: -50, duration: 0.3, ease: 'power3.in', onComplete: () => {
                        itemEl.remove();

                        // Update state after animation
                        State.cart = State.cart.filter(item =>
                            !(item.id === productId && item.color === color && item.size === size)
                        );
                        Cart.updateTotals();

                        // If cart is now empty, show the message
                        if (State.cart.length === 0 && container) {
                            container.innerHTML = '<p>Your cart is empty.</p>';
                        }
                    }
                });
            } else {
                // Fallback for safety if element not found (should not happen)
                State.cart = State.cart.filter(item =>
                    !(item.id === productId && item.color === color && item.size === size)
                );
                Cart.updateUI(); // Full re-render
            }
        },

        toggle: (visible) => {
            const cartEl = Utils.qs('#cart');
            if (!cartEl) return;

            if (visible) {
                cartEl.classList.add('visible');
                gsap.to(cartEl, { right: 0, duration: 0.5, ease: 'power3.inOut' });
            } else {
                gsap.to(cartEl, {
                    right: '-100%', duration: 0.5, ease: 'power3.inOut', onComplete: () => {
                        cartEl.classList.remove('visible');
                    }
                });
            }
        },

        updateTotals: () => {
            const countEl = Utils.qs('.cart-count');
            const totalEl = Utils.qs('.total-price');

            let total = 0;
            let count = 0;

            State.cart.forEach(item => {
                total += item.price * item.quantity;
                count += item.quantity;
            });

            if (totalEl) totalEl.textContent = Utils.formatPrice(total);
            if (countEl) countEl.textContent = count;

            // Update checkout page if active
            if (Utils.qs('.checkout-summary-items')) UI.renderCheckout();
        },

        updateUI: () => {
            const container = Utils.qs('.cart-items');
            if (!container) return;

            container.innerHTML = '';

            if (State.cart.length === 0) {
                container.innerHTML = '<p>Your cart is empty.</p>';
            } else {
                const fragment = document.createDocumentFragment();
                State.cart.forEach(item => {
                    const el = Cart.createItemElement(item);
                    fragment.appendChild(el);
                });
                container.appendChild(fragment);
            }

            Cart.updateTotals();
        }
    };

    // --- Checkout Module (Placeholder) -----------------------------------------
    const Checkout = {
        goToCheckout: () => window.location.href = 'checkout.html'
    }

    // --- Auth Module -----------------------------------------------------------
    const Auth = {
        login: (email, password) => {
            const user = State.users.find(u => u.email === email && u.password === password);
            if (user) {
                State.currentUser = { ...user };
                localStorage.setItem('voxera_user', JSON.stringify(State.currentUser));
                alert('Logged in successfully!');
                Auth.updateUI();
                window.location.href = 'profile.html';
                return true;
            }
            alert('Invalid email or password.');
            return false;
        },

        signup: async (name, email, password, avatarFile) => {
            if (State.users.some(u => u.email === email)) {
                alert('Email already exists.');
                return false;
            }

            let avatar = null;
            if (avatarFile) {
                avatar = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.readAsDataURL(avatarFile);
                });
            }

            const newUser = {
                name, email, password, avatar,
                joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            };

            State.users.push(newUser);
            localStorage.setItem('voxera_users', JSON.stringify(State.users));
            State.currentUser = newUser;
            localStorage.setItem('voxera_user', JSON.stringify(State.currentUser));
            alert('Account created!');
            Auth.updateUI();
            window.location.href = 'profile.html';
            return true;
        },

        logout: () => {
            if (confirm('Are you sure you want to logout?')) {
                State.currentUser = null;
                localStorage.removeItem('voxera_user');
                window.location.href = 'index.html';
            }
        },

        updateUI: () => {
            const userIcon = Utils.qs('.user-icon');
            if (!userIcon) return;

            if (State.currentUser) {
                userIcon.style.color = 'var(--accent-color)';
                userIcon.title = `View Profile: ${State.currentUser.name}`;
                userIcon.href = 'profile.html';
                userIcon.innerHTML = State.currentUser.avatar
                    ? `<img src="${State.currentUser.avatar}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1px solid var(--accent-color);">`
                    : `<i class="far fa-user"></i>`;
            } else {
                userIcon.style.color = '';
                userIcon.title = "Login / Sign Up";
                userIcon.href = '#';
                userIcon.innerHTML = `<i class="far fa-user"></i>`;
            }
        }
    };

    // --- Products Module -------------------------------------------------------
    const Products = {
        createCard: (product, className = 'product-card') => {
            const card = document.createElement('div');
            card.className = `${className} ${product.className || ''}`.trim();
            card.dataset.productId = product.id;
            const imgUrl = Utils.getImage(product.image);

            card.innerHTML = `
                <div class="product-image-wrapper">
                    <img src="${imgUrl}" alt="${product.name}" class="product-card-image" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${CONFIG.fallbackImage}';">
                    <button class="quick-view-btn">Quick View</button>
                </div>
                <h3>${product.name}</h3>
                <p>${Utils.formatPrice(product.price)}</p>
            `;

            card.classList.add('reveal');
            if (State.scrollObserver) State.scrollObserver.observe(card);
            return card;
        },

        renderGrid: () => {
            const grid = Utils.qs('.product-grid');
            if (!grid) return;

            const params = new URLSearchParams(window.location.search);
            const category = params.get('category');
            const searchTerm = (Utils.qs('#shop-search')?.value || '').toLowerCase();
            const sortValue = Utils.qs('#shop-sort')?.value || 'default';

            let filtered = State.products;

            if (category) {
                filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
                const title = Utils.qs('#shop h2');
                if (title) title.textContent = `${category} Collection`;
                UI.renderCollectionFeatures(category);
            } else {
                UI.toggleCollectionFeatures(false);
            }

            if (searchTerm) {
                filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
            }

            if (sortValue === 'price-asc') filtered.sort((a, b) => a.price - b.price);
            if (sortValue === 'price-desc') filtered.sort((a, b) => b.price - a.price);

            grid.innerHTML = '';
            const fragment = document.createDocumentFragment();
            const loadMoreBtn = Utils.qs('#load-more-btn');

            if (filtered.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found.</p>';
                if (loadMoreBtn) loadMoreBtn.style.display = 'none';
                return;
            }

            filtered.slice(0, State.itemsToShow).forEach((p, index) => {
                const card = Products.createCard(p);
                card.style.transitionDelay = `${(index % CONFIG.itemsPerPage) * 0.1}s`; // Stagger effect
                fragment.appendChild(card);
            });
            grid.appendChild(fragment);

            if (loadMoreBtn) {
                loadMoreBtn.style.display = filtered.length > State.itemsToShow ? 'inline-block' : 'none';
            }
        },

        showDetail: (product) => {
            const modal = Utils.qs('#product-detail');
            if (!modal) return;

            Utils.qs('#detail-name').textContent = product.name;
            Utils.qs('#detail-price').textContent = Utils.formatPrice(product.price);
            Utils.qs('#detail-desc').textContent = product.description || "Premium quality.";
            Utils.qs('#product-viewer').src = Utils.getImage(product.image);

            // Sizes
            const sizeSelect = Utils.qs('#size');
            sizeSelect.innerHTML = '';
            (product.sizes || ['S', 'M', 'L', 'XL']).forEach(size => {
                const opt = document.createElement('option');
                opt.value = size;
                opt.textContent = size;
                opt.style.color = 'black';
                sizeSelect.appendChild(opt);
            });

            // Colors
            const colorsContainer = Utils.qs('#detail-colors');
            colorsContainer.innerHTML = '';
            const colors = product.colors || ['#000000'];
            let selectedColor = colors[0];

            colors.forEach((color, idx) => {
                const div = document.createElement('div');
                div.className = `color-option ${idx === 0 ? 'selected' : ''}`;
                div.style.backgroundColor = color;
                div.onclick = () => {
                    selectedColor = color;
                    Utils.qsa('.color-option').forEach(el => el.classList.remove('selected'));
                    div.classList.add('selected');
                };
                colorsContainer.appendChild(div);
            });

            // Add to Cart Button
            const btn = Utils.qs('.add-to-cart-btn');
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.onclick = () => {
                Cart.add(product.id, selectedColor, sizeSelect.value);
                UI.hideDetail();
            };

            modal.classList.add('visible');
            gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        }
    };

    // --- UI Module -------------------------------------------------------------
    const UI = {
        initScrollAnimations: () => {
            State.scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        State.scrollObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

            const animClasses = ['reveal', 'reveal-right', 'reveal-left', 'reveal-scale'];
            Utils.qsa('.reveal, .reveal-right, .reveal-left, .reveal-scale, section > h2, .hero-text, .collection-card, .lookbook-item, .testimonial-card, .footer-section').forEach(el => {
                const hasClass = animClasses.some(cls => el.classList.contains(cls));
                if (!hasClass) el.classList.add('reveal');
                State.scrollObserver.observe(el);
            });
        },

        hideDetail: () => {
            const modal = Utils.qs('#product-detail');
            if (modal) {
                gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: () => modal.classList.remove('visible') });
            }
        },

        handleParallax: () => {
            const hero = Utils.qs('#home');
            if (!hero) return;

            const scrollPosition = window.scrollY;

            if (!State.isParallaxTicking) {
                window.requestAnimationFrame(() => {
                    // Apply parallax effect by moving background at half the scroll speed
                    hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
                    State.isParallaxTicking = false;
                });
                State.isParallaxTicking = true;
            }
        },

        renderCollectionFeatures: (category) => {
            // Mock feature data
            const features = {
                'Cybernetic': { desc: "Integrated circuitry.", stats: { "Tech": "High", "Style": "Futuristic" } },
                'Minimalist': { desc: "Less is more.", stats: { "Tech": "Low", "Style": "Clean" } }
                // Add others as needed
            };

            const container = Utils.qs('#collection-features');
            const data = features[category];

            if (container && data) {
                const statsHtml = Object.entries(data.stats)
                    .map(([k, v]) => `<div class="feature-stat"><strong>${k}:</strong> ${v}</div>`)
                    .join('');
                container.innerHTML = `<p class="collection-description">${data.desc}</p><div class="collection-stats">${statsHtml}</div>`;
                container.style.display = 'block';
            }
        },

        toggleCollectionFeatures: (show) => {
            const el = Utils.qs('#collection-features');
            if (el) el.style.display = show ? 'block' : 'none';
        },

        renderCheckout: () => {
            const container = Utils.qs('.checkout-summary-items');
            const totalEl = Utils.qs('.checkout-total-price');
            if (!container) return;

            container.innerHTML = '';
            let total = 0;
            State.cart.forEach(item => {
                const div = document.createElement('div');
                div.className = 'checkout-item';
                div.innerHTML = `
                    <div class="checkout-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.size} / <span style="display:inline-block;width:10px;height:10px;background:${item.color};border-radius:50%"></span></p>
                        <p>Qty: ${item.quantity}</p>
                    </div>
                    <div class="checkout-item-price">${Utils.formatPrice(item.price * item.quantity)}</div>
                `;
                container.appendChild(div);
                total += item.price * item.quantity;
            });
            if (totalEl) totalEl.textContent = Utils.formatPrice(total);
        },

        renderProfile: () => {
            const container = Utils.qs('.profile-container');
            if (!container) return;

            const content = Utils.qs('#profile-content');
            const prompt = Utils.qs('#login-prompt');

            if (!State.currentUser) {
                if (content) content.style.display = 'none';
                if (prompt) prompt.style.display = 'block';
                return;
            }

            if (content) content.style.display = 'block';
            if (prompt) prompt.style.display = 'none';

            // Fill data
            const user = State.currentUser;
            Utils.qs('#sidebar-name').textContent = user.name;
            Utils.qs('#sidebar-email').textContent = user.email;
            Utils.qs('#profile-fullname').textContent = user.name;
            Utils.qs('#profile-email-display').textContent = user.email;
            Utils.qs('#profile-joined').textContent = user.joinedDate || 'January 2024';
            Utils.qs('#profile-phone').textContent = user.phone || Localization.translations[Localization.lang].notProvided;
            Utils.qs('#profile-address').textContent = user.address || Localization.translations[Localization.lang].notProvided;

            // Render Orders
            const historyContainer = Utils.qs('#order-history-container');
            const userOrders = State.orders[user.email] || [];

            if (historyContainer) {
                if (userOrders.length === 0) {
                    historyContainer.innerHTML = `<p data-i18n="noPastOrders">${Localization.translations[Localization.lang].noPastOrders}</p>`;
                } else {
                    historyContainer.innerHTML = userOrders.reverse().map(order => `
                        <div class="order-history-item">
                            <div class="order-item-header">
                                <div><h4>ID: ${order.orderId}</h4><span>${order.date}</span></div>
                                <div><h4>${Utils.formatPrice(order.total)}</h4></div>
                            </div>
                            <div class="order-items-list">
                                ${order.items.map(i => `<div class="order-product"><span>${i.name} (x${i.quantity})</span></div>`).join('')}
                            </div>
                        </div>
                    `).join('');
                }
            }
        }
    };

    // --- Initialization & Event Listeners --------------------------------------
    const App = {
        init: () => {
            // Loader
            const loader = Utils.qs('#loader');
            if (loader) gsap.to(loader, { opacity: 0, duration: 0.5, onComplete: () => loader.style.display = 'none' });

            Theme.init();
            Localization.init();
            UI.initScrollAnimations();
            Auth.updateUI();
            Cart.updateUI();
            App.setupListeners();
            App.route();
        },

        route: () => {
            // Simple routing based on page content
            if (Utils.qs('.hero-text')) { // Home
                App.renderHome();
            } else if (Utils.qs('.shop-controls')) { // Shop
                Products.renderGrid();
            } else if (Utils.qs('.profile-container')) { // Profile
                UI.renderProfile();
            } else if (Utils.qs('.checkout-page-container')) { // Checkout
                UI.renderCheckout();
            }
        },

        renderHome: () => {
            // New Arrivals
            const slider = Utils.qs('#new-arrivals .collection-slider');
            if (slider) {
                const fragment = document.createDocumentFragment();
                State.products.filter(p => p.newArrival).slice(0, 5).forEach((p, index) => {
                    const card = Products.createCard(p, 'featured-card');
                    card.style.transitionDelay = `${index * 0.1}s`;
                    fragment.appendChild(card);
                });
                slider.appendChild(fragment);
            }

            // Collections
            const shopContainer = Utils.qs('#shop .collection-slider-container');
            if (shopContainer) {
                // Initialize the high-performance circular gallery
                // replacing the standard slider
                CircularGallery.init(shopContainer, State.collections);
            }

            // Intro Animation Trigger
            window.addEventListener("load", () => {
                const stack = document.querySelector(".image-stack");
                if (stack) stack.classList.add("disperse");
            });
        },

        setupSliders: () => {
            Utils.qsa('.collection-slider-container').forEach(container => {
                const slider = container.querySelector('.collection-slider');
                const prev = container.querySelector('.prev-btn');
                const next = container.querySelector('.next-btn');
                if (!slider || !prev || !next) return;

                const scroll = (dir) => {
                    const cardWidth = slider.children[0]?.offsetWidth || 300;
                    slider.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
                };
                prev.onclick = () => scroll(-1);
                next.onclick = () => scroll(1);
            });
        },

        setupListeners: () => {
            // Global Click Delegation
            document.body.addEventListener('click', (e) => {
                // Product Card Clicks
                const card = e.target.closest('.product-card, .featured-card');
                if (card) {
                    const id = parseInt(card.dataset.productId);
                    const product = State.products.find(p => p.id === id);
                    if (product) Products.showDetail(product);
                }

                // Remove from Cart
                if (e.target.classList.contains('remove-item')) {
                    const { id, color, size } = e.target.dataset;
                    Cart.remove(parseInt(id), color, size);
                }

                // Close Cart
                if (e.target.closest('.close-cart')) {
                    Cart.toggle(false);
                }

                // Close Product Detail
                if (e.target.closest('.close-detail') || e.target.id === 'product-detail') {
                    UI.hideDetail();
                }

                // Close Modals
                if (e.target.classList.contains('modal') || e.target.classList.contains('close-modal')) {
                    Utils.qsa('.modal').forEach(m => m.style.display = 'none');
                }

                // Checkout button in cart
                if (e.target.matches('.checkout-btn')) {
                    Checkout.goToCheckout();
                }
            });

            // Navigation
            const hamburger = Utils.qs('.hamburger');
            const navLinks = Utils.qs('.nav-links');
            if (hamburger) {
                hamburger.onclick = () => {
                    hamburger.classList.toggle('open');
                    navLinks.classList.toggle('open');
                };
            }

            // User Icon
            const userIcon = Utils.qs('.user-icon');
            if (userIcon) {
                userIcon.onclick = (e) => {
                    if (!State.currentUser) {
                        e.preventDefault();
                        const modal = Utils.qs('#auth-modal');
                        if (modal) {
                            modal.style.display = 'flex';
                            gsap.fromTo(modal.querySelector('.modal-content'), { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 });
                        }
                    }
                };
            }

            // Cart Toggles
            const cartIcon = Utils.qs('.cart-icon');
            if (cartIcon) cartIcon.onclick = () => Cart.toggle(true);

            // Shop Controls
            const search = Utils.qs('#shop-search');
            const sort = Utils.qs('#shop-sort');
            const loadMore = Utils.qs('#load-more-btn');

            if (search) search.oninput = Utils.debounce(() => Products.renderGrid(), 300);
            if (sort) sort.onchange = () => Products.renderGrid();
            if (loadMore) loadMore.onclick = () => {
                State.itemsToShow += CONFIG.itemsPerPage;
                Products.renderGrid();
            };

            // Auth Forms
            const loginForm = Utils.qs('#login-form');
            const signupForm = Utils.qs('#signup-form');
            const authModal = Utils.qs('#auth-modal');

            if (loginForm) {
                loginForm.onsubmit = (e) => {
                    e.preventDefault();
                    if (Auth.login(Utils.qs('#login-email').value, Utils.qs('#login-pass').value)) {
                        authModal.style.display = 'none';
                    }
                };
            }

            if (signupForm) {
                signupForm.onsubmit = (e) => {
                    e.preventDefault();
                    Auth.signup(
                        Utils.qs('#signup-name').value,
                        Utils.qs('#signup-email').value,
                        Utils.qs('#signup-pass').value,
                        Utils.qs('#signup-avatar')?.files[0]
                    ).then(success => {
                        if (success) authModal.style.display = 'none';
                    });
                };
            }

            // Forgot Password Toggle
            const forgotPassLink = Utils.qs('#forgot-pass-link');
            const backToLoginLink = Utils.qs('#back-to-login');
            if (forgotPassLink && backToLoginLink) {
                const loginForm = Utils.qs('#login-form');
                const forgotForm = Utils.qs('#forgot-pass-form');
                forgotPassLink.onclick = (e) => {
                    e.preventDefault();
                    loginForm.style.display = 'none';
                    forgotForm.style.display = 'block';
                };
                backToLoginLink.onclick = (e) => {
                    e.preventDefault();
                    loginForm.style.display = 'block';
                    forgotForm.style.display = 'none';
                };
            }

            // Auth Tabs
            Utils.qsa('.auth-tab').forEach(tab => {
                tab.onclick = () => {
                    Utils.qsa('.auth-tab').forEach(t => t.classList.remove('active'));
                    Utils.qsa('.auth-form').forEach(f => f.classList.remove('active'));
                    tab.classList.add('active');
                    Utils.qs(`#${tab.dataset.target}`).classList.add('active');
                };
            });

            // Checkout
            const placeOrderBtn = Utils.qs('#place-order-btn');
            if (placeOrderBtn) {
                placeOrderBtn.onclick = (e) => {
                    e.preventDefault();
                    if (State.cart.length === 0) return alert('Cart is empty');
                    // Simulate Stripe
                    alert('Redirecting to payment...');
                    // In real app: stripe.redirectToCheckout(...)
                };
            }

            // Scroll to top button
            const scrollTopBtn = Utils.qs('#scroll-top');
            if (scrollTopBtn) {
                window.addEventListener('scroll', Utils.debounce(() => {
                    if (window.scrollY > CONFIG.scrollThreshold) {
                        scrollTopBtn.classList.add('visible');
                    } else {
                        scrollTopBtn.classList.remove('visible');
                    }
                }, 100));
                scrollTopBtn.onclick = () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                };
            }

            // Parallax scroll for hero section
            window.addEventListener('scroll', UI.handleParallax);
        }
    };

    // Start App
    App.init();
});

// --- Circular Gallery Module (High Performance) ----------------------------
const CircularGallery = {
    init: (container, items) => {
        if (!container || !items.length) return;

        // 1. Performance & Device Detection
        // Detect low-end devices (small screens or low pixel density) to reduce effects
        const isLowEnd = window.innerWidth < 768 || (window.devicePixelRatio || 1) < 1.5;
        
        // 2. Setup DOM Structure
        container.innerHTML = ''; // Clear existing buttons/slider
        container.className = 'cg-container'; // Switch to gallery class
        
        const track = document.createElement('div');
        track.className = 'cg-track';
        container.appendChild(track);

        // Create Items
        const itemEls = items.map((item, i) => {
            const el = document.createElement('div');
            el.className = 'cg-item';
            // Add click handler for navigation
            el.onclick = () => window.location.href = `collection.html?category=${item.category}`;
            el.innerHTML = `
                <div class="cg-img-wrapper">
                    <img src="${item.imageJpg}" alt="${item.title}" draggable="false" loading="eager">
                </div>
                <h3>${item.title}</h3>
            `;
            track.appendChild(el);
            return { el, index: i };
        });

        // 3. Animation State
        let scroll = 0;
        let velocity = 0;
        let isDragging = false;
        let lastX = 0;
        
        // Metrics (Cached)
        let viewportWidth = container.offsetWidth;
        let center = viewportWidth / 2;
        // Item width + gap (must match CSS)
        const itemWidth = window.innerWidth < 768 ? 300 : 420; 
        const totalWidth = items.length * itemWidth;

        // 4. Event Handlers
        const onResize = () => {
            viewportWidth = container.offsetWidth;
            center = viewportWidth / 2;
        };
        window.addEventListener('resize', onResize);

        const onStart = (x) => {
            isDragging = true;
            lastX = x;
            velocity = 0; // Reset momentum on grab
            track.style.cursor = 'grabbing';
        };

        const onMove = (x) => {
            if (!isDragging) return;
            const delta = x - lastX;
            lastX = x;
            velocity = delta; // Track velocity for throw effect
            scroll += delta;
        };

        const onEnd = () => {
            isDragging = false;
            track.style.cursor = 'grab';
        };

        // Bind Events (Passive for performance)
        container.addEventListener('mousedown', e => onStart(e.clientX));
        window.addEventListener('mousemove', e => onMove(e.clientX));
        window.addEventListener('mouseup', onEnd);
        
        container.addEventListener('touchstart', e => onStart(e.touches[0].clientX), { passive: true });
        window.addEventListener('touchmove', e => onMove(e.touches[0].clientX), { passive: true });
        window.addEventListener('touchend', onEnd);
        
        container.addEventListener('wheel', e => {
            // Optional: Horizontal scroll mapping
            velocity -= e.deltaY * 0.2; 
        }, { passive: true });

        // 5. Render Loop (60fps target)
        const update = () => {
            // Physics
            if (!isDragging) {
                velocity *= 0.95; // Friction
                scroll += velocity;
            }

            // Render Items
            for (let i = 0; i < itemEls.length; i++) {
                const { el, index } = itemEls[i];
                
                // Infinite Loop Logic: Calculate distance from center in "world space"
                // (index * width + scroll) % total gives wrapped position
                let dist = ((index * itemWidth + scroll) % totalWidth + totalWidth) % totalWidth;
                if (dist > totalWidth / 2) dist -= totalWidth;

                // Screen Position
                const screenX = center + dist - (itemWidth / 2);

                // Optimization: Cull items outside viewport (with buffer)
                if (screenX < -itemWidth || screenX > viewportWidth + itemWidth) {
                    el.style.transform = 'translate3d(-9999px, 0, 0)'; // Move off-screen cheaply
                    continue;
                }

                // Visual Effects based on distance from center
                // Normalize distance (-1 to 1 relative to half viewport)
                const ratio = dist / (viewportWidth / 1.5); 
                
                if (isLowEnd) {
                    // Low-End: Simple translation only
                    el.style.transform = `translate3d(${screenX}px, 0, 0)`;
                } else {
                    // High-End: Arc, Rotate, Scale, Opacity
                    const scale = 1 - Math.abs(ratio) * 0.2;
                    const y = Math.pow(ratio, 2) * 60; // Parabolic arc
                    const rotate = ratio * 15; // Rotation based on X
                    const zIndex = 100 - Math.round(Math.abs(dist) / 10);

                    el.style.transform = `translate3d(${screenX}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
                    el.style.opacity = 1 - Math.abs(ratio) * 0.5;
                    el.style.zIndex = zIndex;
                }
            }

            requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    }
};
