import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchPerfumes } from "@/lib/search.util";
import { useProducts } from "@/lib/products.util";
import { Perfume } from "@/types/Perfumes.type";

const Shop = () => {
  const categories = ["All", "Men", "Women", "Unisex"] as const;

  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const searchQuery = searchParams.get("query") || "";
  const { data: perfumes, isLoading }: { data: Perfume[]; isLoading: boolean } =
    useProducts();
  const [filteredPerfumes, setFilteredPerfumes] = useState<Perfume[] | null>();

  // Filter and sort perfumes
  useEffect(() => {
    let filtered = perfumes;

    // Filter by search
    if (searchQuery) {
      filtered = searchPerfumes(perfumes, searchQuery, perfumes.length);
      if (selectedCategory !== "all") {
        filtered = filtered?.filter(
          (p) => p.category_slug === selectedCategory
        );
      }
    }
    // Filter by category
    else if (selectedCategory !== "all") {
      filtered = perfumes?.filter((p) => p.category_slug === selectedCategory);
    }

    // Sort by selected option
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    }

    setFilteredPerfumes(filtered);
  }, [perfumes, searchQuery, selectedCategory, sortBy]);

  // Reset category filter when search query is active
  useEffect(() => {
    if (searchQuery) {
      setSelectedCategory("all");
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "Shop Our Collection"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {searchQuery
              ? `Found ${filteredPerfumes?.length} perfume${
                  filteredPerfumes?.length !== 1 ? "s" : ""
                }`
              : "Discover your perfect scent from our exquisite collection"}
          </p>
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={
                  selectedCategory === category.toLocaleLowerCase()
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setSelectedCategory(category.toLocaleLowerCase())
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPerfumes?.map((perfume) => (
            <ProductCard key={perfume.id} perfume={perfume} />
          ))}
        </div>
        {isLoading && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Loading...</p>
          </div>
        )}
        {filteredPerfumes?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No perfumes found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
