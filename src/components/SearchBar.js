import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search assets..."
        value={searchTerm}
        onChange={handleChange}
        className="search-input"
      />
      {searchTerm && (
        <button 
          type="button" 
          className="clear-button"
          onClick={handleClear}
        >
          ×
        </button>
      )}
      <button type="submit" className="search-button">Search</button>
    </form>
  );
};

export default SearchBar;