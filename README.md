# 🍔 MUNCH - Restaurant Ordering System

A professional, bilingual (English/Arabic) ordering system for MUNCH restaurant with cashier interface, admin dashboard, and inventory management.

## Features

### 🎯 Cashier Interface
- **Menu Management**: Organized by categories (Sandwiches, Sliders, Snacks, Desserts)
- **Dynamic Ordering**: Add/remove items, adjust quantities in real-time
- **Price Calculation**: Automatic subtotal, tax (10%), and total calculation
- **Order History**: View all today's orders with timestamps
- **Order Deletion**: Easy order cancellation with confirmation
- **Quick Access**: Link to Admin Panel for management

### 📊 Admin Dashboard
- **Daily Analytics**: Total orders, revenue, average order value, items sold
- **Monthly Reports**: Comprehensive monthly breakdown by date
- **Inventory Management**: Real-time stock tracking with status indicators
- **Top Sellers**: View best-selling items for analysis
- **Data Reset**: Quick reset for testing purposes

### 🔐 Security
- **Admin Login**: Username/Password protected access
  - Username: `admin`
  - Password: `123456789`
- **Session Management**: Auto-logout after browser close

### 🌍 Bilingual Support
- **English & Arabic**: Full UI translation
- **RTL Support**: Automatic right-to-left layout for Arabic
- **Instant Switching**: One-click language toggle

### 📦 Inventory System
- **Stock Tracking**: Real-time quantity monitoring
- **Low Stock Alerts**: Automatic warnings when items run low
- **Out of Stock Prevention**: Alert prevents orders for unavailable items
- **Quantity Control**: Admin can adjust stock levels

### 💾 Data Persistence
- **Browser Storage**: All data saved locally
- **Daily Reset**: Automatic data refresh each day
- **Order History**: Complete order tracking throughout the day

## Project Structure

```
sys_munch/
├── index.html                 # Cashier interface
├── login.html                 # Admin login page
├── admin.html                 # Admin dashboard
├── styles.css                 # Cashier styling
├── login-styles.css           # Login styling
├── admin-styles.css           # Admin styling
├── script.js                  # Cashier logic
├── login.js                   # Login logic
├── admin.js                   # Admin logic
├── menu-data.js               # Menu items and inventory
├── translations.js            # English/Arabic translations
└── README.md                  # This file
```

## Menu Items

### Sandwiches
- Pulled Beef (180 LE)
- Beef Burger (175 LE)
- Chicken Fajita (140 LE)
- Dynamite Chicken (160 LE)
- Falafel & Eggplants (80 LE)
- Halloumi Cheese (120 LE)

### Sliders (2 pieces)
- Beef Burger Slider (140 LE)
- Fried Chicken Slider (100 LE)
- Fried Shrimps Slider (280 LE)

### Snacks
- Burger Coin Slimmies (220 LE)
- Mini Hawawshi (150 LE)
- Tortilla Kebab Skewers (250 LE)
- Mini Corn Dogs (140 LE)
- Dynamite Shrimp (275 LE)
- Sweet Corn on the Cob (75 LE)
- Stuffed Vine Leaves (95 LE)
- Loaded Chips Bag (85 LE)
- Mini Roz Maamor (100 LE)
- Mini Roz Maamor - Meat (180 LE)
- Mini Roz Maamor - Hamam (275 LE)
- **Plate Chicken Tenders with Fries (140 LE)** ⭐ NEW

### Desserts
- Sweet Potato Crème Brûlée (100 LE)
- Vanilla Ice Cream (20 LE)
- Cookie Fries (80 LE)
- Cookie Sandwich (180 LE)
- Strawberry Dubai Kunafa (150 LE)
- Tiramisu Cup (100 LE)

## How to Use

### For Cashiers
1. Open `index.html` in a web browser
2. Click on menu items to add to current order
3. Adjust quantities with +/- buttons
4. Click "Confirm Order" to process
5. View today's orders in the right panel
6. Delete orders if needed using the ✕ button

