// Feedback Migration and Management Utility
// This script helps migrate feedback from localStorage to Supabase and manage feedback data

console.log('📋 Feedback Migration Utility Loaded');

// Check current feedback storage status
function checkFeedbackStorage() {
    console.log('📊 === FEEDBACK STORAGE STATUS ===');
    
    // Check localStorage
    const localFeedbacks = JSON.parse(localStorage.getItem('feedbackSurveys') || '[]');
    console.log(`📦 LocalStorage: ${localFeedbacks.length} feedback entries`);
    
    if (localFeedbacks.length > 0) {
        console.log('📝 Sample localStorage feedback:');
        console.log(localFeedbacks[0]);
        
        console.log('📅 Feedback dates:');
        localFeedbacks.forEach((feedback, index) => {
            console.log(`  ${index + 1}. ${feedback.fullName || 'Anonymous'} - ${feedback.date || feedback.timestamp}`);
        });
    }
    
    // Check Supabase status
    console.log('\n🔍 Supabase Status:');
    console.log('- Library loaded:', typeof window.supabase !== 'undefined');
    console.log('- Config available:', typeof supabaseConfig !== 'undefined');
    console.log('- Service available:', typeof supabaseService !== 'undefined');
    console.log('- Configured:', typeof isSupabaseConfigured === 'function' ? isSupabaseConfigured() : 'Unknown');
    
    return {
        localCount: localFeedbacks.length,
        localData: localFeedbacks,
        supabaseAvailable: typeof window.supabase !== 'undefined' && typeof supabaseService !== 'undefined'
    };
}

