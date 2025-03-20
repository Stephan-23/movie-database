import React from 'react';

function SearchBar({ onSearch }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const query = event.target.elements.query.value;
    if (query) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        name="query"
        placeholder="Search for a movie..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;