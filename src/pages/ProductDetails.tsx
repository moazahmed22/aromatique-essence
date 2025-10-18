import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { perfumes } from "@/data/perfumes";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/contexts/wishlistContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { items, addToWishlist } = useWishlist();

  // TODO: Replace with Supabase query
  const perfume = perfumes.find((p) => p.id === Number(id));

  const [isWishlisted, setIsWishlisted] = useState(
    items.some((item) => item.id === perfume.id)
  );

  if (!perfume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">
            Product Not Found
          </h1>
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get related products (same category, different ID)
  const relatedProducts = perfumes
    .filter((p) => p.category === perfume.category && p.id !== perfume.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-luxury">
            <img
              src={perfume.image}
              alt={perfume.name}
              className="w-full h-full object-cover"
            />
            {perfume.bestseller && (
              <Badge className="absolute top-6 left-6 bg-primary text-lg px-4 py-2">
                Bestseller
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <Badge variant="outline" className="w-fit mb-4">
              {perfume.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              {perfume.name}
            </h1>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(perfume.rating)
                        ? "fill-primary text-primary"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">({perfume.rating})</span>
            </div>
            <p className="text-3xl font-semibold text-primary mb-6">
              ₹{perfume.price.toLocaleString()}
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {perfume.description}
            </p>

            {/* Notes */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="font-heading font-semibold mb-4 text-lg">
                  Fragrance Notes
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-sm">Top Notes:</span>
                    <p className="text-muted-foreground">
                      {perfume.notes.top.join(", ")}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Middle Notes:</span>
                    <p className="text-muted-foreground">
                      {perfume.notes.middle.join(", ")}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Base Notes:</span>
                    <p className="text-muted-foreground">
                      {perfume.notes.base.join(", ")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Volume */}
            <div className="mb-6">
              <span className="font-medium">Volume:</span>
              <span className="text-muted-foreground ml-2">
                {perfume.volume}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={() => addToCart(perfume)}
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={cn(isWishlisted && "border-primary text-primary")}
                onClick={() => {
                  addToWishlist(perfume);
                  setIsWishlisted(!isWishlisted);
                }}
              >
                <Heart
                  className={cn("h-5 w-5", isWishlisted && "fill-current")}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-heading font-bold mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} perfume={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
