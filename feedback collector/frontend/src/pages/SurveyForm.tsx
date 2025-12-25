import {
  Box,
  Typography,
  Card,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Chip,
  Fade,
  Slide,
  Zoom,
  IconButton,
  Alert,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Person,
  NavigateNext,
  NavigateBefore,
  CheckCircle,
  Star,
  TrendingUp,
  Assessment,
  Language,
  AutoAwesome,
  Celebration,
  ArrowBack
} from '@mui/icons-material';
import { surveyResponseService } from '../services/supabaseService';
import SuccessMessage from '../components/SuccessMessage';

interface FormData {
  gender: string;
  age: string;
  marital_status: string;
  education_level: string;
  responses: Record<string, number>;
}

const SurveyForm = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    gender: '',
    age: '',
    marital_status: '',
    education_level: '',
    responses: {}
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  // All 15 questions from database
  const questions = [
    // Tangibility (ተጨባጭነት)
    {
      id: 'q1_facilities',
      dimension: 'tangibility',
      text_amharic: 'የቢሮው አካባቢ ንጹህና ደህንነቱ የተጠበቀ ነው',
      text_english: 'The office environment is clean and safe'
    },
    {
      id: 'q2_equipment',
      dimension: 'tangibility',
      text_amharic: 'ቢሮው ዘመናዊ መሳሪያዎችና ቴክኖሎጂ አለው',
      text_english: 'The office has modern equipment and technology'
    },
    {
      id: 'q3_materials',
      dimension: 'tangibility',
      text_amharic: 'የመረጃ ቁሳቁሶች ግልጽና ተደራሽ ናቸው',
      text_english: 'Information materials are clear and accessible'
    },
    // Responsiveness (ፈጣን አገልግሎት)
    {
      id: 'q4_prompt_service',
      dimension: 'responsiveness',
      text_amharic: 'ሰራተኞች ፈጣን አገልግሎት ይሰጣሉ',
      text_english: 'Staff provide prompt service'
    },
    {
      id: 'q5_willingness',
      dimension: 'responsiveness',
      text_amharic: 'ሰራተኞች ለመርዳት ፈቃደኛ ናቸው',
      text_english: 'Staff are willing to help'
    },
    {
      id: 'q6_availability',
      dimension: 'responsiveness',
      text_amharic: 'ሰራተኞች ሁልጊዜ ይገኛሉ',
      text_english: 'Staff are always available'
    },
    // Reliability (ተዓማኒነት)
    {
      id: 'q7_promised_time',
      dimension: 'reliability',
      text_amharic: 'አገልግሎቱ በተገለጸው ጊዜ ይሰጣል',
      text_english: 'Service is delivered at the promised time'
    },
    {
      id: 'q8_problem_solving',
      dimension: 'reliability',
      text_amharic: 'ችግሮች በተገቢው መንገድ ይፈታሉ',
      text_english: 'Problems are solved appropriately'
    },
    {
      id: 'q9_dependable',
      dimension: 'reliability',
      text_amharic: 'አገልግሎቱ ተዓማኒ ነው',
      text_english: 'The service is dependable'
    },
    // Assurance (የሰራተኞች ብቃት)
    {
      id: 'q10_competence',
      dimension: 'assurance',
      text_amharic: 'ሰራተኞች በቂ እውቀትና ክህሎት አላቸው',
      text_english: 'Staff have adequate knowledge and skills'
    },
    {
      id: 'q11_courtesy',
      dimension: 'assurance',
      text_amharic: 'ሰራተኞች ትሁትና አክባሪ ናቸው',
      text_english: 'Staff are courteous and respectful'
    },
    {
      id: 'q12_confidence',
      dimension: 'assurance',
      text_amharic: 'በአገልግሎቱ ላይ መተማመን አለኝ',
      text_english: 'I have confidence in the service'
    },
    // Empathy (ተሳትፎ)
    {
      id: 'q13_individual_attention',
      dimension: 'empathy',
      text_amharic: 'ሰራተኞች ለእያንዳንዱ ደንበኛ ልዩ ትኩረት ይሰጣሉ',
      text_english: 'Staff give individual attention to each customer'
    },
    {
      id: 'q14_understanding',
      dimension: 'empathy',
      text_amharic: 'ሰራተኞች የደንበኞችን ፍላጎት ይረዳሉ',
      text_english: 'Staff understand customer needs'
    },
    {
      id: 'q15_best_interests',
      dimension: 'empathy',
      text_amharic: 'ሰራተኞች የደንበኞችን ጥቅም ያስቀድማሉ',
      text_english: 'Staff act in customers best interests'
    }
  ];

  const steps = [
    i18n.language === 'am' ? 'የግል መረጃ' : 'Personal Info',
    i18n.language === 'am' ? 'የአገልግሎት ግምገማ' : 'Service Evaluation',
    i18n.language === 'am' ? 'ማጠናቀቅ' : 'Complete'
  ];

  useEffect(() => {
    const totalSteps = steps.length;
    const newProgress = ((currentStep + 1) / totalSteps) * 100;
    setProgress(newProgress);
  }, [currentStep, steps.length]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Calculate scores
      const responseValues = Object.values(formData.responses);
      const overallScore = responseValues.reduce((sum, score) => sum + score, 0) / responseValues.length;
      
      const dimensionScores = {
        tangibility: (
          (formData.responses.q1_facilities || 0) +
          (formData.responses.q2_equipment || 0) +
          (formData.responses.q3_materials || 0)
        ) / 3,
        responsiveness: (
          (formData.responses.q4_prompt_service || 0) +
          (formData.responses.q5_willingness || 0) +
          (formData.responses.q6_availability || 0)
        ) / 3,
        reliability: (
          (formData.responses.q7_promised_time || 0) +
          (formData.responses.q8_problem_solving || 0) +
          (formData.responses.q9_dependable || 0)
        ) / 3,
        assurance: (
          (formData.responses.q10_competence || 0) +
          (formData.responses.q11_courtesy || 0) +
          (formData.responses.q12_confidence || 0)
        ) / 3,
        empathy: (
          (formData.responses.q13_individual_attention || 0) +
          (formData.responses.q14_understanding || 0) +
          (formData.responses.q15_best_interests || 0)
        ) / 3
      };

      const completionRate = Object.keys(formData.responses).length / questions.length;

      const surveyData = {
        gender: formData.gender as 'male' | 'female',
        age: formData.age as '18-30' | '31-40' | '41-50' | '50+',
        marital_status: formData.marital_status as 'married' | 'single' | 'divorced' | 'widowed',
        education_level: formData.education_level as 'unfilled' | '1-8' | '9-12' | 'certificate' | 'diploma' | 'first_degree' | 'second_degree_plus',
        responses: formData.responses,
        overall_score: overallScore,
        dimension_scores: dimensionScores,
        completion_rate: completionRate
      };

      await surveyResponseService.create(surveyData);
      setSubmitted(true);
      setCurrentStep(2);
    } catch (error: any) {
      setError(error.message || 'Failed to submit survey');
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 0: return <Person sx={{ fontSize: 24 }} />;
      case 1: return <Assessment sx={{ fontSize: 24 }} />;
      case 2: return <Celebration sx={{ fontSize: 24 }} />;
      default: return <CheckCircle sx={{ fontSize: 24 }} />;
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return formData.gender && formData.age && formData.marital_status && formData.education_level;
      case 1:
        return Object.keys(formData.responses).length === questions.length;
      case 2:
        return submitted;
      default:
        return false;
    }
  };

  if (submitted) {
    return <SuccessMessage />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        animation: 'float 8s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-30px) rotate(180deg)' }
        }
      }} />
      
      <Box sx={{
        position: 'absolute',
        top: '70%',
        right: '10%',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(16, 185, 129, 0.2)',
        animation: 'pulse 6s ease-in-out infinite',
        '@keyframes pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.7 },
          '50%': { transform: 'scale(1.3)', opacity: 1 }
        }
      }} />

      {/* Header */}
      <Fade in timeout={600}>
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          p: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => navigate('/')}
                sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  background: 'rgba(255,255,255,0.1)',
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
              
              <Zoom in timeout={800}>
                <Avatar sx={{ 
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  width: 50,
                  height: 50,
                  boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
                }}>
                  <img src="/logo.png" alt="Logo" style={{ width: '35px', height: '35px', objectFit: 'contain' }} />
                </Avatar>
              </Zoom>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                  {i18n.language === 'am' ? 'የደንበኛ እርካታ ግምገማ' : 'Customer Satisfaction Survey'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {i18n.language === 'am' ? 'ለሚ ኩራ ክፍለ ከተማ ሰላምና ፀጥታ አስተዳደር ጽ/ቤት' : 'Lemi Kura Sub-City Peace and Security Office'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<Language />}
                onClick={toggleLanguage}
                sx={{ 
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {i18n.language === 'en' ? 'አማ' : 'EN'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* Progress Section */}
      <Slide direction="down" in timeout={1000}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ maxWidth: 800, mx: 'auto', mb: 3 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 12,
                borderRadius: 6,
                background: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderRadius: 6,
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)'
                }
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              {steps.map((step, index) => (
                <Chip
                  key={index}
                  icon={getStepIcon(index)}
                  label={step}
                  size="small"
                  sx={{
                    background: currentStep >= index 
                      ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                      : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontWeight: 600,
                    border: currentStep === index ? '2px solid rgba(255,255,255,0.5)' : 'none',
                    transform: currentStep === index ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Slide>

      {/* Main Content */}
      <Box sx={{ p: 3, pb: 6 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Zoom in timeout={1200}>
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
              {/* Card Top Border Effect */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #10B981, #8B5CF6, #F59E0B)',
                animation: 'shimmer 3s ease-in-out infinite',
                '@keyframes shimmer': {
                  '0%, 100%': { opacity: 0.5 },
                  '50%': { opacity: 1 }
                }
              }} />

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

              {/* Step 0: Personal Information */}
              {currentStep === 0 && (
                <Slide direction="left" in timeout={500}>
                  <Box>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Avatar sx={{
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        width: 70,
                        height: 70,
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 15px 35px rgba(139, 92, 246, 0.3)'
                      }}>
                        <Person sx={{ fontSize: 35 }} />
                      </Avatar>
                      
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700, 
                        color: 'white', 
                        mb: 1,
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                      }}>
                        {i18n.language === 'am' ? 'የተሳታፊ አጠቃላይ መረጃ' : 'Participant General Information'}
                      </Typography>
                      
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {i18n.language === 'am' ? 'እባክዎ የግል መረጃዎን ያስገቡ' : 'Please provide your personal information'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                      {/* Gender */}
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                          {i18n.language === 'am' ? 'ጾታ' : 'Gender'}
                        </Typography>
                        <RadioGroup
                          value={formData.gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        >
                          <FormControlLabel 
                            value="male" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{i18n.language === 'am' ? 'ወንድ' : 'Male'}</Typography>}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel 
                            value="female" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{i18n.language === 'am' ? 'ሴት' : 'Female'}</Typography>}
                          />
                        </RadioGroup>
                      </Box>

                      {/* Age */}
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                          {i18n.language === 'am' ? 'እድሜ' : 'Age'}
                        </Typography>
                        <RadioGroup
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: e.target.value})}
                        >
                          <FormControlLabel 
                            value="18-30" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>18-30</Typography>}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel 
                            value="31-40" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>31-40</Typography>}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel 
                            value="41-50" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>41-50</Typography>}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel 
                            value="50+" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>50+</Typography>}
                          />
                        </RadioGroup>
                      </Box>

                      {/* Marital Status */}
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                          {i18n.language === 'am' ? 'የጋብቻ ሁኔታ' : 'Marital Status'}
                        </Typography>
                        <RadioGroup
                          value={formData.marital_status}
                          onChange={(e) => setFormData({...formData, marital_status: e.target.value})}
                        >
                          <FormControlLabel 
                            value="married" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{i18n.language === 'am' ? 'ያገባ' : 'Married'}</Typography>}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel 
                            value="single" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{i18n.language === 'am' ? 'ያላገባ' : 'Single'}</Typography>}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel 
                            value="divorced" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{i18n.language === 'am' ? 'የተፋታ' : 'Divorced'}</Typography>}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel 
                            value="widowed" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{i18n.language === 'am' ? 'የሞተበት/ባት' : 'Widowed'}</Typography>}
                          />
                        </RadioGroup>
                      </Box>

                      {/* Education Level */}
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                          {i18n.language === 'am' ? 'የትምህርት ደረጃ' : 'Education Level'}
                        </Typography>
                        <RadioGroup
                          value={formData.education_level}
                          onChange={(e) => setFormData({...formData, education_level: e.target.value})}
                        >
                          <FormControlLabel 
                            value="unfilled" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{i18n.language === 'am' ? 'ያልተማረ' : 'Unfilled'}</Typography>}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel 
                            value="1-8" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{i18n.language === 'am' ? '1-8 ክፍል' : '1-8 Grade'}</Typography>}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel 
                            value="9-12" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{i18n.language === 'am' ? '9-12 ክፍል' : '9-12 Grade'}</Typography>}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel 
                            value="certificate" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{i18n.language === 'am' ? 'ሰርተፊኬት' : 'Certificate'}</Typography>}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel 
                            value="diploma" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{i18n.language === 'am' ? 'ዲፕሎማ' : 'Diploma'}</Typography>}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel 
                            value="first_degree" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{i18n.language === 'am' ? 'የመጀመሪያ ዲግሪ' : 'First Degree'}</Typography>}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel 
                            value="second_degree_plus" 
                            control={<Radio sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#10B981' } }} />} 
                            label={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{i18n.language === 'am' ? 'ሁለተኛ ዲግሪ እና ከዚያ በላይ' : 'Second Degree & Above'}</Typography>}
                          />
                        </RadioGroup>
                      </Box>
                    </Box>
                  </Box>
                </Slide>
              )}

              {/* Step 1: Questions */}
              {currentStep === 1 && (
                <Slide direction="left" in timeout={500}>
                  <Box>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Avatar sx={{
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        width: 70,
                        height: 70,
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 15px 35px rgba(245, 158, 11, 0.3)'
                      }}>
                        <Assessment sx={{ fontSize: 35 }} />
                      </Avatar>
                      
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700, 
                        color: 'white', 
                        mb: 1,
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                      }}>
                        {i18n.language === 'am' ? 'የአገልግሎት ግምገማ' : 'Service Evaluation'}
                      </Typography>
                      
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {i18n.language === 'am' ? 'እባክዎ እያንዳንዱን ጥያቄ ይመልሱ' : 'Please answer each question'}
                      </Typography>
                    </Box>

                    <Box sx={{ space: 3 }}>
                      {questions.map((question, index) => (
                        <Fade in timeout={600 + (index * 200)} key={question.id}>
                          <Card sx={{ 
                            p: 3, 
                            mb: 3,
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.1)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                            }
                          }}>
                            <Typography variant="h6" sx={{ 
                              color: 'white', 
                              mb: 3,
                              fontWeight: 600
                            }}>
                              {index + 1}. {i18n.language === 'am' ? question.text_amharic : question.text_english}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {i18n.language === 'am' ? 'በጣም መጥፎ' : 'Very Poor'}
                              </Typography>
                              
                              <RadioGroup
                                row
                                value={formData.responses[question.id] || ''}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  responses: {
                                    ...formData.responses,
                                    [question.id]: parseInt(e.target.value)
                                  }
                                })}
                                sx={{ mx: 2 }}
                              >
                                {[1, 2, 3, 4, 5].map((value) => (
                                  <FormControlLabel
                                    key={value}
                                    value={value}
                                    control={
                                      <Radio 
                                        icon={<Star sx={{ color: 'rgba(255,255,255,0.3)' }} />}
                                        checkedIcon={<Star sx={{ color: '#F59E0B' }} />}
                                        sx={{ 
                                          '&:hover': { 
                                            backgroundColor: 'rgba(245, 158, 11, 0.1)' 
                                          }
                                        }}
                                      />
                                    }
                                    label=""
                                    sx={{ mx: 0.5 }}
                                  />
                                ))}
                              </RadioGroup>
                              
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {i18n.language === 'am' ? 'በጣም ጥሩ' : 'Excellent'}
                              </Typography>
                            </Box>
                          </Card>
                        </Fade>
                      ))}
                    </Box>
                  </Box>
                </Slide>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  startIcon={<NavigateBefore />}
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    px: 3,
                    '&:hover': {
                      background: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      opacity: 0.3
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {i18n.language === 'am' ? 'ወደ ኋላ' : 'Back'}
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!isStepComplete(currentStep)}
                    endIcon={<NavigateNext />}
                    sx={{ 
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 35px rgba(16, 185, 129, 0.5)'
                      },
                      '&:disabled': {
                        background: 'rgba(16, 185, 129, 0.3)',
                        boxShadow: 'none'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {i18n.language === 'am' ? 'ቀጣይ' : 'Next'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !isStepComplete(1)}
                    startIcon={loading ? null : <AutoAwesome />}
                    sx={{ 
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                      color: 'white',
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 35px rgba(139, 92, 246, 0.5)'
                      },
                      '&:disabled': {
                        background: 'rgba(139, 92, 246, 0.3)',
                        boxShadow: 'none'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading 
                      ? (i18n.language === 'am' ? 'በመላክ ላይ...' : 'Submitting...')
                      : (i18n.language === 'am' ? 'ግምገማ ላክ' : 'Submit Survey')
                    }
                  </Button>
                )}
              </Box>
            </Card>
          </Zoom>
        </Box>
      </Box>
    </Box>
  );
};

export default SurveyForm;