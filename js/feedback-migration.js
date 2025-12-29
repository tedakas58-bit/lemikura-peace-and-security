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
    
    // Check if Supabase is available
    if (typeof supabaseService === 'undefined') {
        console.error('❌ Supabase service not available');
        return { success: false, error: 'Supabase service not available' };
    }
    
    if (typeof isSupabaseConfigured !== 'function' || !isSupabaseConfigured()) {
        console.error('❌ Supabase not configured');
        return { success: false, error: 'Supabase not configured' };
    }
    
    let migrated = 0;
    let failed = 0;
    const errors = [];
    
    console.log(`📦 Found ${localFeedbacks.length} feedback entries to migrate`);
    
    for (let i = 0; i < localFeedbacks.length; i++) {
        const feedback = localFeedbacks[i];
        console.log(`📤 Migrating feedback ${i + 1}/${localFeedbacks.length}: ${feedback.fullName || 'Anonymous'}`);
        
        try {
            const result = await supabaseService.addFeedback(feedback);
            
            if (result.success) {
                migrated++;
                console.log(`✅ Migrated feedback ${i + 1} with ID: ${result.id}`);
            } else {
                failed++;
                errors.push(`Feedback ${i + 1}: ${result.error}`);
                console.error(`❌ Failed to migrate feedback ${i + 1}:`, result.error);
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
        if (typeof supabaseService === 'undefined') {
            throw new Error('Supabase service not available');
        }
        
        const result = await supabaseService.addFeedback(testData);
        
        if (result.success) {
            console.log('✅ Test feedback submitted successfully!');
            console.log('📝 Test feedback ID:', result.id);
            
            // Optionally delete the test feedback
            const deleteConfirm = confirm('Test feedback submitted successfully! Do you want to delete the test entry?');
            if (deleteConfirm && typeof supabaseService.deleteFeedback === 'function') {
                const deleteResult = await supabaseService.deleteFeedback(result.id);
                if (deleteResult.success) {
                    console.log('✅ Test feedback deleted successfully');
                } else {
                    console.log('⚠️ Test feedback created but could not be deleted:', deleteResult.error);
                }
            }
            
            return { success: true, message: 'Test feedback submission successful' };
        } else {
            console.error('❌ Test feedback submission failed:', result.error);
            return { success: false, error: result.error };
        }
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