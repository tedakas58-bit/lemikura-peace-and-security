// Amharic Translation System
// Single language system for Amharic content

class AmharicSystem {
    constructor() {
        this.currentLanguage = 'am'; // Always Amharic
        this.translations = {};
        this.isLoading = false;
        
        // Initialize the system
        this.init();
    }
    
    async init() {
        console.log('🌐 Initializing Amharic System...');
        
        // Load translations
        await this.loadTranslations();
        console.log('✅ Amharic translations loaded');
        
        // Apply translations immediately
        this.updateTranslations();
        
        // Setup observers for dynamic content
        this.setupObservers();
        
        // Set document language to Amharic
        document.documentElement.lang = 'am';
        
        // Update font family for Amharic
        this.updateFontFamily();
        
        console.log('✅ Amharic System initialized');
    }
    
    async loadTranslations() {
        this.translations = {
            // Navigation
            navHome: "ዋና ገጽ",
            navAbout: "ስለ እኛ",
            navServices: "አገልግሎቶቻችን",
            navNews: "ዜናዎች እና ብሎጎች",
            navComments: "አስተያየት ይስጡ",
            navContact: "ያግኙን",
            navFeedback: "የአገልግሎት ግምገማ",
            navAdmin: "አስተዳዳሪ",
            
            // Site Info
            siteTitle: "ለሚ ኩራ ክ/ከተማ ሰላምና ጸጥታ አስተዳደር ጽ/ቤት",
            
            // Hero Section
            heroTitle: "ለሚ ኩራ ክ/ከ ሰላምና ጸጥታ አስተዳደር ጽ/ቤት ለላቀ ሰላም የሚተጋ",
            heroDescription: "አዲስ አበባን ሰላምና ፀጥታና ሰላም የሰፈነበት እና የህግ የበላይነት የተረጋገጠበት ከተማ እናደርጋለን፡፡",
            heroBtnServices: "አገልግሎቶች ይመልከቱ",
            heroBtnContact: "በዚህ ያገኙን",
            
            // Welcome Section
            welcomeText: "ሰላም እና ደህንነት የሕብረተሰቡን መረጋጋት እና እድገት የሚደግፉ መሠረታዊ ነገሮች ናቸው። ፅንሰ-ሀሳቦቹ ብዙ ጊዜ እርስ በርስ የተሳሰሩ ሲሆኑ ሰላም ማለት ግጭት አለመኖሩ እና የተስማሙ ግንኙነቶች መኖራቸው ሲሆን ደህንነት ግን ግለሰቦችን፣ ማህበረሰቦችን እና ሀገራትን ከውስጥ እና ከውጪ ካሉ አደጋዎች መጠበቅን ይመለከታል።",
            
            // About Section
            aboutTitle: "ስለ እኛ",
            aboutText: "ሌሚ ኩራ የሰላምና ደህንነት ቢሮ የተቋቋመው አስተማማኝ ፣ የተረጋጋና ስምምነት ያለው ማኅበረሰብ እንዲኖር ለማድረግ በጽኑ ቁርጠኝነት ነበር ። ራሳችንን የወሰነው ቡድናችን በጽኑ አቋም፣ በተጠያቂነትና በትብብር መርሆች በመመራት ግጭትን ለመከላከል፣ የሕግ የበላይነትን ለማስከበርና የሁሉንም ነዋሪዎች ደህንነት ለመጠበቅ ደከመኝ ሰለቸኝ ሳይል ይሰራል።",
            aboutAddress: "አድራሻ",
            aboutAddressText: "ከደራርቱ አደባባይ 500ሜ ገባ ብሎ",
            aboutCity: "ከተማ",
            aboutCityText: "አዲስ አበባ",
            aboutMission: "ተልእኮ",
            aboutMissionText: "የአዲስ አበባ ከተማ ልማትና መልካም አስተዳደር የሚሆን ህጎች ወጥተው ንቃተ ህግ እንዲፈጠር በማድረግ የወረዳችን ነዋሪዎች የልማት ተሣትፎ ተደራሽ የተቀላጠፈ የፍትህ አገልግሎት በመስጠት ወንጀልን በመከላከል የወረዳው አስተዳደር ለማህበረሰቡ ግንዛቤ በመፍጠር በወረዳው የህግ የበላይነት ፣ ሰላምና ፀጥታ እንዲሰፍን ማድረግ ነው ፡፡",
            aboutVision: "ራዕይ",
            aboutVisionText: "በ2025አዲስ አበባ ሰላምና ፀጥታና ሰላም የሰፈነበት እና የህግ የበላይነት የተረጋገጠበት ከተማ ለማድረግጥረት እንደ ወረዳ የራሣችንን ሚና መጫወት፡፡",
            
            // Services Section
            servicesTitle: "አገልግሎቶቻችን",
            servicesSubtitle: "የሰላምና ፀጥታ አገልግሎቶች ለማህበረሰቡ ደህንነት",
            service1Title: "ቅጥር ጥበቃ ድጋፍና ክትትል ማድረግ",
            service1Desc: "በ10ሩም በወረዳ የሚገኙ የቅጥር ጥበቃ አደረጃጀቶች ወደስራ እንዲገቡ ክትትልና ድጋፍ ያደርጋል",
            service2Title: "ሰላም ሰራዊት ስምሪት",
            service2Desc: "በወረዳ የሚፈጸሙ ወንጀል ድርጊቶችንና ህገ-ወት ተግባራት ለመከላከል ህ/ሰቡ እራሱ እናአካባቢውን የሚጠበቅበትን የአሰራር ስርአት በመዘርጋት ስለተግባራዊነቱ ክትትል ያደርጋል፡፡",
            service3Title: "ህ/ሰቡ የፀጥታው ባለቤት ማድረግ",
            service3Desc: "ህ/ሰቡ የፀጥታው ባለቤት የሚያደርጉ ተግባሮችን በወረዳው ካሉት የፀጥታ አካላት ጋር ይሰራል ይህንንም ከሚመለከተው አካል ጋር ሆኖ ያስተባብራል የስራዎችና የውጤቶች ምንጭ ሆናል፡፡",
            service4Title: "8ቱን አደረጃጀት ክትትልና ድጋፍ",
            service4Desc: "በ10ሩም ወረዳዎች ዉስጥ የሚገኙትን አደረጃጀቶች ክትትልና ድጋፍ ማድረግ",
            service5Title: "ግጭቶችን መፍታት",
            service5Desc: "በወረዳዎች የሚገኙ በፀጥታና በእምነት ያሉ ጉዳችን አስመልክቶ የሚቀርቡ አስፈላጊ ግጭቶችን፣ ሁከቶችንእንዲሁም አቤቱታዎችን በተደራጀና በተቀናጀ አግባብ ምላሽ ይሰጣል፡፡",
            service6Title: "ስጋት ቦታ መለየት",
            service6Desc: "ከወረዳዎች ጋር በመሆን ለወንጀል ስጋት የሆኑትን አካባቢዎችን በመለየት ለሚመለከተው አካል መረጃ ይሰጣል፣",
            servicesCta: "እገዛ ከፈለጉ ባለሞያዎቻችንን ያነጋግሩ",
            
            // News Section
            newsTitle: "ዜናዎች እና ብሎጎች",
            newsSubtitle: "የቅርብ ጊዜ ዜናዎች፣ ማስታወቂያዎች እና የሰላምና ፀጥታ ጉዳዮች",
            
            // Contact Section
            contactTitle: "የእናንተን አስተያየት ወይም ጥያቄ ለመቀበል ፈቃደኞች ነን።",
            contactSubtitle: "ጥያቄዎች ወይም አሳሳቢ ሁኔታዎች ካሉህ ያነጋግሩን ።",
            contactAddress: "አድራሻ",
            contactPhone: "ስልክ",
            contactEmail: "Email",
            contactHours: "የስራ ሰዓት",
            contactHoursText: "ሰኞ - ቅዳሜ: 8:00 አ.ም - 8:00 ም.ቁ<br>እሁድ: ዝግ",
            
            // Comments Section
            commentsTitle: "አስተያየቶችዎን ያካፍሉ",
            commentsDescription: "የእርስዎ አስተያየት ለእኛ ጠቃሚ ነው። እባክዎ ሀሳብዎን፣ ጥያቄዎን ወይም አስተያየትዎን ያካፍሉ።",
            commentAuthor: "ስምዎ",
            commentEmail: "ኢሜይል (አማራጭ)",
            commentSubject: "ርዕስ",
            commentText: "አስተያየትዎ",
            commentPlaceholder: "እባክዎ አስተያየትዎን እዚህ ይጻፉ...",
            submitComment: "አስተያየት ላክ",
            resetForm: "ዳግም አስጀምር",
            
            // Comment Subject Options
            selectSubject: "ርዕስ ይምረጡ",
            generalFeedback: "አጠቃላይ አስተያየት",
            serviceRequest: "አገልግሎት ጥያቄ",
            complaint: "ቅሬታ",
            appreciation: "አመስጋኝነት",
            suggestion: "ሀሳብ",
            
            // Footer
            footerQuickLinks: "ፈጣን አገናኞች",
            footerServices: "አገልግሎቶቻችን",
            footerContact: "ያግኙን",
            footerRights: "ለሚ ኩራ ሰላምና ፀጥታ አስተዳደር። ሁሉም መብቶች የተጠበቁ ናቸው።",
            footerPrivacy: "የግላዊነት ፖሊሲ",
            footerTerms: "የአጠቃቀም ደንብ"
        };
    }
    
    updateTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        console.log(`🔍 Found ${elements.length} elements with data-translate attributes`);
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translations[key];
            
            console.log(`🔄 Translating "${key}": "${translation}"`);
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translation;
                } else if (element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.innerHTML = translation;
                }
                console.log(`✅ Updated element with key "${key}"`);
            } else {
                console.warn(`⚠️ No translation found for key "${key}"`);
            }
        });
        
        console.log(`🎯 Translation update complete`);
    }
    
    updateFontFamily() {
        const body = document.body;
        // Add Amharic font support
        body.style.fontFamily = "'Noto Sans Ethiopic', 'Poppins', sans-serif";
    }
    
    setupObservers() {
        // Observer for dynamically added content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const translatableElements = node.querySelectorAll('[data-translate]');
                            if (translatableElements.length > 0) {
                                this.updateTranslations();
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Public API
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    translate(key) {
        return this.translations[key] || key;
    }
    
    // Debug function
    debug() {
        console.log('🔧 Amharic System Debug Info:');
        console.log('Current Language:', this.currentLanguage);
        console.log('Available Translations:', Object.keys(this.translations).length);
        console.log('Elements with data-translate:', document.querySelectorAll('[data-translate]').length);
        
        const elements = document.querySelectorAll('[data-translate]');
        console.log('First 5 translatable elements:');
        Array.from(elements).slice(0, 5).forEach((el, i) => {
            const key = el.getAttribute('data-translate');
            const translation = this.translations[key];
            console.log(`${i + 1}. Key: "${key}", Translation: "${translation}", Element:`, el);
        });
        
        return {
            currentLanguage: this.currentLanguage,
            totalElements: elements.length,
            translations: this.translations
        };
    }
}

// Initialize the Amharic system
let amharicSystem;

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, initializing Amharic system...');
    amharicSystem = new AmharicSystem();
});

// Global functions for backward compatibility
window.getCurrentLanguage = function() {
    return 'am';
};

window.translate = function(key) {
    if (amharicSystem) {
        return amharicSystem.translate(key);
    }
    return key;
};

// Debug function for console testing
window.debugTranslations = function() {
    if (amharicSystem) {
        return amharicSystem.debug();
    } else {
        console.error('❌ Amharic system not initialized yet');
        return null;
    }
};

// Test translation function
window.testTranslation = function(key) {
    if (amharicSystem) {
        const translation = amharicSystem.translate(key);
        console.log(`Translation for "${key}":`, translation);
        return translation;
    }
    return null;
};

// Manual translation trigger
window.manualTranslate = function() {
    console.log('🔄 Manual translation trigger...');
    if (amharicSystem) {
        amharicSystem.updateTranslations();
        console.log('✅ Manual translation complete');
    } else {
        console.error('❌ Amharic system not available');
    }
};

console.log('📚 Amharic System script loaded');