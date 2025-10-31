import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px',
        background: 'linear-gradient(135deg, #f8f9fc 0%, #eef2f7 30%, #e8eef5 70%, #f1f4f8 100%)',
        color: '#507BD8',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(80, 123, 216, 0.3)',
          borderTop: '4px solid #507BD8',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
          Verificando autenticación...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  if (user?.role?.toLowerCase() !== 'admin') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px',
        background: 'linear-gradient(135deg, #f8f9fc 0%, #eef2f7 30%, #e8eef5 70%, #f1f4f8 100%)',
        color: '#507BD8',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '8px'
        }}>
          🔒
        </div>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#2c3e50' }}>
          Acceso Denegado
        </h2>
        <p style={{ margin: '8px 0 24px', fontSize: '16px', fontWeight: '400', color: '#64748b', maxWidth: '400px' }}>
          Esta plataforma solo está disponible para usuarios con rol de administrador.
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            color: '#fff',
            background: '#507BD8',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#4169c4'}
          onMouseOut={(e) => e.currentTarget.style.background = '#507BD8'}
        >
          Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
