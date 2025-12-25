import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Avatar,
  Alert,
  LinearProgress,
  Fade,
  Slide,
  Zoom,
  IconButton,
  Chip,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle,
  ArrowBack,
  Language,
  Security,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Rocket,
  AutoAwesome,
  Shield
} from '@mui/icons-material';
import { createAdminAccount } from '../utils/simpleAuth';

const AdminSetup = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState(0);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  // Auto-progress through initial steps
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep === 0) {
        setProgress(33);
        setCurrentStep(1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(i18n.language === 'am' ? 'የይለፍ ቃሎች አይመሳሰሉም' : 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(i18n.language === 'am' ? 'የይለፍ ቃል ቢያንስ 6 ቁምፊ መሆን አለበት' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(66);

    const result = createAdminAccount(email, password);
    
    if (result.success) {
      setSuccess(i18n.language === 'am' ? 'አስተዳዳሪ መለያ በተሳካ ሁኔታ ተፈጥሯል!' : 'Admin account created successfully!');
      setProgress(100);
      setCurrentStep(2);
      
      setTimeout(() => {
        navigate('/admin/signin');
      }, 3000);
    } else {
      setError(result.error || 'Failed to create admin account');
      setProgress(33);
    }
    
    setLoading(false);
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 0: return <Shield sx={{ fontSize: 28 }} />;
      case 1: return <Security sx={{ fontSize: 28 }} />;
      case 2: return <Rocket sx={{ fontSize: 28 }} />;
      default: return <CheckCircle sx={{ fontSize: 28 }} />;
    }
  };

  const getStepTitle = (step: number) => {
    const titles = [
      i18n.language === 'am' ? 'ስርዓት ዝግጅት' : 'System Initialization',
      i18n.language === 'am' ? 'አስተዳዳሪ መፍጠር' : 'Create Administrator',
      i18n.language === 'am' ? 'ዝግጅት ተጠናቅቋል' : 'Setup Complete'
    ];
    return titles[step] || '';
  };

  const getStepDescription = (step: number) => {
    const descriptions = [
      i18n.language === 'am' ? 'የመተግበሪያ አካባቢ በመዘጋጀት ላይ...' : 'Preparing application environment...',
      i18n.language === 'am' ? 'የመጀመሪያ አስተዳዳሪ መለያ ይፍጠሩ' : 'Create your first administrator account',
      i18n.language === 'am' ? 'እንኳን ደስ አለዎት! ሁሉም ነገር ዝግጁ ነው' : 'Congratulations! Everything is ready'
    ];
    return descriptions[step] || '';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        animation: 'float 6s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }} />
      
      <Box sx={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        animation: 'float 8s ease-in-out infinite reverse',
      }} />

      <Box sx={{ width: '100%', maxWidth: 500, zIndex: 1 }}>
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{ 
                position: 'absolute',
                top: 20,
                left: 20,
                color: 'rgba(255,255,255,0.8)',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                '&:hover': { 
                  color: 'white',
                  background: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ArrowBack />
            </IconButton>

            <Zoom in timeout={1000}>
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 3,
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
                border: '3px solid rgba(255,255,255,0.2)'
              }}>
                <img src="/logo.png" alt="Logo" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
              </Avatar>
            </Zoom>
            
            <Slide direction="down" in timeout={1200}>
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                color: 'white', 
                mb: 1,
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {i18n.language === 'am' ? 'አስተዳዳሪ ማዋቀር' : 'Admin Setup'}
              </Typography>
            </Slide>
            
            <Slide direction="up" in timeout={1400}>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '1.1rem',
                fontWeight: 300
              }}>
                {i18n.language === 'am' 
                  ? 'የመጀመሪያ አስተዳዳሪ መለያ ይፍጠሩ'
                  : 'Create your first administrator account'
                }
              </Typography>
            </Slide>

            <Box sx={{ mt: 3 }}>
              <Button
                startIcon={<Language />}
                onClick={toggleLanguage}
                sx={{ 
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {i18n.language === 'en' ? 'አማርኛ' : 'English'}
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Progress Bar */}
        <Fade in timeout={1600}>
          <Box sx={{ mb: 4 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 8,
                borderRadius: 4,
                background: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderRadius: 4,
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)'
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              {[0, 1, 2].map((step) => (
                <Chip
                  key={step}
                  icon={getStepIcon(step)}
                  label={step + 1}
                  size="small"
                  sx={{
                    background: currentStep >= step 
                      ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                      : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontWeight: 600,
                    border: currentStep === step ? '2px solid rgba(255,255,255,0.5)' : 'none',
                    transform: currentStep === step ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Box>
          </Box>
        </Fade>

        {/* Main Card */}
        <Zoom in timeout={1800}>
          <Card sx={{ 
            p: 4,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Card Background Effect */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #8B5CF6, #10B981, #F59E0B, #EF4444)',
              animation: 'shimmer 3s ease-in-out infinite',
              '@keyframes shimmer': {
                '0%, 100%': { opacity: 0.5 },
                '50%': { opacity: 1 }
              }
            }} />

            {/* Step Content */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Zoom in={currentStep >= 0} timeout={500}>
                <Avatar sx={{
                  background: currentStep >= 1 
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)'
                }}>
                  {getStepIcon(currentStep)}
                </Avatar>
              </Zoom>

              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                color: 'white', 
                mb: 1 
              }}>
                {getStepTitle(currentStep)}
              </Typography>
              
              <Typography variant="body2" sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1rem'
              }}>
                {getStepDescription(currentStep)}
              </Typography>
            </Box>

            {/* Step 0: Initialization */}
            {currentStep === 0 && (
              <Fade in timeout={500}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AutoAwesome sx={{ 
                    fontSize: 60, 
                    color: '#8B5CF6', 
                    mb: 2,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.1)' }
                    }
                  }} />
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {i18n.language === 'am' ? 'እባክዎ ይጠብቁ...' : 'Please wait...'}
                  </Typography>
                </Box>
              </Fade>
            )}

            {/* Step 1: Create Admin Form */}
            {currentStep === 1 && (
              <Slide direction="left" in timeout={500}>
                <form onSubmit={handleCreateAdmin}>
                  {error && (
                    <Fade in>
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mb: 3, 
                          background: 'rgba(244, 67, 54, 0.1)',
                          border: '1px solid rgba(244, 67, 54, 0.3)',
                          borderRadius: 2
                        }}
                      >
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  <TextField
                    fullWidth
                    label={i18n.language === 'am' ? 'አስተዳዳሪ ኢሜይል' : 'Admin Email'}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <Email sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiInputLabel-root': { 
                        color: 'rgba(255,255,255,0.7)',
                        fontWeight: 500
                      },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 2,
                        '& fieldset': { 
                          borderColor: 'rgba(255,255,255,0.3)',
                          borderWidth: 2
                        },
                        '&:hover fieldset': { 
                          borderColor: 'rgba(255,255,255,0.5)',
                          borderWidth: 2
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: '#8B5CF6',
                          borderWidth: 2,
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
                        }
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label={i18n.language === 'am' ? 'የይለፍ ቃል' : 'Password'}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <Lock sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />,
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      )
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiInputLabel-root': { 
                        color: 'rgba(255,255,255,0.7)',
                        fontWeight: 500
                      },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 2,
                        '& fieldset': { 
                          borderColor: 'rgba(255,255,255,0.3)',
                          borderWidth: 2
                        },
                        '&:hover fieldset': { 
                          borderColor: 'rgba(255,255,255,0.5)',
                          borderWidth: 2
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: '#8B5CF6',
                          borderWidth: 2,
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
                        }
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label={i18n.language === 'am' ? 'የይለፍ ቃል ያረጋግጡ' : 'Confirm Password'}
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <Lock sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />,
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          sx={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      )
                    }}
                    sx={{ 
                      mb: 4,
                      '& .MuiInputLabel-root': { 
                        color: 'rgba(255,255,255,0.7)',
                        fontWeight: 500
                      },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 2,
                        '& fieldset': { 
                          borderColor: 'rgba(255,255,255,0.3)',
                          borderWidth: 2
                        },
                        '&:hover fieldset': { 
                          borderColor: 'rgba(255,255,255,0.5)',
                          borderWidth: 2
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: '#8B5CF6',
                          borderWidth: 2,
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
                        }
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? null : <Security />}
                    sx={{ 
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                      borderRadius: 3,
                      py: 2,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 35px rgba(139, 92, 246, 0.5)'
                      },
                      '&:disabled': {
                        background: 'rgba(139, 92, 246, 0.5)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading 
                      ? (i18n.language === 'am' ? 'በመፍጠር ላይ...' : 'Creating...')
                      : (i18n.language === 'am' ? 'አስተዳዳሪ ይፍጠሩ' : 'Create Administrator')
                    }
                  </Button>
                </form>
              </Slide>
            )}

            {/* Step 2: Success */}
            {currentStep === 2 && (
              <Zoom in timeout={500}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  {success && (
                    <Fade in>
                      <Alert 
                        severity="success" 
                        sx={{ 
                          mb: 3, 
                          background: 'rgba(76, 175, 80, 0.1)',
                          border: '1px solid rgba(76, 175, 80, 0.3)',
                          borderRadius: 2
                        }}
                      >
                        {success}
                      </Alert>
                    </Fade>
                  )}
                  
                  <CheckCircle sx={{ 
                    fontSize: 80, 
                    color: '#10B981', 
                    mb: 2,
                    animation: 'bounce 2s ease-in-out infinite',
                    '@keyframes bounce': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-10px)' }
                    }
                  }} />
                  
                  <Typography variant="h5" sx={{ 
                    color: 'white', 
                    mb: 2,
                    fontWeight: 700
                  }}>
                    {i18n.language === 'am' ? 'ማዋቀር ተጠናቅቋል!' : 'Setup Complete!'}
                  </Typography>
                  
                  <Typography sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '1.1rem'
                  }}>
                    {i18n.language === 'am' 
                      ? 'ወደ መግቢያ ገጽ በቅርቡ ይዛወራሉ...'
                      : 'Redirecting to sign in page...'
                    }
                  </Typography>
                </Box>
              </Zoom>
            )}
          </Card>
        </Zoom>

        {/* Footer */}
        <Fade in timeout={2000}>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.9rem',
              fontWeight: 300
            }}>
              {i18n.language === 'am' 
                ? 'ለሚ ኩራ ክፍለ ከተማ ሰላምና ፀጥታ አስተዳደር ጽ/ቤት'
                : 'Lemi Kura Sub-City Peace and Security Office'
              }
            </Typography>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default AdminSetup;