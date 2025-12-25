import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  Avatar,
  Fade,
  Slide,
  Zoom,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { hasAdminAccount } from '../utils/simpleAuth';
import { 
  Person, 
  AdminPanelSettings,
  Language,
  Assignment,
  BarChart,
  AutoAwesome,
  TrendingUp
} from '@mui/icons-material';

const RoleSelection = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  const handleAdminClick = () => {
    if (hasAdminAccount()) {
      navigate('/admin/signin');
    } else {
      navigate('/admin/setup');
    }
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
        top: '15%',
        left: '10%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        animation: 'float 6s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' }
        }
      }} />
      
      <Box sx={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        animation: 'float 8s ease-in-out infinite reverse',
      }} />

      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'rgba(16, 185, 129, 0.2)',
        animation: 'pulse 4s ease-in-out infinite',
        '@keyframes pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.7 },
          '50%': { transform: 'scale(1.2)', opacity: 1 }
        }
      }} />
      <Box sx={{ width: '100%', maxWidth: 800, zIndex: 1 }}>
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Zoom in timeout={1000}>
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 3,
                boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
                border: '3px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1) rotate(5deg)',
                  boxShadow: '0 25px 50px rgba(16, 185, 129, 0.4)'
                }
              }}>
                <img src="/logo.png" alt="Logo" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
              </Avatar>
            </Zoom>
            
            <Slide direction="down" in timeout={1200}>
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                color: 'white', 
                mb: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {i18n.language === 'am' ? 'የደንበኛ እርካታ ስርዓት' : 'Customer Satisfaction System'}
              </Typography>
            </Slide>
            
            <Slide direction="up" in timeout={1400}>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 3,
                fontWeight: 300
              }}>
                {i18n.language === 'am' ? 'ለሚ ኩራ ክፍለ ከተማ ሰላምና ፀጥታ አስተዳደር ጽ/ቤት' : 'Lemi Kura Sub-City Peace and Security Office'}
              </Typography>
            </Slide>

            <Fade in timeout={1600}>
              <Button
                startIcon={<Language />}
                onClick={toggleLanguage}
                sx={{ 
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  mb: 4,
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
            </Fade>

            <Fade in timeout={1800}>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                maxWidth: 600, 
                mx: 'auto',
                fontSize: '1.1rem',
                fontWeight: 300
              }}>
                {i18n.language === 'am' 
                  ? 'እባክዎ የእርስዎን ሚና ይምረጡ። ደንበኛ ከሆኑ ግምገማውን ለመሙላት፣ አስተዳዳሪ ከሆኑ ደግሞ ሪፖርቶችን ለማየት።'
                  : 'Please select your role. Choose Customer to fill out the survey, or Admin to view reports and manage questions.'
                }
              </Typography>
            </Fade>
          </Box>
        </Fade>

        {/* Role Cards */}
        <Slide direction="up" in timeout={2000}>
          <Grid container spacing={4} justifyContent="center">
            {/* Customer Role */}
            <Grid item xs={12} md={6}>
              <Zoom in timeout={2200}>
                <Card sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 4,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: '0 25px 50px rgba(16, 185, 129, 0.3)',
                    border: '1px solid rgba(16, 185, 129, 0.5)',
                    '& .card-glow': {
                      opacity: 1
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #10B981, #059669)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover::before': {
                    opacity: 1
                  }
                }}
                onClick={() => navigate('/customer')}
                >
                  {/* Glow effect */}
                  <Box className="card-glow" sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }} />
                  
                  <Avatar sx={{ 
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    width: 90,
                    height: 90,
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 15px 35px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)'
                    }
                  }}>
                    <Person sx={{ fontSize: 45 }} />
                  </Avatar>
                  
                  <Typography variant="h4" sx={{ 
                    fontWeight: 800, 
                    color: 'white', 
                    mb: 2,
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}>
                    {i18n.language === 'am' ? 'ደንበኛ' : 'Customer'}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    mb: 3,
                    fontSize: '1.1rem',
                    fontWeight: 300
                  }}>
                    {i18n.language === 'am' 
                      ? 'የአገልግሎት ጥራት ግምገማ ይሙሉ'
                      : 'Fill out the service quality survey'
                    }
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      background: 'rgba(16, 185, 129, 0.1)',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      <Assignment sx={{ color: '#10B981', fontSize: 20 }} />
                      <Typography variant="caption" sx={{ 
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 500
                      }}>
                        {i18n.language === 'am' ? '15 ጥያቄዎች' : '15 Questions'}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AutoAwesome />}
                    sx={{ 
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      borderRadius: 3,
                      py: 2,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 35px rgba(16, 185, 129, 0.5)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {i18n.language === 'am' ? 'ግምገማ ይጀምሩ' : 'Start Survey'}
                  </Button>
                </Card>
              </Zoom>
            </Grid>

            {/* Admin Role */}
            <Grid item xs={12} md={6}>
              <Zoom in timeout={2400}>
                <Card sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 4,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: '0 25px 50px rgba(139, 92, 246, 0.3)',
                    border: '1px solid rgba(139, 92, 246, 0.5)',
                    '& .card-glow': {
                      opacity: 1
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover::before': {
                    opacity: 1
                  }
                }}
                onClick={handleAdminClick}
                >
                  {/* Glow effect */}
                  <Box className="card-glow" sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }} />
                  
                  <Avatar sx={{ 
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    width: 90,
                    height: 90,
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 15px 35px rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)'
                    }
                  }}>
                    <AdminPanelSettings sx={{ fontSize: 45 }} />
                  </Avatar>
                  
                  <Typography variant="h4" sx={{ 
                    fontWeight: 800, 
                    color: 'white', 
                    mb: 2,
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}>
                    {i18n.language === 'am' ? 'አስተዳዳሪ' : 'Administrator'}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    mb: 3,
                    fontSize: '1.1rem',
                    fontWeight: 300
                  }}>
                    {i18n.language === 'am' 
                      ? 'ሪፖርቶችን ይመልከቱና ጥያቄዎችን ያስተዳድሩ'
                      : 'View reports and manage questions'
                    }
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      background: 'rgba(139, 92, 246, 0.1)',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}>
                      <TrendingUp sx={{ color: '#8B5CF6', fontSize: 20 }} />
                      <Typography variant="caption" sx={{ 
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 500
                      }}>
                        {i18n.language === 'am' ? 'ትንታኔዎች' : 'Analytics'}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<BarChart />}
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
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {i18n.language === 'am' ? 'ዳሽቦርድ ይክፈቱ' : 'Open Dashboard'}
                  </Button>
                </Card>
              </Zoom>
            </Grid>
          </Grid>
        </Slide>

        {/* Footer */}
        <Fade in timeout={2600}>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.7)',
              fontSize: '1rem',
              fontWeight: 300
            }}>
              {i18n.language === 'am' 
                ? 'የእርስዎ አስተያየት ለአገልግሎታችን መሻሻል በጣም ጠቃሚ ነው'
                : 'Your feedback is very important for improving our services'
              }
            </Typography>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default RoleSelection;