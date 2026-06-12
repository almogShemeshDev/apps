const products = [
  { id: 1, name: "עכבר גיימינג Pro X", price: 249, category: "גיימינג", emoji: "🖱️", description: "עכבר גיימינג מקצועי עם תאורת RGB ו-16000 DPI", stock: 15 },
  { id: 2, name: "אוזניות גיימינג SoundBeast", price: 399, category: "גיימינג", emoji: "🎧", description: "אוזניות סראונד 7.1 עם מיקרופון מובנה", stock: 10 },
  { id: 3, name: "כיסא גיימינג UltraComfort", price: 1290, category: "גיימינג", emoji: "🪑", description: "כיסא גיימינג ארגונומי עם תמיכת גב מלאה", stock: 5 },
  { id: 4, name: "מחשב גיימינג Beast 4090", price: 8999, category: "מחשבים", emoji: "🖥️", description: "מחשב גיימינג RTX 4090, i9, 64GB RAM", stock: 3 },
  { id: 5, name: "MacBook Pro 16\"", price: 9499, category: "מחשבים", emoji: "💻", description: "מקבוק פרו עם שבב M3 Max, 32GB RAM, 1TB", stock: 7 },
  { id: 6, name: "אייפון 15 Pro Max", price: 5499, category: "סמארטפונים", emoji: "📱", description: "אייפון 15 פרו מקס 256GB, טיטניום טבעי", stock: 20 },
  { id: 7, name: "Samsung Galaxy S24 Ultra", price: 4999, category: "סמארטפונים", emoji: "📱", description: "סמסונג גלקסי S24 אולטרה 512GB עם S-Pen", stock: 12 },
  { id: 8, name: "iPad Pro 12.9\"", price: 4299, category: "טאבלטים", emoji: "📟", description: "אייפד פרו עם שבב M4 ומסך Liquid Retina XDR", stock: 8 },
  { id: 9, name: "טאבלט Samsung Galaxy Tab S9", price: 2899, category: "טאבלטים", emoji: "📟", description: "טאבלט סמסונג 256GB עם עט S-Pen", stock: 6 },
  { id: 10, name: "מקלדת גיימינג MechKeys", price: 449, category: "גיימינג", emoji: "⌨️", description: "מקלדת מכנית עם מתגי Cherry MX ו-RGB", stock: 18 },
  { id: 11, name: "פד גיימינג XL", price: 89, category: "גיימינג", emoji: "🎮", description: "פד גיימינג ענק 90x40 ס״מ עם בסיס אנטי-החלקה", stock: 25 },
  { id: 12, name: "כרטיס גרפי RTX 4080", price: 3799, category: "מחשבים", emoji: "🎮", description: "כרטיס גרפי NVIDIA RTX 4080 16GB", stock: 4 },
];

function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

function getProducts() {
  const saved = localStorage.getItem('products');
  return saved ? JSON.parse(saved) : products;
}
