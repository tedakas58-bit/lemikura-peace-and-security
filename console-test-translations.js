// Console test for bilingual system
// Run this in the browser console after the page loads

console.log('🧪 Starting Translation System Test...');

// Wait for bilingual system to load
setTimeout(() => {
    console.log('🔍 Checking bilingual system...');
    
    if (typeof bilingualSystem === 'undefined') {
        console.error('❌ Bilingual system not loaded!');
        return;
    }
    
    console.log('✅ Bilingual system loaded');
    console.log('📊 Current language:', bilingualSystem.getCurrentLanguage());
    
    // Test key translations
    const testKeys = [
        'navHome', 'navAbout', 'heroTitle', 'heroDescription',
        'aboutVision', 'aboutVisionText', 'commentsTitle', 
        'commentAuthor', 'selectSubject'
    ];
    
    console.log('🔍 Testing translations...');
    testKeys.forEach(key => {
        const translation = bilingualSystem.translate(key);
        const status = translation !== key ? '✅' : '❌';
        console.log(`${status} ${key}: "${translation}"`);
    });
    
    // Count elements
    const elements = document.querySelectorAll('[data-translate]');
    console.log(`📝 Found ${elements.length} translatable elements`);
    
    // Test language toggle
    console.log('🔄 Testing language toggle...');
    const currentLang = bilingualSystem.getCurrentLanguage();
    console.log('Current language before toggle:', currentLang);
    
    // Toggle language
    bilingualSystem.toggleLanguage();
    
    setTimeout(() => {
        const newLang = bilingualSystem.getCurrentLanguage();
        console.log('Current language after toggle:', newLang);
        
        if (newLang !== currentLang) {
            console.log('✅ Language toggle working!');
        } else {
            console.log('❌ Language toggle not working');
        }
        
        // Test a few translations in the new language
        console.log('🔍 Testing translations in new language...');
        testKeys.slice(0, 3).forEach(key => {
            const translation = bilingualSystem.translate(key);
            console.log(`${key}: "${translation}"`);
        });
        
        console.log('🎯 Translation test completed!');
    }, 1000);
    
}, 3000);

// Function to manually test language switching
window.testLanguageSwitch = function() {
    console.log('🔄 Manual language switch test...');
    if (bilingualSystem) {
        const before = bilingualSystem.getCurrentLanguage();
        bilingualSystem.toggleLanguage();
        setTimeout(() => {
            const after = bilingualSystem.getCurrentLanguage();
            console.log(`Language switched: ${before} → ${after}`);
        }, 500);
    }
};

// Function to test specific translation
window.testTranslation = function(key) {
    if (bilingualSystem) {
        const translation = bilingualSystem.translate(key);
        console.log(`Translation for "${key}": "${translation}"`);
        return translation;
    }
    return null;
};

console.log('🚀 Translation test script loaded. Tests will run automatically in 3 seconds.');
console.log('💡 You can also run testLanguageSwitch() or testTranslation("keyName") manually.');