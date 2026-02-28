const menuData = {
    sandwiches: [
        { id: 1, name: 'Pulled Beef', price: 180, icon: 'ðŸ¥©', nameAr: 'Ù„Ø­Ù… Ù…Ø³Ø­ÙˆØ¨', quantity: 50 },
        { id: 2, name: 'Beef Burger', price: 175, icon: 'ðŸ”', nameAr: 'Ø¨Ø±Ø¬Ø± Ù„Ø­Ù…', quantity: 45 },
        { id: 3, name: 'Chicken Fajita', price: 140, icon: 'ðŸŒ®', nameAr: 'ÙØ§Ø¬ÙŠØªØ§ Ø¯Ø¬Ø§Ø¬', quantity: 40 },
        { id: 4, name: 'Dynamite Chicken Pops', price: 160, icon: 'â˜•ðŸ½ï¸', nameAr: 'Ø¨ÙˆØ¨Ø³ Ø¯Ø¬Ø§Ø¬ Ø¯ÙŠÙ†Ø§Ù…ÙŠØª', quantity: 35 },
        { id: 5, name: 'Falafel & Eggplants', price: 80, icon: 'ðŸŸ¤', nameAr: 'ÙÙ„Ø§ÙÙ„ ÙˆØ¨Ø§Ø°Ù†Ø¬Ø§Ù†', quantity: 60 },
        { id: 6, name: 'Halloumi Cheese', price: 120, icon: 'ðŸ§€', nameAr: 'Ø¬Ø¨Ù† Ø­Ù„ÙˆÙ…', quantity: 38 },
    ],
    sliders: [
        { id: 7, name: 'Beef Burger Slider', price: 140, icon: 'ðŸ”', nameAr: 'Ø´Ø±ÙŠØ­Ø© Ø¨Ø±Ø¬Ø± Ù„Ø­Ù…', quantity: 50 },
        { id: 8, name: 'Fried Chicken Slider', price: 100, icon: 'ðŸ—', nameAr: 'Ø´Ø±ÙŠØ­Ø© Ø¯Ø¬Ø§Ø¬ Ù…Ù‚Ù„ÙŠ', quantity: 42 },
        { id: 9, name: 'Fried Shrimps Slider', price: 280, icon: 'ðŸ¤', nameAr: 'Ø´Ø±ÙŠØ­Ø© Ø¬Ù…Ø¨Ø±ÙŠ Ù…Ù‚Ù„ÙŠ', quantity: 28 },
    ],
    snacks: [
        { id: 10, name: 'Burger Coin Slimmies', price: 220, icon: 'ðŸ’°', nameAr: 'Ù‚Ø·Ø¹ Ø§Ù„Ø¨Ø±Ø¬Ø±', quantity: 50 },
        { id: 11, name: 'Mini Hawawshi', price: 150, icon: 'ðŸ¥–', nameAr: 'Ø­ÙˆØ§ÙˆØ´ÙŠ ØµØºÙŠØ±', quantity: 40 },
        { id: 12, name: 'Tortilla Kebab Skewers', price: 250, icon: 'ðŸŒ¯', nameAr: 'Ø´ÙŠØ´ Ø·Ø±Ø·ÙˆØ± Ø§Ù„ÙƒØ¨Ø§Ø¨', quantity: 30 },
        { id: 13, name: 'Mini Corn Dogs', price: 140, icon: 'ðŸŒ­', nameAr: 'Ù†Ù‚Ø§Ù†Ù‚ Ø§Ù„Ø°Ø±Ø© Ø§Ù„ØµØºÙŠØ±Ø©', quantity: 35 },
        { id: 14, name: 'Dynamite Shrimp Pops', price: 275, icon: 'â˜•ðŸ½ï¸', nameAr: 'Ø¨ÙˆØ¨Ø³ Ø¬Ù…Ø¨Ø±ÙŠ Ø¯ÙŠÙ†Ø§Ù…ÙŠØª', quantity: 25 },
        { id: 15, name: 'Sweet Corn on the Cob', price: 75, icon: 'ðŸŒ½', nameAr: 'Ø°Ø±Ø© Ø­Ù„ÙˆØ©', quantity: 45 },
        { id: 16, name: 'Stuffed Vine Leaves', price: 95, icon: 'ðŸƒ', nameAr: 'ÙˆØ±Ù‚ Ø¹Ù†Ø¨ Ù…Ø­Ø´ÙŠ', quantity: 40 },
        { id: 17, name: 'Loaded Chips Bag', price: 85, icon: 'ðŸ¥”', nameAr: 'ÙƒÙŠØ³ Ø´ÙŠØ¨Ø³ÙŠ Ù…Ø­Ù…Ù„', quantity: 60 },
        { id: 18, name: 'Mini Roz Maamor', price: 100, icon: 'ðŸš', nameAr: 'Ø£Ø±Ø² Ù…Ù…ÙˆØ± ØµØºÙŠØ±', quantity: 30 },
        { id: 19, name: 'Mini Roz Maamor - Meat', price: 180, icon: 'ðŸš', nameAr: 'Ø£Ø±Ø² Ù…Ù…ÙˆØ± ØµØºÙŠØ± Ù„Ø­Ù…', quantity: 25 },
        { id: 20, name: 'Mini Roz Maamor - Hamam', price: 275, icon: 'ðŸš', nameAr: 'Ø£Ø±Ø² Ù…Ù…ÙˆØ± ØµØºÙŠØ± Ø­Ù…Ø§Ù…', quantity: 20 },
        { id: 27, name: 'Plate Chicken Tenders with Fries', price: 140, icon: 'ðŸŸ', nameAr: 'ØµØ¯ÙˆØ± Ø¯Ø¬Ø§Ø¬ Ù…Ø¹ Ø¨Ø·Ø§Ø·Ø³', quantity: 55 },
        { id: 28, name: 'Fries Cup', price: 100, icon: 'â˜•', nameAr: 'ÙƒÙˆØ¨ Ø¨Ø·Ø§Ø·Ø³', quantity: 100 },
    ],
    extras: [
        { id: 29, name: 'Soft Drink', price: 30, icon: '🥤', nameAr: 'مشروب غازي', quantity: 200 },
        { id: 30, name: 'Extra Sauce', price: 10, icon: '🥫', nameAr: 'صوص إضافي', quantity: 300 },
        { id: 34, name: 'Truffle Mayo', price: 30, icon: '🍄', nameAr: 'مايونيز ترافل', quantity: 150 },
    ],
    desserts: [
        { id: 21, name: 'Sweet Potato CrÃ¨me BrÃ»lÃ©e', price: 100, icon: 'ðŸ®', nameAr: 'ÙƒØ±ÙŠÙ…Ø© Ø§Ù„Ø¨Ø·Ø§Ø·Ø§ Ø§Ù„Ø­Ù„ÙˆØ©', quantity: 32 },
        { id: 22, name: 'Vanilla Ice Cream', price: 20, icon: 'ðŸ¦', nameAr: 'Ø¢ÙŠØ³ ÙƒØ±ÙŠÙ… ÙØ§Ù†ÙŠÙ„ÙŠØ§', quantity: 100 },
        { id: 23, name: 'Cookie Fries', price: 80, icon: 'ðŸª', nameAr: 'Ø¨Ø³ÙƒÙˆÙŠØª Ù…Ù‚Ù„ÙŠ', quantity: 44 },
        { id: 24, name: 'Cookie Sandwich', price: 180, icon: 'ðŸª', nameAr: 'Ø³Ù†Ø¯ÙˆÙŠØªØ´ Ø§Ù„Ø¨Ø³ÙƒÙˆÙŠØª', quantity: 25 },
        { id: 25, name: 'Strawberry Dubai Kunafa', price: 150, icon: 'ðŸ“', nameAr: 'ÙƒÙ†Ø§ÙØ© ÙØ±Ø§ÙˆÙ„Ø© Ø¯Ø¨ÙŠ', quantity: 20 },
        { id: 26, name: 'Tiramisu Cup', price: 100, icon: 'â˜•', nameAr: 'ÙƒÙˆØ¨ ØªÙŠØ±Ø§Ù…ÙŠØ³Ùˆ', quantity: 30 },
    ]
};

function getMenuItemName(item) {
    return currentLanguage === 'ar' ? item.nameAr : item.name;
}

function getAllMenuItems() {
    const all = [];
    for (let category in menuData) {
        all.push(...menuData[category]);
    }
    return all;
}

function getMenuItemsByCategory(category) {
    if (category === 'all') {
        return getAllMenuItems();
    }
    return menuData[category] || [];
}

