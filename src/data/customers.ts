// Mock customers data - will be replaced with Supabase queries
// TODO: Replace with Supabase query: const { data } = await supabase.from('profiles').select('*')

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  joinedDate: string;
  lastOrder: string;
}

export const customers: Customer[] = [
  {
    id: 1,
    name: 'Sarah Ahmed',
    email: 'sarah.ahmed@example.com',
    phone: '+971 50 123 4567',
    orderCount: 5,
    totalSpent: 12500,
    joinedDate: '2024-06-15',
    lastOrder: '2025-10-18'
  },
  {
    id: 2,
    name: 'Ali Hassan',
    email: 'ali.hassan@example.com',
    phone: '+971 55 234 5678',
    orderCount: 3,
    totalSpent: 7500,
    joinedDate: '2024-08-20',
    lastOrder: '2025-10-17'
  },
  {
    id: 3,
    name: 'Fatima Al Mansoori',
    email: 'fatima.m@example.com',
    phone: '+971 50 345 6789',
    orderCount: 8,
    totalSpent: 21000,
    joinedDate: '2024-03-10',
    lastOrder: '2025-10-16'
  },
  {
    id: 4,
    name: 'Mohammed Khalid',
    email: 'mohammed.k@example.com',
    phone: '+971 54 456 7890',
    orderCount: 2,
    totalSpent: 4800,
    joinedDate: '2024-11-05',
    lastOrder: '2025-10-15'
  },
  {
    id: 5,
    name: 'Layla Ibrahim',
    email: 'layla.i@example.com',
    phone: '+971 56 567 8901',
    orderCount: 6,
    totalSpent: 15300,
    joinedDate: '2024-07-22',
    lastOrder: '2025-10-14'
  },
  {
    id: 6,
    name: 'Omar Abdullah',
    email: 'omar.a@example.com',
    phone: '+971 52 678 9012',
    orderCount: 4,
    totalSpent: 9400,
    joinedDate: '2024-09-18',
    lastOrder: '2025-10-13'
  },
  {
    id: 7,
    name: 'Aisha Mohammed',
    email: 'aisha.m@example.com',
    phone: '+971 50 789 0123',
    orderCount: 7,
    totalSpent: 18900,
    joinedDate: '2024-04-12',
    lastOrder: '2025-10-10'
  },
  {
    id: 8,
    name: 'Khalid Ahmed',
    email: 'khalid.a@example.com',
    phone: '+971 55 890 1234',
    orderCount: 1,
    totalSpent: 2500,
    joinedDate: '2025-01-08',
    lastOrder: '2025-10-08'
  }
];
