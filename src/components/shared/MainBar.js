import React, { useState } from "react";
import { Link } from 'react-router-dom';

function MainBar() {
  const [search, setSearch] = useState('');

  function handleSearch(event) {
    event.preventDefault();
    console.log(search);
  }


  return (
    <nav className="main-bar bar" data-testid="main-bar">
      <span><Link to="/">Home</Link></span>
      <span>
        <form>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(ev) => { setSearch(ev.target.value) }}
          ></input>
          <button onClick={(event) => { handleSearch(event) }}>Search</button>
        </form>
      </span>
      <span><Link to="/c">Create</Link></span>
      <span>Sign Out</span>
      <span>Sign Up</span>
      <span><Link to="/u">My Account</Link></span>
    </nav>
  );
}

export default MainBar;
