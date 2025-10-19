// Mock orders data - will be replaced with Supabase queries
// TODO: Replace with Supabase query: const { data } = await supabase.from('orders').select('*')

export interface Order {
  id: number;
  orderId: string;
  customer: string;
  customerEmail: string;
  items: { productId: number; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'completed' | 'canceled';
  date: string;
  shippingAddress: string;
}

export const orders: Order[] = [
  {
    id: 1,
    orderId: 'ORD-1001',
    customer: 'Sarah Ahmed',
    customerEmail: 'sarah.ahmed@example.com',
    items: [
      { productId: 1, quantity: 1, price: 2500 },
      { productId: 2, quantity: 1, price: 2200 }
    ],
    total: 4700,
    status: 'pending',
    date: '2025-10-18',
    shippingAddress: '123 Main St, Dubai, UAE'
  },
  {
    id: 2,
    orderId: 'ORD-1002',
    customer: 'Ali Hassan',
    customerEmail: 'ali.hassan@example.com',
    items: [
      { productId: 1, quantity: 1, price: 2500 }
    ],
    total: 2500,
    status: 'completed',
    date: '2025-10-17',
    shippingAddress: '456 Palm Blvd, Abu Dhabi, UAE'
  },
  {
    id: 3,
    orderId: 'ORD-1003',
    customer: 'Fatima Al Mansoori',
    customerEmail: 'fatima.m@example.com',
    items: [
      { productId: 3, quantity: 2, price: 2600 }
    ],
    total: 5200,
    status: 'completed',
    date: '2025-10-16',
    shippingAddress: '789 Sheikh Zayed Rd, Dubai, UAE'
  },
  {
    id: 4,
    orderId: 'ORD-1004',
    customer: 'Mohammed Khalid',
    customerEmail: 'mohammed.k@example.com',
    items: [
      { productId: 4, quantity: 1, price: 2300 }
    ],
    total: 2300,
    status: 'canceled',
    date: '2025-10-15',
    shippingAddress: '321 Marina Walk, Dubai, UAE'
  },
  {
    id: 5,
    orderId: 'ORD-1005',
    customer: 'Layla Ibrahim',
    customerEmail: 'layla.i@example.com',
    items: [
      { productId: 5, quantity: 1, price: 2400 },
      { productId: 6, quantity: 1, price: 2700 }
    ],
    total: 5100,
    status: 'pending',
    date: '2025-10-14',
    shippingAddress: '555 Jumeirah Beach Rd, Dubai, UAE'
  },
  {
    id: 6,
    orderId: 'ORD-1006',
    customer: 'Omar Abdullah',
    customerEmail: 'omar.a@example.com',
    items: [
      { productId: 7, quantity: 1, price: 2350 }
    ],
    total: 2350,
    status: 'completed',
    date: '2025-10-13',
    shippingAddress: '888 Business Bay, Dubai, UAE'
  }
];