### For Admins
1. From cashier interface, click "📊 Admin Panel"
2. Enter credentials:
   - Username: `admin`
   - Password: `123456789`
3. Access three tabs:
   - **📅 Today**: Daily statistics and orders
   - **📊 Monthly**: Monthly analytics and breakdown
   - **📦 Inventory**: Stock management and adjustments

### Language Support
- Click "English" or "العربية" to switch languages
- Available on both cashier and admin interfaces

## Technical Details

### Technologies Used
- **HTML5**: Structure
- **CSS3**: Styling with responsive design
- **Vanilla JavaScript**: No frameworks or dependencies
- **Local Storage API**: Data persistence

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

### Storage
- Uses browser's Local Storage
- No server required
- Data resets after closing all instances daily

## Setup Instructions

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/youssefgendii/sys_munch.git
   cd sys_munch
   ```

2. Open in browser:
   - Simply open `index.html` in any web browser
   - No build process or installation needed

### Deployment Options

#### Option 1: GitHub Pages (Recommended)
1. Go to repository settings
2. Scroll to "GitHub Pages" section
3. Select "main" branch as source
4. Your site will be live at: `https://youssefgendii.github.io/sys_munch/`

#### Option 2: Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select this repository
5. Deploy!

#### Option 3: Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import from GitHub
4. Select this repository
5. Deploy!

## Admin Features

### Dashboard Statistics
- **Total Orders**: Count of orders placed
- **Total Revenue**: Sum of all order totals
- **Average Order Value**: Revenue divided by orders
- **Items Sold**: Total quantity of items ordered

### Inventory Management
- View all items with current stock levels
- Edit quantities in modal dialog
- Filter by category
- Color-coded status (Green/Yellow/Red)

### Order Tracking
- Complete order history with timestamps
- View individual order details
- Delete orders if needed

### Data Management
- Reset all data for testing
- Monthly breakdown by date
- Top selling items analysis

## Security Notes

- Login credentials are stored in `login.js`
- For production, use server-side authentication
- Session-based login clears on browser close
- No user authentication database required for current setup

## Customization

### Adding Menu Items
Edit `menu-data.js` to add/modify items:
```javascript
{
  id: 28,
  name: 'Item Name',
  price: 150,
  icon: '🍕',
  nameAr: 'اسم العنصر',
  quantity: 50
}
```

### Changing Tax Rate
Edit `script.js` line where tax is calculated:
```javascript
const tax = Math.round(subtotal * 0.1 * 100) / 100; // Change 0.1 to desired rate
```

### Modifying Colors
Update CSS variables in `styles.css`:
```css
:root {
  --primary-color: #1a5f3f;
  --secondary-color: #2d9d65;
  /* ... other colors */
}
```

## Testing

### Test Scenarios
1. **Place Order**: Add items → Confirm → Check in orders list
2. **Inventory Check**: Try ordering more than available → Should show alert
3. **Delete Order**: Click ✕ on order → Confirm deletion
4. **Admin Access**: Go to Admin Panel → Login → Check statistics
5. **Language Switch**: Switch to Arabic and English → UI should update

### Email Resetting
1. Click "🔄 Reset All" button in admin (for testing only)
2. Confirm the warning dialog
3. All data and inventory will reset

## Known Limitations

- No backend server (data stored locally only)
- No database (uses browser Local Storage)
- No user accounts (single admin login)
- No payment integration
- No SMS notifications

## Future Enhancements

- [ ] Backend API integration
- [ ] Multiple admin accounts
- [ ] Payment gateway integration
- [ ] SMS order notifications
- [ ] Customer account system
- [ ] Order tracking for customers
- [ ] Analytics dashboard
- [ ] Staff management
- [ ] Multi-location support

## License

© 2026 MUNCH Restaurant. All rights reserved.

## Support

For issues or questions, contact the development team.

---

**Last Updated**: February 23, 2026
**Version**: 1.0.0
