// BypassAuth.js
import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';


export function BypassAuth({ children }) {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const newChildren = React.cloneElement(children, {
    user: user,
    signOut: signOut
  });
  return newChildren;
}