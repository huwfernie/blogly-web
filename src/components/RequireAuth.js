// RequireAuth.js
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';


export function RequireAuth({ children }) {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const location = useLocation();
  const { route } = useAuthenticator((context) => [context.route]);
  if (route !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const newChildren = React.cloneElement(children, {
    user: user,
    signOut: signOut
  });
  return newChildren;
}