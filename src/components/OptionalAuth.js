// OptionalAuth.js
import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

function OptionalAuth({ children }) {
  let { user, signOut } = useAuthenticator((context) => [context.user]);

  const newChildren = React.cloneElement(children, {
    user: user,
    signOut: signOut
  });
  return newChildren;
}

export default OptionalAuth;
