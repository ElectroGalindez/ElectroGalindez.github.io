// src/components/SearchBar.jsx
import React, { useState, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import '../styles/SearchBar.css';

function SearchBar({ onSearch, placeholder = "Buscar en ElectroGalíndez..." }) {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    if (onSearch) onSearch('');
    inputRef.current?.focus();
  };

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => {
    if (!query) setIsActive(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && query) {
      clearSearch();
    }
  };

  return (
    <div 
      className={`search-bar ${isActive ? 'active' : ''}`} 
      role="search"
      aria-label="Barra de búsqueda"
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
    </div>
  );
}

export default SearchBar;