import { Perfume } from "@/types/Perfumes.type";
import { supabase } from "./supabase.util";
import { useQuery } from "@tanstack/react-query";

export const fetchProducts = async () => {
  try {
    const { data }: { data: Perfume[] } = await supabase
      .from("perfumes")
      .select("*");
    return data;
  } catch (error) {
    return error;
  }
};

export const getFeaturedPerfumes = (perfumes: Perfume[]) =>
  perfumes.filter((p) => p.featured);
export const getBestsellers = (perfumes: Perfume[]) =>
  perfumes.filter((p) => p.bestseller);
export const getPerfumesByCategory = (
  category_slug: string,
  perfumes: Perfume[]
) =>
  category_slug === "All"
    ? perfumes
    : perfumes.filter((p) => p.category_slug === category_slug);

export const useProducts = () => {
  const query = useQuery({ queryKey: ["perfumes"], queryFn: fetchProducts });
  return query;
};
