// Bilingual Translation System - English & Amharic
// Enhanced translation system with improved performance and user experience

class BilingualSystem {
    constructor() {
        this.currentLanguage = 'en'; // Default to English
        this.translations = {};
        this.isLoading = false;
        this.observers = [];
        
        // Initialize the system
        this.init();
    }
    
    async init() {
        console.log('🌐 Initializing Bilingual System...');
        
        // Load translations
        await this.loadTranslations();
        
        // Get saved language preference
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        
        // Set initial language
        await this.setLanguage(savedLang, false);
        
        // Setup language toggle
        this.setupLanguageToggle();
        
        // Setup observers for dynamic content
        this.setupObservers();
        
        console.log('✅ Bilingual System initialized');
    }
    
    async loadTranslations() {
        this.translations = {
            en: {
                // Navigation
                navHome: "Home",
                navAbout: "About Us", 
                navServices: "Our Services",
                navNews: "News & Blogs",
                navComments: "Give Feedback",
                navContact: "Contact Us",
                navFeedback: "Service Evaluation",
                navAdmin: "Admin",
                
                // Site Info
                siteTitle: "Lemi Kura Sub-City Peace and Security Administration Office",
                
                // Hero Section
                heroTitle: "Lemi Kura Sub-City Peace and Security Administration Office - Committed to Excellence in Peace",
                heroDescription: "We are dedicated to making Addis Ababa a city where peace, security, and the rule of law prevail.",
                heroBtnServices: "View Services",
                heroBtnContact: "Contact Us",
                
                // Welcome Section
                welcomeText: "Peace and security are fundamental elements that support the stability and development of society. These concepts are often interconnected, where peace refers to the absence of conflict and the presence of harmonious relationships, while security involves protecting individuals, communities, and nations from internal and external threats.",
                
                // About Section
                aboutTitle: "About Us",
                aboutText: "The Lemi Kura Peace and Security Office was established with a firm commitment to creating a safe, stable, and harmonious community. Our dedicated team, guided by principles of integrity, accountability, and cooperation, works tirelessly to prevent conflicts, enforce the rule of law, and protect the safety of all residents.",
                aboutAddress: "Address",
                aboutAddressText: "500 meters from Derartu Square",
                aboutCity: "City",
                aboutCityText: "Addis Ababa",
                aboutMission: "Mission",
                aboutMissionText: "To ensure the rule of law, peace, and security in our district by implementing laws that promote good governance and development in Addis Ababa, creating legal awareness among our residents, providing accessible and efficient justice services, preventing crime, and fostering community understanding of district administration.",
                
                // Services Section
                servicesTitle: "Our Services",
                servicesSubtitle: "Peace and security services for community safety",
                service1Title: "Community Security Support and Monitoring",
                service1Desc: "We provide support and monitoring to ensure community security organizations in all 10 districts are operational and effective.",
                service2Title: "Peace Corps Deployment",
                service2Desc: "We establish and monitor operational systems where the community protects itself and its surroundings to prevent criminal activities and illegal actions in the district.",
                service3Title: "Community Ownership of Security",
                service3Desc: "We work with district security agencies to implement activities that make the community owners of their security, coordinating with relevant bodies to ensure effective outcomes.",
                service4Title: "Organizational Support and Monitoring",
                service4Desc: "Providing support and monitoring to organizations within the 10 districts to ensure effective operations.",
                service5Title: "Conflict Resolution",
                service5Desc: "We provide organized and coordinated responses to necessary conflicts, disturbances, and complaints related to security and trust issues in the districts.",
                service6Title: "Risk Area Identification",
                service6Desc: "Working with districts to identify areas at risk of crime and providing information to relevant authorities.",
                servicesCta: "Contact Our Experts for Assistance",
                
                // News Section
                newsTitle: "News & Blogs",
                newsSubtitle: "Latest news, announcements, and peace & security updates",
                
                // Contact Section
                contactTitle: "We're Ready to Receive Your Feedback or Questions",
                contactSubtitle: "If you have questions or concerns, please contact us.",
                contactAddress: "Address",
                contactPhone: "Phone",
                contactEmail: "Email",
                contactHours: "Working Hours",
                contactHoursText: "Monday - Saturday: 8:00 AM - 8:00 PM<br>Sunday: Closed",
                
                // Comments Section
                commentsTitle: "Share Your Comments",
                commentsDescription: "Your feedback is valuable to us. Please share your thoughts, questions, or comments.",
                commentAuthor: "Your Name",
                commentEmail: "Email (Optional)",
                commentSubject: "Subject",
                commentText: "Your Comment",
                commentPlaceholder: "Please write your comment here...",
                submitComment: "Submit Comment",
                resetForm: "Reset Form",
                
                // Comment Subject Options
                selectSubject: "Select Subject",
                generalFeedback: "General Feedback",
                serviceRequest: "Service Request",
                complaint: "Complaint",
                appreciation: "Appreciation",
                suggestion: "Suggestion",
                
                // Footer
                footerQuickLinks: "Quick Links",
                footerServices: "Our Services",
                footerContact: "Contact Us",
                footerRights: "Lemi Kura Peace and Security Administration. All rights reserved.",
                footerPrivacy: "Privacy Policy",
                footerTerms: "Terms of Use",
                
                // Language Toggle
                currentLang: "አማ", // Shows Amharic when English is active
                switchToAmharic: "Switch to Amharic",
                switchToEnglish: "Switch to English"
            },
            
            am: {
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
                footerTerms: "የአጠቃቀም ደንብ",
                
                // Language Toggle
                currentLang: "EN", // Shows English when Amharic is active
                switchToAmharic: "ወደ አማርኛ ቀይር",
                switchToEnglish: "Switch to English"
            }
        };
    }
    
