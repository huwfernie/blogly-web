// BypassAuth.js
import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify";

export function BypassAuth({ children }) {
  const { user } = useAuthenticator((context) => [context.user]);
  const newChildren = React.cloneElement(children, {
    user: user,
    signOut: handleSignOut
  });

  function handleSignOut() {
    Auth.signOut().then(() => {
      return null;
    });
  }

  return newChildren;
}
