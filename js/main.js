document.addEventListener('DOMContentLoaded', () => {

    // --- Basic Setup -----------------------------------------------------------

    // --- Global Variables ------------------------------------------------------
    let activeSection = 'home';
    let scrollObserver;
    
    let products = [];
    try {
        products = JSON.parse(localStorage.getItem('void_products')) || [];
    } catch (e) {
        console.error("Error loading products:", e);
        products = [];
    }

    if (!localStorage.getItem('void_products')) {
        localStorage.setItem('void_products', JSON.stringify(products));
    }

    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('void_cart')) || [];
    } catch (e) {
        console.error("Error loading cart:", e);
        cart = [];
    }
    let itemsToShow = 6;
    // A test key is used here, replace with your actual public key
    const stripe = Stripe('pk_test_51PZVxyRxBMMl3JgLtyaM0OAW2w3m211wzC9A2Vz1jTz9k2gS1k3v2z4h1c5f3b6X5x4y3z2a1b0c9d8e7f');

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

    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elementsToAnimate = document.querySelectorAll('section > h1, section > h2, .hero-text, .featured-card, .lookbook-item, .collection-card, .product-card, .testimonial-card, .faq-item, .about-content, .newsletter-form, .footer-section, .checkout-form-section, .checkout-summary-section, .search-container');
        
        elementsToAnimate.forEach(el => {
            el.classList.add('reveal');
            scrollObserver.observe(el);
        });
    }

    // --- Main Initialization ---------------------------------------------------
    
    function setupEventListeners() {
        // Hamburger Menu
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hamburger.classList.toggle('open');
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
                alert('Payment Successful! Redirecting to confirmation...');
                
                // Clear Cart
                cart = [];
                saveCart();
                updateCartUI();
                
                // Redirect to success state (simulated)
                const baseUrl = window.location.origin + window.location.pathname;
                window.location.href = `${baseUrl}?success=true`;
                
                confirmPaymentBtn.textContent = originalText;
                confirmPaymentBtn.disabled = false;
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
        if(!grid) return;
        
        grid.innerHTML = '';
        if (grid) {
            grid.innerHTML = '';
        }
        
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        const categoryParam = params.get('category');
        const category = categoryParam ? categoryParam.trim() : null;
        const searchInput = document.getElementById('shop-search');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const sortSelect = document.getElementById('shop-sort');
        const sortValue = sortSelect ? sortSelect.value : 'default';
        

        let displayProducts = products;
        if (category) {
            displayProducts = products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
            
            // Find matching key case-insensitively
            const featureKey = Object.keys(collectionFeatures).find(k => k.toLowerCase() === category.toLowerCase());
            const displayTitle = featureKey || category;

            const title = document.querySelector('#shop h2');
            if(title) title.textContent = category + ' Collection';
            if(title) title.textContent = displayTitle + ' Collection';
            
            // Update Features
            const featuresContainer = document.getElementById('collection-features');
            if (featuresContainer && collectionFeatures[category]) {
                const data = collectionFeatures[category];
            if (featuresContainer && featureKey) {
                const data = collectionFeatures[featureKey];
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
            return;
        }
        if (grid) {
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

        if(loadMoreBtn) {
            if(totalItems > itemsToShow) {
                loadMoreBtn.style.display = 'inline-block';
            } else {
                loadMoreBtn.style.display = 'none';
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
                    grid.appendChild(card);
                    if(scrollObserver) scrollObserver.observe(card);
                });
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

    function init() {
        const loader = document.getElementById('loader');
        if (loader) {
            gsap.to(loader, { opacity: 0, duration: 0.5, onComplete: () => loader.style.display = 'none' });
        }
        
        setupEventListeners();
        initScrollAnimations();
        renderShop();
        setupSlider('#shop');
        setupSlider('#new-arrivals');
        updateCartUI();
        renderCheckoutPage();
        
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
