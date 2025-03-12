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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="query"
        placeholder="Search for a movie..."
        style={{ padding: '5px', width: '200px' }}
      />
      <button type="submit" style={{ padding: '5px 10px' }}>
        Search
      </button>
    </form>
  );
}

export default SearchBar;