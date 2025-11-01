// TODO: Replace static data with Supabase query in the future

export type { Perfume } from "@/types/Perfumes.type";

// export const perfumes: Perfume[] = [
//   {
//     id: 1,
//     name: "Golden Oud",
//     price: 2500,
//     category_slug: "Unisex",
//     image: "/images/oud.png",
//     description:
//       "A luxurious blend of precious oud wood with warm amber and vanilla. This signature scent embodies timeless elegance and sophistication.",
//     rating: 4.8,
//     bestseller: true,
//     featured: true,
//     notes: {
//       top: ["Bergamot", "Saffron"],
//       middle: ["Oud Wood", "Rose"],
//       base: ["Amber", "Vanilla", "Musk"],
//     },
//     volume: "100ml",
//     stock: 20,
//   },
//   {
//     id: 2,
//     name: "Velvet Rose",
//     price: 2200,
//     category_slug: "Women",
//     image: "/images/rose.png",
//     description:
//       "An enchanting bouquet of Bulgarian rose petals kissed by morning dew, wrapped in soft cashmere and white musk.",
//     rating: 4.9,
//     bestseller: true,
//     featured: true,
//     notes: {
//       top: ["Pink Pepper", "Mandarin"],
//       middle: ["Bulgarian Rose", "Peony"],
//       base: ["White Musk", "Cashmere Wood"],
//     },
//     volume: "100ml",
//     stock: 15,
//   },
//   {
//     id: 3,
//     name: "Noir Essence",
//     price: 2600,
//     category_slug: "Men",
//     image: "/images/noir.png",
//     description:
//       "A bold and mysterious fragrance featuring dark spices, leather, and smoky vetiver. Perfect for the modern gentleman.",
//     rating: 4.7,
//     bestseller: true,
//     featured: true,
//     notes: {
//       top: ["Black Pepper", "Cardamom"],
//       middle: ["Leather", "Iris"],
//       base: ["Vetiver", "Tobacco", "Patchouli"],
//     },
//     volume: "100ml",
//     stock: 18,
//   },
//   {
//     id: 4,
//     name: "Citrus Bloom",
//     price: 1800,
//     category_slug: "Unisex",
//     image: "/images/citrus.png",
//     description:
//       "A refreshing symphony of Mediterranean citrus fruits with hints of jasmine and white tea. Light, airy, and sophisticated.",
//     rating: 4.6,
//     featured: true,
//     notes: {
//       top: ["Lemon", "Orange Blossom"],
//       middle: ["Jasmine", "White Tea"],
//       base: ["Cedar", "Light Musk"],
//     },
//     volume: "50ml",
//     stock: 25,
//   },
//   {
//     id: 5,
//     name: "Amber Mystique",
//     price: 2400,
//     category_slug: "Women",
//     image: "/images/amber.png",
//     description:
//       "Warm and sensual amber combined with exotic spices and silky sandalwood. A captivating evening fragrance.",
//     rating: 4.8,
//     notes: {
//       top: ["Cinnamon", "Clove"],
//       middle: ["Amber", "Jasmine"],
//       base: ["Sandalwood", "Vanilla", "Benzoin"],
//     },
//     volume: "100ml",
//     stock: 12,
//   },
//   {
//     id: 6,
//     name: "Oceanic Breeze",
//     price: 1900,
//     category_slug: "Men",
//     image: "/images/ocean.png",
//     description:
//       "Fresh aquatic notes blended with coastal herbs and driftwood. Inspired by Mediterranean shores.",
//     rating: 4.5,
//     notes: {
//       top: ["Sea Salt", "Mint"],
//       middle: ["Marine Notes", "Sage"],
//       base: ["Driftwood", "Amber"],
//     },
//     volume: "50ml",
//     stock: 30,
//   },
//   {
//     id: 7,
//     name: "Jasmine Noir",
//     price: 2300,
//     category_slug: "Women",
//     image: "/images/jasmine.png",
//     description:
//       "Intoxicating night-blooming jasmine with dark berries and creamy tonka bean. Elegant and mysterious.",
//     rating: 4.7,
//     notes: {
//       top: ["Blackcurrant", "Mandarin"],
//       middle: ["Night Jasmine", "Orange Blossom"],
//       base: ["Tonka Bean", "Patchouli"],
//     },
//     volume: "100ml",
//     stock: 8,
//   },
//   {
//     id: 8,
//     name: "Sandalwood Dreams",
//     price: 2100,
//     category_slug: "Unisex",
//     image: "/images/sandalwood.png",
//     description:
//       "Creamy sandalwood paired with warm cardamom and soft iris. A modern classic for any occasion.",
//     rating: 4.6,
//     notes: {
//       top: ["Cardamom", "Bergamot"],
//       middle: ["Iris", "Lavender"],
//       base: ["Sandalwood", "Cedarwood", "Musk"],
//     },
//     volume: "100ml",
//     stock: 22,
//   },
// ];

// export const categories = ["All", "Men", "Women", "Unisex"] as const;

// export const getFeaturedPerfumes = () => perfumes.filter((p) => p.featured);
// export const getBestsellers = () => perfumes.filter((p) => p.bestseller);
// export const getPerfumesByCategory = (category_slug: string) =>
//   category_slug === "All"
//     ? perfumes
//     : perfumes.filter((p) => p.category_slug === category_slug);
