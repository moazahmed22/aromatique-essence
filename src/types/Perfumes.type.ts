export interface Perfume {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  bestseller?: boolean;
  featured?: boolean;
  category_slug: "Men" | "Women" | "Unisex";
  notes_top: string[];
  notes_middle: string[];
  notes_base: string[];
  volume: string;
  stock: number;
}
