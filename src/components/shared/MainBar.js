import React, { useState } from "react";
import { Link } from 'react-router-dom';

function MainBar({signOut}) {
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
            onChange={(event) => { setSearch(event.target.value) }}
          ></input>
          <button onClick={(event) => { handleSearch(event) }}>Search</button>
        </form>
      </span>
      <span><Link to="/c">Create</Link></span>
      <span onClick={signOut}>Sign Out</span>
      <span><Link to="/login">Sign Up</Link></span>
      <span><Link to="/u">My Account</Link></span>
    </nav>
  );
}

export default MainBar;
