import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useWishlist } from "@/contexts/wishlistContext";

const WishlistPage = () => {
  const categories = ["All", "Men", "Women", "Unisex"] as const;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const { items: wishlistedPerfumes } = useWishlist();

  // Filter by category
  let filteredPerfumes =
    selectedCategory === "All"
      ? wishlistedPerfumes
      : wishlistedPerfumes.filter((p) => p.category_slug === selectedCategory);

  // Sort perfumes
  if (sortBy === "price-low") {
    filteredPerfumes = [...filteredPerfumes].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredPerfumes = [...filteredPerfumes].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredPerfumes = [...filteredPerfumes].sort(
      (a, b) => b.rating - a.rating
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Your Wishlist
          </h1>
          <p className="text-muted-foreground text-lg">
            List of your most favorite perfumes
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
              You have no perfumes in your wishlist
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
