// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import '../styles/SearchBar.css';

function SearchBar({ onSearch, placeholder = "Buscar en ElectroGalíndez..." }) {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    setIsActive(false);
    if (onSearch) onSearch('');
  };

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => {
    if (!query) setIsActive(false);
  };

  return (
    <div className={`search-bar ${isActive ? 'active' : ''}`}>
      <FaSearch className="search-icon" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        aria-label="Buscar productos"
      />
      {query && (
        <button
          className="clear-button"
          onClick={clearSearch}
          aria-label="Limpiar búsqueda"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
}

export default SearchBar;