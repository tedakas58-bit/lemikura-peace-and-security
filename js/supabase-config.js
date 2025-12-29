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

// Initialize Supabase client with better error handling
if (typeof initializeSupabase === 'undefined') {
    function initializeSupabase() {
        try {
            // Check if Supabase loading failed
            if (window.supabaseLoadFailed) {
                console.log('⚠️ Supabase library failed to load - using fallback mode');
                return false;
            }
            
            // Wait for Supabase library to be available with reduced attempts
            let attempts = 0;
            const maxAttempts = 10; // Reduced from 20 to 10
            
            const tryInitialize = () => {
                attempts++;
                
                if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
                    // Store the library reference before overwriting
                    const supabaseLib = window.supabase;
                    // Create the client and store it globally
                    window.supabase = supabaseLib.createClient(window.supabaseConfig.url, window.supabaseConfig.anonKey);
                    console.log('✅ Supabase initialized successfully');
                    return true;
                } else if (attempts < maxAttempts) {
                    console.log(`⏳ Waiting for Supabase library... (attempt ${attempts}/${maxAttempts})`);
                    setTimeout(tryInitialize, 500); // Reduced wait time to 500ms
                    return false;
                } else {
                    console.log('⚠️ Supabase library not loaded after', maxAttempts, 'attempts - using fallback');
                    return false;
                }
            };
            
            return tryInitialize();
        } catch (error) {
            console.error('❌ Error initializing Supabase:', error);
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

console.log('📦 Supabase configuration loaded - v5 (optimized)');
console.log('🔧 Configured:', (typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) ? 'Yes' : 'No - Please update supabase-config.js with your project details');