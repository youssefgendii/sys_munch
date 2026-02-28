const menuData = {
    sandwiches: [
        { id: 1, name: 'Pulled Beef', price: 180, icon: '🥩', nameAr: 'لحم مسحوب', quantity: 50 },
        { id: 2, name: 'Beef Burger', price: 175, icon: '🍔', nameAr: 'برجر لحم', quantity: 45 },
        { id: 3, name: 'Chicken Fajita', price: 140, icon: '🌮', nameAr: 'فاجيتا دجاج', quantity: 40 },
        { id: 4, name: 'Dynamite Chicken Pops', price: 160, icon: '🍗', nameAr: 'بوبس دجاج ديناميت', quantity: 35 },
        { id: 5, name: 'Falafel & Eggplants', price: 80, icon: '🧆', nameAr: 'فلافل وباذنجان', quantity: 60 },
        { id: 6, name: 'Halloumi Cheese', price: 120, icon: '🧀', nameAr: 'جبن حلوم', quantity: 38 },
    ],
    sliders: [
        { id: 7, name: 'Beef Burger Slider', price: 140, icon: '🍔', nameAr: 'سلايدر برجر لحم', quantity: 50 },
        { id: 8, name: 'Fried Chicken Slider', price: 100, icon: '🍗', nameAr: 'سلايدر دجاج مقلي', quantity: 42 },
        { id: 9, name: 'Fried Shrimps Slider', price: 280, icon: '🍤', nameAr: 'سلايدر جمبري مقلي', quantity: 28 },
    ],
    snacks: [
        { id: 10, name: 'Burger Coin Slimmies', price: 220, icon: '🍖', nameAr: 'قطع برجر', quantity: 50 },
        { id: 11, name: 'Mini Hawawshi', price: 150, icon: '🥙', nameAr: 'ميني حواوشي', quantity: 40 },
        { id: 12, name: 'Tortilla Kebab Skewers', price: 250, icon: '🌯', nameAr: 'أسياخ كباب تورتيلا', quantity: 30 },
        { id: 13, name: 'Mini Corn Dogs', price: 140, icon: '🌭', nameAr: 'ميني كورن دوج', quantity: 35 },
        { id: 14, name: 'Dynamite Shrimp Pops', price: 275, icon: '🍤', nameAr: 'بوبس جمبري ديناميت', quantity: 25 },
        { id: 15, name: 'Sweet Corn on the Cob', price: 75, icon: '🌽', nameAr: 'ذرة حلوة', quantity: 45 },
        { id: 16, name: 'Stuffed Vine Leaves', price: 95, icon: '🍃', nameAr: 'ورق عنب محشي', quantity: 40 },
        { id: 17, name: 'Loaded Chips Bag', price: 85, icon: '🥔', nameAr: 'شيبسي محمل', quantity: 60 },
        { id: 18, name: 'Mini Roz Maamor', price: 100, icon: '🍚', nameAr: 'ميني رز معمور', quantity: 30 },
        { id: 19, name: 'Mini Roz Maamor - Meat', price: 180, icon: '🍚', nameAr: 'ميني رز معمور - لحم', quantity: 25 },
        { id: 20, name: 'Mini Roz Maamor - Hamam', price: 275, icon: '🍚', nameAr: 'ميني رز معمور - حمام', quantity: 20 },
        { id: 27, name: 'Plate Chicken Tenders with Fries', price: 140, icon: '🍟', nameAr: 'طبق تشيكن تندرز مع بطاطس', quantity: 55 },
        { id: 28, name: 'Fries Cup', price: 100, icon: '🍟', nameAr: 'كوب بطاطس', quantity: 100 },
    ],
    extras: [
        { id: 29, name: 'Soft Drink', price: 30, icon: '🥤', nameAr: 'مشروب غازي', quantity: 200 },
        { id: 30, name: 'Extra Sauce', price: 10, icon: '🥫', nameAr: 'صوص إضافي', quantity: 300 },
        { id: 34, name: 'Truffle Mayo', price: 30, icon: '🍄', nameAr: 'مايونيز ترافل', quantity: 150 },
    ],
    desserts: [
        { id: 21, name: 'Sweet Potato Crème Brûlée', price: 100, icon: '🍮', nameAr: 'سويت بوتيتو كريم بروليه', quantity: 32 },
        { id: 22, name: 'Vanilla Ice Cream', price: 20, icon: '🍦', nameAr: 'آيس كريم فانيليا', quantity: 100 },
        { id: 23, name: 'Cookie Fries', price: 80, icon: '🍪', nameAr: 'كوكي فرايز', quantity: 44 },
        { id: 24, name: 'Cookie Sandwich', price: 180, icon: '🍪', nameAr: 'كوكي ساندوتش', quantity: 25 },
        { id: 25, name: 'Strawberry Dubai Kunafa', price: 150, icon: '🍓', nameAr: 'كنافة فراولة دبي', quantity: 20 },
        { id: 26, name: 'Tiramisu Cup', price: 100, icon: '☕', nameAr: 'كوب تيراميسو', quantity: 30 },
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
