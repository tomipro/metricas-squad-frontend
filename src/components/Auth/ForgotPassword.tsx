import React, { useState } from 'react';
import { forgotPassword } from '../../services/authService';
import './ForgotPassword.css';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }

    if (!validateEmail(email)) {
      setError('El email no es válido');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el email. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-left-panel">
          <div className="forgot-password-content">
            <div className="forgot-password-header">
              <h1 className="forgot-password-title">Email Enviado</h1>
              <p className="forgot-password-subtitle">
                Hemos enviado un enlace de recuperación a tu email
              </p>
            </div>

            <div className="success-message">
              <div className="success-icon"></div>
              <h3>Revisa tu bandeja de entrada</h3>
              <p>
                Hemos enviado un enlace de recuperación de contraseña a <strong>{email}</strong>
              </p>
              <p className="success-note">
                Si no ves el email, revisa tu carpeta de spam o correo no deseado.
              </p>
            </div>

            <div className="forgot-password-actions">
              <button
                type="button"
                className="back-button"
                onClick={onBackToLogin}
              >
                Volver al Login
              </button>
              <button
                type="button"
                className="resend-button"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
              >
                Enviar otro email
              </button>
            </div>
          </div>
        </div>

        <div className="forgot-password-right-panel">
          <div className="right-panel-content">
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-left-panel">
        <div className="forgot-password-content">
          <div className="forgot-password-header">
            <h1 className="forgot-password-title">Recuperar Contraseña</h1>
            <p className="forgot-password-subtitle">
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit} className="forgot-password-form">
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
                  value={email}
                  onChange={handleInputChange}
                  className={`form-input ${error ? 'error' : ''}`}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
                <span className="input-icon"></span>
              </div>
            </div>

            <button
              type="submit"
              className="forgot-password-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Enviando...
                </>
              ) : (
                'Enviar Enlace de Recuperación'
              )}
            </button>
          </form>

          <div className="forgot-password-footer">
            <button
              type="button"
              className="back-to-login"
              onClick={onBackToLogin}
            >
              ← Volver al Login
            </button>
          </div>
        </div>
      </div>

      <div className="forgot-password-right-panel">
        <div className="right-panel-content">
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
