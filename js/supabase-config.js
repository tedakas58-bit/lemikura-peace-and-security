// Supabase Configuration
// IMPORTANT: Replace these placeholder values with your actual Supabase project details
// 1. Go to https://supabase.com and create a new project
// 2. Go to Settings > API in your Supabase dashboard
// 3. Copy your Project URL and anon/public API key
// 4. Replace the values below

// Prevent redeclaration errors
if (typeof supabaseConfig === 'undefined') {
    const supabaseConfig = {
        url: 'https://asfrnjaegyzwpseryawi.supabase.co', // Your Project URL
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZnJuamFlZ3l6d3BzZXJ5YXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDg4OTAsImV4cCI6MjA4MjQyNDg5MH0.7vLsda2lKd-9zEyeNJgGXQ39TmN1XZ-TfI4BHM_eWD8' // Your anon/public API key
    };
    
    // Make it globally available
    window.supabaseConfig = supabaseConfig;
}

// Initialize Supabase client
// Note: supabase client will be stored in window.supabase after initialization

if (typeof initializeSupabase === 'undefined') {
    function initializeSupabase() {
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            // Store the library reference before overwriting
            const supabaseLib = window.supabase;
            // Create the client and store it globally
            window.supabase = supabaseLib.createClient(window.supabaseConfig.url, window.supabaseConfig.anonKey);
            console.log('✅ Supabase initialized successfully');
            return true;
        } else {
            console.error('❌ Supabase library not loaded');
            return false;
        }
    }
    
    // Make it globally available
    window.initializeSupabase = initializeSupabase;
}

// Check if Supabase is configured
if (typeof isSupabaseConfigured === 'undefined') {
    function isSupabaseConfigured() {
        const config = window.supabaseConfig || supabaseConfig;
        return config.url !== 'https://your-project-ref.supabase.co' && 
               config.anonKey !== 'your-anon-key-here' &&
               config.url !== 'YOUR_SUPABASE_URL' && 
               config.anonKey !== 'YOUR_SUPABASE_ANON_KEY';
    }
    
    // Make it globally available
    window.isSupabaseConfigured = isSupabaseConfigured;
}

console.log('📦 Supabase configuration loaded - v3 (no redeclaration)');
console.log('🔧 Configured:', (typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) ? 'Yes' : 'No - Please update supabase-config.js with your project details');