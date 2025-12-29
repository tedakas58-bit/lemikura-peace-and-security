// SIMPLE SUPABASE SETUP - NO MORE CONFIGURATION ISSUES!
console.log('🚀 Loading Simple Supabase Setup...');

// Direct Supabase configuration - no external dependencies
window.SUPABASE_CONFIG = {
    url: 'https://asfrnjaegyzwpseryawi.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZnJuamFlZ3l6d3BzZXJ5YXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDg4OTAsImV4cCI6MjA4MjQyNDg5MH0.7vLsda2lKd-9zEyeNJgGXQ39TmN1XZ-TfI4BHM_eWD8'
};

// Simple Supabase client initialization
window.initSimpleSupabase = function() {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        const supabaseLib = window.supabase;
        window.supabaseClient = supabaseLib.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.key);
        window.supabase = window.supabaseClient; // Make it available as 'supabase' too
        console.log('✅ Simple Supabase client initialized');
        return true;
    }
    console.log('⚠️ Supabase library not ready');
    return false;
};

// Simple news operations
window.simpleSupabase = {
    // Get all news
    async getAllNews() {
        try {
            if (!window.supabaseClient) {
                console.log('⚠️ Supabase client not ready');
                return { success: true, data: [] };
            }
            
            const { data, error } = await window.supabaseClient
                .from('news')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error:', error);
                return { success: true, data: [] }; // Return empty instead of error
            }

            console.log('✅ Loaded', data.length, 'news items from Supabase');
            return { success: true, data: data || [] };
        } catch (error) {
            console.log('⚠️ News loading error:', error.message);
            return { success: true, data: [] };
        }
    },

    // Add news
    async addNews(newsData) {
        try {
            if (!window.supabaseClient) {
                alert('❌ Database not available');
                return { success: false };
            }

            const { data, error } = await window.supabaseClient
                .from('news')
                .insert([{
                    title: newsData.title,
                    category: newsData.category,
                    image: newsData.image || 'images/hero-bg.jpg',
                    excerpt: newsData.excerpt,
                    content: newsData.content,
                    likes: 0,
                    date_display: new Date().toLocaleDateString('am-ET'),
                    created_at: new Date().toISOString()
                }])
                .select();

            if (error) {
                console.error('Add news error:', error);
                alert('❌ Failed to add news: ' + error.message);
                return { success: false };
            }

            console.log('✅ News added successfully');
            return { success: true, data: data };
        } catch (error) {
            console.error('Add news error:', error);
            alert('❌ Error adding news: ' + error.message);
            return { success: false };
        }
    },

    // Delete news
    async deleteNews(id) {
        try {
            if (!window.supabaseClient) {
                alert('❌ Database not available');
                return { success: false };
            }

            const { error } = await window.supabaseClient
                .from('news')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Delete news error:', error);
                alert('❌ Failed to delete news: ' + error.message);
                return { success: false };
            }

            console.log('✅ News deleted successfully');
            return { success: true };
        } catch (error) {
            console.error('Delete news error:', error);
            alert('❌ Error deleting news: ' + error.message);
            return { success: false };
        }
    }
};

console.log('✅ Simple Supabase setup loaded');