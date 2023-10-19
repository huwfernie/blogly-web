// OptionalAuth.js
import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify";

function OptionalAuth({ children }) {
  // let { user, signOut } = useAuthenticator((context) => [context.user]);
  let { user } = useAuthenticator((context) => [context.user]);

  const newChildren = React.cloneElement(children, {
    user: user,
    signOut: handleSignOut
  });
  return newChildren;

  function handleSignOut() {
    Auth.signOut().then(() => {
      return null;
    });
  }
}

export default OptionalAuth;
