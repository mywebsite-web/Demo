/* ===================================
   app.js - Main Application Logic
   Routes, state management, event handlers
   =================================== */

const AppState = (() => {
    let currentPage = 'home';
    let currentFilter = null;
    let currentSearchTerm = '';
    let currentSort = 'popularity';

    /**
     * Initialize the application
     */
    function init() {
        CartManager.init();
        updateCartCount();
        setupEventListeners();
        navigateTo('home');
    }

    /**
     * Setup global event listeners
     */
    function setupEventListeners() {
        // Modal close button
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', UIManager.closeProductModal);
        }

        // Close modal on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                UIManager.closeProductModal();
            }
        });

        // Close modal on background click
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    UIManager.closeProductModal();
                }
            });
        }

        // Navigation links
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                navigateTo(page);
                
                // Close mobile menu
                const navMenu = document.getElementById('navMenu');
                navMenu.classList.remove('active');
                const menuToggle = document.getElementById('menuToggle');
                menuToggle.classList.remove('active');
            });
        });

        // Menu toggle
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const navMenu = document.getElementById('navMenu');
                navMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }
    }

    // Admin WhatsApp number in international format (no + or spaces).
    // You provided a local number '09157286254' — converted to Nigeria international format by removing the leading 0 and prefixing 234.
    // wa.me requires country code format (e.g., 2349157286254)
    const ADMIN_WHATSAPP_NUMBER = '2349157286254';

    // Normalize phone number for wa.me links.
    // - removes non-digits and leading +
    // - converts local 0-prefixed Nigerian numbers to international (0XXXXXXXXX -> 234XXXXXXXXX)
    // - if number seems short, prefixes default country code (234)
    function normalizePhoneForWa(raw) {
        if (!raw) return '';
        let s = String(raw).trim();
        // remove spaces, parentheses, dashes
        s = s.replace(/[\s()-]/g, '');
        // remove any leading +
        if (s.startsWith('+')) s = s.slice(1);
        // remove any non-digit characters
        s = s.replace(/\D/g, '');

        // If it starts with a single 0 (local format), convert to Nigeria country code
        if (s.length >= 2 && s.startsWith('0')) {
            // Replace leading 0 with 234 (Nigeria). If you need another country, change this.
            s = '234' + s.slice(1);
        }

        // If it already starts with country code (e.g., 234...) leave as-is
        // If still too short (less than 9 digits), try prefixing 234
        if (s.length > 0 && s.length < 9) {
            s = '234' + s;
        }

        return s;
    }

    // Helper: generate a random order ID
    function generateRandomOrderId() {
        const ts = Date.now();
        const rnd = Math.floor(Math.random() * 9000) + 1000; // 4 digits
        return `ORD-${ts}-${rnd}`;
    }

    /**
     * Navigation handler
     */
    function navigateTo(page, param = null) {
        const appContainer = document.getElementById('app');
        currentPage = page;

        UIManager.closeProductModal();

        let content = '';

        switch (page) {
            case 'home':
                content = PageManager.renderHome();
                break;
            case 'menu':
                currentFilter = param || null;
                currentSearchTerm = '';
                currentSort = 'popularity';
                content = PageManager.renderMenu(currentFilter, currentSearchTerm, currentSort);
                setupMenuEventListeners();
                break;
            case 'cart':
                content = PageManager.renderCart();
                break;
            case 'checkout':
                content = PageManager.renderCheckout();
                setupCheckoutEventListeners();
                break;
            case 'login':
                content = PageManager.renderLogin();
                setupLoginEventListeners();
                break;
            case 'admin':
                content = PageManager.renderAdmin();
                break;
            default:
                content = PageManager.renderHome();
        }

        appContainer.innerHTML = content;
        window.scrollTo(0, 0);
    }

    /**
     * Setup menu page event listeners
     */
    function setupMenuEventListeners() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearchTerm = e.target.value;
                updateMenuDisplay();
            });
        }

        // Setup food card click handlers for modal
        document.querySelectorAll('.food-card').forEach(card => {
            card.addEventListener('click', () => {
                const itemId = parseInt(card.getAttribute('data-item-id'));
                const item = MENU_DATA.find(i => i.id === itemId);
                if (item) {
                    UIManager.showProductModal(item);
                }
            });
        });
    }

    /**
     * Setup checkout form listeners
     */
    function setupCheckoutEventListeners() {
        const form = document.getElementById('checkoutForm');
        if (form) {
            form.addEventListener('submit', handleCheckoutSubmit);
        }
    }

    /**
     * Setup login form listeners
     */
    function setupLoginEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                UIManager.notify('✅ Login successful! (Demo)', 'success');
                setTimeout(() => navigateTo('home'), 1500);
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                UIManager.notify('✅ Account created! (Demo)', 'success');
                setTimeout(() => navigateTo('home'), 1500);
            });
        }
    }

    /**
     * Update menu display after filter/search changes
     */
    function updateMenuDisplay() {
        const appContainer = document.getElementById('app');
        const content = PageManager.renderMenu(currentFilter, currentSearchTerm, currentSort);
        appContainer.innerHTML = content;
        setupMenuEventListeners();
    }

    /**
     * Update cart count in navbar
     */
    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const count = CartManager.getCartCount();
        cartCount.textContent = count;
    }

    /**
     * PUBLIC METHODS - Called from HTML
     */

    return {
        init,
        navigateTo,

        handleAddToCart(itemId) {
            const item = MENU_DATA.find(i => i.id === itemId);
            if (item && !StorageManager.isItemUnavailable(itemId)) {
                CartManager.addItem(item, 1);
                updateCartCount();
                UIManager.notify(`✅ ${item.name} added to cart!`, 'success');
            }
        },

        handleModalAddToCart(itemId) {
            const item = MENU_DATA.find(i => i.id === itemId);
            if (item && !StorageManager.isItemUnavailable(itemId)) {
                const quantity = UIManager.getModalQuantity();
                CartManager.addItem(item, quantity);
                updateCartCount();
                UIManager.closeProductModal();
                UIManager.notify(
                    `✅ ${item.name} × ${quantity} added to cart!`,
                    'success'
                );
            }
        },

        handleRemoveFromCart(itemId) {
            CartManager.removeItem(itemId);
            updateCartCount();
            UIManager.notify('🗑️ Item removed from cart', 'success');
            navigateTo('cart');
        },

        handleUpdateQuantity(itemId, newQuantity) {
            if (newQuantity <= 0) {
                this.handleRemoveFromCart(itemId);
            } else {
                CartManager.updateQuantity(itemId, newQuantity);
                updateCartCount();
                navigateTo('cart');
            }
        },

        handleFilter(category) {
            currentFilter = category;
            updateMenuDisplay();
        },

        handleSort(sortType) {
            currentSort = sortType;
            updateMenuDisplay();
        },

        handleCheckoutSubmit(event) {
            event.preventDefault();

            // Validate form
            if (!UIManager.validateForm('checkoutForm')) {
                UIManager.notify('❌ Please fill in all required fields', 'error');
                return;
            }

            // Get form data
            const formData = UIManager.getFormData('checkoutForm');
            const cartItems = CartManager.getCartItems();
            const subtotal = CartManager.getSubtotal();
            const total = CartManager.getTotal();

            // Create order object and assign a random order ID
            const order = {
                customerName: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                notes: formData.notes || '',
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                subtotal,
                deliveryFee: DELIVERY_FEE,
                total,
                orderId: generateRandomOrderId(),
                status: 'Confirmed'
            };

            // Save order to history (StorageManager preserves provided orderId)
            StorageManager.saveOrder(order);

            // Clear cart
            CartManager.clear();
            updateCartCount();

            // Generate WhatsApp message for admin
            const whatsappMessage = AppState.generateWhatsAppMessage(order, formData);

            // Build wa.me link for admin (opens admin chat directly)
            let waLink = '';
            const normalizedAdmin = normalizePhoneForWa(ADMIN_WHATSAPP_NUMBER);
            if (normalizedAdmin && /^\d+$/.test(normalizedAdmin)) {
                waLink = `https://wa.me/${normalizedAdmin}?text=${encodeURIComponent(whatsappMessage)}`;
            } else {
                // fallback to generic share (user chooses recipient)
                waLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
            }

            // Open admin WhatsApp chat in new tab/window
            try {
                window.open(waLink, '_blank');
            } catch (e) {
                console.warn('Could not open WhatsApp link automatically', e);
            }

            // Show success message to buyer
            const appContainer = document.getElementById('app');
            appContainer.innerHTML = `
                <div style="max-width: 600px; margin: 4rem auto; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
                    <h1 style="margin-bottom: 1rem; color: var(--success-color);">Order Placed Successfully!</h1>
                    <p style="font-size: 1.125rem; color: #666; margin-bottom: 2rem;">
                        Thank you for your order, ${formData.fullName}!
                    </p>
                    <div style="background: var(--light-color); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem; text-align: left;">
                        <p><strong>Order ID:</strong> ${order.orderId}</p>
                        <p><strong>Delivery To:</strong> ${formData.address}, ${formData.city}</p>
                        <p><strong>Estimated Time:</strong> 30-45 minutes</p>
                        <p><strong>Total Amount:</strong> <strong style="color: var(--primary-color);">${UIManager.formatPrice(order.total)}</strong></p>
                    </div>
                    <p style="font-size: 0.875rem; color: #999; margin-bottom: 1.5rem;">
                        ✅ Your order has been sent to the restaurant on WhatsApp.
                    </p>
                    <button class="btn-checkout" style="background-color: var(--success-color); margin-right: 1rem; margin-bottom: 1rem;" onclick="AppState.navigateTo('home')">
                        Back to Home
                    </button>
                    <button class="btn-checkout" style="background-color: var(--primary-color);" onclick="AppState.navigateTo('admin')">
                        View Orders
                    </button>
                </div>
            `;
            window.scrollTo(0, 0);
        },

        handleAuthToggle() {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            
            if (loginForm.style.display === 'none') {
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
            }
        },

        handleToggleItemAvailability(itemId) {
            StorageManager.toggleItemAvailability(itemId);
            navigateTo('admin');
            UIManager.notify('✅ Item availability updated', 'success');
        },

        // Delete an order (admin or user)
        deleteOrder(orderId) {
            if (!orderId) return;
            const confirmed = window.confirm('Delete this order? This action cannot be undone.');
            if (!confirmed) return;
            StorageManager.deleteOrder(orderId);
            navigateTo('admin');
            UIManager.notify('🗑️ Order deleted', 'success');
        },

        /**
         * Generate WhatsApp message with order details
         */
        generateWhatsAppMessage(order, formData) {
            let message = `🍽️ *FoodHub Order Confirmation*\n\n`;
            message += `📦 *Order ID:* ${order.orderId}\n`;
            message += `👤 *Name:* ${formData.fullName}\n`;
            message += `📱 *Phone:* ${formData.phone}\n`;
            message += `📍 *Delivery Address:* ${formData.address}, ${formData.city}\n\n`;
            
            message += `📋 *Order Items:*\n`;
            order.items.forEach((item, index) => {
                message += `${index + 1}. ${item.name} (×${item.quantity}) = ₦${item.price.toLocaleString()}\n`;
            });
            
            message += `\n💰 *Price Summary:*\n`;
            message += `Subtotal: ₦${order.subtotal.toLocaleString()}\n`;
            message += `Delivery Fee: ₦${order.deliveryFee.toLocaleString()}\n`;
            message += `*Total: ₦${order.total.toLocaleString()}*\n\n`;
            
            if (formData.notes) {
                message += `📝 *Special Instructions:* ${formData.notes}\n\n`;
            }
            
            message += `⏱️ *Estimated Delivery Time:* 30-45 minutes\n`;
            message += `✅ *Status:* Order Confirmed\n\n`;
            message += `Thank you for ordering from FoodHub! 🙏`;
            
            return message;
        }
    };
})();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', AppState.init);
