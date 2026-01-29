import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/footer';
import { useSearch } from '../context/SearchContext';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { searchResults, performSearch, isSearching } = useSearch();

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  return (
    <div>
      <Navbar />
      
      <div className="search-results-container">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb-nav">
            <Link to="/">Home</Link>
            <span>&gt;</span>
            <span className="breadcrumb-active">Search Results</span>
          </div>

          {/* Search Header */}
          <div className="search-header">
            <h2>Search Results</h2>
            {query && (
              <p className="search-query">
                Showing results for: <strong>"{query}"</strong>
              </p>
            )}
            <p className="search-count">
              {isSearching ? 'Searching...' : `${searchResults.length} products found`}
            </p>
          </div>

          {/* Search Results */}
          {isSearching ? (
            <div className="search-loading">
              <p>Searching products...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="search-results-grid">
              <div className="row">
                {searchResults.map((product) => (
                  <div key={product.id} className="col-6 col-md-4 col-lg-3">
                    <ProductCard 
                      image={product.image} 
                      name={product.title} 
                      id={product.id} 
                      price={product.price} 
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : query ? (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try searching with different keywords or browse our categories.</p>
              <Link to="/" className="btn btn-primary">
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="no-query">
              <h3>Enter a search term</h3>
              <p>Use the search bar above to find products.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SearchResults;