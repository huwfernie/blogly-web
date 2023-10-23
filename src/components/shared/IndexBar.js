import React from "react";
import { Link } from 'react-router-dom';

function IndexBar({ user, signOut }) {
  if (user === undefined) {
    return (
      <nav className="index-bar bar">
        <span><Link to="/login">Sign In</Link></span>
        <span>|</span>
        <span><Link to="/login">Sign Up</Link></span>
      </nav>
    )
  } else {
    return (
      <nav className="index-bar bar">
        <span><Link to="/c">Create</Link></span>
        <span>|</span>
        <span onClick={signOut}><Link to="#">Sign Out</Link></span>
        <span>|</span>
        <span><Link to="/u">My Account</Link></span>
      </nav>
    )
  }
}

export default IndexBar;
