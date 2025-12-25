import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  AdminPanelSettings,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowBack,
  Language
} from '@mui/icons-material';
import { signInAdmin } from '../utils/simpleAuth';

const AdminSignIn = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = signInAdmin(email, password);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Successfully signed in, redirect to admin dashboard
      navigate('/admin');
    } catch (error: any) {
      setError(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError(i18n.language === 'am' ? 'እባክዎ ኢሜይልዎን ያስገቡ' : 'Please enter your email first');
      return;
    }

    // For simple auth, we can't reset passwords
    setError('');
    alert(i18n.language === 'am' 
      ? 'የይለፍ ቃል ዳግም ማስተካከያ በዚህ ስሪት አይደገፍም። እባክዎ አስተዳዳሪውን ያነጋግሩ።'
      : 'Password reset is not supported in this version. Please contact the administrator.'
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }
    }}>
      <Box sx={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 10 }}>
        {/* Modern Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              px: 3,
              py: 1,
              mb: 4,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { 
                color: 'white',
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {i18n.language === 'am' ? '🏠 ወደ ዋናው ገጽ ተመለስ' : '🏠 Back to Home'}
          </Button>

          {/* Animated Logo */}
          <Box sx={{ 
            position: 'relative',
            display: 'inline-block',
            mb: 4,
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -6,
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
              borderRadius: '50%',
              opacity: 0.8,
              animation: 'rotate 3s linear infinite'
            },
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }}>
            <Avatar sx={{ 
              width: 100,
              height: 100,
              background: 'rgba(255, 255, 255, 0.95)',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              <img src="/logo.png" alt="Logo" style={{ width: '75px', height: '75px', objectFit: 'contain' }} />
            </Avatar>
          </Box>
          
          <Typography variant="h3" sx={{ 
            fontWeight: 800, 
            color: 'white',
            background: 'linear-gradient(45deg, #fff, #e3f2fd)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}>
            {i18n.language === 'am' ? '🔐 አስተዳዳሪ መግቢያ' : '🔐 Administrator Sign In'}
          </Typography>
          
          <Typography variant="h6" sx={{ 
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 500,
            mb: 3
          }}>
            {i18n.language === 'am' 
              ? 'የአስተዳደር ዳሽቦርድ ለመድረስ ይግቡ'
              : 'Sign in to access the admin dashboard'
            }
          </Typography>

          <Button
            startIcon={<Language />}
            onClick={toggleLanguage}
            sx={{ 
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {i18n.language === 'en' ? '🇪🇹 አማርኛ' : '🇺🇸 English'}
          </Button>
        </Box>

        {/* Modern Sign In Form */}
        <Card sx={{ 
          p: 5,
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #4ade80, #22d3ee, #a855f7, #f59e0b)'
          }
        }}>
          <form onSubmit={handleSignIn}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 4,
                  background: 'rgba(239, 68, 68, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 3,
                  color: '#ff6b6b',
                  '& .MuiAlert-icon': { color: '#ff6b6b' }
                }}
              >
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label={i18n.language === 'am' ? '📧 ኢሜይል አድራሻ' : '📧 Email Address'}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ 
                mb: 4,
                '& .MuiInputLabel-root': { 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500
                },
                '& .MuiOutlinedInput-root': { 
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#4ade80',
                    borderWidth: 2
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={i18n.language === 'am' ? '🔒 የይለፍ ቃል' : '🔒 Password'}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ 
                mb: 4,
                '& .MuiInputLabel-root': { 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500
                },
                '& .MuiOutlinedInput-root': { 
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#4ade80',
                    borderWidth: 2
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ 
                        color: 'rgba(255,255,255,0.7)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                borderRadius: 3,
                py: 2,
                fontWeight: 700,
                fontSize: '1.2rem',
                mb: 3,
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(74, 222, 128, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(74, 222, 128, 0.6)'
                },
                '&:disabled': {
                  background: 'rgba(107, 114, 128, 0.5)',
                  color: 'rgba(255,255,255,0.5)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading 
                ? (i18n.language === 'am' ? '⏳ በመግባት ላይ...' : '⏳ Signing In...')
                : (i18n.language === 'am' ? '🚀 ግባ' : '🚀 Sign In')
              }
            </Button>

            <Divider sx={{ 
              my: 3, 
              borderColor: 'rgba(255,255,255,0.2)',
              '&::before, &::after': {
                borderColor: 'rgba(255,255,255,0.2)'
              }
            }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleForgotPassword}
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {i18n.language === 'am' ? '🔑 የይለፍ ቃልዎን ረሱት?' : '🔑 Forgot Password?'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/admin/setup')}
                sx={{ 
                  color: '#a855f7',
                  borderColor: 'rgba(168, 85, 247, 0.5)',
                  background: 'rgba(168, 85, 247, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { 
                    color: '#8b5cf6',
                    borderColor: '#a855f7',
                    background: 'rgba(168, 85, 247, 0.1)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {i18n.language === 'am' ? '⚙️ የመጀመሪያ አስተዳዳሪ ይፍጠሩ' : '⚙️ First Time Setup'}
              </Button>
            </Box>
          </form>
        </Card>

        {/* Modern Footer */}
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography variant="body1" sx={{ 
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 500,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            p: 2
          }}>
            {i18n.language === 'am' 
              ? '🏛️ ለሚ ኩራ ክፍለ ከተማ ሰላምና ፀጥታ አስተዳደር ጽ/ቤት'
              : '🏛️ Lemi Kura Sub-City Peace and Security Office'
            }
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminSignIn;