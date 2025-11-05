import { supabase } from "./supabase.util";
import { useQuery } from "@tanstack/react-query";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const useCategories = () => {
  const query = useQuery({ 
    queryKey: ["categories"], 
    queryFn: fetchCategories 
  });
  return query;
};

export const incrementCategoryCount = async (categorySlug: string) => {
  try {
    const { error } = await supabase.rpc("increment_category_count", {
      category_slug: categorySlug
    });
    
    if (error) throw error;
  } catch (error) {
    console.error("Error incrementing category count:", error);
  }
};

export const decrementCategoryCount = async (categorySlug: string) => {
  try {
    const { error } = await supabase.rpc("decrement_category_count", {
      category_slug: categorySlug
    });
    
    if (error) throw error;
  } catch (error) {
    console.error("Error decrementing category count:", error);
  }
};
