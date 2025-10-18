// TODO: Replace static data with Supabase query in the future
export interface Testimonial {
  id: number;
  name: string;
  location: string;
  comment: string;
  rating: number;
  image?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sophie Laurent",
    location: "Paris, France",
    comment: "Velvet Rose has become my signature scent. The quality is exceptional and the fragrance lasts all day. Truly luxurious!",
    rating: 5
  },
  {
    id: 2,
    name: "James Morrison",
    location: "London, UK",
    comment: "Noir Essence is sophisticated and bold. I've received countless compliments. Aromatique delivers excellence in every bottle.",
    rating: 5
  },
  {
    id: 3,
    name: "Isabella Romano",
    location: "Milan, Italy",
    comment: "The attention to detail in every fragrance is remarkable. Golden Oud is an absolute masterpiece. Worth every penny!",
    rating: 5
  }
];
