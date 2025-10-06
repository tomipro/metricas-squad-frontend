import React, { useState } from 'react';
import { Login, ForgotPassword } from './index';

type AuthView = 'login' | 'forgot-password';

const AuthContainer: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  const handleForgotPassword = () => {
    setCurrentView('forgot-password');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    // This will be handled by the routing system
    // The user will be redirected to dashboard
  };

  return (
    <>
      {currentView === 'login' && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onForgotPassword={handleForgotPassword}
        />
      )}
      {currentView === 'forgot-password' && (
        <ForgotPassword 
          onBackToLogin={handleBackToLogin}
        />
      )}
    </>
  );
};

export default AuthContainer;
