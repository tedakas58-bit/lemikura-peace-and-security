// Main Page Feedback Debug Commands
// Copy and paste this entire script into the browser console on index.html

console.log('🔍 MAIN PAGE FEEDBACK DIAGNOSTIC');
console.log('================================');

// 1. Check if the dynamic feedback system loaded at all
console.log('📋 System Status:');
console.log('- mainPageQuestionConfig exists:', typeof mainPageQuestionConfig !== 'undefined');
console.log('- initializeDynamicFeedback exists:', typeof initializeDynamicFeedback !== 'undefined');
console.log('- loadMainPageQuestionConfig exists:', typeof loadMainPageQuestionConfig !== 'undefined');

// 2. Check DOM elements
console.log('\n🎨 DOM Elements:');
const loadingState = document.getElementById('feedbackLoadingState');
const dynamicContainer = document.getElementById('dynamicFeedbackContainer');
const fallbackForm = document.getElementById('fallbackCommentForm');

console.log('- feedbackLoadingState exists:', !!loadingState);
console.log('- dynamicFeedbackContainer exists:', !!dynamicContainer);
console.log('- fallbackCommentForm exists:', !!fallbackForm);

if (loadingState) console.log('- Loading state display:', loadingState.style.display);
if (dynamicContainer) console.log('- Dynamic container display:', dynamicContainer.style.display);
if (fallbackForm) console.log('- Fallback form display:', fallbackForm.style.display);

// 3. Check Supabase
console.log('\n📡 Supabase Status:');
console.log('- Supabase library loaded:', typeof window.supabase !== 'undefined');
console.log('- Supabase config exists:', typeof supabaseConfig !== 'undefined');

if (typeof supabaseConfig !== 'undefined') {
    console.log('- Supabase URL:', supabaseConfig.url);
    console.log('- Has API key:', !!supabaseConfig.anonKey);
}

// 4. Check console for errors
console.log('\n🚨 Check browser console for any error messages above this diagnostic');

// 5. Manual initialization test
console.log('\n🧪 Testing Manual Initialization...');

if (typeof initializeDynamicFeedback === 'function') {
    console.log('✅ initializeDynamicFeedback function exists - trying to run it...');
    try {
        initializeDynamicFeedback();
        console.log('✅ Manual initialization started');
    } catch (error) {
        console.error('❌ Manual initialization failed:', error);
    }
} else {
    console.log('❌ initializeDynamicFeedback function not found');
    console.log('💡 This means the dynamic feedback JavaScript didn\'t load properly');
}

// 6. Test Supabase connection manually
async function testSupabaseManually() {
    console.log('\n🔌 Testing Supabase Connection...');
    
    try {
        if (typeof window.supabase === 'undefined') {
            throw new Error('Supabase library not loaded');
        }
        
        let supabaseClient;
        if (typeof window.supabase.createClient === 'function') {
            supabaseClient = window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey);
        } else {
            supabaseClient = window.supabase;
        }
        
        const { data, error } = await supabaseClient
            .from('question_config')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (error) {
            console.error('❌ Supabase query failed:', error);
            return false;
        }
        
        if (data && data.length > 0) {
            console.log('✅ Supabase connection successful!');
            console.log('📊 Found question config:', data[0]);
            
            // Try to manually set the config
            window.mainPageQuestionConfig = data[0].config;
            console.log('✅ Manually set mainPageQuestionConfig');
            
            return data[0].config;
        } else {
            console.log('⚠️ No question config found in database');
            console.log('💡 You need to create questions in the admin panel first');
            return false;
        }
    } catch (error) {
        console.error('❌ Supabase test failed:', error);
        return false;
    }
}

// 7. Manual form generation test
function testFormGeneration(config) {
    console.log('\n🎨 Testing Form Generation...');
    
    if (!config) {
        console.log('❌ No config provided for form generation');
        return;
    }
    
    const container = document.getElementById('mainPageDynamicContent');
    if (!container) {
        console.log('❌ mainPageDynamicContent container not found');
        return;
    }
    
    try {
        // Simple form generation test
        let formHTML = '<div class="test-form">';
        
        Object.keys(config).forEach(category => {
            if (config[category] && config[category].length > 0) {
                formHTML += `<h3>${category} (${config[category].length} questions)</h3>`;
                
                config[category].slice(0, 2).forEach(question => {
                    formHTML += `<p><strong>${question.label}</strong> (${question.type})</p>`;
                });
            }
        });
        
        formHTML += '</div>';
        container.innerHTML = formHTML;
        
        console.log('✅ Test form generated successfully');
        
        // Show the dynamic container
        const dynamicContainer = document.getElementById('dynamicFeedbackContainer');
        const loadingState = document.getElementById('feedbackLoadingState');
        
        if (loadingState) loadingState.style.display = 'none';
        if (dynamicContainer) dynamicContainer.style.display = 'block';
        
        console.log('✅ Form container made visible');
        
    } catch (error) {
        console.error('❌ Form generation failed:', error);
    }
}

// Run the tests
console.log('\n🚀 Running automatic tests...');

// Test Supabase and try to load config
testSupabaseManually().then(config => {
    if (config) {
        console.log('\n✅ Config loaded successfully, testing form generation...');
        testFormGeneration(config);
    } else {
        console.log('\n❌ Could not load config from admin panel');
        console.log('💡 Possible solutions:');
        console.log('   1. Check if you have created questions in admin panel');
        console.log('   2. Check CORS settings in Supabase');
        console.log('   3. Verify Supabase configuration');
    }
});

// Make functions available globally for manual testing
window.testSupabaseManually = testSupabaseManually;
window.testFormGeneration = testFormGeneration;

console.log('\n🛠️ Available manual test functions:');
console.log('- testSupabaseManually() - Test Supabase connection and load config');
console.log('- testFormGeneration(config) - Test form generation with config');