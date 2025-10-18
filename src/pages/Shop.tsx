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
import { perfumes, categories } from "@/data/perfumes";
import { searchPerfumes } from "@/lib/search.util";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const searchQuery = searchParams.get("query") || "";

  // TODO: Replace with Supabase query when implementing backend
  // Filter by search query first, then by category
  let filteredPerfumes = searchQuery
    ? searchPerfumes(perfumes, searchQuery, perfumes.length)
    : selectedCategory === "All"
    ? perfumes
    : perfumes.filter((p) => p.category === selectedCategory);

  // Reset category filter when search query is active
  useEffect(() => {
    if (searchQuery) {
      setSelectedCategory("All");
    }
  }, [searchQuery]);

  // Sort perfumes
  if (sortBy === "price-low") {
    filteredPerfumes = [...filteredPerfumes].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredPerfumes = [...filteredPerfumes].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredPerfumes = [...filteredPerfumes].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Shop Our Collection"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {searchQuery
              ? `Found ${filteredPerfumes.length} perfume${filteredPerfumes.length !== 1 ? "s" : ""}`
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
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
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
          {filteredPerfumes.map((perfume) => (
            <ProductCard key={perfume.id} perfume={perfume} />
          ))}
        </div>

        {filteredPerfumes.length === 0 && (
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
