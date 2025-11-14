/* ===================================
   pages.js - Page Rendering Logic
   Handles different page views
   =================================== */

const PageManager = (() => {
    return {
        /**
         * Render Home Page
         */
        renderHome() {
            const featured = MENU_DATA.filter(item => item.featured);

            const html = `
                <section class="hero">
                    <h1>🍽️ Welcome to FoodHub</h1>
                    <p>Delicious authentic food, delivered fresh to your door</p>
                    <button class="hero-button" onclick="AppState.navigateTo('menu')">
                        Order Now
                    </button>
                </section>

                <section class="featured-section">
                    <h2 class="section-title">Featured Items</h2>
                    <div class="featured-grid">
                        ${featured.map(item => UIManager.createFoodCard(item)).join('')}
                    </div>
                </section>

                <section class="featured-section">
                    <h2 class="section-title">Browse Categories</h2>
                    <div class="categories-grid">
                        ${CATEGORIES.map(cat => `
                            <div class="category-card" onclick="AppState.navigateTo('menu', '${cat.name}')">
                                <div class="icon">${cat.icon}</div>
                                <div class="name">${cat.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </section>
            `;

            return html;
        },

        /**
         * Render Menu Page with filters and search
         */
        renderMenu(filterCategory = null, searchTerm = '', sortBy = 'popularity') {
            let items = MENU_DATA;

            // Filter by category
            if (filterCategory && filterCategory !== 'All') {
                items = items.filter(item => item.category === filterCategory);
            }

            // Search by name
            if (searchTerm) {
                items = items.filter(item =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Sort
            if (sortBy === 'price-asc') {
                items.sort((a, b) => a.price - b.price);
            } else if (sortBy === 'price-desc') {
                items.sort((a, b) => b.price - a.price);
            } else if (sortBy === 'popularity') {
                items.sort((a, b) => b.popularityScore - a.popularityScore);
            }

            const html = `
                <h1 style="margin-bottom: 2rem;">Menu</h1>

                <div class="menu-controls">
                    <div class="search-box">
                        <input type="text" placeholder="Search menu..." id="searchInput" value="${searchTerm}">
                    </div>
                    <div class="sort-buttons">
                        <button class="sort-btn ${sortBy === 'popularity' ? 'active' : ''}" onclick="AppState.handleSort('popularity')">Popular</button>
                        <button class="sort-btn ${sortBy === 'price-asc' ? 'active' : ''}" onclick="AppState.handleSort('price-asc')">Price: Low</button>
                        <button class="sort-btn ${sortBy === 'price-desc' ? 'active' : ''}" onclick="AppState.handleSort('price-desc')">Price: High</button>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
                    <button class="filter-btn ${!filterCategory || filterCategory === 'All' ? 'active' : ''}" onclick="AppState.handleFilter('All')">
                        All Items
                    </button>
                    ${CATEGORIES.map(cat => `
                        <button class="filter-btn ${filterCategory === cat.name ? 'active' : ''}" onclick="AppState.handleFilter('${cat.name}')">
                            ${cat.icon} ${cat.name}
                        </button>
                    `).join('')}
                </div>

                <div class="menu-grid">
                    ${items.length > 0 
                        ? items.map(item => UIManager.createFoodCard(item)).join('')
                        : `
                            <div class="empty-state">
                                <div class="empty-state-icon">🔍</div>
                                <div class="empty-state-text">No items found</div>
                            </div>
                        `
                    }
                </div>
            `;

            return html;
        },

        /**
         * Render Shopping Cart
         */
        renderCart() {
            const cartItems = CartManager.getCartItems();
            const subtotal = CartManager.getSubtotal();
            const total = CartManager.getTotal();

            if (cartItems.length === 0) {
                return `
                    <div class="cart-empty">
                        <div class="cart-empty-icon">🛒</div>
                        <h2 style="margin-bottom: 1rem;">Your cart is empty</h2>
                        <p style="color: #999; margin-bottom: 2rem;">Add some delicious food to get started!</p>
                        <button class="btn-continue-shopping" onclick="AppState.navigateTo('menu')" style="width: auto;">
                            Continue Shopping
                        </button>
                    </div>
                `;
            }

            const html = `
                <div class="cart-container">
                    <div class="cart-items">
                        <h2 style="margin-bottom: 2rem;">Shopping Cart</h2>
                        ${cartItems.map(item => UIManager.renderCartItem(item)).join('')}
                    </div>

                    <div class="cart-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>${UIManager.formatPrice(subtotal)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Delivery Fee:</span>
                            <span>${UIManager.formatPrice(DELIVERY_FEE)}</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span>${UIManager.formatPrice(total)}</span>
                        </div>
                        <button class="btn-checkout" onclick="AppState.navigateTo('checkout')">
                            Proceed to Checkout
                        </button>
                        <button class="btn-continue-shopping" onclick="AppState.navigateTo('menu')">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            `;

            return html;
        },

        /**
         * Render Checkout Page
         */
        renderCheckout() {
            const cartItems = CartManager.getCartItems();
            
            if (cartItems.length === 0) {
                return `
                    <div class="cart-empty">
                        <div class="cart-empty-icon">😕</div>
                        <h2>Checkout Unavailable</h2>
                        <p style="margin: 1rem 0; color: #999;">Your cart is empty. Add items to proceed.</p>
                        <button class="btn-continue-shopping" onclick="AppState.navigateTo('menu')" style="width: auto;">
                            Back to Menu
                        </button>
                    </div>
                `;
            }

            const subtotal = CartManager.getSubtotal();
            const total = CartManager.getTotal();
            const itemsList = cartItems.map(item => 
                `<li>${item.name} × ${item.quantity} = ${UIManager.formatPrice(item.price * item.quantity)}</li>`
            ).join('');

            const html = `
                <h1 style="margin-bottom: 2rem;">Checkout</h1>

                <div class="checkout-container">
                    <form class="checkout-form" id="checkoutForm">
                        <h3 style="margin-bottom: 1.5rem;">Delivery Information</h3>

                        <div class="form-group">
                            <label for="fullName">Full Name *</label>
                            <input type="text" id="fullName" name="fullName" placeholder="John Doe" required>
                            <div class="form-error"></div>
                        </div>

                        <div class="form-group">
                            <label for="phone">Phone Number *</label>
                            <input type="tel" id="phone" name="phone" placeholder="+234 800 000 0000" required>
                            <div class="form-error"></div>
                        </div>

                        <div class="form-group">
                            <label for="address">Delivery Address *</label>
                            <textarea id="address" name="address" placeholder="123 Main Street, Apt 4B" required></textarea>
                            <div class="form-error"></div>
                        </div>

                        <div class="form-group">
                            <label for="city">City/State *</label>
                            <input type="text" id="city" name="city" placeholder="Lagos" required>
                            <div class="form-error"></div>
                        </div>

                        <div class="form-group">
                            <label for="notes">Special Instructions</label>
                            <textarea id="notes" name="notes" placeholder="Any special requests? (optional)"></textarea>
                        </div>

                        <button type="submit" class="btn-submit" onclick="AppState.handleCheckoutSubmit(event)">
                            Complete Order
                        </button>
                    </form>

                    <div class="order-summary">
                        <h3 style="margin-bottom: 1rem;">Order Summary</h3>
                        <div class="order-items-list" style="margin-bottom: 1rem; max-height: 300px; overflow-y: auto;">
                            <ul style="list-style: none; padding: 0;">
                                ${itemsList}
                            </ul>
                        </div>
                        <hr style="margin-bottom: 1rem;">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>${UIManager.formatPrice(subtotal)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Delivery:</span>
                            <span>${UIManager.formatPrice(DELIVERY_FEE)}</span>
                        </div>
                        <div class="summary-row total" style="border-top: 2px solid var(--border-color); padding-top: 1rem;">
                            <span>Total:</span>
                            <span>${UIManager.formatPrice(total)}</span>
                        </div>
                    </div>
                </div>
            `;

            return html;
        },

        /**
         * Render Login/Signup Page
         */
        renderLogin() {
            const html = `
                <div class="auth-container">
                    <form class="auth-form" id="loginForm">
                        <h2 class="auth-title">Login</h2>

                        <div class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" name="email" placeholder="your@email.com" required>
                        </div>

                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" name="password" placeholder="••••••••" required>
                        </div>

                        <button type="submit" class="btn-submit" style="width: 100%;">
                            Sign In
                        </button>

                        <div class="auth-toggle">
                            <span>Don't have an account? </span>
                            <button type="button" onclick="AppState.handleAuthToggle()">Sign Up</button>
                        </div>
                    </form>

                    <form class="auth-form" id="signupForm" style="display: none; margin-top: 2rem;">
                        <h2 class="auth-title">Create Account</h2>

                        <div class="form-group">
                            <label for="signupName">Full Name</label>
                            <input type="text" id="signupName" name="name" placeholder="John Doe" required>
                        </div>

                        <div class="form-group">
                            <label for="signupEmail">Email</label>
                            <input type="email" id="signupEmail" name="email" placeholder="your@email.com" required>
                        </div>

                        <div class="form-group">
                            <label for="signupPassword">Password</label>
                            <input type="password" id="signupPassword" name="password" placeholder="••••••••" required>
                        </div>

                        <button type="submit" class="btn-submit" style="width: 100%;">
                            Create Account
                        </button>

                        <div class="auth-toggle">
                            <span>Already have an account? </span>
                            <button type="button" onclick="AppState.handleAuthToggle()">Sign In</button>
                        </div>
                    </form>

                    <div style="text-align: center; margin-top: 2rem; color: #999; font-size: 0.875rem;">
                        💡 Tip: This is a demo. No data is actually saved.
                    </div>
                </div>
            `;

            return html;
        },

        /**
         * Render Admin Panel
         */
        renderAdmin() {
            const unavailable = StorageManager.getUnavailableItems();
            const orders = StorageManager.getOrders();

            const itemsHtml = MENU_DATA.map(item => {
                const isUnavailable = unavailable.includes(item.id);
                return `
                    <div class="admin-item">
                        <div class="admin-item-name">${item.name}</div>
                        <div style="color: #999; font-size: 0.875rem; margin-bottom: 1rem;">
                            ${item.category} • ${UIManager.formatPrice(item.price)}
                        </div>
                        <div class="admin-toggle">
                            <span>${isUnavailable ? '❌ Out of Stock' : '✅ Available'}</span>
                            <div class="toggle-switch ${isUnavailable ? 'active' : ''}" 
                                 onclick="AppState.handleToggleItemAvailability(${item.id})"></div>
                        </div>
                    </div>
                `;
            }).join('');

            const ordersHtml = orders.length > 0
                ? orders.slice().reverse().map(order => `
                    <div class="order-item">
                        <div class="order-header">
                            <div>
                                <div class="order-id">${order.orderId}</div>
                                <div class="order-date">${UIManager.formatDate(order.date)}</div>
                            </div>
                            <div class="order-status">${order.status}</div>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <strong>${order.customerName}</strong><br>
                            ${order.phone}<br>
                            ${order.address}, ${order.city}
                        </div>
                        <div class="order-items-list">
                            <ul>
                                ${order.items.map(item => 
                                    `<li>${item.name} × ${item.quantity} = ${UIManager.formatPrice(item.price * item.quantity)}</li>`
                                ).join('')}
                            </ul>
                        </div>
                        <div class="order-total">
                            Total: ${UIManager.formatPrice(order.total)}
                        </div>
                        <div style="margin-top: 1rem; display:flex; gap:0.5rem;">
                            <button class="btn-delete" onclick="AppState.deleteOrder('${order.orderId}')" style="background:#e74c3c; color:white; padding:0.5rem 0.75rem; border-radius:4px; border:none; cursor:pointer;">Delete</button>
                        </div>
                    </div>
                `).join('')
                : '<p style="color: #999; text-align: center; padding: 2rem;">No orders yet</p>';

            const html = `
                <div class="admin-container">
                    <h1 style="margin-bottom: 2rem;">Admin Panel</h1>

                    <div class="admin-section">
                        <h3>📦 Manage Items</h3>
                        <div class="admin-grid">
                            ${itemsHtml}
                        </div>
                    </div>

                    <div class="order-history">
                        <h3>📋 Order History</h3>
                        <div style="max-height: 500px; overflow-y: auto;">
                            ${ordersHtml}
                        </div>
                    </div>
                </div>
            `;

            return html;
        }
    };
})();
