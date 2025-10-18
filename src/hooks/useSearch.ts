import { useState, useEffect, useCallback } from "react";
import { perfumes, Perfume } from "@/data/perfumes";
import { searchPerfumes } from "@/lib/search.util";

export const useSearch = (debounceMs: number = 300) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Perfume[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      // TODO: Replace with Supabase query
      const searchResults = searchPerfumes(perfumes, debouncedQuery);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setResults([]);
    setIsOpen(false);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    query,
    results,
    isOpen,
    handleQueryChange,
    clearSearch,
    closeDropdown,
  };
};
