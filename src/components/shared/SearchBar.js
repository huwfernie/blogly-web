import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function SearchBar({ placeholder = "Search", initialValue = "" }) {
  initialValue = initialValue !== null ? initialValue : "";
  const [searchterm, setSearchterm] = useState(initialValue);
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();
    navigate(`/search?title=${searchterm}`);
  }

  return (
    <form>
      <input
        type="text"
        placeholder={placeholder}
        value={searchterm}
        onChange={(event) => { setSearchterm(event.target.value) }}
        data-testid="search-input"
      ></input>
      <button onClick={handleSearch}>Search</button>
    </form>
  );
}

export default SearchBar;
