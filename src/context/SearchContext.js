  import React, { createContext, useContext, useState, useEffect } from 'react';
  import { env } from '../utils/env';

  const SearchContext = createContext();

  export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
      throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
  };

  export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Load all products on mount
    useEffect(() => {
      async function loadProducts() {
        try {
          const res = await fetch(`${env.api.fakeStoreUrl}/products`);
          const data = await res.json();
          setAllProducts(data);
        } catch (error) {
          console.error('Error loading products:', error);
        }
      }
      loadProducts();
    }, []);

    // Search function
    const performSearch = (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setSearchQuery('');
        return;
      }

      setIsSearching(true);
      setSearchQuery(query);

      // Filter products based on title, description, and category
      const filtered = allProducts.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filtered);
      setIsSearching(false);
    };

    // Clear search
    const clearSearch = () => {
      setSearchQuery('');
      setSearchResults([]);
    };

    const value = {
      searchQuery,
      searchResults,
      allProducts,
      isSearching,
      performSearch,
      clearSearch,
      setSearchQuery
    };

    return (
      <SearchContext.Provider value={value}>
        {children}
      </SearchContext.Provider>
    );
  };