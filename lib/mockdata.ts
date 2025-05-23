export interface PizzaOrder {
  id: string;
  customerName: string;
  pizzaType: string; // e.g., "Margherita", "Pepperoni", "Veggie Supreme"
  quantity: number;
  orderDate: string; // Using YYYY-MM-DD HH:MM format as specified
  status:
    | "Pending"
    | "Preparing"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
}

export const mockPizzaOrders: PizzaOrder[] = [
  {
    id: "PZA001",
    customerName: "Alice Wonderland",
    pizzaType: "Pepperoni",
    quantity: 2,
    orderDate: "2025-05-24 10:30",
    status: "Delivered",
  },
  {
    id: "PZA002",
    customerName: "Bob The Builder",
    pizzaType: "Margherita",
    quantity: 1,
    orderDate: "2025-05-24 11:15",
    status: "Preparing",
  },
  {
    id: "PZA003",
    customerName: "Charlie Brown",
    pizzaType: "Veggie Supreme",
    quantity: 1,
    orderDate: "2025-05-24 12:00",
    status: "Pending",
  },
  {
    id: "PZA004",
    customerName: "Diana Prince",
    pizzaType: "Pepperoni",
    quantity: 3,
    orderDate: "2025-05-23 18:00",
    status: "Out for Delivery",
  },
  {
    id: "PZA005",
    customerName: "Edward Scissorhands",
    pizzaType: "Margherita",
    quantity: 1,
    orderDate: "2025-05-23 14:20",
    status: "Cancelled",
  },
  {
    id: "PZA006",
    customerName: "Fiona Gallagher",
    pizzaType: "Veggie Supreme",
    quantity: 2,
    orderDate: "2025-05-24 13:00",
    status: "Pending",
  },
];