    async setLanguage(lang, savePreference = true) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        console.log(`🔄 Switching to ${lang === 'en' ? 'English' : 'Amharic'}...`);
        
        // Update current language
        this.currentLanguage = lang;
        
        // Update document language
        document.documentElement.lang = lang;
        
        // Update all translatable elements
        this.updateTranslations();
        
        // Update language toggle button
        this.updateLanguageToggle();
        
        // Save preference
        if (savePreference) {
            localStorage.setItem('preferredLanguage', lang);
        }
        
        // Update font family for Amharic
        this.updateFontFamily();
        
        // Notify observers
        this.notifyObservers(lang);
        
        this.isLoading = false;
        console.log(`✅ Language switched to ${lang === 'en' ? 'English' : 'Amharic'}`);
    }
    
    updateTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translations[this.currentLanguage][key];
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translation;
                } else if (element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });
    }
    
    updateLanguageToggle() {
        const langToggle = document.getElementById('currentLang');
        const langButton = document.getElementById('languageToggle');
        
        if (langToggle) {
            langToggle.textContent = this.translations[this.currentLanguage].currentLang;
        }
        
        if (langButton) {
            const title = this.currentLanguage === 'en' 
                ? this.translations[this.currentLanguage].switchToAmharic
                : this.translations[this.currentLanguage].switchToEnglish;
            langButton.setAttribute('title', title);
        }
    }
    
    updateFontFamily() {
        const body = document.body;
        
        if (this.currentLanguage === 'am') {
            // Add Amharic font support
            body.style.fontFamily = "'Noto Sans Ethiopic', 'Poppins', sans-serif";
        } else {
            // Use English fonts
            body.style.fontFamily = "'Poppins', sans-serif";
        }
    }
    
    setupLanguageToggle() {
        // Create language toggle button if it doesn't exist
        let langToggle = document.getElementById('languageToggle');
        
        if (!langToggle) {
            const headerControls = document.querySelector('.header-controls');
            if (headerControls) {
                const langContainer = document.createElement('div');
                langContainer.className = 'language-selector';
                
                langToggle = document.createElement('button');
                langToggle.id = 'languageToggle';
                langToggle.className = 'language-btn';
                langToggle.innerHTML = `
                    <i class="fas fa-globe"></i>
                    <span id="currentLang">አማ</span>
                `;
                
                langContainer.appendChild(langToggle);
                headerControls.insertBefore(langContainer, headerControls.firstChild);
            }
        }
        
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }
    }
    
    toggleLanguage() {
        const newLang = this.currentLanguage === 'en' ? 'am' : 'en';
        this.setLanguage(newLang);
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
    
    notifyObservers(language) {
        this.observers.forEach(callback => {
            try {
                callback(language);
            } catch (error) {
                console.error('Error in language observer:', error);
            }
        });
    }
    
    // Public API
    onLanguageChange(callback) {
        this.observers.push(callback);
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    translate(key) {
        return this.translations[this.currentLanguage][key] || key;
    }
}

// Initialize the bilingual system
let bilingualSystem;

document.addEventListener('DOMContentLoaded', function() {
    bilingualSystem = new BilingualSystem();
    
    // Update select navigation when language changes
    if (bilingualSystem) {
        bilingualSystem.onLanguageChange(function(language) {
            updateSelectNavigationLanguage(language);
        });
    }
});

// Function to update select navigation language
function updateSelectNavigationLanguage(language) {
    const select = document.querySelector('.mobile-nav-select');
    const label = document.querySelector('.mobile-nav-label span');
    
    if (select) {
        const defaultOption = select.querySelector('option[value=""]');
        if (defaultOption) {
            defaultOption.textContent = language === 'en' 
                ? '📋 Choose Menu / ዝርዝር ይምረጡ'
                : '📋 ዝርዝር ይምረጡ / Choose Menu';
        }
    }
    
    if (label) {
        label.textContent = language === 'en' ? 'Menu / ዝርዝር' : 'ዝርዝር / Menu';
    }
}

// Global functions for backward compatibility
window.toggleLanguage = function() {
    if (bilingualSystem) {
        bilingualSystem.toggleLanguage();
    }
};

window.setLanguage = function(lang) {
    if (bilingualSystem) {
        bilingualSystem.setLanguage(lang);
    }
};

// Export for use in other scripts
window.BilingualSystem = BilingualSystem;

console.log('📚 Bilingual System script loaded');