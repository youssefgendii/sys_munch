const menuData = {
    snackSipCup: [
        { id: 1, name: 'Soft Drink', price: 0, icon: '🥤', nameAr: 'مشروب غازي', quantity: 200 },
        { id: 2, name: 'Orange Juice (+20)', price: 20, icon: '🍊', nameAr: 'عصير برتقال (+20)', quantity: 120 },
        { id: 3, name: 'Original', price: 100, icon: '🍟', nameAr: 'أوريجينال', quantity: 120 },
        { id: 4, name: 'Chicken Pops', price: 160, icon: '🍗', nameAr: 'تشيكن بوبس', quantity: 120 },
        { id: 5, name: 'Chicken Cordon Bleu (4 pcs)', price: 160, icon: '🍗', nameAr: 'تشيكن كوردون بلو (4 قطع)', quantity: 120 },
        { id: 6, name: 'Hawawshi (3 pcs)', price: 175, icon: '🥙', nameAr: 'حواوشي (3 قطع)', quantity: 120 },
        { id: 7, name: 'Shrimp (5 pcs)', price: 260, icon: '🍤', nameAr: 'جمبري (5 قطع)', quantity: 120 },
        { id: 8, name: 'Coin Slimmies (5 pcs)', price: 180, icon: '🥩', nameAr: 'كوين سليميز (5 قطع)', quantity: 120 },
    ],
    miniRozMaamar: [
        { id: 9, name: 'Original', price: 100, icon: '🍚', nameAr: 'أوريجينال', quantity: 120 },
        { id: 10, name: 'Meat', price: 180, icon: '🥩', nameAr: 'لحم', quantity: 120 },
        { id: 11, name: 'Hamam', price: 275, icon: '🍗', nameAr: 'حمام', quantity: 120 },
    ],
    curlyFries: [
        { id: 12, name: 'Curly Fries', price: 60, icon: '🍟', nameAr: 'بطاطس كيرلي', quantity: 180 },
        { id: 41, name: 'Plate Chicken Pops', price: 140, icon: '🍗', nameAr: 'طبق تشيكن بوبس', quantity: 120 },
        { id: 42, name: 'Plate Shrimp', price: 245, icon: '🍤', nameAr: 'طبق جمبري', quantity: 120 },
    ],
    dessertSection: [
        { id: 13, name: 'Sweet Potato Crème Brûlée', price: 100, icon: '🍮', nameAr: 'سويت بوتيتو كريم بروليه', quantity: 120 },
        { id: 14, name: 'Vanilla Ice-Cream (+20)', price: 20, icon: '🍦', nameAr: 'آيس كريم فانيليا (+20)', quantity: 200 },
        { id: 15, name: 'Cookie Fries', price: 80, icon: '🍪', nameAr: 'كوكي فرايز', quantity: 120 },
        { id: 16, name: 'Cookie Sandwich', price: 180, icon: '🍪', nameAr: 'كوكي ساندويتش', quantity: 120 },
        { id: 17, name: 'Strawberry Dubai Kunafa', price: 150, icon: '🍓', nameAr: 'ستروبيري دبي كنافة', quantity: 120 },
        { id: 18, name: 'Tiramisu Cup (Weekend)', price: 100, icon: '☕', nameAr: 'كوب تيراميسو (ويك إند)', quantity: 80 },
    ],
    munchPocketSandwiches: [
        { id: 19, name: 'Pulled Beef', price: 180, icon: '🥩', nameAr: 'لحم مسحوب', quantity: 120 },
        { id: 20, name: 'Beef Burger', price: 175, icon: '🍔', nameAr: 'بيف برجر', quantity: 120 },
        { id: 21, name: 'Chicken Fajita', price: 140, icon: '🌮', nameAr: 'تشيكن فاهيتا', quantity: 120 },
        { id: 22, name: 'Dynamite Chicken', price: 160, icon: '🍗', nameAr: 'ديناميت تشيكن', quantity: 120 },
        { id: 23, name: 'Falafel & Eggplants', price: 80, icon: '🧆', nameAr: 'فلافل و باذنجان', quantity: 120 },
        { id: 24, name: 'Halloumi Cheese', price: 120, icon: '🧀', nameAr: 'جبنة حلومي', quantity: 120 },
    ],
    briocheSliders: [
        { id: 25, name: 'Beef Burger', price: 140, icon: '🍔', nameAr: 'بيف برجر', quantity: 120 },
        { id: 26, name: 'Fried Chicken', price: 100, icon: '🍗', nameAr: 'دجاج مقلي', quantity: 120 },
        { id: 27, name: 'Fried Shrimps', price: 280, icon: '🍤', nameAr: 'جمبري مقلي', quantity: 120 },
    ],
    snackClassics: [
        { id: 28, name: 'Burger Coin Slimmies (10 pcs)', price: 220, icon: '🥩', nameAr: 'برجر كوين سليميز (10 قطع)', quantity: 120 },
        { id: 29, name: 'Mini Hawawshi (4 pcs)', price: 150, icon: '🥙', nameAr: 'ميني حواوشي (4 قطع)', quantity: 120 },
        { id: 30, name: 'Tortilla Kebab Skewers (2 pieces)', price: 250, icon: '🌯', nameAr: 'أسياخ كباب تورتيلا (2 قطعة)', quantity: 120 },
        { id: 31, name: 'Mini Corn Dogs (6 pieces)', price: 140, icon: '🌭', nameAr: 'ميني كورن دوج (6 قطع)', quantity: 120 },
        { id: 32, name: 'Dynamite Shrimp (6 pieces)', price: 275, icon: '🍤', nameAr: 'ديناميت جمبري (6 قطع)', quantity: 120 },
        { id: 33, name: 'Sweet Corn on the Cob', price: 75, icon: '🌽', nameAr: 'ذرة على الكوز', quantity: 120 },
        { id: 34, name: 'Stuffed Vine Leaves', price: 95, icon: '🍃', nameAr: 'ورق عنب محشي', quantity: 120 },
        { id: 35, name: 'Loaded Chips Bag - Original (Weekend)', price: 50, icon: '🥔', nameAr: 'لودد تشيبس - أوريجينال (ويك إند)', quantity: 80 },
        { id: 36, name: 'Loaded Chips Bag - Beef (Weekend)', price: 85, icon: '🥔', nameAr: 'لودد تشيبس - بيف (ويك إند)', quantity: 80 },
        { id: 37, name: 'Loaded Chips Bag - Chicken (Weekend)', price: 75, icon: '🥔', nameAr: 'لودد تشيبس - تشيكن (ويك إند)', quantity: 80 },
    ],
    extras: [
        { id: 38, name: 'Soft Drink', price: 30, icon: '\ud83e\udd64', nameAr: '\u0645\u0634\u0631\u0648\u0628 \u063a\u0627\u0632\u064a', quantity: 200 },
        { id: 39, name: 'Extra Sauce', price: 10, icon: '\ud83e\uded9', nameAr: '\u0635\u0648\u0635 \u0625\u0636\u0627\u0641\u064a', quantity: 200 },
        { id: 40, name: 'Truffle Mayo', price: 30, icon: '\ud83e\uded9', nameAr: '\u062a\u0631\u0627\u0641\u0644 \u0645\u0627\u064a\u0648', quantity: 200 },
        { id: 43, name: 'Cherry Cola', price: 45, icon: '\ud83e\udd64', nameAr: '\u0643\u0648\u0644\u0627 \u0643\u0631\u0632', quantity: 200 },
        { id: 44, name: 'Passion Fruit', price: 50, icon: '\ud83e\udd64', nameAr: '\u0628\u0627\u0634\u0646 \u0641\u0631\u0648\u062a', quantity: 200 },
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
