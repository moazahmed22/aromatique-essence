import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Perfume } from "@/data/perfumes";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/contexts/wishlistContext";

interface ProductCardProps {
  perfume: Perfume;
}

export const ProductCard = ({ perfume }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { items, addToWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(items.some((item)=> item.id === perfume.id));

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-luxury">
      <Link to={`/product/${perfume.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={perfume.image}
            alt={perfume.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {perfume.bestseller && (
            <Badge className="absolute top-4 left-4 bg-primary">
              Bestseller
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background",
              isWishlisted && "text-primary"
            )}
            onClick={(e) => {
              e.preventDefault();
              addToWishlist(perfume);
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/product/${perfume.id}`}>
          <div className="mb-2">
            <Badge variant="outline" className="mb-2">
              {perfume.category}
            </Badge>
            <h3 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors">
              {perfume.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm text-muted-foreground">
                {perfume.rating}
              </span>
            </div>
          </div>
        </Link>

        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-semibold">
            ₹{perfume.price.toLocaleString()}
          </p>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => addToCart(perfume)}
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
