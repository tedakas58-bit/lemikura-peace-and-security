// Fixed Translation System for Lemi Kura Peace and Security Website

const translations = {
    am: {
        // Site Title
        siteTitle: 'ለሚ ኩራ ክ/ከተማ ሰላምና ፀጥታ አስተዳደር ጽ/ቤት',
        
        // Navigation
        navHome: 'ዋና ገጽ',
        navAbout: 'ስለ እኛ',
        navServices: 'አገልግሎቶቻችን',
        navNews: 'ዜናዎች እና ብሎጎች',
        navComments: 'አስተያየት ይስጡ',
        navContact: 'ያግኙን',
        navFeedback: 'የአገልግሎት ግምገማ',
        navAdmin: 'አስተዳዳሪ',
        
        // Hero Section
        heroTitle: 'ለሚ ኩራ ክ/ከ ሰላምና ጸጥታ አስተዳደር ጽ/ቤት ለላቀ ሰላም የሚተጋ',
        heroDescription: 'አዲስ አበባን ሰላምና ፀጥታና ሰላም የሰፈነበት እና የህግ የበላይነት የተረጋገጠበት ከተማ እናደርጋለን፡፡',
        heroBtnServices: 'አገልግሎቶች ይመልከቱ',
        heroBtnContact: 'በዚህ ያገኙን',
        
        // Welcome Section
        welcomeText: 'ሰላም እና ደህንነት የሕብረተሰቡን መረጋጋት እና እድገት የሚደግፉ መሠረታዊ ነገሮች ናቸው። ፅንሰ-ሀሳቦቹ ብዙ ጊዜ እርስ በርስ የተሳሰሩ ሲሆኑ ሰላም ማለት ግጭት አለመኖሩ እና የተስማሙ ግንኙነቶች መኖራቸው ሲሆን ደህንነት ግን ግለሰቦችን፣ ማህበረሰቦችን እና ሀገራትን ከውስጥ እና ከውጪ ካሉ አደጋዎች መጠበቅን ይመለከታል።',
        
        // About Section
        aboutTitle: 'ስለ እኛ',
        aboutText: 'ሌሚ ኩራ የሰላምና ደህንነት ቢሮ የተቋቋመው አስተማማኝ ፣ የተረጋጋና ስምምነት ያለው ማኅበረሰብ እንዲኖር ለማድረግ በጽኑ ቁርጠኝነት ነበር ። ራሳችንን የወሰነው ቡድናችን በጽኑ አቋም፣ በተጠያቂነትና በትብብር መርሆች በመመራት ግጭትን ለመከላከል፣ የሕግ የበላይነትን ለማስከበርና የሁሉንም ነዋሪዎች ደህንነት ለመጠበቅ ደከመኝ ሰለቸኝ ሳይል ይሰራል።',
        aboutAddress: 'አድራሻ',
        aboutCity: 'ከተማ',
        aboutMission: 'ተልእኮ',
        aboutVision: 'ራዕይ',
        
        // Services Section
        servicesTitle: 'አገልግሎቶቻችን',
        servicesSubtitle: 'የሰላምና ፀጥታ አገልግሎቶች ለማህበረሰቡ ደህንነት',
        servicesCta: 'እገዛ ከፈለጉ ባለሞያዎቻችንን ያነጋግሩ',
        
        // Service Cards
        service1Title: 'ቅጥር ጥበቃ ድጋፍና ክትትል ማድረግ',
        service1Desc: 'በ10ሩም በወረዳ የሚገኙ የቅጥር ጥበቃ አደረጃጀቶች ወደስራ እንዲገቡ ክትትልና ድጋፍ ያደርጋል',
        service2Title: 'ሰላም ሰራዊት ስምሪት',
        service2Desc: 'በወረዳ የሚፈጸሙ ወንጀል ድርጊቶችንና ህገ-ወት ተግባራት ለመከላከል ህ/ሰቡ እራሱ እናአካባቢውን የሚጠበቅበትን የአሰራር ስርአት በመዘርጋት ስለተግባራዊነቱ ክትትል ያደርጋል፡፡',
        service3Title: 'ህ/ሰቡ የፀጥታው ባለቤት ማድረግ',
        service3Desc: 'ህ/ሰቡ የፀጥታው ባለቤት የሚያደርጉ ተግባሮችን በወረዳው ካሉት የፀጥታ አካላት ጋር ይሰራል ይህንንም ከሚመለከተው አካል ጋር ሆኖ ያስተባብራል የስራዎችና የውጤቶች ምንጭ ሆናል፡፡',
        service4Title: '8ቱን አደረጃጀት ክትትልና ድጋፍ',
        service4Desc: 'በ10ሩም ወረዳዎች ዉስጥ የሚገኙትን አደረጃጀቶች ክትትልና ድጋፍ ማድረግ',
        service5Title: 'ግጭቶችን መፍታት',
        service5Desc: 'በወረዳዎች የሚገኙ በፀጥታና በእምነት ያሉ ጉዳችን አስመልክቶ የሚቀርቡ አስፈላጊ ግጭቶችን፣ ሁከቶችንእንዲሁም አቤቱታዎችን በተደራጀና በተቀናጀ አግባብ ምላሽ ይሰጣል፡፡',
        service6Title: 'ስጋት ቦታ መለየት',
        service6Desc: 'ከወረዳዎች ጋር በመሆን ለወንጀል ስጋት የሆኑትን አካባቢዎችን በመለየት ለሚመለከተው አካል መረጃ ይሰጣል፣',
        
        // About Info Items
        aboutAddressText: 'ከደራርቱ አደባባይ 500ሜ ገባ ብሎ',
        aboutCityText: 'አዲስ አበባ',
        aboutMissionText: 'የአዲስ አበባ ከተማ ልማትና መልካም አስተዳደር የሚሆን ህጎች ወጥተው ንቃተ ህግ እንዲፈጠር በማድረግ የወረዳችን ነዋሪዎች የልማት ተሣትፎ ተደራሽ የተቀላጠፈ የፍትህ አገልግሎት በመስጠት ወንጀልን በመከላከል የወረዳው አስተዳደር ለማህበረሰቡ ግንዛቤ በመፍጠር በወረዳው የህግ የበላይነት ፣ ሰላምና ፀጥታ እንዲሰፍን ማድረግ ነው ፡፡',
        aboutVisionText: 'በ2025አዲስ አበባ ሰላምና ፀጥታና ሰላም የሰፈነበት እና የህግ የበላይነት የተረጋገጠበት ከተማ ለማድረግጥረት እንደ ወረዳ የራሣችንን ሚና መጫወት፡፡',
        
        // News Section
        newsTitle: 'ዜናዎች እና ብሎጎች',
        newsSubtitle: 'የቅርብ ጊዜ ዜናዎች፣ ማስታወቂያዎች እና የሰላምና ፀጥታ ጉዳዮች',
        readMore: 'ሙሉ ዜናውን ያንብቡ',
        comments: 'አስተያየቶች',
        addComment: 'አስተያየት ይስጡ',
        commentPlaceholder: 'አስተያየትዎን ይጻፉ...',
        
        // Contact Section
        contactTitle: 'የእናንተን አስተያየት ወይም ጥያቄ ለመቀበል ፈቃደኞች ነን።',
        contactSubtitle: 'ጥያቄዎች ወይም አሳሳቢ ሁኔታዎች ካሉህ ያነጋግሩን ።',
        contactAddress: 'አድራሻ',
        contactPhone: 'ስልክ',
        contactEmail: 'Email',
        contactHours: 'የስራ ሰዓት',
        
        // Footer
        footerQuickLinks: 'ፈጣን አገናኞች',
        footerServices: 'አገልግሎቶቻችን',
        footerContact: 'ያግኙን',
        footerRights: 'ለሚ ኩራ ሰላምና ፀጥታ አስተዳደር። ሁሉም መብቶች የተጠበቁ ናቸው።',
        footerPrivacy: 'የግላዊነት ፖሊሲ',
        footerTerms: 'የአጠቃቀም ደንብ',
        
        // Feedback Collector
        feedbackTitle: 'የአገልግሎት ግምገማ ዳሽቦርድ',
        
        // Comment Form
        commentsTitle: 'አስተያየቶችዎን ያካፍሉ',
        commentsDescription: 'የእርስዎ አስተያየት ለእኛ ጠቃሚ ነው። እባክዎ ሀሳብዎን፣ ጥያቄዎን ወይም አስተያየትዎን ያካፍሉ።',
        commentAuthor: 'ስምዎ',
        commentEmail: 'ኢሜይል (አማራጭ)',
        commentSubject: 'ርዕስ',
        commentText: 'አስተያየትዎ',
        submitComment: 'አስተያየት ላክ',
        resetForm: 'ዳግም አስጀምር',
        like: 'አስደሳች'
    },
    en: {
        // Site Title
        siteTitle: 'Lemi Kura Sub-City Peace and Security Administration Office',
        
        // Navigation
        navHome: 'Home',
        navAbout: 'About Us',
        navServices: 'Our Services',
        navNews: 'News & Blogs',
        navComments: 'Give Feedback',
        navContact: 'Contact Us',
        navFeedback: 'Service Evaluation',
        navAdmin: 'Admin',
        
        // Hero Section
        heroTitle: 'Lemi Kura Peace and Security Administration Committed to Excellence',
        heroDescription: 'We are committed to making Addis Ababa a city where peace, security and rule of law prevail.',
        heroBtnServices: 'View Services',
        heroBtnContact: 'Contact Us',
        
        // Welcome Section
        welcomeText: 'Peace and security are fundamental pillars that support the stability and development of society. These concepts are often interconnected, where peace refers to the absence of conflict and the presence of harmonious relationships, while security involves protecting individuals, communities, and nations from internal and external threats.',
        
        // About Section
        aboutTitle: 'About Us',
        aboutText: 'The Lemi Kura Peace and Security Office was established with a firm commitment to ensuring a safe, stable and harmonious community. Our dedicated team works tirelessly, guided by principles of integrity, accountability and cooperation to prevent conflict, enforce the rule of law and protect the safety of all residents.',
        aboutAddress: 'Address',
        aboutCity: 'City',
        aboutMission: 'Mission',
        aboutVision: 'Vision',
        
        // Services Section
        servicesTitle: 'Our Services',
        servicesSubtitle: 'Peace and security services for community safety',
        servicesCta: 'Contact Our Experts If You Need Help',
        
        // Service Cards
        service1Title: 'Security Guard Support and Monitoring',
        service1Desc: 'Provides monitoring and support for security guard organizations in all 10 sub-districts to ensure they are operational',
        service2Title: 'Peace Force Recruitment',
        service2Desc: 'Establishes and monitors operational systems where the community itself protects its environment to prevent criminal activities and illegal acts in the district',
        service3Title: 'Making the Community Security Owners',
        service3Desc: 'Works with security bodies in the district on activities that make the community security owners and coordinates with relevant bodies as a source of work and results',
        service4Title: 'Support and Monitoring of 8 Organizations',
        service4Desc: 'Monitoring and supporting organizations found in all 10 sub-districts',
        service5Title: 'Conflict Resolution',
        service5Desc: 'Responds to necessary conflicts, riots and complaints related to security and trust issues in the districts in an organized and coordinated manner',
        service6Title: 'Risk Area Identification',
        service6Desc: 'Works with districts to identify areas at risk of crime and provides information to relevant bodies',
        
        // About Info Items
        aboutAddressText: '500m from Derartu Square',
        aboutCityText: 'Addis Ababa',
        aboutMissionText: 'To ensure the rule of law, peace and security in the district by creating awareness for the community through the district administration by preventing crime by providing accessible and efficient justice services for the development participation of our district residents by enacting laws for the development and good governance of Addis Ababa city and creating legal awareness.',
        aboutVisionText: 'To play our role as a district in making Addis Ababa a city where peace, security and rule of law prevail by 2025.',
        
        // News Section
        newsTitle: 'News & Blogs',
        newsSubtitle: 'Latest news, announcements and peace & security updates',
        readMore: 'Read Full Article',
        comments: 'Comments',
        addComment: 'Add Comment',
        commentPlaceholder: 'Write your comment...',
        
        // Contact Section
        contactTitle: 'We Are Ready to Receive Your Feedback or Questions',
        contactSubtitle: 'Contact us if you have questions or concerns.',
        contactAddress: 'Address',
        contactPhone: 'Phone',
        contactEmail: 'Email',
        contactHours: 'Office Hours',
        
        // Footer
        footerQuickLinks: 'Quick Links',
        footerServices: 'Our Services',
        footerContact: 'Contact Us',
        footerRights: 'Lemi Kura Peace and Security Administration. All Rights Reserved.',
        footerPrivacy: 'Privacy Policy',
        footerTerms: 'Terms of Use',
        
        // Feedback Collector
        feedbackTitle: 'Service Evaluation Dashboard',
        
        // Comment Form
        commentsTitle: 'Share Your Comments',
        commentsDescription: 'Your feedback is valuable to us. Please share your thoughts, questions, or comments.',
        commentAuthor: 'Your Name',
        commentEmail: 'Email (Optional)',
        commentSubject: 'Subject',
        commentText: 'Your Comment',
        submitComment: 'Send Comment',
        resetForm: 'Reset Form',
        like: 'Like'
    }
};