// Migrate all localStorage feedback to Supabase
async function migrateFeedbackToSupabase() {
    console.log('🚀 Starting feedback migration from localStorage to Supabase...');
    
    const localFeedbacks = JSON.parse(localStorage.getItem('feedbackSurveys') || '[]');
    
    if (localFeedbacks.length === 0) {
        console.log('📝 No feedback found in localStorage to migrate');
        return { success: true, migrated: 0, message: 'No feedback to migrate' };
    }
    
    // Check if Supabase is available and properly initialized
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase library not available');
        return { success: false, error: 'Supabase library not available' };
    }
    
    // Try to initialize Supabase client if not already done
    let supabaseClient = window.supabase;
    
    // If supabase is not a client object, try to create one
    if (!supabaseClient || typeof supabaseClient.from !== 'function') {
        console.log('🔧 Creating Supabase client...');
        
        // Try to get the library from different possible locations
        const supabaseLib = window.supabaseLib || (window.supabase && window.supabase.createClient ? window.supabase : null);
        
        if (supabaseLib && typeof supabaseConfig !== 'undefined' && supabaseConfig.url && supabaseConfig.anonKey) {
            try {
                supabaseClient = supabaseLib.createClient(supabaseConfig.url, supabaseConfig.anonKey);
                console.log('✅ Supabase client created successfully');
                
                // Store it globally for future use
                window.supabase = supabaseClient;
            } catch (error) {
                console.error('❌ Error creating Supabase client:', error);
                return { success: false, error: 'Failed to create Supabase client: ' + error.message };
            }
        } else {
            console.error('❌ Supabase library or configuration not available');
            console.log('- Library available:', typeof supabaseLib !== 'undefined');
            console.log('- Config available:', typeof supabaseConfig !== 'undefined');
            return { success: false, error: 'Supabase library or configuration not available' };
        }
    }
    
    // Verify the client works
    if (!supabaseClient || typeof supabaseClient.from !== 'function') {
        console.error('❌ Supabase client not properly initialized');
        return { success: false, error: 'Supabase client not properly initialized' };
    }
    
    let migrated = 0;
    let failed = 0;
    const errors = [];
    
    console.log(`📦 Found ${localFeedbacks.length} feedback entries to migrate`);
    
    for (let i = 0; i < localFeedbacks.length; i++) {
        const feedback = localFeedbacks[i];
        console.log(`📤 Migrating feedback ${i + 1}/${localFeedbacks.length}: ${feedback.fullName || 'Anonymous'}`);
        
        try {
            // Direct Supabase insertion (bypassing the service layer for now)
            const { data, error } = await supabaseClient
                .from('feedback')
                .insert([{
                    full_name: feedback.fullName,
                    age: feedback.age,
                    gender: feedback.gender,
                    education: feedback.education,
                    service_type: feedback.serviceType,
                    visit_purpose: feedback.visitPurpose,
                    staff_behavior: parseInt(feedback.staff_behavior) || 0,
                    service_speed: parseInt(feedback.service_speed) || 0,
                    service_quality: parseInt(feedback.service_quality) || 0,
                    overall_satisfaction: parseInt(feedback.overall_satisfaction) || 0,
                    staff_understanding: parseInt(feedback.staff_understanding) || 0,
                    employee_empathy: parseInt(feedback.employee_empathy) || 0,
                    needs_understanding: parseInt(feedback.needs_understanding) || 0,
                    suggestions: feedback.suggestions,
                    complaints: feedback.complaints,
                    date_display: feedback.date || new Date().toLocaleDateString('am-ET'),
                    created_at: new Date().toISOString()
                }])
                .select();
            
            if (error) {
                failed++;
                errors.push(`Feedback ${i + 1}: ${error.message}`);
                console.error(`❌ Failed to migrate feedback ${i + 1}:`, error.message);
            } else {
                migrated++;
                console.log(`✅ Migrated feedback ${i + 1} with ID: ${data[0].id}`);
            }
        } catch (error) {
            failed++;
            errors.push(`Feedback ${i + 1}: ${error.message}`);
            console.error(`❌ Error migrating feedback ${i + 1}:`, error);
        }
        
        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📊 Migration Summary:`);
    console.log(`✅ Successfully migrated: ${migrated}`);
    console.log(`❌ Failed to migrate: ${failed}`);
    
    if (errors.length > 0) {
        console.log(`\n❌ Errors encountered:`);
        errors.forEach(error => console.log(`  - ${error}`));
    }
    
    // If all feedback was successfully migrated, offer to clear localStorage
    if (migrated > 0 && failed === 0) {
        console.log(`\n🎉 All feedback successfully migrated to Supabase!`);
        console.log(`💡 You can now clear localStorage by running: clearLocalStorageFeedback()`);
    }
    
    return {
        success: failed === 0,
        migrated,
        failed,
        errors,
        message: `Migrated ${migrated} feedback entries${failed > 0 ? `, ${failed} failed` : ''}`
    };
}

// Clear localStorage feedback (only after successful migration)
function clearLocalStorageFeedback() {
    const localFeedbacks = JSON.parse(localStorage.getItem('feedbackSurveys') || '[]');
    
    if (localFeedbacks.length === 0) {
        console.log('📝 No feedback found in localStorage to clear');
        return { success: true, message: 'No feedback to clear' };
    }
    
    const count = localFeedbacks.length;
    
    // Ask for confirmation
    const confirmed = confirm(`Are you sure you want to clear ${count} feedback entries from localStorage?\n\nThis action cannot be undone. Make sure they are safely stored in Supabase first.`);
    
    if (confirmed) {
        localStorage.removeItem('feedbackSurveys');
        console.log(`✅ Cleared ${count} feedback entries from localStorage`);
        return { success: true, cleared: count, message: `Cleared ${count} feedback entries` };
    } else {
        console.log('❌ Clear operation cancelled by user');
        return { success: false, message: 'Operation cancelled' };
    }
}

// Get all feedback from Supabase
async function getAllFeedbackFromSupabase() {
    console.log('📡 Fetching all feedback from Supabase...');
    
    if (typeof supabaseService === 'undefined') {
        console.error('❌ Supabase service not available');
        return { success: false, error: 'Supabase service not available' };
    }
    
    try {
        const result = await supabaseService.getAllFeedback();
        
        if (result.success) {
            console.log(`✅ Found ${result.data.length} feedback entries in Supabase`);
            
            if (result.data.length > 0) {
                console.log('📝 Sample Supabase feedback:');
                console.log(result.data[0]);
                
                console.log('📅 Recent feedback:');
                result.data.slice(0, 5).forEach((feedback, index) => {
                    console.log(`  ${index + 1}. ${feedback.full_name || 'Anonymous'} - ${feedback.date_display || feedback.created_at}`);
                });
            }
            
            return result;
        } else {
            console.error('❌ Failed to fetch feedback from Supabase:', result.error);
            return result;
        }
    } catch (error) {
        console.error('❌ Error fetching feedback from Supabase:', error);
        return { success: false, error: error.message };
    }
}

// Compare localStorage and Supabase feedback
async function compareFeedbackStorage() {
    console.log('🔍 Comparing feedback storage between localStorage and Supabase...');
    
    const localFeedbacks = JSON.parse(localStorage.getItem('feedbackSurveys') || '[]');
    const supabaseResult = await getAllFeedbackFromSupabase();
    
    console.log(`\n📊 Storage Comparison:`);
    console.log(`📦 LocalStorage: ${localFeedbacks.length} entries`);
    console.log(`☁️  Supabase: ${supabaseResult.success ? supabaseResult.data.length : 'Error fetching'} entries`);
    
    if (supabaseResult.success) {
        const supabaseFeedbacks = supabaseResult.data;
        
        // Check for potential duplicates by comparing names and dates
        const potentialDuplicates = [];
        
        localFeedbacks.forEach(localFeedback => {
            const matches = supabaseFeedbacks.filter(supabaseFeedback => 
                supabaseFeedback.full_name === localFeedback.fullName &&
                (supabaseFeedback.date_display === localFeedback.date || 
                 new Date(supabaseFeedback.created_at).toDateString() === new Date(localFeedback.timestamp || localFeedback.date).toDateString())
            );
            
            if (matches.length > 0) {
                potentialDuplicates.push({
                    local: localFeedback,
                    supabase: matches[0]
                });
            }
        });
        
        console.log(`🔄 Potential duplicates found: ${potentialDuplicates.length}`);
        
        if (potentialDuplicates.length > 0) {
            console.log('⚠️  These entries might already be in Supabase:');
            potentialDuplicates.forEach((dup, index) => {
                console.log(`  ${index + 1}. ${dup.local.fullName} - ${dup.local.date}`);
            });
        }
        
        const uniqueLocal = localFeedbacks.length - potentialDuplicates.length;
        console.log(`📝 Unique localStorage entries to migrate: ${uniqueLocal}`);
        
        return {
            localCount: localFeedbacks.length,
            supabaseCount: supabaseFeedbacks.length,
            potentialDuplicates: potentialDuplicates.length,
            uniqueToMigrate: uniqueLocal
        };
    }
    
    return {
        localCount: localFeedbacks.length,
        supabaseCount: 'Error',
        error: supabaseResult.error
    };
}

// Export feedback data as JSON
function exportFeedbackData() {
    console.log('📤 Exporting feedback data...');
    
    const localFeedbacks = JSON.parse(localStorage.getItem('feedbackSurveys') || '[]');
    
    if (localFeedbacks.length === 0) {
        console.log('📝 No feedback found in localStorage to export');
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        source: 'localStorage',
        count: localFeedbacks.length,
        feedback: localFeedbacks
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `feedback-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    console.log(`✅ Exported ${localFeedbacks.length} feedback entries to JSON file`);
}

