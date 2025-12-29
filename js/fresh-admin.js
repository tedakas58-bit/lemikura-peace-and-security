// Fresh Admin System - Built from scratch
// Simple, clean, working admin functionality

console.log('🚀 Loading Fresh Admin System...');

// Configuration
const ADMIN_CONFIG = {
    email: 'admin@lemikurapeace.com',
    password: 'Word@1212',
    supabaseUrl: 'https://asfrnjaegyzwpseryawi.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZnJuamFlZ3l6d3BzZXJ5YXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDg4OTAsImV4cCI6MjA4MjQyNDg5MH0.7vLsda2lKd-9zEyeNJgGXQ39TmN1XZ-TfI4BHM_eWD8'
};

// Global variables
let supabaseClient = null;
let adminData = {
    news: [],
    comments: [],
    feedback: []
};

// Initialize Supabase
async function initializeSupabase() {
    try {
        // Wait for Supabase library to load
        let attempts = 0;
        while (attempts < 20) {
            if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
                supabaseClient = window.supabase.createClient(ADMIN_CONFIG.supabaseUrl, ADMIN_CONFIG.supabaseKey);
                console.log('✅ Supabase initialized successfully');
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        
        console.log('⚠️ Supabase library not loaded, using offline mode');
        return false;
    } catch (error) {
        console.error('❌ Supabase initialization error:', error);
        return false;
    }
}

// Authentication
function login(email, password) {
    if (email === ADMIN_CONFIG.email && password === ADMIN_CONFIG.password) {
        console.log('✅ Admin login successful');
        return true;
    }
    console.log('❌ Invalid credentials');
    return false;
}

// News Management
async function loadNews() {
    console.log('📡 Loading news...');
    
    try {
        if (!supabaseClient) {
            console.log('⚠️ No database connection, using empty data');
            adminData.news = [];
            return adminData.news;
        }
        
        const { data, error } = await supabaseClient
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('❌ Error loading news:', error);
            adminData.news = [];
        } else {
            adminData.news = data || [];
            console.log('✅ Loaded', adminData.news.length, 'news items');
        }
        
        return adminData.news;
    } catch (error) {
        console.error('❌ Error loading news:', error);
        adminData.news = [];
        return adminData.news;
    }
}

async function addNews(newsData) {
    console.log('➕ Adding news:', newsData.title);
    
    try {
        if (!supabaseClient) {
            throw new Error('Database not available');
        }
        
        const newsItem = {
            title: newsData.title,
            category: newsData.category,
            excerpt: newsData.excerpt,
            content: newsData.content,
            image: newsData.image || 'images/hero-bg.jpg',
            likes: 0,
            date_display: new Date().toLocaleDateString('am-ET'),
            created_at: new Date().toISOString()
        };
        
        const { data, error } = await supabaseClient
            .from('news')
            .insert([newsItem])
            .select();
        
        if (error) {
            throw error;
        }
        
        console.log('✅ News added successfully:', data);
        return { success: true, data: data };
    } catch (error) {
        console.error('❌ Error adding news:', error);
        return { success: false, error: error.message };
    }
}

async function deleteNews(id) {
    console.log('🗑️ Deleting news:', id);
    
    try {
        if (!supabaseClient) {
            throw new Error('Database not available');
        }
        
        const { error } = await supabaseClient
            .from('news')
            .delete()
            .eq('id', id);
        
        if (error) {
            throw error;
        }
        
        console.log('✅ News deleted successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ Error deleting news:', error);
        return { success: false, error: error.message };
    }
}

// Comments Management
async function loadComments() {
    console.log('📡 Loading comments...');
    
    try {
        if (!supabaseClient) {
            adminData.comments = [];
            return adminData.comments;
        }
        
        const { data, error } = await supabaseClient
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('❌ Error loading comments:', error);
            adminData.comments = [];
        } else {
            adminData.comments = data || [];
            console.log('✅ Loaded', adminData.comments.length, 'comments');
        }
        
        return adminData.comments;
    } catch (error) {
        console.error('❌ Error loading comments:', error);
        adminData.comments = [];
        return adminData.comments;
    }
}

// Feedback Management
async function loadFeedback() {
    console.log('📡 Loading feedback...');
    
    try {
        if (!supabaseClient) {
            adminData.feedback = [];
            return adminData.feedback;
        }
        
        const { data, error } = await supabaseClient
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('❌ Error loading feedback:', error);
            adminData.feedback = [];
        } else {
            adminData.feedback = data || [];
            console.log('✅ Loaded', adminData.feedback.length, 'feedback items');
        }
        
        return adminData.feedback;
    } catch (error) {
        console.error('❌ Error loading feedback:', error);
        adminData.feedback = [];
        return adminData.feedback;
    }
}

// Statistics
function getStats() {
    const totalNews = adminData.news.length;
    const totalComments = adminData.comments.length;
    const totalFeedback = adminData.feedback.length;
    const totalLikes = adminData.news.reduce((sum, news) => sum + (news.likes || 0), 0);
    
    return {
        news: totalNews,
        comments: totalComments,
        feedback: totalFeedback,
        likes: totalLikes
    };
}

// Export functions for global use
window.FreshAdmin = {
    initialize: initializeSupabase,
    login: login,
    loadNews: loadNews,
    addNews: addNews,
    deleteNews: deleteNews,
    loadComments: loadComments,
    loadFeedback: loadFeedback,
    getStats: getStats,
    data: adminData
};

console.log('✅ Fresh Admin System loaded');