// Language Manager Class
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'am';
        console.log('🌐 Language Manager initialized with:', this.currentLang);
        this.init();
    }

    init() {
        console.log('🔧 Initializing language manager, current lang:', this.currentLang);
        this.updateLanguageButton();
        this.applyTranslations();
    }

    toggleLanguage() {
        const oldLang = this.currentLang;
        this.currentLang = this.currentLang === 'am' ? 'en' : 'am';
        console.log('🔄 Language toggled from', oldLang, 'to', this.currentLang);
        
        localStorage.setItem('language', this.currentLang);
        this.updateLanguageButton();
        this.applyTranslations();
        document.documentElement.lang = this.currentLang;
        
        console.log('✅ Language switch completed to:', this.currentLang);
    }

    updateLanguageButton() {
        const langBtn = document.getElementById('currentLang');
        console.log('🔄 Updating language button, element found:', !!langBtn, 'current lang:', this.currentLang);
        if (langBtn) {
            // Show the language we can switch TO, not the current language
            const newText = this.currentLang === 'am' ? 'EN' : 'አማ';
            langBtn.textContent = newText;
            console.log('✅ Language button updated to:', newText, '(shows language we can switch TO)');
        } else {
            console.warn('⚠️ Language button element not found (currentLang)');
        }
    }

    translate(key) {
        const translation = translations[this.currentLang] && translations[this.currentLang][key];
        if (key === 'heroTitle') {
            console.log('🔍 HERO TITLE DEBUG:', {
                key: key,
                currentLang: this.currentLang,
                translation: translation,
                expectedEN: 'Lemi Kura Peace and Security Administration Committed to Excellence'
            });
        }
        console.log(`🔍 Translating "${key}" for language "${this.currentLang}":`, translation || 'NOT FOUND');
        return translation || key;
    }

    applyTranslations() {
        console.log('🌐 Applying translations for language:', this.currentLang);
        console.log('🔍 Available translations for this language:', Object.keys(translations[this.currentLang] || {}));
        
        // Update all elements with data-translate attribute
        const elements = document.querySelectorAll('[data-translate]');
        console.log('📝 Found', elements.length, 'elements to translate');
        
        let translatedCount = 0;
        elements.forEach((element, index) => {
            const key = element.getAttribute('data-translate');
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
            
            if (translation !== key) {
                translatedCount++;
                console.log(`✅ Element ${index + 1}: "${key}" → "${translation}"`);
            } else {
                console.log(`⚠️ Element ${index + 1}: "${key}" → NO TRANSLATION (kept original)`);
            }
        });
        
        console.log('✅ Translations applied:', translatedCount, 'of', elements.length, 'elements translated');
    }
}

