import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { 
  Add, 
  Edit, 
  Delete, 
  Visibility,
  Download,
  TrendingUp,
  People,
  Assessment,
  Star,
  BarChart,
  Logout,
  Language,
  DeleteSweep
} from '@mui/icons-material';
import { fetchOverallSummary } from '../services/api';
import { questionService } from '../services/supabaseService';
import DataManagement from '../components/DataManagement';
import EmptyStateMessage from '../components/EmptyStateMessage';
import ReportsSection from '../components/ReportsSection';
import { addSampleData } from '../utils/sampleData';
import { exportToCSV } from '../services/csvExportService';
import { signOutAdmin, getCurrentAdminSession } from '../utils/simpleAuth';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const adminSession = getCurrentAdminSession();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [questionDialog, setQuestionDialog] = useState(false);
  const [viewQuestionDialog, setViewQuestionDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [questionForm, setQuestionForm] = useState({
    question_id: '',
    dimension: '',
    text_amharic: '',
    text_english: '',
    order_number: 1
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  const handleSignOut = async () => {
    signOutAdmin();
    navigate('/admin/signin');
  };

  // Fetch data
  const { data: summaryData } = useQuery({
    queryKey: ['overallSummary'],
    queryFn: () => fetchOverallSummary(),
    refetchInterval: 30000
  });

  const { data: questions = [] } = useQuery({
    queryKey: ['questions'],
    queryFn: () => questionService.getAll(),
    refetchInterval: 30000
  });

  // Add sample data mutation
  const addSampleMutation = useMutation({
    mutationFn: addSampleData,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['overallSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dimensionScores'] });
      
      alert(i18n.language === 'am' 
        ? `${result.count} የናሙና ምላሾች ተጨመሩ`
        : `${result.count} sample responses added successfully`
      );
    },
    onError: (error: any) => {
      alert(i18n.language === 'am' 
        ? `ስህተት: ${error.message}`
        : `Error: ${error.message}`
      );
    }
  });

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: () => exportToCSV(i18n.language as 'en' | 'am'),
    onError: (error: any) => {
      alert(i18n.language === 'am' 
        ? `ወደ CSV መላክ ሳይሳካ ቀረ: ${error.message}`
        : `CSV export failed: ${error.message}`
      );
    }
  });



  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddQuestion = () => {
    setSelectedQuestion(null);
    setQuestionForm({
      question_id: '',
      dimension: '',
      text_amharic: '',
      text_english: '',
      order_number: (questions?.length || 0) + 1
    });
    setQuestionDialog(true);
  };

  const handleEditQuestion = (question: any) => {
    setSelectedQuestion(question);
    setQuestionForm({
      question_id: question.question_id,
      dimension: question.dimension,
      text_amharic: question.text_amharic,
      text_english: question.text_english,
      order_number: question.order_number
    });
    setQuestionDialog(true);
  };

  const handleSaveQuestion = async () => {
    if (!questionForm.question_id || !questionForm.text_amharic || !questionForm.text_english) {
      alert(i18n.language === 'am' ? 'እባክዎ ሁሉንም መስኮች ይሙሉ' : 'Please fill all fields');
      return;
    }

    setSaving(true);
    try {
      if (selectedQuestion) {
        // Update existing question
        await questionService.update(selectedQuestion.id, questionForm);
      } else {
        // Create new question
        await questionService.create(questionForm);
      }
      
      // Refresh questions list
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setQuestionDialog(false);
      setQuestionForm({
        question_id: '',
        dimension: '',
        text_amharic: '',
        text_english: '',
        order_number: 1
      });
    } catch (error: any) {
      alert(error.message || 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const handleViewQuestion = (question: any) => {
    setSelectedQuestion(question);
    setViewQuestionDialog(true);
  };

  const handleDeleteQuestion = async (question: any) => {
    const confirmMessage = i18n.language === 'am' 
      ? `እርግጠኛ ነዎት ይህን ጥያቄ መሰረዝ ይፈልጋሉ?\n"${question.text_amharic}"`
      : `Are you sure you want to delete this question?\n"${question.text_english}"`;
    
    if (!confirm(confirmMessage)) return;

    setDeleting(true);
    try {
      await questionService.delete(question.id);
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      alert(i18n.language === 'am' ? 'ጥያቄ በተሳካ ሁኔታ ተሰርዟል' : 'Question deleted successfully');
    } catch (error: any) {
      alert(i18n.language === 'am' 
        ? `ጥያቄን መሰረዝ አልተሳካም: ${error.message}`
        : `Failed to delete question: ${error.message}`
      );
    } finally {
      setDeleting(false);
    }
  };

  const renderAnalytics = () => {
    const hasNoData = !summaryData?.totalResponses || summaryData.totalResponses === 0;
    
    return (
    <Box>
      {/* Modern Key Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          {
            title: i18n.language === 'am' ? 'አጠቃላይ እርካታ' : 'Overall CSAT',
            value: summaryData?.overallCSAT && summaryData?.totalResponses > 0 
              ? `${((summaryData.overallCSAT - 1) / 4 * 100).toFixed(0)}%` 
              : '0%',
            icon: <Star sx={{ fontSize: 32 }} />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            shadowColor: 'rgba(102, 126, 234, 0.4)'
          },
          {
            title: i18n.language === 'am' ? 'አጠቃላይ ምላሾች' : 'Total Responses',
            value: summaryData?.totalResponses ?? 0,
            icon: <People sx={{ fontSize: 32 }} />,
            gradient: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
            shadowColor: 'rgba(74, 222, 128, 0.4)'
          },
          {
            title: i18n.language === 'am' ? 'ምላሽ መጠን' : 'Response Rate',
            value: `${summaryData?.totalResponses > 0 ? ((summaryData?.responseRate || 0) * 100).toFixed(0) : 0}%`,
            icon: <TrendingUp sx={{ fontSize: 32 }} />,
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            shadowColor: 'rgba(245, 158, 11, 0.4)'
          },
          {
            title: i18n.language === 'am' ? 'ንቁ ጥያቄዎች' : 'Active Questions',
            value: questions.filter(q => q.is_active).length,
            icon: <Assessment sx={{ fontSize: 32 }} />,
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            shadowColor: 'rgba(139, 92, 246, 0.4)'
          }
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card sx={{ 
              p: 4,
              height: '100%',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 20px 40px ${metric.shadowColor}`,
                background: 'rgba(255, 255, 255, 0.12)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: metric.gradient
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ 
                  p: 2,
                  borderRadius: 3,
                  background: metric.gradient,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 20px ${metric.shadowColor}`
                }}>
                  {metric.icon}
                </Box>
              </Box>
              
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                color: 'white',
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}>
                {metric.value}
              </Typography>
              
              <Typography variant="body1" sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 500,
                fontSize: '1rem'
              }}>
                {metric.title}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Service Quality Dimensions - Modern Cards */}
      <Card sx={{ 
        p: 5, 
        mb: 5,
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 4
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 800, 
          color: 'white', 
          mb: 4,
          textAlign: 'center',
          background: 'linear-gradient(45deg, #fff, #e3f2fd)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {i18n.language === 'am' ? '🎯 የአገልግሎት ጥራት ልኬቶች' : '🎯 Service Quality Dimensions'}
        </Typography>
        
        <Grid container spacing={3}>
          {[
            { 
              key: 'tangibility', 
              label: i18n.language === 'am' ? 'ተጨባጭነት' : 'Tangibility', 
              gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              icon: '🏢'
            },
            { 
              key: 'responsiveness', 
              label: i18n.language === 'am' ? 'ፈጣን አገልግሎት' : 'Responsiveness', 
              gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              icon: '⚡'
            },
            { 
              key: 'reliability', 
              label: i18n.language === 'am' ? 'ተዓማኒነት' : 'Reliability', 
              gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              icon: '🛡️'
            },
            { 
              key: 'assurance', 
              label: i18n.language === 'am' ? 'የሰራተኞች ብቃት' : 'Assurance', 
              gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              icon: '👥'
            },
            { 
              key: 'empathy', 
              label: i18n.language === 'am' ? 'ተሳትፎ' : 'Empathy', 
              gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              icon: '❤️'
            }
          ].map((dimension) => {
            const realScore = summaryData?.dimensionScores?.[dimension.key] ?? 0;
            
            return (
            <Grid item xs={12} sm={6} lg={4} key={dimension.key}>
              <Card sx={{ 
                p: 4,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  background: 'rgba(255, 255, 255, 0.1)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: dimension.gradient
                }
              }}>
                <Typography variant="h4" sx={{ mb: 2, fontSize: '2rem' }}>
                  {dimension.icon}
                </Typography>
                
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  {dimension.label}
                </Typography>
                
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 800,
                    background: dimension.gradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}>
                    {realScore.toFixed(1)}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    / 5.0
                  </Typography>
                </Box>

                {/* Progress Bar */}
                <Box sx={{ 
                  width: '100%', 
                  height: 8, 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    width: `${(realScore / 5) * 100}%`,
                    height: '100%',
                    background: dimension.gradient,
                    borderRadius: 4,
                    transition: 'width 1s ease'
                  }} />
                </Box>
              </Card>
            </Grid>
            );
          })}
        </Grid>
      </Card>

      {/* Modern Recent Responses */}
      <Card sx={{ 
        p: 5,
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 4
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            color: 'white',
            background: 'linear-gradient(45deg, #fff, #e3f2fd)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {i18n.language === 'am' ? '📋 የቅርብ ጊዜ ምላሾች' : '📋 Recent Responses'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<Download />}
              variant="outlined"
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending || !summaryData?.totalResponses}
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.3)',
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  color: 'rgba(255,255,255,0.4)',
                  borderColor: 'rgba(255,255,255,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {exportMutation.isPending 
                ? (i18n.language === 'am' ? 'በመላክ ላይ...' : 'Exporting...')
                : (i18n.language === 'am' ? 'ወደ CSV ላክ' : 'Export to CSV')
              }
            </Button>
            
            <Button
              startIcon={<DeleteSweep />}
              variant="outlined"
              onClick={() => setTabValue(3)}
              sx={{ 
                color: '#ff6b6b', 
                borderColor: 'rgba(255, 107, 107, 0.5)',
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                background: 'rgba(255, 107, 107, 0.05)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  background: 'rgba(255, 107, 107, 0.1)',
                  borderColor: '#ff6b6b',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {i18n.language === 'am' ? 'መረጃ ሰርዝ' : 'Clear Data'}
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ 
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(255,255,255,0.1)' } }}>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  {i18n.language === 'am' ? '📅 ቀን' : '📅 Date'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  {i18n.language === 'am' ? '👤 ፆታ' : '👤 Gender'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  {i18n.language === 'am' ? '🎂 ዕድሜ' : '🎂 Age'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  {i18n.language === 'am' ? '⭐ እርካታ ነጥብ' : '⭐ CSAT Score'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  {i18n.language === 'am' ? '✅ ሁኔታ' : '✅ Status'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(!summaryData?.recentResponses || summaryData.recentResponses.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Typography variant="h4" sx={{ opacity: 0.3 }}>📭</Typography>
                      <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        {i18n.language === 'am' ? 'ምንም የቅርብ ጊዜ ምላሽ የለም' : 'No recent responses'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                summaryData.recentResponses.slice(0, 4).map((response: any, index: number) => (
                  <TableRow key={index} sx={{ 
                    '&:hover': { 
                      background: 'rgba(255,255,255,0.05)' 
                    },
                    '& td': { 
                      borderBottom: '1px solid rgba(255,255,255,0.05)' 
                    }
                  }}>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                      {new Date(response.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>
                      <Chip 
                        label={i18n.language === 'am' ? (response.gender === 'male' ? '👨 ወንድ' : '👩 ሴት') : `${response.gender === 'male' ? '👨' : '👩'} ${response.gender}`}
                        size="small"
                        sx={{ 
                          background: response.gender === 'male' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)',
                          color: response.gender === 'male' ? '#60a5fa' : '#f472b6',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                      {response.age}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${((response.overall_score - 1) / 4 * 100).toFixed(0)}%`} 
                        size="small"
                        sx={{ 
                          background: response.overall_score >= 4 
                            ? 'linear-gradient(135deg, #4ade80, #22c55e)' 
                            : response.overall_score >= 3 
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                            : 'linear-gradient(135deg, #ef4444, #dc2626)',
                          color: 'white',
                          fontWeight: 600,
                          boxShadow: response.overall_score >= 4 
                            ? '0 4px 12px rgba(74, 222, 128, 0.3)' 
                            : response.overall_score >= 3
                            ? '0 4px 12px rgba(245, 158, 11, 0.3)'
                            : '0 4px 12px rgba(239, 68, 68, 0.3)'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={i18n.language === 'am' ? '✅ ተጠናቅቋል' : '✅ Complete'} 
                        size="small"
                        sx={{ 
                          background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                          color: 'white',
                          fontWeight: 600,
                          boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Empty State Message */}
      {hasNoData && (
        <Box sx={{ mt: 4 }}>
          <EmptyStateMessage 
            onAddSampleData={() => addSampleMutation.mutate()}
            isLoading={addSampleMutation.isPending}
          />
        </Box>
      )}
    </Box>
    );
  };

  const renderQuestionManagement = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 800, 
          color: 'white',
          background: 'linear-gradient(45deg, #fff, #e3f2fd)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {i18n.language === 'am' ? '❓ ጥያቄዎች አስተዳደር' : '❓ Question Management'}
        </Typography>
        
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={handleAddQuestion}
          sx={{
            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
            color: 'white',
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 8px 20px rgba(74, 222, 128, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 30px rgba(74, 222, 128, 0.6)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {i18n.language === 'am' ? '➕ አዲስ ጥያቄ ጨምር' : '➕ Add New Question'}
        </Button>
      </Box>

      <Card sx={{ 
        p: 5,
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 4
      }}>
        <TableContainer component={Paper} sx={{ 
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(255,255,255,0.1)' } }}>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  {i18n.language === 'am' ? '🔢 ቅደም ተከተል' : '🔢 Order'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  {i18n.language === 'am' ? '❓ ጥያቄ' : '❓ Question'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  {i18n.language === 'am' ? '🎯 ልኬት' : '🎯 Dimension'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  {i18n.language === 'am' ? '📊 ሁኔታ' : '📊 Status'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  {i18n.language === 'am' ? '⚙️ እርምጃዎች' : '⚙️ Actions'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question, index) => (
                <TableRow key={question.id} sx={{ 
                  '&:hover': { 
                    background: 'rgba(255,255,255,0.05)' 
                  },
                  '& td': { 
                    borderBottom: '1px solid rgba(255,255,255,0.05)' 
                  }
                }}>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    <Chip 
                      label={question.order_number}
                      size="small"
                      sx={{ 
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        fontWeight: 600,
                        minWidth: 40
                      }}
                    />
                  </TableCell>
                  
                  <TableCell sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 400 }}>
                    <Box sx={{ 
                      p: 2, 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        {i18n.language === 'am' ? question.text_amharic : question.text_english}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: 'rgba(255,255,255,0.6)',
                        fontStyle: 'italic'
                      }}>
                        {i18n.language === 'am' ? question.text_english : question.text_amharic}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={question.dimension} 
                      size="small"
                      sx={{ 
                        background: {
                          tangibility: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          responsiveness: 'linear-gradient(135deg, #10b981, #059669)',
                          reliability: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          assurance: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          empathy: 'linear-gradient(135deg, #ef4444, #dc2626)'
                        }[question.dimension] || 'linear-gradient(135deg, #6b7280, #4b5563)',
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={question.is_active ? (i18n.language === 'am' ? '✅ ንቁ' : '✅ Active') : (i18n.language === 'am' ? '⏸️ ቦዝ' : '⏸️ Inactive')} 
                      size="small"
                      sx={{ 
                        background: question.is_active 
                          ? 'linear-gradient(135deg, #4ade80, #22c55e)' 
                          : 'linear-gradient(135deg, #6b7280, #4b5563)',
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: question.is_active 
                          ? '0 4px 12px rgba(74, 222, 128, 0.3)' 
                          : '0 4px 12px rgba(107, 114, 128, 0.3)'
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditQuestion(question)}
                        sx={{ 
                          color: 'white',
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      
                      <IconButton 
                        size="small"
                        onClick={() => handleViewQuestion(question)}
                        sx={{ 
                          color: 'white',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #059669, #047857)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      
                      <IconButton 
                        size="small"
                        onClick={() => handleDeleteQuestion(question)}
                        disabled={deleting}
                        sx={{ 
                          color: 'white',
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)'
                          },
                          '&:disabled': {
                            background: 'rgba(107, 114, 128, 0.5)',
                            color: 'rgba(255,255,255,0.5)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      position: 'relative',
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
      {/* Modern Header */}
      <Box sx={{ 
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        p: { xs: 2, md: 3 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          maxWidth: '1400px',
          mx: 'auto'
        }}>
          {/* Left Section - Logo & Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ 
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -4,
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
                width: 64,
                height: 64,
                background: 'rgba(255, 255, 255, 0.9)',
                position: 'relative',
                zIndex: 1
              }}>
                <img src="/logo.png" alt="Logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
              </Avatar>
            </Box>
            
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 800, 
                color: 'white',
                background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5
              }}>
                {i18n.language === 'am' ? 'አስተዳዳሪ ዳሽቦርድ' : 'Admin Dashboard'}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontWeight: 500,
                mb: 0.5
              }}>
                {i18n.language === 'am' ? 'የደንበኛ እርካታ ግምገማ አስተዳደር' : 'Customer Satisfaction Survey Management'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: '#4ade80',
                  animation: 'pulse 2s infinite'
                }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {i18n.language === 'am' ? 'እንኳን ደህና መጡ' : 'Welcome'}, {adminSession?.email}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Section - Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
              {i18n.language === 'en' ? 'አማ' : 'EN'}
            </Button>
            
            <Button
              startIcon={<Logout />}
              onClick={handleSignOut}
              sx={{ 
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                color: 'white',
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ee5a52 0%, #dc4c41 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.6)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {i18n.language === 'am' ? 'ውጣ' : 'Sign Out'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Modern Navigation Tabs */}
      <Box sx={{ 
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': { 
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                minHeight: 64,
                px: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.05)'
                }
              },
              '& .Mui-selected': { 
                color: 'white !important',
                background: 'rgba(255, 255, 255, 0.1) !important'
              },
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #4ade80, #22d3ee)'
              }
            }}
          >
            <Tab label={i18n.language === 'am' ? '📊 ትንታኔዎች' : '📊 Analytics'} />
            <Tab label={i18n.language === 'am' ? '❓ ጥያቄዎች' : '❓ Questions'} />
            <Tab label={i18n.language === 'am' ? '📈 ሪፖርቶች' : '📈 Reports'} />
            <Tab label={i18n.language === 'am' ? '🗂️ የመረጃ አስተዳደር' : '🗂️ Data Management'} />
          </Tabs>
        </Box>
      </Box>

      {/* Content Area */}
      <Box sx={{ 
        position: 'relative',
        zIndex: 5,
        maxWidth: '1400px',
        mx: 'auto',
        p: { xs: 2, md: 4 }
      }}>
        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {renderAnalytics()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {renderQuestionManagement()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <ReportsSection />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <DataManagement />
        </TabPanel>
      </Box>

      {/* Question Dialog */}
      <Dialog 
        open={questionDialog} 
        onClose={() => setQuestionDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          {selectedQuestion 
            ? (i18n.language === 'am' ? 'ጥያቄ አርም' : 'Edit Question')
            : (i18n.language === 'am' ? 'አዲስ ጥያቄ ጨምር' : 'Add New Question')
          }
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={i18n.language === 'am' ? 'ጥያቄ መለያ' : 'Question ID'}
                value={questionForm.question_id}
                onChange={(e) => setQuestionForm({...questionForm, question_id: e.target.value})}
                placeholder="e.g., q16_new_question"
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': { 
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#10B981' }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {i18n.language === 'am' ? 'ምድብ' : 'Dimension'}
                </InputLabel>
                <Select
                  value={questionForm.dimension}
                  onChange={(e) => setQuestionForm({...questionForm, dimension: e.target.value})}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10B981' }
                  }}
                >
                  <MenuItem value="tangibility">
                    {i18n.language === 'am' ? 'ተጨባጭነት' : 'Tangibility'}
                  </MenuItem>
                  <MenuItem value="responsiveness">
                    {i18n.language === 'am' ? 'ፈጣን አገልግሎት' : 'Responsiveness'}
                  </MenuItem>
                  <MenuItem value="reliability">
                    {i18n.language === 'am' ? 'ተዓማኒነት' : 'Reliability'}
                  </MenuItem>
                  <MenuItem value="assurance">
                    {i18n.language === 'am' ? 'የሰራተኞች ብቃት' : 'Assurance'}
                  </MenuItem>
                  <MenuItem value="empathy">
                    {i18n.language === 'am' ? 'ተሳትፎ' : 'Empathy'}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={i18n.language === 'am' ? 'ጥያቄ (አማርኛ)' : 'Question (Amharic)'}
                value={questionForm.text_amharic}
                onChange={(e) => setQuestionForm({...questionForm, text_amharic: e.target.value})}
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': { 
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#10B981' }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={i18n.language === 'am' ? 'ጥያቄ (እንግሊዝኛ)' : 'Question (English)'}
                value={questionForm.text_english}
                onChange={(e) => setQuestionForm({...questionForm, text_english: e.target.value})}
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': { 
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#10B981' }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={i18n.language === 'am' ? 'ቅደም ተከተል' : 'Order Number'}
                value={questionForm.order_number}
                onChange={(e) => setQuestionForm({...questionForm, order_number: parseInt(e.target.value)})}
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': { 
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#10B981' }
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuestionDialog(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {i18n.language === 'am' ? 'ሰርዝ' : 'Cancel'}
          </Button>
          <Button 
            variant="contained"
            onClick={handleSaveQuestion}
            disabled={saving}
            sx={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
              }
            }}
          >
            {saving 
              ? (i18n.language === 'am' ? 'በማስቀመጥ ላይ...' : 'Saving...')
              : (i18n.language === 'am' ? 'አስቀምጥ' : 'Save')
            }
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Question Dialog */}
      <Dialog 
        open={viewQuestionDialog} 
        onClose={() => setViewQuestionDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          {i18n.language === 'am' ? 'ጥያቄ ዝርዝር' : 'Question Details'}
        </DialogTitle>
        <DialogContent>
          {selectedQuestion && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  {i18n.language === 'am' ? 'ጥያቄ መለያ' : 'Question ID'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                  {selectedQuestion.question_id}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  {i18n.language === 'am' ? 'ምድብ' : 'Dimension'}
                </Typography>
                <Chip 
                  label={selectedQuestion.dimension} 
                  sx={{ background: 'rgba(139, 92, 246, 0.3)', color: '#8B5CF6' }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  {i18n.language === 'am' ? 'ጥያቄ (አማርኛ)' : 'Question (Amharic)'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', mb: 2, p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                  {selectedQuestion.text_amharic}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  {i18n.language === 'am' ? 'ጥያቄ (እንግሊዝኛ)' : 'Question (English)'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', mb: 2, p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                  {selectedQuestion.text_english}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  {i18n.language === 'am' ? 'ቅደም ተከተል' : 'Order Number'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {selectedQuestion.order_number}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  {i18n.language === 'am' ? 'ሁኔታ' : 'Status'}
                </Typography>
                <Chip 
                  label={selectedQuestion.is_active ? (i18n.language === 'am' ? 'ንቁ' : 'Active') : (i18n.language === 'am' ? 'ቦዝ' : 'Inactive')} 
                  sx={{ 
                    background: selectedQuestion.is_active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(107, 114, 128, 0.3)',
                    color: selectedQuestion.is_active ? '#10B981' : '#6B7280'
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  {i18n.language === 'am' ? 'የተፈጠረበት ቀን' : 'Created Date'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {new Date(selectedQuestion.created_at).toLocaleDateString()}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  {i18n.language === 'am' ? 'የተሻሻለበት ቀን' : 'Updated Date'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {new Date(selectedQuestion.updated_at).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewQuestionDialog(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {i18n.language === 'am' ? 'ዝጋ' : 'Close'}
          </Button>
          <Button 
            variant="contained"
            onClick={() => {
              setViewQuestionDialog(false);
              handleEditQuestion(selectedQuestion);
            }}
            sx={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)'
              }
            }}
          >
            {i18n.language === 'am' ? 'አርም' : 'Edit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;