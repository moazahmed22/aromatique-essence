// Mock categories data - will be replaced with Supabase queries
// TODO: Replace with Supabase query: const { data } = await supabase.from('categories').select('*')

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export const categories: Category[] = [
  {
    id: 1,
    name: 'Men',
    slug: 'men',
    description: 'Premium fragrances designed for men',
    productCount: 3,
    createdAt: '2024-01-15',
    updatedAt: '2025-10-18'
  },
  {
    id: 2,
    name: 'Women',
    slug: 'women',
    description: 'Elegant and sophisticated scents for women',
    productCount: 2,
    createdAt: '2024-01-15',
    updatedAt: '2025-10-18'
  },
  {
    id: 3,
    name: 'Unisex',
    slug: 'unisex',
    description: 'Versatile fragrances for everyone',
    productCount: 3,
    createdAt: '2024-01-15',
    updatedAt: '2025-10-18'
  }
];
