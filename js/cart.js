/* ===================================
   cart.js - Shopping Cart Logic
   Manages cart state and operations
   =================================== */

const CartManager = (() => {
    let cart = [];

    // Initialize cart from storage
    function init() {
        cart = StorageManager.getCart();
    }

    return {
        init() {
            init();
        },

        addItem(menuItem, quantity = 1) {
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === menuItem.id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    ...menuItem,
                    quantity: quantity
                });
            }

            StorageManager.saveCart(cart);
            return true;
        },

        removeItem(itemId) {
            cart = cart.filter(item => item.id !== itemId);
            StorageManager.saveCart(cart);
        },

        updateQuantity(itemId, quantity) {
            const item = cart.find(item => item.id === itemId);
            if (item) {
                if (quantity <= 0) {
                    this.removeItem(itemId);
                } else {
                    item.quantity = quantity;
                    StorageManager.saveCart(cart);
                }
            }
        },

        getCart() {
            return [...cart];
        },

        getCartItems() {
            return cart;
        },

        getCartCount() {
            return cart.reduce((total, item) => total + item.quantity, 0);
        },

        getSubtotal() {
            return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        getTotal() {
            const subtotal = this.getSubtotal();
            const deliveryFee = DELIVERY_FEE;
            return subtotal + deliveryFee;
        },

        isEmpty() {
            return cart.length === 0;
        },

        clear() {
            cart = [];
            StorageManager.clearCart();
        }
    };
})();
