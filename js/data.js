/* ===================================
   data.js - Sample Menu Data
   Contains all food items and categories
   =================================== */

// Generate placeholder image URLs using a reliable placeholder service
function getPlaceholderImage(seed) {
    return `https://images.unsplash.com/photo-${seed}?w=400&h=300&fit=crop`;
}

const MENU_DATA = [
    // Rice Dishes (Category 1)
    {
        id: 1,
        name: 'Jollof Rice',
        category: 'Rice',
        price: 2500,
        description: 'Aromatic West African rice cooked in tomato and spices',
        ingredients: ['Long grain rice', 'Tomatoes', 'Peppers', 'Onions', 'Spices'],
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        popularityScore: 95,
        featured: true
    },
    {
        id: 2,
        name: 'Fried Rice',
        category: 'Rice',
        price: 2200,
        description: 'Stir-fried rice with vegetables, egg, and choice of protein',
        ingredients: ['Rice', 'Egg', 'Carrots', 'Peas', 'Onions'],
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
        popularityScore: 88,
        featured: true
    },
    {
        id: 3,
        name: 'White Rice & Stew',
        category: 'Rice',
        price: 2300,
        description: 'Fluffy white rice served with rich tomato-based stew',
        ingredients: ['White rice', 'Tomato stew', 'Peppers', 'Onions'],
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
        popularityScore: 82,
        featured: false
    },
    {
        id: 4,
        name: 'Coconut Rice',
        category: 'Rice',
        price: 2600,
        description: 'Rice cooked in aromatic coconut milk with seasonal vegetables',
        ingredients: ['Rice', 'Coconut milk', 'Mixed vegetables', 'Spices'],
        imageUrl: 'https://images.unsplash.com/photo-1596040694312-923d12cb5d5d?w=400&h=300&fit=crop',
        popularityScore: 75,
        featured: false
    },
    
    // Swallow Dishes (Category 2)
    {
        id: 5,
        name: 'Fufu & Egusi Soup',
        category: 'Swallow',
        price: 3000,
        description: 'Traditional pounded yam with creamy melon seed soup',
        ingredients: ['Yam', 'Egusi seeds', 'Leafy greens', 'Protein', 'Spices'],
        imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
        popularityScore: 92,
        featured: true
    },
    {
        id: 6,
        name: 'Pounded Yam',
        category: 'Swallow',
        price: 2800,
        description: 'Smooth pounded yam served with your choice of soup',
        ingredients: ['White yam', 'Butter', 'Salt'],
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        popularityScore: 85,
        featured: false
    },
    {
        id: 7,
        name: 'Amala & Okra Soup',
        category: 'Swallow',
        price: 2700,
        description: 'Smooth yam flour dough with slimy okra soup',
        ingredients: ['Yam flour', 'Okra', 'Peppers', 'Tomatoes', 'Protein'],
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        popularityScore: 78,
        featured: false
    },
    {
        id: 8,
        name: 'Garri & Soup',
        category: 'Swallow',
        price: 2400,
        description: 'Cassava garri with hot soup - a true comfort meal',
        ingredients: ['Garri', 'Cassava', 'Hot soup', 'Peppers'],
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        popularityScore: 70,
        featured: false
    },
    
    // Snacks (Category 3)
    {
        id: 9,
        name: 'Meat Pie',
        category: 'Snacks',
        price: 800,
        description: 'Flaky pastry filled with seasoned ground meat',
        ingredients: ['Pastry', 'Ground meat', 'Onions', 'Spices', 'Egg'],
        imageUrl: 'https://images.unsplash.com/photo-1566781857391-7b64cd2d7d47?w=400&h=300&fit=crop',
        popularityScore: 88,
        featured: false
    },
    {
        id: 10,
        name: 'Spring Rolls',
        category: 'Snacks',
        price: 600,
        description: 'Crispy rolls filled with vegetables and protein',
        ingredients: ['Wrapper', 'Cabbage', 'Carrots', 'Protein', 'Spices'],
        imageUrl: 'https://images.unsplash.com/photo-1609617262527-40ee8e34ec2a?w=400&h=300&fit=crop',
        popularityScore: 81,
        featured: false
    },
    {
        id: 11,
        name: 'Suya (Grilled Meat)',
        category: 'Snacks',
        price: 1200,
        description: 'Spicy grilled meat skewers with peanut coating',
        ingredients: ['Beef', 'Peanuts', 'Paprika', 'Cayenne pepper', 'Spices'],
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
        popularityScore: 94,
        featured: false
    },
    {
        id: 12,
        name: 'Egg Roll',
        category: 'Snacks',
        price: 500,
        description: 'Soft bread filled with fried egg and vegetables',
        ingredients: ['Bread', 'Egg', 'Onions', 'Tomatoes', 'Pepper'],
        imageUrl: 'https://images.unsplash.com/photo-1635521076201-4d86db2c6ba0?w=400&h=300&fit=crop',
        popularityScore: 76,
        featured: false
    },
    
    // Drinks (Category 4)
    {
        id: 13,
        name: 'Fresh Juice (Orange)',
        category: 'Drinks',
        price: 500,
        description: 'Freshly squeezed orange juice',
        ingredients: ['Fresh oranges', 'Sugar', 'Ice'],
        imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd1dcb47?w=400&h=300&fit=crop',
        popularityScore: 79,
        featured: false
    },
    {
        id: 14,
        name: 'Zobo (Hibiscus)',
        category: 'Drinks',
        price: 400,
        description: 'Traditional hibiscus drink served cold',
        ingredients: ['Hibiscus flowers', 'Ginger', 'Sugar', 'Ice'],
        imageUrl: 'https://images.unsplash.com/photo-1543181286-19c0d9efecf0?w=400&h=300&fit=crop',
        popularityScore: 72,
        featured: false
    },
    {
        id: 15,
        name: 'Mango Smoothie',
        category: 'Drinks',
        price: 600,
        description: 'Creamy mango smoothie with yogurt',
        ingredients: ['Fresh mango', 'Yogurt', 'Milk', 'Honey', 'Ice'],
        imageUrl: 'https://images.unsplash.com/photo-1590080876759-cd849d19d915?w=400&h=300&fit=crop',
        popularityScore: 85,
        featured: false
    },
    {
        id: 16,
        name: 'Ginger Drink',
        category: 'Drinks',
        price: 450,
        description: 'Spicy ginger tea - perfect for digestion',
        ingredients: ['Fresh ginger', 'Lemon', 'Honey', 'Water'],
        imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd33fbe?w=400&h=300&fit=crop',
        popularityScore: 68,
        featured: false
    }
];

// Categories for filtering
const CATEGORIES = [
    { name: 'Rice', icon: '🍚' },
    { name: 'Swallow', icon: '🥘' },
    { name: 'Snacks', icon: '🍖' },
    { name: 'Drinks', icon: '🥤' }
];

// Delivery configuration
const DELIVERY_FEE = 500;
const TAX_PERCENTAGE = 0.05; // 5% tax (optional)
