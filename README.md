# FoodHub - Frontend Food Ordering Web Application

A complete, portfolio-ready **frontend-only** food ordering web application built with **vanilla HTML, CSS, and JavaScript** (no frameworks, no build tools).

## 🚀 Quick Start

1. **Open in Browser**: Simply open `index.html` in any modern web browser
2. **No Installation Needed**: It's a static site - no server, no build process required
3. **Ready to Deploy**: Upload to Netlify, Vercel, or GitHub Pages

## ✨ Features

### 📱 Pages & Views

- **Home Page**: Hero section with featured items and category browsing
- **Menu Page**: Full menu with search, filter by category, and sorting options
- **Product Details**: Modal with large image, full description, ingredients, and quantity selector
- **Shopping Cart**: Add/remove/update items with persistent storage via localStorage
- **Checkout**: Form with validation, order summary, and success confirmation
- **Login/Signup**: UI placeholder (no backend authentication)
- **Admin Panel**: Manage item availability and view order history

### 🛒 Shopping Features

- Add items to cart from cards or product modal
- Update quantities directly in cart
- Persistent cart storage (survives page reload)
- Real-time cart count badge in navbar
- Calculated subtotal, delivery fee, and total
- Item availability toggle (admin feature)

### 🔍 Menu Features

- **Search**: Find items by name or description
- **Filter**: Browse by categories (Rice, Swallow, Snacks, Drinks)
- **Sort**: By popularity, price ascending, or price descending
- **Product Variants**: 16 sample food items across 4 categories

### 📝 Checkout & Orders

- Form validation with inline error messages
- Order history saved in localStorage
- Admin panel to view past orders
- Order summary with order ID and timestamp

### 📐 Design & UX

- **Responsive Layout**: Mobile-first design for all screen sizes
- **Accessible**: Semantic HTML, proper labels, keyboard navigation, ARIA attributes
- **Modern UI**: Card-based design, smooth animations, hover effects
- **Theme Variables**: Easily customize colors via CSS variables
- **Performance**: Lightweight, no external dependencies

## 📁 Project Structure

```
Web App/
├── index.html              # Main HTML shell with navigation and app container
├── css/
│   └── styles.css          # All styles (mobile-first, responsive, animations)
├── js/
│   ├── data.js             # Sample menu items and categories
│   ├── storage.js          # LocalStorage management for cart and orders
│   ├── cart.js             # Shopping cart logic and operations
│   ├── ui.js               # UI utilities (notifications, formatting, validation)
│   ├── pages.js            # Page rendering logic for all views
│   └── app.js              # Main app controller and event handlers
├── assets/                 # Placeholder for images (currently using Unsplash URLs)
└── README.md              # This file
```

## 🎨 Design System

### Color Palette

- **Primary**: `#ff6b35` (Orange - CTAs, prices)
- **Secondary**: `#f7931e` (Warm orange)
- **Accent**: `#ffd700` (Gold - highlights)
- **Success**: `#28a745` (Green - confirmations)
- **Error**: `#dc3545` (Red - validations)

### Typography

- Font Family: System fonts (no external imports)
- Responsive font sizes using CSS variables
- Semantic heading hierarchy

## 🔧 Technical Details

### JavaScript Architecture

- **Modular Design**: Separate modules for data, storage, cart, UI, pages, and app logic
- **IIFE Pattern**: Using Immediately Invoked Function Expressions for encapsulation
- **ES6 Features**: Arrow functions, template literals, destructuring
- **No Dependencies**: Pure vanilla JavaScript

### CSS Organization

- **CSS Variables**: Theme colors and spacing tokens
- **Mobile-First**: Start with mobile styles, enhance for larger screens
- **BEM-ish**: Clear class naming conventions
- **Responsive Breakpoints**:
  - Mobile: < 480px
  - Tablet: 480px - 1024px
  - Desktop: > 1024px

### LocalStorage Data Structure

**Cart**:

```javascript
[
  {
    id: 1,
    name: "Jollof Rice",
    price: 2500,
    quantity: 2,
    imageUrl: "...",
    category: "Rice",
    description: "...",
    ingredients: ["..."],
  },
];
```

**Orders**:

```javascript
[
  {
    orderId: "ORD-1234567890",
    date: "2025-11-15T10:30:00",
    customerName: "John Doe",
    phone: "+234 800 000 0000",
    address: "123 Main Street",
    city: "Lagos",
    notes: "...",
    items: [...],
    subtotal: 5000,
    deliveryFee: 500,
    total: 5500,
    status: "Completed"
  }
]
```

## 📊 Sample Data

16 food items across 4 categories:

- **Rice** (4 items): Jollof Rice, Fried Rice, White Rice & Stew, Coconut Rice
- **Swallow** (4 items): Fufu & Egusi, Pounded Yam, Amala & Okra, Garri & Soup
- **Snacks** (4 items): Meat Pie, Spring Rolls, Suya, Egg Roll
- **Drinks** (4 items): Orange Juice, Zobo, Mango Smoothie, Ginger Drink

Each item includes:

- ID, name, category, price
- Description and ingredients list
- Popularity score (affects sorting)
- Image URL (Unsplash placeholder)
- Featured flag (for homepage)

## 🎯 Key Functions

### AppState Module

