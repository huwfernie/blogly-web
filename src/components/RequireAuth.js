// RequireAuth.js
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify";

export function RequireAuth({ children }) {
  const { user } = useAuthenticator((context) => [context.user]);
  const location = useLocation();
  const { route } = useAuthenticator((context) => [context.route]);
  if (route !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
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