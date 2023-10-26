// components/Login.js
import React, { useEffect } from "react";

import { Authenticator, useAuthenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { useNavigate, useLocation } from 'react-router';

function Login() {
  const { route } = useAuthenticator((context) => [context.route]);
  const location = useLocation();
  const navigate = useNavigate();
  let from = location.state?.from?.pathname || '/';
  useEffect(() => {
    if (route === 'authenticated') {
      navigate(from, { replace: true });
    }
  }, [route, navigate, from]);

  return (
    <View className="auth-wrapper" data-testid="auth-wrapper">
      <Authenticator></Authenticator>
    </View>
  );
}

export default Login;