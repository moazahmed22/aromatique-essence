import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  onClose?: () => void;
}

export const SearchBar = ({ className, onClose }: SearchBarProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { query, results, isOpen, handleQueryChange, clearSearch, closeDropdown } = useSearch();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/shop?query=${encodeURIComponent(query)}`);
      clearSearch();
      onClose?.();
    } else if (e.key === "Escape") {
      closeDropdown();
    }
  };

  const handleResultClick = (id: number) => {
    navigate(`/product/${id}`);
    clearSearch();
    onClose?.();
  };

  const handleSeeAllResults = () => {
    navigate(`/shop?query=${encodeURIComponent(query)}`);
    clearSearch();
    onClose?.();
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search perfumes..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9"
          aria-label="Search perfumes"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-autocomplete="list"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          id="search-results"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto"
        >
          {results.length > 0 ? (
            <>
              <div className="py-2">
                {results.map((perfume) => (
                  <button
                    key={perfume.id}
                    role="option"
                    aria-selected="false"
                    onClick={() => handleResultClick(perfume.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
                  >
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {perfume.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {perfume.category_slug}
                      </p>
                    </div>
                    <p className="font-semibold text-sm text-primary">
                      ₹{perfume.price}
                    </p>
                  </button>
                ))}
              </div>
              <div className="border-t border-border px-4 py-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSeeAllResults}
                >
                  See all results for "{query}"
                </Button>
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <p>No perfumes found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
