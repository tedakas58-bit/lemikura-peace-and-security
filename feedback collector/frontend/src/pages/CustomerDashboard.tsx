import {
  Box,
  Typography,
  Card,
  Avatar,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Assignment, 
  Language,
  AccessTime,
  Star,
  CheckCircle
} from '@mui/icons-material';

const CustomerDashboard = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundAttachment: 'fixed',
      p: 3
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        p: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            width: 40,
            height: 40
          }}>
            <img src="/logo.png" alt="Logo" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              {i18n.language === 'am' ? 'የደንበኛ እርካታ ግምገማ' : 'Customer Satisfaction Survey'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {i18n.language === 'am' ? 'ለሚ ኩራ ክፍለ ከተማ ሰላምና ፀጥታ አስተዳደር ጽ/ቤት' : 'Lemi Kura Sub-City Peace and Security Office'}
            </Typography>
          </Box>
        </Box>

        <Button
          startIcon={<Language />}
          onClick={toggleLanguage}
          sx={{ 
            color: 'white',
            borderColor: 'rgba(255,255,255,0.3)',
            border: '1px solid',
            borderRadius: 2
          }}
        >
          {i18n.language === 'en' ? 'አማ' : 'EN'}
        </Button>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ 
            p: 6, 
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <Avatar sx={{ 
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 4
            }}>
              <Assignment sx={{ fontSize: 50 }} />
            </Avatar>
            
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
              {i18n.language === 'am' ? 'እንኳን ደህና መጡ!' : 'Welcome!'}
            </Typography>
            
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
              {i18n.language === 'am' 
                ? 'የእርስዎን አስተያየት ለማወቅ እንፈልጋለን'
                : 'We would like to know your opinion'
              }
            </Typography>

            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, maxWidth: 500, mx: 'auto' }}>
              {i18n.language === 'am' 
                ? 'እባክዎ የአገልግሎታችንን ጥራት ለመገምገም ከዚህ በታች ያለውን ቀላል ግምገማ ይሙሉ። ይህ ግምገማ ከ5-10 ደቂቃ ይወስዳል።'
                : 'Please fill out the simple survey below to evaluate our service quality. This survey takes 5-10 minutes.'
              }
            </Typography>

            {/* Survey Info Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ 
                    background: 'rgba(16, 185, 129, 0.2)',
                    mx: 'auto',
                    mb: 1,
                    width: 48,
                    height: 48
                  }}>
                    <AccessTime sx={{ color: '#10B981' }} />
                  </Avatar>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {i18n.language === 'am' ? '5-10 ደቂቃ' : '5-10 minutes'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ 
                    background: 'rgba(139, 92, 246, 0.2)',
                    mx: 'auto',
                    mb: 1,
                    width: 48,
                    height: 48
                  }}>
                    <Star sx={{ color: '#8B5CF6' }} />
                  </Avatar>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {i18n.language === 'am' ? '15 ጥያቄዎች' : '15 Questions'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ 
                    background: 'rgba(59, 130, 246, 0.2)',
                    mx: 'auto',
                    mb: 1,
                    width: 48,
                    height: 48
                  }}>
                    <CheckCircle sx={{ color: '#3B82F6' }} />
                  </Avatar>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {i18n.language === 'am' ? 'ቀላል' : 'Easy'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/survey')}
              sx={{ 
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                borderRadius: 3,
                px: 6,
                py: 2,
                fontWeight: 600,
                fontSize: '1.2rem',
                mb: 3
              }}
            >
              {i18n.language === 'am' ? 'ግምገማ ይጀምሩ' : 'Start Survey'}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={i18n.language === 'am' ? 'ሚስጥራዊነት የተጠበቀ' : 'Confidential'} 
                size="small" 
                sx={{ 
                  background: 'rgba(16, 185, 129, 0.2)', 
                  color: '#10B981',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }} 
              />
              <Chip 
                label={i18n.language === 'am' ? 'ፈቃደኛነት ላይ የተመሰረተ' : 'Voluntary'} 
                size="small" 
                sx={{ 
                  background: 'rgba(139, 92, 246, 0.2)', 
                  color: '#8B5CF6',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }} 
              />
              <Chip 
                label={i18n.language === 'am' ? 'ማንነት የማይታወቅ' : 'Anonymous'} 
                size="small" 
                sx={{ 
                  background: 'rgba(59, 130, 246, 0.2)', 
                  color: '#3B82F6',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }} 
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          {i18n.language === 'am' 
            ? 'የእርስዎ አስተያየት ለአገልግሎታችን መሻሻል በጣም ጠቃሚ ነው'
            : 'Your feedback is very important for improving our services'
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default CustomerDashboard;