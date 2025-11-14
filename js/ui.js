/* ===================================
   ui.js - UI Utilities and Helpers
   Handles rendering and interactions
   =================================== */

const UIManager = (() => {
    return {
        /**
         * Show notification toast
         */
        notify(message, type = 'success', duration = 3000) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification show ${type}`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, duration);
        },

        /**
         * Format price to currency
         */
        formatPrice(amount) {
            return `₦${amount.toLocaleString()}`;
        },

        /**
         * Format date
         */
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        /**
         * Render food card HTML
         */
        createFoodCard(item, clickHandler = null) {
            const isUnavailable = StorageManager.isItemUnavailable(item.id);
            const stars = '⭐'.repeat(Math.round(item.popularityScore / 20));
            
            const html = `
                <div class="food-card" ${!isUnavailable ? `data-item-id="${item.id}"` : 'style="opacity: 0.6;"'}>
                    <img src="${item.imageUrl}" alt="${item.name}" class="food-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EFood Image%3C/text%3E%3C/svg%3E'">
                    <div class="food-content">
                        <div class="food-category">${item.category}</div>
                        <h3 class="food-name">${item.name}</h3>
                        <p class="food-description">${item.description}</p>
                        <div class="food-footer">
                            <div>
                                <div class="food-price">${UIManager.formatPrice(item.price)}</div>
                                <div class="food-popularity">${stars}</div>
                            </div>
                            <button class="btn-add-to-cart" ${isUnavailable ? 'disabled' : ''} 
                                    onclick="AppState.handleAddToCart(${item.id})">
                                ${isUnavailable ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            return html;
        },

        /**
         * Render product detail modal
         */
        renderProductDetail(item) {
            const stars = '⭐'.repeat(Math.round(item.popularityScore / 20));
            const ingredientsHtml = item.ingredients
                .map(ing => `<span class="ingredient-tag">${ing}</span>`)
                .join('');

            const html = `
                <img src="${item.imageUrl}" alt="${item.name}" class="product-detail-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22350%22%3E%3Crect fill=%22%23ddd%22 width=%22600%22 height=%22350%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EProduct Image%3C/text%3E%3C/svg%3E'">
                <h2 class="product-detail-name">${item.name}</h2>
                <div class="product-detail-price">${UIManager.formatPrice(item.price)}</div>
                <div class="food-popularity" style="margin-bottom: 1rem;">${stars}</div>
                <p class="product-detail-description">${item.description}</p>
                
                <div class="ingredients-section">
                    <div class="ingredients-label">Ingredients:</div>
                    <div class="ingredients-list">${ingredientsHtml}</div>
                </div>

                <div class="quantity-selector">
                    <button class="quantity-btn" onclick="UIManager.decrementQuantity()">−</button>
                    <input type="number" class="quantity-input" id="modalQuantity" value="1" min="1" max="99">
                    <button class="quantity-btn" onclick="UIManager.incrementQuantity()">+</button>
                </div>

                <button class="btn-add-modal" onclick="AppState.handleModalAddToCart(${item.id})">
                    Add to Cart
                </button>
            `;

            return html;
        },

        /**
         * Quantity control helpers
         */
        incrementQuantity() {
            const input = document.getElementById('modalQuantity');
            input.value = Math.min(parseInt(input.value) + 1, 99);
        },

        decrementQuantity() {
            const input = document.getElementById('modalQuantity');
            input.value = Math.max(parseInt(input.value) - 1, 1);
        },

        getModalQuantity() {
            const input = document.getElementById('modalQuantity');
            return parseInt(input.value) || 1;
        },

        /**
         * Show product modal
         */
        showProductModal(item) {
            const modal = document.getElementById('productModal');
            const content = document.getElementById('productModalContent');
            content.innerHTML = this.renderProductDetail(item);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        },

        /**
         * Close product modal
         */
        closeProductModal() {
            const modal = document.getElementById('productModal');
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        },

        /**
         * Render cart item
         */
        renderCartItem(item) {
            return `
                <div class="cart-item">
                    <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2212%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EFood%3C/text%3E%3C/svg%3E'">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${UIManager.formatPrice(item.price)} × ${item.quantity}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button onclick="AppState.handleUpdateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                            <input type="number" value="${item.quantity}" readonly>
                            <button onclick="AppState.handleUpdateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="btn-remove" onclick="AppState.handleRemoveFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            `;
        },

        /**
         * Validate form fields
         */
        validateForm(formId) {
            const form = document.getElementById(formId);
            const fields = form.querySelectorAll('[required]');
            let isValid = true;

            fields.forEach(field => {
                const formGroup = field.closest('.form-group');
                const errorDiv = formGroup.querySelector('.form-error');

                if (!field.value.trim()) {
                    formGroup.classList.add('error');
                    if (errorDiv) errorDiv.textContent = `${field.placeholder || field.name} is required`;
                    isValid = false;
                } else if (field.type === 'email' && !this.isValidEmail(field.value)) {
                    formGroup.classList.add('error');
                    if (errorDiv) errorDiv.textContent = 'Invalid email address';
                    isValid = false;
                } else if (field.type === 'tel' && !this.isValidPhone(field.value)) {
                    formGroup.classList.add('error');
                    if (errorDiv) errorDiv.textContent = 'Invalid phone number';
                    isValid = false;
                } else {
                    formGroup.classList.remove('error');
                }
            });

            return isValid;
        },

        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        isValidPhone(phone) {
            return /^[\d\s\-\+\(\)]{7,}$/.test(phone);
        },

        /**
         * Get form data
         */
        getFormData(formId) {
            const form = document.getElementById(formId);
            const formData = new FormData(form);
            const data = {};

            formData.forEach((value, key) => {
                data[key] = value;
            });

            return data;
        }
    };
})();
