import React from "react";
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from './SearchBar';

function MainBar({ user, signOut }) {
  let [searchParams] = useSearchParams();
  const title = searchParams.get('title');

  if (user === undefined) {
    return (
      <nav className="main-bar bar" data-testid="main-bar">
        <div className="display-content">
          <span><Link to="/">Home</Link></span>
          <span>
            <SearchBar initialValue={title} />
          </span>
          <span>
            <span><Link to="/login">Sign In</Link></span>
            <span> | </span>
            <span><Link to="/login">Sign Up</Link></span>
          </span>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="main-bar bar" data-testid="main-bar">
        <div className="display-content">
          <span><Link to="/">Home</Link></span>
          <span>
            <SearchBar initialValue={title} />
          </span>
          <span><Link to="/c">Create</Link></span>
          <span>
            <span onClick={signOut}><Link to="#">Sign Out</Link></span>
            <span> | </span>
            <span><Link to="/u">My Account</Link></span>
          </span>
        </div>
      </nav>
    );
  }
}

export default MainBar;
