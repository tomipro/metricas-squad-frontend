import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

interface LoginProps {
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    setValidationErrors({});
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }

    if (!formData.password.trim()) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      onLoginSuccess?.();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div className="login-content">
          <div className="login-header">
            <h1 className="login-title">Iniciar Sesión</h1>
            <p className="login-subtitle">Accede a tu panel de métricas</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                <span className="error-icon"></span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="input-container">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${validationErrors.email ? 'error' : ''}`}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
                <span className="input-icon"></span>
              </div>
              {validationErrors.email && (
                <span className="validation-error">{validationErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="input-container">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${validationErrors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <span className="input-icon"></span>
              </div>
              {validationErrors.password && (
                <span className="validation-error">{validationErrors.password}</span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Recordar sesión
              </label>
              <button type="button" className="forgot-password">¿Olvidaste tu contraseña?</button>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="copyright">
              ©2024 Todos los derechos reservados. Metrics Squad Inc.
            </p>
            <button type="button" className="privacy-link">Política de Privacidad</button>
          </div>
        </div>
      </div>

      <div className="login-right-panel">
        <div className="right-panel-content">
        </div>
      </div>
    </div>
  );
};

export default Login;
