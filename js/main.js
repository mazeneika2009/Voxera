document.addEventListener('DOMContentLoaded', () => {

    // --- Basic Setup -----------------------------------------------------------

    // --- Global Variables ------------------------------------------------------
    let activeSection = 'home';
    let scrollObserver;
    const defaultProducts = [
        {
            id: 1,
            name: "Neural Link Hoodie",
            price: 89.99,
            category: "Cybernetic",
            description: "Connect to the grid with this bio-responsive fabric hoodie.",
            image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=60",
            colors: ["#000000", "#00ff00", "#ff00ff"],
            sizes: ["S", "M", "L", "XL"],
            newArrival: true
        },
        {
            id: 2,
            name: "Void Basic Tee",
            price: 35.00,
            category: "Minimalist",
            description: "Essential wear for the modern entity. 100% organic cotton.",
            image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
            colors: ["#ffffff", "#000000", "#808080"],
            sizes: ["XS", "S", "M", "L", "XL"],
            newArrival: false
        },
        {
            id: 3,
            name: "Heavy Duty Cargo",
            price: 95.00,
            category: "Industrial",
            description: "Reinforced stitching and multiple pockets for maximum utility.",
            image: "https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?w=500&auto=format&fit=crop&q=60",
            colors: ["#333333", "#555555"],
            sizes: ["30", "32", "34", "36"],
            newArrival: false
        },
        {
            id: 4,
            name: "Glow Runner Jacket",
            price: 130.00,
            category: "Neon",
            description: "Stand out in the darkest nights with reflective neon accents.",
            image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=60",
            colors: ["#000000", "#ccff00"],
            sizes: ["S", "M", "L"],
            newArrival: true
        },
        {
            id: 5,
            name: "Asymmetric Drape Coat",
            price: 220.00,
            category: "Avant-Garde",
            description: "Pushing boundaries with non-traditional cuts and silhouettes.",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60",
            colors: ["#1a1a1a"],
            sizes: ["One Size"],
            newArrival: true
        },
        {
            id: 6,
            name: "Tactical Shell",
            price: 180.00,
            category: "Techwear",
            description: "Waterproof, windproof, and breathable. Prepared for any forecast.",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60",
            colors: ["#000000", "#1c1c1c"],
            sizes: ["S", "M", "L", "XL", "XXL"],
            newArrival: false
        },
        {
            id: 7,
            name: "Shadow Hoodie",
            price: 70.00,
            category: "Monochrome",
            description: "A study in light and shadow. Deep black dye.",
            image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&auto=format&fit=crop&q=60",
            colors: ["#000000"],
            sizes: ["S", "M", "L", "XL"],
            newArrival: false
        },
        {
            id: 8,
            name: "City Drifter Hoodie",
            price: 80.00,
            category: "Street",
            description: "The pulse of the city woven into fabric.",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60",
            colors: ["#ff0000", "#000000"],
            sizes: ["M", "L", "XL"],
            newArrival: true
        },
        {
            id: 9,
            name: "Circuit Breaker Vest",
            price: 110.00,
            category: "Cybernetic",
            description: "Armored aesthetic for the digital warrior.",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
            colors: ["#222222", "#444444"],
            sizes: ["S", "M", "L"],
            newArrival: false
        },
        {
            id: 10,
            name: "Clean Slate Trousers",
            price: 75.00,
            category: "Minimalist",
            description: "Sharp lines and comfortable fit.",
            image: "https://images.unsplash.com/photo-1516082669438-2d2bb5082626?q=80&w=869&auto=format&fit=crop",
            colors: ["#e0e0e0", "#333333"],
            sizes: ["28", "30", "32", "34"],
            newArrival: false
        },
        {
            id: 11,
            name: "Steel Toe Boots",
            price: 150.00,
            category: "Industrial",
            description: "Safety meets style. Rugged construction.",
            image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop&q=60",
            colors: ["#000000", "#5c4033"],
            sizes: ["8", "9", "10", "11", "12"],
            newArrival: false
        },
        {
            id: 12,
            name: "Luminous Leggings",
            price: 60.00,
            category: "Neon",
            description: "Stretch fabric with UV reactive prints.",
            image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=500&auto=format&fit=crop&q=60",
            colors: ["#ff00ff", "#00ffff"],
            sizes: ["XS", "S", "M", "L"],
            newArrival: false
        },
        {
            id: 13,
            name: "Deconstructed Shirt",
            price: 85.00,
            category: "Avant-Garde",
            description: "Reimagining the classic button-down.",
            image: "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=500&auto=format&fit=crop&q=60",
            colors: ["#ffffff"],
            sizes: ["S", "M", "L"],
            newArrival: false
        },
        {
            id: 14,
            name: "Utility Belt",
            price: 45.00,
            category: "Techwear",
            description: "Modular attachment system for all your gear.",
            image: "https://images.unsplash.com/photo-1693443688057-85f57b872a3c?w=500",
            colors: ["#000000"],
            sizes: ["Adjustable"],
            newArrival: false
        },
        {
            id: 15,
            name: "Ghost White Parka",
            price: 160.00,
            category: "Monochrome",
            description: "Oversized fit in blinding white.",
            image: "https://images.unsplash.com/photo-1516082669438-2d2bb5082626?q=80&w=869&auto=format&fit=crop",
            colors: ["#ffffff"],
            sizes: ["M", "L", "XL"],
            newArrival: true
        },
        {
            id: 16,
            name: "Graffiti Print Tee",
            price: 40.00,
            category: "Street",
            description: "Limited edition print from local artists.",
            image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=500&auto=format&fit=crop&q=60",
            colors: ["#ffffff", "#000000"],
            sizes: ["S", "M", "L", "XL"],
            newArrival: false
        }
    ];
    
    let products = JSON.parse(localStorage.getItem('void_products'));
    if (!products || products.length === 0) {
        products = defaultProducts;
        localStorage.setItem('void_products', JSON.stringify(products));
    }

    let cart = JSON.parse(localStorage.getItem('void_cart')) || [];
    let itemsToShow = 6;
    // A test key is used here, replace with your actual public key
    const stripe = Stripe('pk_test_51PZVxyRxBMMl3JgLtyaM0OAW2w3m211wzC9A2Vz1jTz9k2gS1k3v2z4h1c5f3b6X5x4y3z2a1b0c9d8e7f');


    // --- Placeholder 3D Model Creation -----------------------------------------
    
    function showProductDetail(product) {
       const detailView = document.getElementById('product-detail');
       if(!detailView) return;
       
       document.getElementById('detail-name').textContent = product.name;
       document.getElementById('detail-price').textContent = `$${product.price.toFixed(2)}`;
       document.getElementById('detail-desc').textContent = product.description || "A premium quality item from the VOID collection.";

       const sizeSelect = document.getElementById('size');
       sizeSelect.innerHTML = '';
       (product.sizes || ['S', 'M', 'L', 'XL']).forEach(size => {
           const option = document.createElement('option');
           option.value = size;
           option.textContent = size;
           option.style.color = 'black';
           sizeSelect.appendChild(option);
       });

       const colorsContainer = document.getElementById('detail-colors');
       colorsContainer.innerHTML = '';
       let selectedColor = product.colors[0];
       
       const productViewerImg = document.getElementById('product-viewer');
       productViewerImg.src = product.image || 'https://via.placeholder.com/400';
       productViewerImg.alt = product.name;

       product.colors.forEach((color, index) => {
           const colorOption = document.createElement('div');
           colorOption.className = 'color-option';
           if(index === 0) colorOption.classList.add('selected');
           colorOption.style.backgroundColor = color;
           colorOption.addEventListener('click', () => {
               selectedColor = color;
               const currentSelected = document.querySelector('.color-option.selected');
               if(currentSelected) currentSelected.classList.remove('selected');
               colorOption.classList.add('selected');
               // Here you could update the model's color if the model supports it
           });
           colorsContainer.appendChild(colorOption);
       });
       
       const addToCartBtn = document.querySelector('.add-to-cart-btn');
       // use cloneNode to remove old event listeners
       const newBtn = addToCartBtn.cloneNode(true);
       addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
       
       newBtn.addEventListener('click', () => {
           addToCart(product.id, selectedColor, document.getElementById('size').value);
           hideProductDetail();
       });
       
       detailView.classList.add('visible');
       gsap.to(detailView, { 
           opacity: 1, 
           duration: 0.3
       });
    }
    
    function hideProductDetail() {
        const detailView = document.getElementById('product-detail');
        if(!detailView) return;
        gsap.to(detailView, { opacity: 0, duration: 0.3, onComplete: () => {
            detailView.classList.remove('visible');
        }});
    }
    
    function saveCart() {
        localStorage.setItem('void_cart', JSON.stringify(cart));
    }

    function addToCart(productId, color, size) {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId && item.color === color && item.size === size);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1, color, size });
        }
        
        saveCart();
        updateCartUI();
        toggleCart(true);
        gsap.fromTo('.cart-count', { scale: 1 }, { scale: 1.5, yoyo: true, repeat: 1, duration: 0.2 });
    }

    function removeFromCart(productId, color, size) {
        cart = cart.filter(item => !(item.id === productId && item.color === color && item.size === size));
        saveCart();
        updateCartUI();
    }
    
    function toggleCart(visible) {
        const cartElement = document.getElementById('cart');
        if(visible) {
            cartElement.classList.add('visible');
            gsap.to(cartElement, { right: 0, duration: 0.5, ease: 'power3.inOut' });
            updateCartUI();
        } else {
            gsap.to(cartElement, { right: '-100%', duration: 0.5, ease: 'power3.inOut', onComplete: () => {
                cartElement.classList.remove('visible');
            }});
        }
    }
    
    function updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const totalPriceEl = document.querySelector('.total-price');

        if(!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Size: ${item.size} / Color: <span style="display: inline-block; width: 12px; height: 12px; background-color: ${item.color}; border-radius: 50%;"></span></p>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <button class="remove-item" data-id="${item.id}" data-color="${item.color}" data-size="${item.size}">&times;</button>
                `;
                cartItemsContainer.appendChild(itemEl);
                total += item.price * item.quantity;
                count += item.quantity;
            });

            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const { id, color, size } = e.target.dataset;
                    removeFromCart(parseInt(id), color, size);
                });
            });
        }
        
        totalPriceEl.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = count;
        renderCheckoutPage();
    }


    // --- Checkout --------------------------------------------------------------
    
    async function handleCheckout(customerEmail = null) {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const line_items = cart.map(item => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${item.name} - ${item.size} / ${item.color}`,
                    },
                    unit_amount: item.price * 100, // Price in cents
                },
                quantity: item.quantity,
            };
        });

        const baseUrl = window.location.origin + window.location.pathname;
        const checkoutOptions = {
            lineItems: line_items,
            mode: 'payment',
            successUrl: `${baseUrl}?success=true`,
            cancelUrl: `${baseUrl}?canceled=true`,
        };

        if (customerEmail) {
            checkoutOptions.customer_email = customerEmail;
        }

        try {
            const { error } = await stripe.redirectToCheckout(checkoutOptions);

            if (error) {
                alert(error.message);
            }
        } catch (error) {
            console.error("Stripe checkout error:", error);
        }
    }
    
    // --- Scroll Animations & Active Nav Link ---------------------------------
    function handleScroll() {
        const sections = document.querySelectorAll('main > section');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollTopBtn = document.getElementById('scroll-top');

        if (scrollTopBtn) {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if(pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if(href.startsWith('#') && href.substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

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

    const elements = document.querySelectorAll('#home, #new-arrivals, #lookbook, #shop, #about, #contact , .footer-content, #testimonials, .faq-container, .footer-content, .product-card, .featured-card, #cart, #product-detail');
    elements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Only intercept hash links (anchors on the same page)
                if (href.startsWith('#')) {
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        e.preventDefault();
                        // Close mobile nav if open
                        if(navLinks.classList.contains('open')) {
                            navLinks.classList.remove('open');
                            hamburger.classList.remove('open');
                        }
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Cart
        const cartIcon = document.querySelector('.cart-icon');
        if(cartIcon) cartIcon.addEventListener('click', () => toggleCart(true));
        
        const closeCartBtn = document.querySelector('.close-cart');
        if(closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
        
        const checkoutBtn = document.querySelector('.checkout-btn');
        if(checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                window.location.href = 'checkout.html';
            });
        }

        const placeOrderBtn = document.getElementById('place-order-btn');
        const paymentModal = document.getElementById('payment-modal');
        const closePaymentModal = document.getElementById('close-payment-modal');
        const confirmPaymentBtn = document.getElementById('confirm-payment-btn');

        if(placeOrderBtn && paymentModal) {
            placeOrderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const form = document.getElementById('checkout-form');
                if(form && !form.checkValidity()) {
                    form.reportValidity();
                    return;
                }
                
                const checkoutTotal = document.querySelector('.checkout-total-price');
                const modalTotal = document.getElementById('modal-total-price');
                if(modalTotal && checkoutTotal) {
                    modalTotal.textContent = checkoutTotal.textContent;
                }
                paymentModal.style.display = 'flex';
            });
        }

        if(closePaymentModal && paymentModal) {
            closePaymentModal.addEventListener('click', () => paymentModal.style.display = 'none');
        }
        
        if(paymentModal) window.addEventListener('click', (e) => { if(e.target === paymentModal) paymentModal.style.display = 'none'; });

        if(confirmPaymentBtn) {
            // Input Formatting Logic
            const cardNumInput = document.getElementById('card-number');
            const cardIcon = document.getElementById('card-icon');
            const cardExpiry = document.getElementById('card-expiry');

            if(cardNumInput) {
                cardNumInput.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    
                    // Detect Card Type
                    if(value.startsWith('4')) {
                        cardIcon.className = 'fab fa-cc-visa active';
                    } else if(value.startsWith('5')) {
                        cardIcon.className = 'fab fa-cc-mastercard active';
                    } else if(value.startsWith('3')) {
                        cardIcon.className = 'fab fa-cc-amex active';
                    } else {
                        cardIcon.className = 'far fa-credit-card';
                    }

                    // Format spacing
                    value = value.replace(/(.{4})/g, '$1 ').trim();
                    e.target.value = value;
                });
            }

            if(cardExpiry) {
                cardExpiry.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if(value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                    }
                    e.target.value = value;
                });
            }

            confirmPaymentBtn.addEventListener('click', async () => {
                // Basic Validation
                const cardNum = document.getElementById('card-number').value;
                const cardExp = document.getElementById('card-expiry').value;
                const cardCvc = document.getElementById('card-cvc').value;
                const cardName = document.getElementById('card-name').value;

                if(!cardNum || !cardExp || !cardCvc || !cardName) {
                    alert('Please fill in all payment details.');
                    return;
                }
                
                const originalText = confirmPaymentBtn.textContent;
                confirmPaymentBtn.textContent = 'Processing...';
                confirmPaymentBtn.disabled = true;
                
                // Simulate Payment Processing Delay
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Simulate Success
                alert('Payment Successful! Thank you for your order.');
                
                // Save order to history
                const currentUser = JSON.parse(localStorage.getItem('void_current_user'));
                if (currentUser) {
                    let allOrders = JSON.parse(localStorage.getItem('void_orders')) || {};
                    if (!allOrders[currentUser.email]) {
                        allOrders[currentUser.email] = [];
                    }
                    const newOrder = {
                        orderId: `VOID-${Date.now()}`,
                        date: new Date().toLocaleDateString(),
                        items: cart,
                        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
                    };
                    allOrders[currentUser.email].push(newOrder);
                    localStorage.setItem('void_orders', JSON.stringify(allOrders));
                }

                // Clear Cart and redirect
                cart = [];
                saveCart();
                updateCartUI();
                window.location.href = `profile.html`;
            });
        }
        
        // Product Detail
        const closeDetailBtn = document.querySelector('.close-detail');
        if(closeDetailBtn) {
            closeDetailBtn.addEventListener('click', () => hideProductDetail());
        }

        // Search
        const searchInput = document.getElementById('shop-search');
        if(searchInput) {
            searchInput.addEventListener('input', () => {
                itemsToShow = 6;
                renderShop();
            });
        }

        // Sort
        const sortSelect = document.getElementById('shop-sort');
        if(sortSelect) {
            sortSelect.addEventListener('change', () => {
                itemsToShow = 6;
                renderShop();
            });
        }

        // Load More
        const loadMoreBtn = document.getElementById('load-more-btn');
        if(loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                itemsToShow += 6;
                renderShop();
            });
        }

        // Scroll Top
        const scrollTopBtn = document.getElementById('scroll-top');
        if(scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // --- Auth System -------------------------------------------------------
        const authModal = document.getElementById('auth-modal');
        const userIcon = document.querySelector('.user-icon');
        const closeAuthBtn = document.querySelector('.close-auth');
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');

        // Check Login State
        function checkLoginState() {
            const currentUserStr = localStorage.getItem('void_current_user');
            if (userIcon) {
                if (currentUserStr) {
                    const currentUser = JSON.parse(currentUserStr);
                    userIcon.style.color = 'var(--accent-color)';
                    userIcon.title = `View Profile: ${currentUser.name}`;
                    userIcon.href = 'profile.html';
                    
                    if (currentUser.avatar) {
                        userIcon.innerHTML = `<img src="${currentUser.avatar}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1px solid var(--accent-color); display: block;">`;
                    } else {
                        userIcon.innerHTML = `<i class="far fa-user"></i>`;
                    }
                } else {
                    userIcon.style.color = '';
                    userIcon.title = "Login / Sign Up";
                    userIcon.href = '#';
                    userIcon.innerHTML = `<i class="far fa-user"></i>`;
                }
            }
        }
        checkLoginState();

        if (userIcon) {
            userIcon.addEventListener('click', (e) => {
                const currentUser = localStorage.getItem('void_current_user');
                if (!currentUser) {
                    e.preventDefault();
                    if(authModal) authModal.style.display = 'flex';
                }
            });
        }

        if (closeAuthBtn && authModal) {
            closeAuthBtn.addEventListener('click', () => authModal.style.display = 'none');
        }

        if (authModal) {
            window.addEventListener('click', (e) => {
                if (e.target === authModal) authModal.style.display = 'none';
            });
        }

        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));
                
                tab.classList.add('active');
                const targetId = tab.dataset.target;
                document.getElementById(targetId).classList.add('active');
            });
        });

        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('signup-name').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-pass').value;
                const avatarFile = document.getElementById('signup-avatar') ? document.getElementById('signup-avatar').files[0] : null;

                let users = JSON.parse(localStorage.getItem('void_users')) || [];
                
                if (users.some(u => u.email === email)) {
                    alert('An account with this email already exists.');
                    return;
                }

                let avatar = null;
                if (avatarFile) {
                    const reader = new FileReader();
                    avatar = await new Promise(resolve => {
                        reader.onload = e => resolve(e.target.result);
                        reader.readAsDataURL(avatarFile);
                    });
                }

                const joinedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                users.push({ name, email, password, avatar, joinedDate });
                localStorage.setItem('void_users', JSON.stringify(users));
                
                localStorage.setItem('void_current_user', JSON.stringify({ name, email, avatar, joinedDate }));
                alert('Account created successfully!');
                authModal.style.display = 'none';
                checkLoginState();
                signupForm.reset();
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-pass').value;
                
                const users = JSON.parse(localStorage.getItem('void_users')) || [];
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    localStorage.setItem('void_current_user', JSON.stringify({ 
                        name: user.name, 
                        email: user.email, 
                        avatar: user.avatar,
                        phone: user.phone,
                        address: user.address,
                        joinedDate: user.joinedDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    }));
                    alert('Logged in successfully!');
                    authModal.style.display = 'none';
                    checkLoginState();
                    loginForm.reset();
                } else {
                    alert('Invalid email or password.');
                }
            });
        }

        // Forgot Password Logic
        const forgotPassLink = document.getElementById('forgot-pass-link');
        const backToLoginLink = document.getElementById('back-to-login');
        const forgotPassForm = document.getElementById('forgot-pass-form');

        if (forgotPassLink) {
            forgotPassLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (loginForm) loginForm.classList.remove('active');
                if (forgotPassForm) forgotPassForm.classList.add('active');
            });
        }

        if (backToLoginLink) {
            backToLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (forgotPassForm) forgotPassForm.classList.remove('active');
                if (loginForm) loginForm.classList.add('active');
            });
        }

        if (forgotPassForm) {
            forgotPassForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('forgot-email').value;
                const users = JSON.parse(localStorage.getItem('void_users')) || [];
                
                const userIndex = users.findIndex(u => u.email === email);
                
                if (userIndex !== -1) {
                    // Simulate email link click by allowing immediate reset for the prototype
                    if(confirm(`[DEMO] In a real application, an email would be sent to ${email}.\n\nSince this is a prototype, would you like to simulate clicking the reset link and set a new password now?`)) {
                        const newPass = prompt("Enter your new password:");
                        if(newPass) {
                            users[userIndex].password = newPass;
                            localStorage.setItem('void_users', JSON.stringify(users));
                            alert("Password reset successfully! You can now login with your new password.");
                            forgotPassForm.reset();
                            forgotPassForm.classList.remove('active');
                            if (loginForm) loginForm.classList.add('active');
                        }
                    }
                } else {
                    alert('No account found with that email address.');
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

        // Newsletter
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for subscribing to the VOID newsletter!');
                form.reset();
            });
        });

    
    function renderShop() {
        const grid = document.querySelector('.product-grid');
        
        if (grid) {
            grid.innerHTML = '';
            
            const params = new URLSearchParams(window.location.search);
            const category = params.get('category');
            const searchInput = document.getElementById('shop-search');
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const sortSelect = document.getElementById('shop-sort');
            const sortValue = sortSelect ? sortSelect.value : 'default';
            
            // Fake Features Data
            const collectionFeatures = {
                'Cybernetic': { description: "Integrated circuitry meets high fashion.", stats: { "Tech": "High", "Durability": "Reinforced", "Style": "Futuristic" } },
                'Minimalist': { description: "Less is more. Pure forms for the purist.", stats: { "Tech": "Low", "Durability": "Standard", "Style": "Clean" } },
                'Industrial': { description: "Raw aesthetics inspired by the machine age.", stats: { "Tech": "Mid", "Durability": "Heavy-Duty", "Style": "Rugged" } },
                'Neon': { description: "Stand out in the darkest nights.", stats: { "Tech": "Mid", "Durability": "Standard", "Style": "Vibrant" } },
                'Avant-Garde': { description: "Pushing the boundaries of what is possible.", stats: { "Tech": "Experimental", "Durability": "Delicate", "Style": "Abstract" } },
                'Techwear': { description: "Functionality first. Prepared for anything.", stats: { "Tech": "High", "Durability": "Weatherproof", "Style": "Tactical" } },
                'Monochrome': { description: "A study in light and shadow.", stats: { "Tech": "Low", "Durability": "Standard", "Style": "Stark" } },
                'Street': { description: "The pulse of the city.", stats: { "Tech": "Low", "Durability": "Tough", "Style": "Urban" } }
            };

            let displayProducts = products;
            if (category) {
                displayProducts = products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
                const title = document.querySelector('#shop h2');
                if(title) title.textContent = category + ' Collection';
                
                // Update Features
                const featuresContainer = document.getElementById('collection-features');
                if (featuresContainer && collectionFeatures[category]) {
                    const data = collectionFeatures[category];
                    let statsHtml = '';
                    for (const [key, value] of Object.entries(data.stats)) {
                        statsHtml += `<div class="feature-stat"><strong>${key}:</strong> ${value}</div>`;
                    }
                    featuresContainer.innerHTML = `
                        <p class="collection-description">${data.description}</p>
                        <div class="collection-stats">${statsHtml}</div>
                    `;
                    featuresContainer.style.display = 'block';
                }
            } else {
                const featuresContainer = document.getElementById('collection-features');
                if(featuresContainer) featuresContainer.style.display = 'none';
            }

            if (searchTerm) {
                displayProducts = displayProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
            }

            if (sortValue === 'price-asc') {
                displayProducts = displayProducts.slice().sort((a, b) => a.price - b.price);
            } else if (sortValue === 'price-desc') {
                displayProducts = displayProducts.slice().sort((a, b) => b.price - a.price);
            }

            const totalItems = displayProducts.length;
            const loadMoreBtn = document.getElementById('load-more-btn');

            if(totalItems === 0) {
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found in this collection.</p>';
                if(loadMoreBtn) loadMoreBtn.style.display = 'none';
            } else {
                if(loadMoreBtn) {
                    if(totalItems > itemsToShow) {
                        loadMoreBtn.style.display = 'inline-block';
                    } else {
                        loadMoreBtn.style.display = 'none';
                    }
                }

                displayProducts.slice(0, itemsToShow).forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.dataset.productId = product.id;
                    card.innerHTML = `
                        <div class="product-image-wrapper">
                            <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}" class="product-card-image">
                        </div>
                        <h3>${product.name}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                    `;
                    card.addEventListener('click', () => showProductDetail(product));
                    card.classList.add('reveal');
                    if(scrollObserver) scrollObserver.observe(card);
                    grid.appendChild(card);
                });
            }
        }

        // Update New Arrivals Slider
        const newArrivalsSlider = document.querySelector('#new-arrivals .collection-slider');
        if (newArrivalsSlider) {
            newArrivalsSlider.innerHTML = '';
            
            // Filter for products marked as newArrival, fallback to first 5 if none marked
            let sliderItems = products.filter(p => p.newArrival);
            if (sliderItems.length === 0) sliderItems = products.slice(0, 5);

            sliderItems.forEach(product => {
                const card = document.createElement('div');
                card.className = 'featured-card';
                card.innerHTML = `
                    <div class="product-image-wrapper" style="margin-bottom: 1.5rem;">
                        <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}" class="product-card-image" style="height: 300px; margin-bottom: 0;">
                    </div>
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                `;
                card.addEventListener('click', () => showProductDetail(product));
                card.classList.add('reveal');
                if(scrollObserver) scrollObserver.observe(card);
                newArrivalsSlider.appendChild(card);
            });
        }
    }

    function setupSlider(sectionId) {
        const section = document.querySelector(sectionId);
        if (!section) return;

        const slider = section.querySelector('.collection-slider');
        const prevBtn = section.querySelector('.prev-btn');
        const nextBtn = section.querySelector('.next-btn');

        if (!slider || !prevBtn || !nextBtn) return;

        const getScrollAmount = () => {
            const card = slider.children[0];
            if (!card) return 0;

            if (slider.children.length > 1) {
                return slider.children[1].offsetLeft - slider.children[0].offsetLeft;
            }

            const style = window.getComputedStyle(slider);
            const gap = parseFloat(style.gap) || 32;
            return card.offsetWidth + gap;
        };

        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });
    }

    function renderCheckoutPage() {
        const summaryContainer = document.querySelector('.checkout-summary-items');
        const totalEl = document.querySelector('.checkout-total-price');
        
        if (!summaryContainer || !totalEl) return;

        summaryContainer.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'checkout-item';
            div.innerHTML = `
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.size} / <span style="display:inline-block;width:10px;height:10px;background:${item.color};border-radius:50%"></span></p>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <div class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            summaryContainer.appendChild(div);
            total += item.price * item.quantity;
        });
        
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    function renderProfilePage() {
        const profileContainer = document.querySelector('.profile-container');
        if (!profileContainer) return; // Not on profile page

        const profileContent = document.getElementById('profile-content');
        const loginPrompt = document.getElementById('login-prompt');
        const currentUser = JSON.parse(localStorage.getItem('void_current_user'));

        if (!currentUser) {
            profileContent.style.display = 'none';
            loginPrompt.style.display = 'block';
            return;
        }

        profileContent.style.display = 'block';
        loginPrompt.style.display = 'none';

        // Update Avatar
        const avatarContainer = document.querySelector('.profile-avatar');
        if (currentUser.avatar) {
            avatarContainer.innerHTML = `<img src="${currentUser.avatar}" alt="Profile">`;
        } else {
            avatarContainer.innerHTML = `<i class="fas fa-user-circle"></i>`;
        }

        // Populate Profile Data
        document.getElementById('sidebar-name').textContent = currentUser.name;
        document.getElementById('sidebar-email').textContent = currentUser.email;
        document.getElementById('profile-fullname').textContent = currentUser.name;
        document.getElementById('profile-email-display').textContent = currentUser.email;
        document.getElementById('profile-phone').textContent = currentUser.phone || 'Not provided';
        document.getElementById('profile-address').textContent = currentUser.address || 'Not provided';
        document.getElementById('profile-joined').textContent = currentUser.joinedDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('void_current_user');
                window.location.href = 'index.html';
            }
        });

        // Edit Profile Logic
        const editBtn = document.getElementById('edit-profile-btn');
        const editModal = document.getElementById('edit-profile-modal');
        const closeEditBtn = document.getElementById('close-edit-profile');
        const editForm = document.getElementById('edit-profile-form');

        if (editBtn) {
            // Clone to remove old listeners if re-rendered
            const newEditBtn = editBtn.cloneNode(true);
            editBtn.parentNode.replaceChild(newEditBtn, editBtn);

            newEditBtn.addEventListener('click', () => {
                document.getElementById('edit-name').value = currentUser.name;
                document.getElementById('edit-phone').value = currentUser.phone || '';
                document.getElementById('edit-address').value = currentUser.address || '';
                document.getElementById('edit-avatar-url').value = currentUser.avatar && !currentUser.avatar.startsWith('data:') ? currentUser.avatar : '';
                if(editModal) editModal.style.display = 'flex';
            });
        }

        if (closeEditBtn && editModal) {
            closeEditBtn.addEventListener('click', () => editModal.style.display = 'none');
        }
        
        if (editModal) {
            window.addEventListener('click', (e) => {
                if (e.target === editModal) editModal.style.display = 'none';
            });
        }

        if (editForm) {
            const newForm = editForm.cloneNode(true);
            editForm.parentNode.replaceChild(newForm, editForm);
            
            newForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const newName = document.getElementById('edit-name').value;
                const newPhone = document.getElementById('edit-phone').value;
                const newAddress = document.getElementById('edit-address').value;
                const avatarUrl = document.getElementById('edit-avatar-url').value;
                const avatarFile = document.getElementById('edit-avatar-file').files[0];

                let finalAvatar = currentUser.avatar;

                if (avatarFile) {
                    const reader = new FileReader();
                    finalAvatar = await new Promise(resolve => {
                        reader.onload = e => resolve(e.target.result);
                        reader.readAsDataURL(avatarFile);
                    });
                } else if (avatarUrl) {
                    finalAvatar = avatarUrl;
                }

                // Update Local State
                currentUser.name = newName;
                currentUser.phone = newPhone;
                currentUser.address = newAddress;
                currentUser.avatar = finalAvatar;
                localStorage.setItem('void_current_user', JSON.stringify(currentUser));

                // Update Global Users List
                let users = JSON.parse(localStorage.getItem('void_users')) || [];
                const userIndex = users.findIndex(u => u.email === currentUser.email);
                if (userIndex !== -1) {
                    users[userIndex].name = newName;
                    users[userIndex].phone = newPhone;
                    users[userIndex].address = newAddress;
                    users[userIndex].avatar = finalAvatar;
                    localStorage.setItem('void_users', JSON.stringify(users));
                }

                alert('Profile updated successfully!');
                if(editModal) editModal.style.display = 'none';
                renderProfilePage(); // Re-render to show changes
            });
        }

        // Tab Switching Logic
        const tabs = document.querySelectorAll('.menu-btn');
        const tabContents = document.querySelectorAll('.profile-tab');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const targetId = `tab-${tab.dataset.tab}`;
                document.getElementById(targetId).classList.add('active');
            });
        });

        const orderHistoryContainer = document.getElementById('order-history-container');
        const allOrders = JSON.parse(localStorage.getItem('void_orders')) || {};
        const userOrders = allOrders[currentUser.email] || [];

        if (userOrders.length === 0) {
            orderHistoryContainer.innerHTML = '<p>You have no past orders.</p>';
            return;
        }

        orderHistoryContainer.innerHTML = '';
        userOrders.reverse().forEach(order => { // Show most recent first
            const orderEl = document.createElement('div');
            orderEl.className = 'order-history-item';

            let itemsHtml = '';
            order.items.forEach(item => {
                itemsHtml += `
                    <div class="order-product">
                        <span>${item.name} (x${item.quantity}) - ${item.size}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `;
            });

            orderEl.innerHTML = `
                <div class="order-item-header">
                    <div><h4>Order ID: ${order.orderId}</h4><span>Date: ${order.date}</span></div>
                    <div><h4>Total: $${order.total.toFixed(2)}</h4></div>
                </div>
                <div class="order-items-list">${itemsHtml}</div>
            `;
            orderHistoryContainer.appendChild(orderEl);
        });
    }

    function init() {
        const loader = document.getElementById('loader');
        if (loader) {
            gsap.to(loader, { opacity: 0, duration: 0.5, onComplete: () => loader.style.display = 'none' });
        }
        
        setupEventListeners();
        initScrollAnimations();
        
        // Check for static HTML products first
        const staticGridItems = document.querySelectorAll('.product-grid .product-card');
        const staticSliderItems = document.querySelectorAll('#new-arrivals .collection-slider .featured-card');
        
        if (staticGridItems.length > 0 || staticSliderItems.length > 0) {
            const attachListeners = (cards) => {
                cards.forEach(card => {
                    const id = parseInt(card.dataset.productId);
                    const product = products.find(p => p.id === id);
                    if (product) {
                        card.addEventListener('click', () => showProductDetail(product));
                        if(scrollObserver) scrollObserver.observe(card);
                    }
                });
            };
            attachListeners(staticGridItems);
            attachListeners(staticSliderItems);
        } else {
            renderShop();
        }
        
        setupSlider('#shop');
        setupSlider('#new-arrivals');
        updateCartUI();
        renderCheckoutPage();
        renderProfilePage();
        
        // Handle post-checkout redirect
        const params = new URLSearchParams(window.location.search);
        if (params.get('success')) {
            alert('Order placed! Thank you.');
            cart = []; 
            saveCart();
            updateCartUI();
            // Clear URL params
            window.history.replaceState({}, document.title, "/" + window.location.pathname.split("/").pop());
        }
        if (params.get('canceled')) {
            alert('Order canceled.');
            window.history.replaceState({}, document.title, "/" + window.location.pathname.split("/").pop());
        }
        
        window.addEventListener('scroll', handleScroll);
    }

    init();

});
