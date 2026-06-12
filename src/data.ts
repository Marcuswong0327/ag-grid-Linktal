export interface Product {
  id: number;
  sku: string;
  product: string;
  category: "Electronics" | "Apparel" | "Home" | "Toys" | "Grocery";
  qty: number;
  reorderLevel: number;
  unitCost: number;
  unitPrice: number;
  inStock: boolean;
  lastRestock: string; // YYYY-MM-DD
}

export const CATEGORIES: Product["category"][] = [
  "Electronics",
  "Apparel",
  "Home",
  "Toys",
  "Grocery",
];

const products = [
  ["Wireless Mouse", "Electronics"],
  ["Mechanical Keyboard", "Electronics"],
  ["USB-C Hub", "Electronics"],
  ["Noise-Cancel Headphones", "Electronics"],
  ["Cotton T-Shirt", "Apparel"],
  ["Running Shoes", "Apparel"],
  ["Wool Beanie", "Apparel"],
  ["Denim Jacket", "Apparel"],
  ["Ceramic Mug", "Home"],
  ["Throw Blanket", "Home"],
  ["LED Desk Lamp", "Home"],
  ["Cast Iron Pan", "Home"],
  ["Building Blocks", "Toys"],
  ["RC Car", "Toys"],
  ["Puzzle 1000pc", "Toys"],
  ["Plush Bear", "Toys"],
  ["Organic Coffee", "Grocery"],
  ["Olive Oil 1L", "Grocery"],
  ["Dark Chocolate", "Grocery"],
  ["Green Tea Box", "Grocery"],
] as const;

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dateNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function makeRows(): Product[] {
  return products.map(([name, category], i) => {
    const unitCost = rand(3, 180) + 0.99;
    return {
      id: i + 1,
      sku: `SKU-${String(1000 + i)}`,
      product: name,
      category: category as Product["category"],
      qty: rand(0, 120),
      reorderLevel: rand(10, 30),
      unitCost: Number(unitCost.toFixed(2)),
      unitPrice: Number((unitCost * (1 + rand(20, 90) / 100)).toFixed(2)),
      inStock: Math.random() > 0.2,
      lastRestock: dateNDaysAgo(rand(1, 90)),
    };
  });
}
