// Quick Diagnostic Commands for Main Page Feedback System
// Copy and paste these into browser console on main page

// 1. Check overall system status
function checkFeedbackSystemStatus() {
    console.log('🔍 FEEDBACK SYSTEM DIAGNOSTIC');
    console.log('================================');
    
    // Check Supabase
    console.log('📡 Supabase Status:');
    console.log('- Library loaded:', typeof window.supabase !== 'undefined');
    console.log('- Config available:', typeof supabaseConfig !== 'undefined');
    console.log('- Client functional:', window.supabase && typeof window.supabase.from === 'function');
    
    // Check question config
    console.log('\n📋 Question Config Status:');
    console.log('- Main page config loaded:', typeof mainPageQuestionConfig !== 'undefined');
    console.log('- Config has data:', mainPageQuestionConfig && Object.keys(mainPageQuestionConfig).length > 0);
    
    if (mainPageQuestionConfig) {
        Object.keys(mainPageQuestionConfig).forEach(category => {
            console.log(`- ${category}: ${mainPageQuestionConfig[category].length} questions`);
        });
    }
    
    // Check localStorage backup
    const backupConfig = localStorage.getItem('mainPageQuestionConfig');
    console.log('- Backup in localStorage:', !!backupConfig);
    
    // Check form elements
    console.log('\n🎨 Form Status:');
    console.log('- Loading state visible:', document.getElementById('feedbackLoadingState').style.display !== 'none');
    console.log('- Dynamic form visible:', document.getElementById('dynamicFeedbackContainer').style.display !== 'none');
    console.log('- Fallback form visible:', document.getElementById('fallbackCommentForm').style.display !== 'none');
    
    return 'Diagnostic complete - check console output above';
}

// 2. Test admin panel connection
async function testAdminConnection() {
    console.log('🧪 Testing Admin Panel Connection...');
    
    try {
        if (!window.supabase || typeof window.supabase.from !== 'function') {
            throw new Error('Supabase client not available');
        }
        
        const { data, error } = await window.supabase
            .from('question_config')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (error) {
            console.error('❌ Admin connection failed:', error);
            return { success: false, error: error.message };
        }
        
        if (data && data.length > 0) {
            console.log('✅ Admin connection successful!');
            console.log('📊 Latest config from admin:', data[0]);
            console.log('📅 Last updated:', new Date(data[0].updated_at).toLocaleString());
            return { success: true, data: data[0] };
        } else {
            console.log('⚠️ No question config found in admin panel');
            return { success: false, error: 'No config found' };
        }
    } catch (error) {
        console.error('❌ Connection test failed:', error);
        return { success: false, error: error.message };
    }
}

// 3. Force reload questions from admin
async function forceReloadFromAdmin() {
    console.log('🔄 Force reloading questions from admin panel...');
    
    try {
        // Clear localStorage cache
        localStorage.removeItem('mainPageQuestionConfig');
        console.log('🗑️ Cleared localStorage cache');
        
        // Reload configuration
        await loadMainPageQuestionConfig();
        console.log('📥 Reloaded configuration');
        
        // Regenerate form
        generateMainPageForm();
        console.log('🎨 Regenerated form');
        
        // Reinitialize ratings
        setTimeout(initializeMainPageStarRatings, 100);
        console.log('⭐ Reinitialized star ratings');
        
        console.log('✅ Force reload complete!');
        return 'Success - form updated with latest admin questions';
    } catch (error) {
        console.error('❌ Force reload failed:', error);
        return 'Failed - ' + error.message;
    }
}

// 4. Compare admin vs displayed questions
async function compareAdminVsDisplayed() {
    console.log('🔍 Comparing Admin Panel vs Displayed Questions...');
    
    try {
        // Get admin questions
        const adminResult = await testAdminConnection();
        if (!adminResult.success) {
            console.log('❌ Cannot get admin questions:', adminResult.error);
            return;
        }
        
        const adminQuestions = adminResult.data.config;
        const displayedQuestions = mainPageQuestionConfig;
        
        console.log('📊 COMPARISON RESULTS:');
        console.log('======================');
        
        Object.keys(adminQuestions).forEach(category => {
            const adminCount = adminQuestions[category].length;
            const displayedCount = displayedQuestions[category] ? displayedQuestions[category].length : 0;
            
            console.log(`${category}:`);
            console.log(`  Admin: ${adminCount} questions`);
            console.log(`  Displayed: ${displayedCount} questions`);
            console.log(`  Match: ${adminCount === displayedCount ? '✅' : '❌'}`);
        });
        
        // Check if configs are identical
        const identical = JSON.stringify(adminQuestions) === JSON.stringify(displayedQuestions);
        console.log(`\n🎯 Overall Match: ${identical ? '✅ IDENTICAL' : '❌ DIFFERENT'}`);
        
        if (!identical) {
            console.log('💡 Tip: Run forceReloadFromAdmin() to sync with admin panel');
        }
        
        return identical ? 'Questions match admin panel' : 'Questions differ from admin panel';
    } catch (error) {
        console.error('❌ Comparison failed:', error);
        return 'Comparison failed - ' + error.message;
    }
}

// 5. Show current form data
function showCurrentFormData() {
    console.log('📋 Current Form Data:');
    console.log('====================');
    
    const form = document.getElementById('mainPageFeedbackForm');
    if (!form) {
        console.log('❌ No form found');
        return 'No form found';
    }
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    console.log('Form fields and values:', data);
    
    // Check star ratings
    const ratings = {};
    document.querySelectorAll('input[type="hidden"]').forEach(input => {
        if (input.value) {
            ratings[input.name] = input.value;
        }
    });
    
    console.log('Star ratings:', ratings);
    
    return { formData: data, ratings: ratings };
}

// Make functions globally available
window.checkFeedbackSystemStatus = checkFeedbackSystemStatus;
window.testAdminConnection = testAdminConnection;
window.forceReloadFromAdmin = forceReloadFromAdmin;
window.compareAdminVsDisplayed = compareAdminVsDisplayed;
window.showCurrentFormData = showCurrentFormData;

console.log('🛠️ Diagnostic commands loaded! Available functions:');
console.log('- checkFeedbackSystemStatus() - Overall system check');
console.log('- testAdminConnection() - Test connection to admin panel');
console.log('- forceReloadFromAdmin() - Force reload questions from admin');
console.log('- compareAdminVsDisplayed() - Compare admin vs displayed questions');
console.log('- showCurrentFormData() - Show current form data');