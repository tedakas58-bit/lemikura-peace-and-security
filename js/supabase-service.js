// Supabase Service - Database Operations
// This file handles all Supabase database operations

// Prevent redeclaration errors
if (typeof supabaseService === 'undefined') {

// ==================== NEWS OPERATIONS ====================

// Get all news articles
async function getAllNews() {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching news:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Fetched news from Supabase:', data.length, 'items');
        return { success: true, data: data };
    } catch (error) {
        console.error('Error in getAllNews:', error);
        return { success: false, error: error.message };
    }
}

// Add a new news article
async function addNewsArticle(newsData) {
    try {
        const { data, error } = await supabase
            .from('news')
            .insert([{
                title: newsData.title,
                category: newsData.category,
                image: newsData.image || 'images/hero-bg.jpg',
                excerpt: newsData.excerpt,
                content: newsData.content,
                likes: newsData.likes || 0,
                comments: newsData.comments || [],
                date_display: newsData.date || new Date().toLocaleDateString('am-ET'),
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) {
            console.error('Error adding news:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ News added to Supabase:', data[0].id);
        return { success: true, id: data[0].id, data: data[0] };
    } catch (error) {
        console.error('Error in addNewsArticle:', error);
        return { success: false, error: error.message };
    }
}

// Update a news article
async function updateNewsArticle(newsId, newsData) {
    try {
        const { data, error } = await supabase
            .from('news')
            .update({
                title: newsData.title,
                category: newsData.category,
                image: newsData.image,
                excerpt: newsData.excerpt,
                content: newsData.content,
                updated_at: new Date().toISOString()
            })
            .eq('id', newsId)
            .select();

        if (error) {
            console.error('Error updating news:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ News updated in Supabase:', newsId);
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error in updateNewsArticle:', error);
        return { success: false, error: error.message };
    }
}

// Update news likes count only
async function updateNewsLikes(newsId, likesCount) {
    try {
        const { data, error } = await supabase
            .from('news')
            .update({
                likes: likesCount,
                updated_at: new Date().toISOString()
            })
            .eq('id', newsId)
            .select();

        if (error) {
            console.error('Error updating news likes:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ News likes updated in Supabase:', newsId, 'likes:', likesCount);
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error in updateNewsLikes:', error);
        return { success: false, error: error.message };
    }
}

// Delete a news article
async function deleteNewsArticle(newsId) {
    try {
        const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', newsId);

        if (error) {
            console.error('Error deleting news:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ News deleted from Supabase:', newsId);
        return { success: true };
    } catch (error) {
        console.error('Error in deleteNewsArticle:', error);
        return { success: false, error: error.message };
    }
}

// ==================== FEEDBACK OPERATIONS ====================

// Get all feedback
async function getAllFeedback() {
    try {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching feedback:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Fetched feedback from Supabase:', data.length, 'items');
        return { success: true, data: data };
    } catch (error) {
        console.error('Error in getAllFeedback:', error);
        return { success: false, error: error.message };
    }
}

// Add feedback
async function addFeedback(feedbackData) {
    try {
        const { data, error } = await supabase
            .from('feedback')
            .insert([{
                full_name: feedbackData.fullName,
                age: feedbackData.age,
                gender: feedbackData.gender,
                education: feedbackData.education,
                service_type: feedbackData.serviceType,
                visit_purpose: feedbackData.visitPurpose,
                staff_behavior: parseInt(feedbackData.staff_behavior) || 0,
                service_speed: parseInt(feedbackData.service_speed) || 0,
                service_quality: parseInt(feedbackData.service_quality) || 0,
                overall_satisfaction: parseInt(feedbackData.overall_satisfaction) || 0,
                staff_understanding: parseInt(feedbackData.staff_understanding) || 0,
                employee_empathy: parseInt(feedbackData.employee_empathy) || 0,
                needs_understanding: parseInt(feedbackData.needs_understanding) || 0,
                suggestions: feedbackData.suggestions,
                complaints: feedbackData.complaints,
                date_display: feedbackData.date || new Date().toLocaleDateString('am-ET'),
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) {
            console.error('Error adding feedback:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Feedback added to Supabase:', data[0].id);
        return { success: true, id: data[0].id, data: data[0] };
    } catch (error) {
        console.error('Error in addFeedback:', error);
        return { success: false, error: error.message };
    }
}

// Delete feedback
async function deleteFeedback(feedbackId) {
    try {
        const { error } = await supabase
            .from('feedback')
            .delete()
            .eq('id', feedbackId);

        if (error) {
            console.error('Error deleting feedback:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Feedback deleted from Supabase:', feedbackId);
        return { success: true };
    } catch (error) {
        console.error('Error in deleteFeedback:', error);
        return { success: false, error: error.message };
    }
}

// ==================== QUESTION CONFIG OPERATIONS ====================

// Get question configuration
async function getQuestionConfig() {
    try {
        const { data, error } = await supabase
            .from('question_config')
            .select('*')
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error fetching question config:', error);
            return { success: false, error: error.message };
        }

        if (!data) {
            console.log('📝 No question config found in Supabase, using default');
            return { success: true, data: null };
        }

        console.log('✅ Fetched question config from Supabase');
        return { success: true, data: data.config };
    } catch (error) {
        console.error('Error in getQuestionConfig:', error);
        return { success: false, error: error.message };
    }
}

// Save question configuration
async function saveQuestionConfig(config) {
    try {
        // First try to update existing config
        const { data: existingData } = await supabase
            .from('question_config')
            .select('id')
            .single();

        let result;
        if (existingData) {
            // Update existing
            result = await supabase
                .from('question_config')
                .update({
                    config: config,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingData.id)
                .select();
        } else {
            // Insert new
            result = await supabase
                .from('question_config')
                .insert([{
                    config: config,
                    created_at: new Date().toISOString()
                }])
                .select();
        }

        if (result.error) {
            console.error('Error saving question config:', result.error);
            return { success: false, error: result.error.message };
        }

        console.log('✅ Question config saved to Supabase');
        return { success: true, data: result.data[0] };
    } catch (error) {
        console.error('Error in saveQuestionConfig:', error);
        return { success: false, error: error.message };
    }
}

// ==================== ADMIN AUTH OPERATIONS ====================

// Simple admin login (you can enhance this with Supabase Auth later)
async function adminLogin(email, password) {
    try {
        // For now, we'll use simple credential check
        // You can later implement Supabase Auth for more security
        if ((email === 'admin@lemikurapeace.com' && password === 'Word@1212') ||
            (email === 'admin' && password === 'admin123')) {
            
            console.log('✅ Admin login successful');
            return { success: true, user: { email: email } };
        } else {
            console.log('❌ Invalid credentials');
            return { success: false, error: 'Invalid credentials' };
        }
    } catch (error) {
        console.error('Error in adminLogin:', error);
        return { success: false, error: error.message };
    }
}

// Export all functions for use in other files
const supabaseService = {
    getAllNews,
    addNewsArticle,
    updateNewsArticle,
    updateNewsLikes,
    deleteNewsArticle,
    getAllFeedback,
    addFeedback,
    deleteFeedback,
    getQuestionConfig,
    saveQuestionConfig,
    adminLogin
};

// Make it globally available and prevent redeclaration
window.supabaseService = supabaseService;

console.log('📦 Supabase service loaded successfully - v3 (no redeclaration)');

} // End of redeclaration prevention