// Global function for button onclick
function toggleLanguage() {
    console.log('🌐 toggleLanguage called, languageManager:', !!languageManager);
    if (languageManager) {
        languageManager.toggleLanguage();
    } else {
        console.error('❌ Language manager not initialized!');
        languageManager = new LanguageManager();
        languageManager.toggleLanguage();
    }
}

// Make toggleLanguage available globally
window.toggleLanguage = toggleLanguage;

// Initialize language manager
let languageManager;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Initializing language manager...');
    languageManager = new LanguageManager();
    console.log('✅ Language manager initialized:', languageManager.currentLang);
    
    // Make sure the toggle button works
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        console.log('✅ Language toggle button found');
        
        // Add click event listener
        languageToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🌐 Language toggle clicked via event listener');
            toggleLanguage();
        });
        
        // Add touch event for mobile
        languageToggle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('🌐 Language toggle touched');
            toggleLanguage();
        });
    } else {
        console.error('❌ Language toggle button not found!');
    }
});

// Debug functions
window.testLanguageToggle = function() {
    console.log('🧪 Testing language toggle...');
    console.log('- Current language:', languageManager ? languageManager.currentLang : 'not initialized');
    console.log('- Language button exists:', !!document.getElementById('currentLang'));
    console.log('- Language toggle button exists:', !!document.getElementById('languageToggle'));
    console.log('- Language button text:', document.getElementById('currentLang')?.textContent);
    console.log('- LocalStorage language:', localStorage.getItem('language'));
    
    if (languageManager) {
        console.log('🔄 Triggering language toggle...');
        const beforeLang = languageManager.currentLang;
        const beforeButtonText = document.getElementById('currentLang')?.textContent;
        
        toggleLanguage();
        
        const afterLang = languageManager.currentLang;
        const afterButtonText = document.getElementById('currentLang')?.textContent;
        
        console.log('📊 Toggle results:');
        console.log('  - Before:', beforeLang, '(button showed:', beforeButtonText + ')');
        console.log('  - After:', afterLang, '(button shows:', afterButtonText + ')');
        console.log('  - LocalStorage now:', localStorage.getItem('language'));
        console.log('✅ Language toggle test completed');
    } else {
        console.error('❌ Language manager not available');
    }
    
    return 'Language toggle test completed';
};

window.forceLanguage = function(lang) {
    if (!['am', 'en'].includes(lang)) {
        console.error('❌ Invalid language. Use "am" or "en"');
        return 'Invalid language';
    }
    
    console.log('🔧 Forcing language to:', lang);
    localStorage.setItem('language', lang);
    
    if (languageManager) {
        languageManager.currentLang = lang;
        languageManager.updateLanguageButton();
        languageManager.applyTranslations();
        document.documentElement.lang = lang;
        console.log('✅ Language forced to:', lang);
    } else {
        console.log('⚠️ Language manager not available, will take effect on reload');
    }
    
    return 'Language forced to ' + lang;
};

window.resetLanguageState = function() {
    console.log('🔄 Resetting language state...');
    localStorage.removeItem('language');
    console.log('✅ Language state reset. Reload page to see default state.');
    return 'Language state reset';
};