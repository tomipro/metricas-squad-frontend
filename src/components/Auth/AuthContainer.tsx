import React from 'react';
import { Login } from './index';

const AuthContainer: React.FC = () => {
  const handleLoginSuccess = () => {
    // This will be handled by the routing system
    // The user will be redirected to dashboard
  };

  return (
    <Login 
      onLoginSuccess={handleLoginSuccess}
    />
  );
};

export default AuthContainer;
