import { Perfume } from "@/types/Perfumes.type";

/**
 * 🔍 Search utility function - currently filters static data
 * TODO: Replace with Supabase full-text search query:
 * const { data } = await supabase
 *   .from("products")
 *   .select("*")
 *   .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
 *   .limit(limit);
 */
export const searchPerfumes = (
  perfumes: Perfume[],
  query: string,
  limit: number = 5
): Perfume[] => {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();

  return perfumes
    .filter((perfume) => {
      const matchesName = perfume.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory = perfume.category_slug
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesDescription = perfume.description
        .toLowerCase()
        .includes(normalizedQuery);

      return matchesName || matchesCategory || matchesDescription;
    })
    .slice(0, limit);
};

/**
 * Highlight matching text in search results
 */
// export const highlightMatch = (text: string, query: string): string => {
//   if (!query.trim()) return text;

//   const regex = new RegExp(`(${query})`, "gi");
//   return text.replace(regex, "<mark>$1</mark>");
// };
