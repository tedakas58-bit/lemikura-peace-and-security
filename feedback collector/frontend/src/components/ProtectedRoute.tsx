import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { isAdminLoggedIn } from '../utils/simpleAuth';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAdminLoggedIn();
      setIsAuthenticated(authenticated);
      setLoading(false);
      
      if (!authenticated) {
        navigate('/admin/signin');
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'white' }}>
          {i18n.language === 'am' ? 'በመጫን ላይ...' : 'Loading...'}
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;