- `init()` - Initialize the app
- `navigateTo(page, param)` - Route to different pages
- `handleAddToCart(itemId)` - Add item from card
- `handleModalAddToCart(itemId)` - Add with quantity from modal
- `handleRemoveFromCart(itemId)` - Remove from cart
- `handleUpdateQuantity(itemId, quantity)` - Update quantity
- `handleFilter(category)` - Filter by category
- `handleSort(sortType)` - Sort items
- `handleCheckoutSubmit(event)` - Process checkout
- `handleToggleItemAvailability(itemId)` - Admin: toggle item availability

### CartManager Module

- `init()` - Load cart from storage
- `addItem(menuItem, quantity)` - Add to cart
- `removeItem(itemId)` - Remove from cart
- `updateQuantity(itemId, quantity)` - Update quantity
- `getCartItems()` - Get all items
- `getSubtotal()` - Calculate subtotal
- `getTotal()` - Calculate total with delivery fee
- `isEmpty()` - Check if cart is empty
- `clear()` - Clear entire cart

### UIManager Module

- `notify(message, type, duration)` - Show toast notification
- `formatPrice(amount)` - Format to currency
- `formatDate(dateString)` - Format date/time
- `createFoodCard(item)` - Render food card HTML
- `renderProductDetail(item)` - Render modal content
- `showProductModal(item)` - Open product modal
- `closeProductModal()` - Close modal
- `validateForm(formId)` - Validate form fields
- `getFormData(formId)` - Extract form data

### PageManager Module

- `renderHome()` - Home page
- `renderMenu(filter, search, sort)` - Menu page
- `renderCart()` - Cart page
- `renderCheckout()` - Checkout page
- `renderLogin()` - Login/Signup page
- `renderAdmin()` - Admin panel

### StorageManager Module

- `getCart()` / `saveCart(cart)` - Cart persistence
- `getOrders()` / `saveOrder(order)` - Order history
- `getUnavailableItems()` - Get unavailable item IDs
- `toggleItemAvailability(itemId)` - Toggle availability
- `isItemUnavailable(itemId)` - Check if unavailable

## 🎬 User Flow

1. **Landing**: User sees home page with featured items and categories
2. **Browsing**: Click "Order Now" or category to go to Menu
3. **Searching**: Use search bar to find items by name
4. **Filtering**: Click category buttons to filter results
5. **Viewing Details**: Click item card to see full details in modal
6. **Adding**: Select quantity and "Add to Cart" (added to localStorage)
7. **Shopping**: Continue shopping or go to cart
8. **Cart Review**: See all items, adjust quantities, view total
9. **Checkout**: Enter delivery details and complete order
10. **Confirmation**: See success page with order summary
11. **History**: Admin can view all orders made

## 🚀 Deployment

### Ready for Static Hosting

No backend required! Deploy to:

- **Netlify**: Drag & drop the folder
- **Vercel**: Connect GitHub or drag & drop
- **GitHub Pages**: Push to gh-pages branch
- **Any static host**: AWS S3, Firebase, etc.

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

```css
Desktop:    1200px+ (full sidebar cart summary)
Tablet:     768px - 1024px (2-column checkout)
Mobile:     < 768px (hamburger menu, stacked layout)
Small:      < 480px (optimized small screen)
```

## ⚡ Performance

- **No external dependencies** - Faster load times
- **Minimal CSS** - ~10KB minified
- **Lightweight JS** - ~8KB minified
- **Image optimization**: Using Unsplash URLs with size parameters
- **Lazy-load ready**: Can add image lazy-loading if needed

## 🔐 Security Notes

This is a frontend-only demo app. In production:

- Use HTTPS for all communications
- Implement backend validation for checkout
- Use secure payment gateway (Stripe, Paystack, etc.)
- Never expose sensitive data in localStorage (currently just demo data)
- Implement proper user authentication

## 🎓 Learning Resource

This project demonstrates:

- HTML5 semantic structure
- Modern CSS (Grid, Flexbox, Variables, Media Queries)
- Vanilla JavaScript (ES6, Modules, Event Handling, localStorage API)
- Single Page Application (SPA) routing
- Form validation and error handling
- LocalStorage for data persistence
- Responsive design principles
- Accessibility best practices
- UX/UI patterns

## 📝 Customization

### Change Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
  --primary-color: #ff6b35; /* Change to your color */
  --secondary-color: #f7931e;
  /* ... other variables ... */
}
```

### Update Menu Items

Edit sample data in `js/data.js`:

```javascript
const MENU_DATA = [
  {
    id: 1,
    name: "Your Item",
    category: "Category",
    price: 1000,
    description: "...",
    ingredients: ["..."],
    imageUrl: "...",
    popularityScore: 80,
    featured: true,
  },
];
```

### Adjust Delivery Fee

Change in `js/data.js`:

```javascript
const DELIVERY_FEE = 500; // Set your fee
```

## 🐛 Troubleshooting

**Cart not persisting?**

- Check browser's localStorage is enabled
- Open DevTools → Application → LocalStorage → See `foodhub_cart`

**Images not loading?**

- Check internet connection (uses Unsplash URLs)
- Unsplash placeholder URLs require internet
- Replace imageUrl with local paths if offline

**Form validation not working?**

- Check browser console for errors
- Ensure form field `name` attributes match JavaScript keys
- Make fields `required` if you want them validated

## 📄 License

This is a learning/portfolio project. Feel free to use, modify, and deploy.

## 🙋 Questions?

This is a complete, self-contained application. Check the code comments in each file for detailed explanations of how everything works.

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**

Happy coding! 🚀
