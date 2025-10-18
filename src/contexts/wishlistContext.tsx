import React, { createContext, useContext, useState, useEffect } from "react";
import { Perfume } from "@/data/perfumes";
import { toast } from "@/hooks/use-toast";

// TODO: Replace local storage with Supabase wishlist table in the future
// interface WishlistItem extends Perfume {
// }

interface WishlistContextType {
  items: Perfume[];
  addToWishlist: (perfume: Perfume) => void;
  removeFromWishlist: (id: number, name: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<Perfume[]>(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items]);

  const addToWishlist = (perfume: Perfume) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === perfume.id);
      if (existing) {
        return removeFromWishlist(perfume.id, perfume.name);
      } else {
        toast({
          title: "Added to wishlist",
          description: `${perfume.name} has been added to your wishlist`,
        });
        return [...prev, { ...perfume }];
      }
    });
  };

  const removeFromWishlist = (id: number, name: string) => {
    toast({
      title: "Removed from wishlist",
      description: `${name} has been removed from your wishlist`,
    });
    return items.filter((item) => item.id !== id);
  };

  const clearWishlist = () => {
    setItems([]);
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
