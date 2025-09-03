// src/components/SearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes, FaBoxOpen, FaTags } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import '../styles/SearchBar.css';

function SearchBar({ placeholder = "Buscar en ElectroGalíndez..." }) {
  const { products, categories } = useStore();
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [filteredResults, setFilteredResults] = useState({ products: [], categories: [] });
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const handleSearch = (value) => {
    const term = value.trim().toLowerCase();
    if (!term) {
      setFilteredResults({ products: [], categories: [] });
      return;
    }

    const filteredProducts = products
      .filter(p => p.name?.toLowerCase().includes(term))
      .slice(0, 5);

    const filteredCategories = categories
      .filter(c => c.name?.toLowerCase().includes(term))
      .slice(0, 3);

    setFilteredResults({ products: filteredProducts, categories: filteredCategories });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
    setHighlightedIndex(-1);
  };

  const clearSearch = () => {
    setQuery('');
    setFilteredResults({ products: [], categories: [] });
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsActive(true);
    if (query) handleSearch(query);
  };

  const handleBlur = (e) => {
    if (!resultsRef.current?.contains(e.relatedTarget)) {
      setIsActive(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (query) {
        clearSearch();
      } else {
        setIsActive(false);
        inputRef.current?.blur();
      }
      return;
    }

    const totalResults = filteredResults.products.length + filteredResults.categories.length;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < totalResults - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      // Simular clic en el elemento resaltado
      const allItems = [
        ...filteredResults.categories.map(c => ({ type: 'category', item: c })),
        ...filteredResults.products.map(p => ({ type: 'product', item: p }))
      ];
      const selectedItem = allItems[highlightedIndex];
      if (selectedItem) {
        // Enfocar el enlace y hacer clic
        setTimeout(() => {
          const link = document.querySelector(`[data-key="${selectedItem.type}-${selectedItem.item._id}"]`);
          if (link) link.click();
        }, 0);
      }
    }
  };

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-bar')) {
        setIsActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasResults = filteredResults.products.length > 0 || filteredResults.categories.length > 0;

  return (
    <div 
      className={`search-bar ${isActive ? 'active' : ''}`} 
      role="search"
      aria-label="Barra de búsqueda"
      ref={resultsRef}
    >
      <FaSearch className="search-icon" aria-hidden="true" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Buscar productos"
        autoComplete="off"
        spellCheck="false"
        aria-autocomplete="list"
        aria-controls={isActive && hasResults ? "search-results" : undefined}
        aria-expanded={isActive && hasResults}
      />

      {query && (
        <button
          className="clear-button"
          onClick={clearSearch}
          aria-label="Limpiar campo de búsqueda"
          tabIndex="0"
        >
          <FaTimes aria-hidden="true" />
        </button>
      )}

      {/* Resultados */}
      {isActive && hasResults && (
        <ul 
          id="search-results" 
          className="search-results"
          role="listbox"
          aria-label="Resultados de búsqueda"
        >
          {filteredResults.categories.length > 0 && (
            <>
              <li className="search-results-header">
                <FaTags /> Categorías
              </li>
              {filteredResults.categories.map((category, index) => {
                const currentIndex = index;
                return (
                  <li
                    key={`category-${category._id}`}
                    role="option"
                    aria-selected={highlightedIndex === currentIndex}
                    className={`search-result-item ${highlightedIndex === currentIndex ? 'highlighted' : ''}`}
                  >
                    <Link
                      to="/products"
                      onClick={() => {
                        setIsActive(false);
                        setQuery(category.name);
                        setFilteredResults({ products: [], categories: [] });
                      }}
                      data-key={`category-${category._id}`}
                    >
                      <FaTags /> {category.name}
                    </Link>
                  </li>
                );
              })}
            </>
          )}

          {filteredResults.products.length > 0 && (
            <>
              <li className="search-results-header">
                <FaBoxOpen /> Productos
              </li>
              {filteredResults.products.map((product, index) => {
                const currentIndex = filteredResults.categories.length + index;
                return (
                  <li
                    key={`product-${product._id}`}
                    role="option"
                    aria-selected={highlightedIndex === currentIndex}
                    className={`search-result-item ${highlightedIndex === currentIndex ? 'highlighted' : ''}`}
                  >
                    <Link
                      to={`/products/${product._id}`}
                      onClick={() => setIsActive(false)}
                      data-key={`product-${product._id}`}
                    >
                      <img
                        src={product.images?.[0] || '/placeholders/product-thumb.png'}
                        alt=""
                        className="search-result-img"
                        loading="lazy"
                        onError={(e) => { e.target.src = '/placeholders/fallback-thumb.png'; }}
                      />
                      <span>{product.name}</span>
                    </Link>
                  </li>
                );
              })}
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;