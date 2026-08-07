export type PlainDrink = {
  id: string;
  name: string;
  category: string;
  tag: string | null;
  description: string | null;
  price: number;
  priceLarge: number | null;
  originalPrice: number | null;
  colorway: string;
  imageUrl: string | null;
  isNew: boolean;
  active: boolean;
  sortOrder: number;
};

export type PlainTopping = {
  id: string;
  name: string;
  price: number;
  colorway: string;
  imageUrl: string | null;
  active: boolean;
  sortOrder: number;
};

export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type CartToppingSelection = {
  toppingId: string;
  name: string;
  price: number;
};

export type CartLine = {
  lineId: string;
  drinkId: string;
  name: string;
  tag: string | null;
  colorway: string;
  imageUrl: string | null;
  size: "500ML" | "700ML";
  unitPrice: number;
  quantity: number;
  sugarLevel: number;
  toppings: CartToppingSelection[];
  lineTotal: number;
};

export type PlainOrder = {
  id: string;
  customerName: string;
  customerPhone: string | null;
  notes: string | null;
  status: OrderStatus;
  subtotal: number;
  total: number;
  createdAt: string;
  items: {
    id: string;
    drinkName: string;
    size: string;
    unitPrice: number;
    quantity: number;
    sugarLevel: number;
    lineTotal: number;
    toppings: { name: string; price: number }[];
  }[];
};
