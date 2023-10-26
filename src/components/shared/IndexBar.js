import React from "react";
import { Link } from 'react-router-dom';

function Wrapper({ children }) {
  return (
    <nav className="index-bar bar" data-testid="index-bar">
      <div className="display-content">
        {children}
      </div>
    </nav>
  )
}

function IndexBar({ user, signOut }) {
  if (user === undefined) {
    return (
      <Wrapper>
        <span><Link to="/login">Sign In</Link></span>
        <span>|</span>
        <span><Link to="/login">Sign Up</Link></span>
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <span><Link to="/c">Create</Link></span>
        <span>|</span>
        <span onClick={signOut}><Link to="#">Sign Out</Link></span>
        <span>|</span>
        <span><Link to="/u">My Account</Link></span>
      </Wrapper>
    )
  }
}

export default IndexBar;
