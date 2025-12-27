// Supabase Configuration
// IMPORTANT: Replace these placeholder values with your actual Supabase project details
// 1. Go to https://supabase.com and create a new project
// 2. Go to Settings > API in your Supabase dashboard
// 3. Copy your Project URL and anon/public API key
// 4. Replace the values below

const supabaseConfig = {
    url: 'https://asfrnjaegyzwpseryawi.supabase.co', // Your Project URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZnJuamFlZ3l6d3BzZXJ5YXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDg4OTAsImV4cCI6MjA4MjQyNDg5MH0.7vLsda2lKd-9zEyeNJgGXQ39TmN1XZ-TfI4BHM_eWD8' // Your anon/public API key
};

// Initialize Supabase client
let supabase;

function initializeSupabase() {
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey);
        console.log('✅ Supabase initialized successfully');
        return true;
    } else {
        console.error('❌ Supabase library not loaded');
        return false;
    }
}

// Check if Supabase is configured
function isSupabaseConfigured() {
    return supabaseConfig.url !== 'https://your-project-ref.supabase.co' && 
           supabaseConfig.anonKey !== 'your-anon-key-here' &&
           supabaseConfig.url !== 'YOUR_SUPABASE_URL' && 
           supabaseConfig.anonKey !== 'YOUR_SUPABASE_ANON_KEY';
}

console.log('📦 Supabase configuration loaded');
console.log('🔧 Configured:', isSupabaseConfigured() ? 'Yes' : 'No - Please update supabase-config.js with your project details');