// Test feedback submission to verify Supabase connection
async function testFeedbackSubmission() {
    console.log('🧪 Testing feedback submission to Supabase...');
    
    const testData = {
        fullName: 'Test User - Migration Test',
        age: '25-35',
        gender: 'ወንድ',
        education: 'ዲግሪ',
        serviceType: 'ቅጥር ጥበቃ አገልግሎት',
        visitPurpose: 'Testing feedback migration system',
        staff_behavior: '5',
        service_speed: '4',
        service_quality: '5',
        overall_satisfaction: '5',
        staff_understanding: '4',
        employee_empathy: '5',
        needs_understanding: '4',
        suggestions: 'This is a test feedback to verify the migration system is working correctly.',
        complaints: '',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('am-ET')
    };
    
    try {
        // Check if Supabase is available
        if (typeof window.supabase === 'undefined') {
            throw new Error('Supabase library not available');
        }
        
        // Try to get or create Supabase client
        let supabaseClient = window.supabase;
        
        // If supabase is not a client object, try to create one
        if (!supabaseClient || typeof supabaseClient.from !== 'function') {
            console.log('🔧 Creating Supabase client for test...');
            
            // Try to get the library from different possible locations
            const supabaseLib = window.supabaseLib || (window.supabase && window.supabase.createClient ? window.supabase : null);
            
            if (supabaseLib && typeof supabaseConfig !== 'undefined' && supabaseConfig.url && supabaseConfig.anonKey) {
                supabaseClient = supabaseLib.createClient(supabaseConfig.url, supabaseConfig.anonKey);
                console.log('✅ Supabase client created for test');
                
                // Store it globally for future use
                window.supabase = supabaseClient;
            } else {
                throw new Error('Supabase library or configuration not available');
            }
        }
        
        // Verify the client works
        if (!supabaseClient || typeof supabaseClient.from !== 'function') {
            throw new Error('Supabase client not properly initialized');
        }
        
        console.log('📤 Submitting test feedback...');
        
        // Direct Supabase insertion
        const { data, error } = await supabaseClient
            .from('feedback')
            .insert([{
                full_name: testData.fullName,
                age: testData.age,
                gender: testData.gender,
                education: testData.education,
                service_type: testData.serviceType,
                visit_purpose: testData.visitPurpose,
                staff_behavior: parseInt(testData.staff_behavior) || 0,
                service_speed: parseInt(testData.service_speed) || 0,
                service_quality: parseInt(testData.service_quality) || 0,
                overall_satisfaction: parseInt(testData.overall_satisfaction) || 0,
                staff_understanding: parseInt(testData.staff_understanding) || 0,
                employee_empathy: parseInt(testData.employee_empathy) || 0,
                needs_understanding: parseInt(testData.needs_understanding) || 0,
                suggestions: testData.suggestions,
                complaints: testData.complaints,
                date_display: testData.date,
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) {
            console.error('❌ Test feedback submission failed:', error.message);
            return { success: false, error: error.message };
        }
        
        console.log('✅ Test feedback submitted successfully!');
        console.log('📝 Test feedback ID:', data[0].id);
        
        // Optionally delete the test feedback
        const deleteConfirm = confirm('Test feedback submitted successfully! Do you want to delete the test entry?');
        if (deleteConfirm) {
            const { error: deleteError } = await supabaseClient
                .from('feedback')
                .delete()
                .eq('id', data[0].id);
            
            if (deleteError) {
                console.log('⚠️ Test feedback created but could not be deleted:', deleteError.message);
            } else {
                console.log('✅ Test feedback deleted successfully');
            }
        }
        
        return { success: true, message: 'Test feedback submission successful', id: data[0].id };
        
    } catch (error) {
        console.error('❌ Error in test feedback submission:', error);
        return { success: false, error: error.message };
    }
}

// Make functions available globally
window.feedbackMigration = {
    checkStorage: checkFeedbackStorage,
    migrate: migrateFeedbackToSupabase,
    clearLocal: clearLocalStorageFeedback,
    getSupabase: getAllFeedbackFromSupabase,
    compare: compareFeedbackStorage,
    export: exportFeedbackData,
    test: testFeedbackSubmission
};

// Convenience functions
window.checkFeedbackStorage = checkFeedbackStorage;
window.migrateFeedbackToSupabase = migrateFeedbackToSupabase;
window.clearLocalStorageFeedback = clearLocalStorageFeedback;
window.compareFeedbackStorage = compareFeedbackStorage;
window.exportFeedbackData = exportFeedbackData;
window.testFeedbackSubmission = testFeedbackSubmission;

console.log('✅ Feedback Migration Utility Ready!');
console.log('📋 Available functions:');
console.log('  - checkFeedbackStorage() - Check current storage status');
console.log('  - migrateFeedbackToSupabase() - Migrate localStorage to Supabase');
console.log('  - compareFeedbackStorage() - Compare localStorage vs Supabase');
console.log('  - exportFeedbackData() - Export localStorage data as JSON');
console.log('  - testFeedbackSubmission() - Test Supabase connection');
console.log('  - clearLocalStorageFeedback() - Clear localStorage (after migration)');
console.log('\n💡 Start with: checkFeedbackStorage()');