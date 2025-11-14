/* ===================================
   storage.js - LocalStorage Management
   Handles cart and order persistence
   =================================== */

const StorageManager = (() => {
    const CART_KEY = 'foodhub_cart';
    const ORDERS_KEY = 'foodhub_orders';
    const UNAVAILABLE_ITEMS_KEY = 'foodhub_unavailable';
    const ADMIN_WHATSAPP_KEY = 'foodhub_admin_whatsapp';

    return {
        // Cart operations
        getCart() {
            try {
                const cart = localStorage.getItem(CART_KEY);
                return cart ? JSON.parse(cart) : [];
            } catch (e) {
                console.error('Error loading cart:', e);
                return [];
            }
        },

        saveCart(cart) {
            try {
                localStorage.setItem(CART_KEY, JSON.stringify(cart));
            } catch (e) {
                console.error('Error saving cart:', e);
            }
        },

        clearCart() {
            localStorage.removeItem(CART_KEY);
        },

        // Order history operations
        getOrders() {
            try {
                const orders = localStorage.getItem(ORDERS_KEY);
                return orders ? JSON.parse(orders) : [];
            } catch (e) {
                console.error('Error loading orders:', e);
                return [];
            }
        },

        saveOrder(order) {
            try {
                const orders = this.getOrders();
                const generatedId = order.orderId || `ORD-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;
                orders.push({
                    ...order,
                    orderId: generatedId,
                    date: new Date().toISOString(),
                    status: order.status || 'Completed'
                });
                localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
            } catch (e) {
                console.error('Error saving order:', e);
            }
        },

        // Delete an order by orderId
        deleteOrder(orderId) {
            try {
                const orders = this.getOrders();
                const idx = orders.findIndex(o => o.orderId === orderId);
                if (idx > -1) {
                    orders.splice(idx, 1);
                    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
                }
            } catch (e) {
                console.error('Error deleting order:', e);
            }
        },

        // Admin WhatsApp number (stored as plain string)
        getAdminWhatsAppNumber() {
            try {
                const v = localStorage.getItem(ADMIN_WHATSAPP_KEY);
                return v ? v : null;
            } catch (e) {
                console.error('Error getting admin whatsapp number:', e);
                return null;
            }
        },

        setAdminWhatsAppNumber(number) {
            try {
                if (number === null || number === undefined) {
                    localStorage.removeItem(ADMIN_WHATSAPP_KEY);
                } else {
                    localStorage.setItem(ADMIN_WHATSAPP_KEY, String(number));
                }
            } catch (e) {
                console.error('Error setting admin whatsapp number:', e);
            }
        },

        // Unavailable items (admin feature)
        getUnavailableItems() {
            try {
                const items = localStorage.getItem(UNAVAILABLE_ITEMS_KEY);
                return items ? JSON.parse(items) : [];
            } catch (e) {
                console.error('Error loading unavailable items:', e);
                return [];
            }
        },

        toggleItemAvailability(itemId) {
            try {
                const unavailable = this.getUnavailableItems();
                const index = unavailable.indexOf(itemId);
                
                if (index > -1) {
                    unavailable.splice(index, 1);
                } else {
                    unavailable.push(itemId);
                }
                
                localStorage.setItem(UNAVAILABLE_ITEMS_KEY, JSON.stringify(unavailable));
            } catch (e) {
                console.error('Error toggling item availability:', e);
            }
        },

        isItemUnavailable(itemId) {
            return this.getUnavailableItems().includes(itemId);
        }
    };
})();
