// SIMPLE ADMIN SYSTEM WITH FIREBASE
console.log('🚀 Simple Admin System Loading... v2.1');

// Global variables
let adminNewsData = [];
let useFirebase = false;
let firebaseInitialized = false;

// Check if Firebase is available
function initializeSystem() {
    if (typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
        console.log('✅ Firebase available, initializing...');
        try {
            firebaseService.initializeFirebase();
            useFirebase = true;
            firebaseInitialized = true;
            console.log('✅ Firebase initialized for admin');
            loadFirebaseData();
        } catch (error) {
            console.error('❌ Firebase failed, using localStorage:', error);
            useFirebase = false;
            loadLocalData();
        }
    } else {
        console.log('❌ Firebase not available, using localStorage');
        useFirebase = false;
        loadLocalData();
    }
}

// Load data from Firebase
async function loadFirebaseData() {
    try {
        console.log('📡 Loading news from Firebase...');
        const firebaseNews = await firebaseService.getAllNews();
        
        if (firebaseNews && firebaseNews.length > 0) {
            adminNewsData = firebaseNews.map(item => ({
                id: item.id,
                title: item.title,
                category: item.category,
                image: item.image || 'images/hero-bg.jpg',
                excerpt: item.excerpt,
                content: item.content,
                date: item.timestamp ? new Date(item.timestamp).toLocaleDateString('am-ET') : new Date().toLocaleDateString('am-ET'),
                likes: item.likes || 0,
                comments: item.comments || []
            }));
            console.log('✅ Loaded from Firebase:', adminNewsData.length, 'items');
        } else {
            console.log('📝 No Firebase data, creating default...');
            adminNewsData = getDefaultData();
            // Save default data to Firebase
            for (const news of adminNewsData) {
                await firebaseService.addNewsArticle(news);
            }
        }
    } catch (error) {
        console.error('❌ Firebase load error:', error);
        adminNewsData = getDefaultData();
    }
}

// Load data from localStorage (fallback)
function loadLocalData() {
    const savedData = localStorage.getItem('adminNewsData');
    if (savedData) {
        try {
            adminNewsData = JSON.parse(savedData);
            console.log('✅ Loaded from localStorage:', adminNewsData.length, 'items');
        } catch (error) {
            console.error('Error loading localStorage:', error);
            adminNewsData = getDefaultData();
        }
    } else {
        adminNewsData = getDefaultData();
        console.log('Using default data');
    }
}

function getDefaultData() {
    return [
        {
            id: 1,
            title: "የሰላምና ፀጥታ አዲስ ፕሮግራም ተጀመረ",
            category: "ዜና",
            image: "images/hero-bg.jpg",
            excerpt: "በለሚ ኩራ ክ/ከተማ አዲስ የሰላምና ፀጥታ ፕሮግራም ተጀምሯል።",
            content: "በለሚ ኩራ ክ/ከተማ አዲስ የሰላምና ፀጥታ ፕሮግራም ተጀምሯል። ይህ ፕሮግራም የማህበረሰቡን ተሳትፎ በመጨመር የወረዳውን ሰላምና ፀጥታ ለማጠናከር ይረዳል።",
            date: "ታህሳስ 19, 2017",
            likes: 12,
            comments: []
        },
        {
            id: 2,
            title: "የማህበረሰብ ስብሰባ ማስታወቂያ",
            category: "ማስታወቂያ",
            image: "images/pro.jpg",
            excerpt: "ሁሉም ነዋሪዎች በታህሳስ 25 ቀን 2017 ዓ.ም በማህበረሰብ ስብሰባ እንዲሳተፉ ተጋብዘዋል።",
            content: "ሁሉም ነዋሪዎች በታህሳስ 25 ቀን 2017 ዓ.ም በማህበረሰብ ስብሰባ እንዲሳተፉ ተጋብዘዋል። ስብሰባው በጠዋቱ 9:00 ሰዓት በወረዳ ቢሮ ይካሄዳል።",
            date: "ታህሳስ 15, 2017",
            likes: 8,
            comments: []
        },
        {
            id: 3,
            title: "የሰላም ግንባታ አስፈላጊነት",
            category: "ብሎግ",
            image: "images/hero-bg.png",
            excerpt: "ሰላም ማለት ከግጭት መላቀቅ ብቻ ሳይሆን፣ ዘላቂ የሆነ የማህበረሰብ መረጋጋት ማለት ነው።",
            content: "ሰላም ማለት ከግጭት መላቀቅ ብቻ ሳይሆን፣ ዘላቂ የሆነ የማህበረሰብ መረጋጋት ማለት ነው። የሰላም ግንባታ ሂደት የሁሉንም የማህበረሰብ ክፍሎች ተሳትፎ ይጠይቃል።",
            date: "ታህሳስ 10, 2017",
            likes: 15,
            comments: []
        }
    ];
}

// SIMPLE SAVE FUNCTION
async function saveData() {
    console.log('💾 Saving data:', adminNewsData.length, 'items');
    
    // Always save to localStorage as backup
    localStorage.setItem('adminNewsData', JSON.stringify(adminNewsData));
    localStorage.setItem('newsData', JSON.stringify(adminNewsData)); // For public site
    
    if (useFirebase && firebaseInitialized) {
        console.log('💾 Firebase available for future saves...');
    } else {
        console.log('💾 Saved to localStorage only');
    }
    
    console.log('✅ Data saved successfully');
}

// SIMPLE ADD/EDIT NEWS FUNCTION
async function handleAddNews(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const form = e.target;
    const formData = new FormData(form);
    const editId = document.getElementById('editNewsId').value;
    
    // Get form values
    const title = formData.get('title');
    const category = formData.get('category');
    const excerpt = formData.get('excerpt');
    const content = formData.get('content');
    const image = formData.get('image');
    
    // Validate required fields
    if (!title || !category || !excerpt || !content) {
        alert('እባክዎ ሁሉንም የሚያስፈልጉ መስኮች ይሙሉ!');
        return false;
    }
    
    if (editId) {
        // EDIT MODE
        const newsIndex = adminNewsData.findIndex(n => n.id == editId);
        if (newsIndex === -1) {
            alert('ዜና አልተገኘም!');
            return false;
        }
        
        // Update existing news
        adminNewsData[newsIndex] = {
            ...adminNewsData[newsIndex],
            title: title,
            category: category,
            image: image || 'images/hero-bg.jpg',
            excerpt: excerpt,
            content: content
        };
        
        // Update in Firebase if available
        if (useFirebase && firebaseInitialized) {
            try {
                await firebaseService.updateNewsArticle(editId, {
                    title: title,
                    category: category,
                    image: image || 'images/hero-bg.jpg',
                    excerpt: excerpt,
                    content: content
                });
            } catch (error) {
                console.error('❌ Firebase update error:', error);
            }
        }
        
        alert('ዜና በተሳካ ሁኔታ ተሻሽሏል!');
        
    } else {
        // ADD MODE
        const newsItem = {
            id: Date.now(),
            title: title,
            category: category,
            image: image || 'images/hero-bg.jpg',
            excerpt: excerpt,
            content: content,
            date: new Date().toLocaleDateString('am-ET'),
            likes: 0,
            comments: []
        };
        
        // Save to Firebase if available
        if (useFirebase && firebaseInitialized) {
            try {
                const result = await firebaseService.addNewsArticle(newsItem);
                if (result.success) {
                    newsItem.id = result.id; // Use Firebase ID
                }
            } catch (error) {
                console.error('❌ Firebase save error:', error);
            }
        }
        
        // Add to local array
        adminNewsData.unshift(newsItem);
        alert('ዜና በተሳካ ሁኔታ ተጨምሯል!');
    }
    
    // Save and refresh
    await saveData();
    loadNewsData();
    hideAddNewsForm();
    updateStats();
    
    return false;
}

// SIMPLE LOAD NEWS DISPLAY
function loadNewsData() {
    const container = document.getElementById('adminNewsList');
    if (!container) {
        console.error('❌ adminNewsList container not found!');
        return;
    }
    
    container.innerHTML = '';
    
    adminNewsData.forEach((news, index) => {
        const newsElement = document.createElement('div');
        newsElement.className = 'admin-news-item';
        newsElement.innerHTML = `
            <div class="admin-news-content">
                <h4>${news.title}</h4>
                <div class="admin-news-meta">
                    <span><i class="fas fa-calendar"></i> ${news.date}</span>
                    <span><i class="fas fa-tag"></i> ${news.category}</span>
                    <span><i class="fas fa-heart"></i> ${news.likes} ወዳጅነቶች</span>
                </div>
                <p>${news.excerpt}</p>
            </div>
            <div class="admin-news-actions">
                <button class="edit-btn" onclick="editNews(${news.id})" style="margin-right: 10px;">
                    <i class="fas fa-edit"></i> አርም
                </button>
                <button class="delete-btn" onclick="deleteNews(${news.id})">
                    <i class="fas fa-trash"></i> ሰርዝ
                </button>
            </div>
        `;
        container.appendChild(newsElement);
    });
}

// SIMPLE DELETE FUNCTION
async function deleteNews(id) {
    if (confirm('እርግጠኛ ነዎት ይህን ዜና መሰረዝ ይፈልጋሉ?')) {
        // Delete from Firebase if available
        if (useFirebase && firebaseInitialized) {
            try {
                await firebaseService.deleteNewsArticle(id);
            } catch (error) {
                console.error('❌ Firebase delete error:', error);
            }
        }
        
        // Delete from local array
        adminNewsData = adminNewsData.filter(n => n.id !== id);
        await saveData();
        loadNewsData();
        updateStats();
        alert('ዜና ተሰርዟል!');
    }
}

// SIMPLE STATS UPDATE
function updateStats() {
    const totalNews = adminNewsData.length;
    const totalNewsEl = document.getElementById('totalNews');
    if (totalNewsEl) totalNewsEl.textContent = totalNews;
}

// SIMPLE FORM FUNCTIONS
function showAddNewsForm() {
    document.getElementById('addNewsForm').style.display = 'block';
    document.getElementById('newsForm').reset();
    document.getElementById('editNewsId').value = '';
    document.querySelector('#addNewsForm h3').innerHTML = '<i class="fas fa-edit"></i> አዲስ ዜና/ብሎግ ጨምር';
    document.querySelector('#newsForm button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> ዜና ይለጥፉ';
}

function hideAddNewsForm() {
    document.getElementById('addNewsForm').style.display = 'none';
    document.getElementById('newsForm').reset();
    document.getElementById('editNewsId').value = '';
}

// EDIT NEWS FUNCTION
function editNews(id) {
    const news = adminNewsData.find(n => n.id == id);
    if (!news) {
        alert('ዜና አልተገኘም!');
        return;
    }
    
    // Fill the form with existing data
    document.getElementById('newsTitle').value = news.title;
    document.getElementById('newsCategory').value = news.category;
    document.getElementById('newsImage').value = news.image || '';
    document.getElementById('newsExcerpt').value = news.excerpt;
    document.getElementById('newsContent').value = news.content;
    
    // Set edit mode
    document.getElementById('editNewsId').value = id;
    
    // Update form title and button
    document.querySelector('#addNewsForm h3').innerHTML = '<i class="fas fa-edit"></i> ዜና አርም';
    document.querySelector('#newsForm button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> ለውጦችን ያስቀምጡ';
    
    // Show the form
    document.getElementById('addNewsForm').style.display = 'block';
}

// SIMPLE LOGIN FUNCTIONS
let currentUser = null;

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Try Firebase Auth first
    if (useFirebase && firebaseInitialized) {
        try {
            const result = await firebaseService.adminLogin(username, password);
            if (result.success) {
                currentUser = { email: username, loginTime: new Date() };
                showDashboard();
                return;
            }
        } catch (error) {
            console.error('❌ Firebase auth error:', error);
        }
    }
    
    // Fallback to simple login check
    if ((username === 'admin' && password === 'admin123') || 
        (username === 'admin@lemikurapeace.com' && password === 'Word@1212')) {
        currentUser = { username: username, loginTime: new Date() };
        showDashboard();
    } else {
        alert('የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል!');
    }
}

function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadNewsData();
    updateStats();
}

async function logout() {
    if (useFirebase && firebaseInitialized) {
        try {
            await firebaseService.adminLogout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    currentUser = null;
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showTab(tabName, buttonElement) {
    // Hide all tabs with fade out
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.opacity = '0';
        setTimeout(() => {
            tab.classList.remove('active');
        }, 150);
    });
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab with fade in
    setTimeout(() => {
        const selectedTab = document.getElementById(tabName + 'Tab');
        if (selectedTab) {
            selectedTab.classList.add('active');
            selectedTab.style.opacity = '1';
        }
        if (buttonElement) {
            buttonElement.classList.add('active');
        }
        
        // Load data for the selected tab
        if (tabName === 'news' && typeof loadNewsData === 'function') {
            loadNewsData();
        } else if (tabName === 'comments' && typeof loadCommentsData === 'function') {
            loadCommentsData();
        } else if (tabName === 'feedback') {
            loadFeedbackData();
        } else if (tabName === 'questions') {
            loadQuestionConfig();
        }
    }, 150);
}
// Feedback Management Functions
let allFeedbacks = [];
let filteredFeedbacks = [];

function loadFeedbackData() {
    const savedFeedbacks = localStorage.getItem('feedbackSurveys');
    
    if (savedFeedbacks) {
        try {
            allFeedbacks = JSON.parse(savedFeedbacks);
            filteredFeedbacks = [...allFeedbacks];
        } catch (error) {
            console.error('❌ Error parsing feedback data:', error);
            allFeedbacks = [];
            filteredFeedbacks = [];
        }
    } else {
        allFeedbacks = [];
        filteredFeedbacks = [];
    }
    
    updateFeedbackStats();
    renderFeedbackList();
}

function updateFeedbackStats() {
    const totalFeedbacks = allFeedbacks.length;
    const todayFeedbacks = allFeedbacks.filter(f => {
        const today = new Date().toLocaleDateString('am-ET');
        return f.date === today;
    }).length;
    
    // Calculate average rating
    let totalRating = 0;
    let ratingCount = 0;
    
    allFeedbacks.forEach(feedback => {
        ['staff_behavior', 'service_speed', 'service_quality', 'overall_satisfaction'].forEach(rating => {
            if (feedback[rating]) {
                totalRating += parseInt(feedback[rating]);
                ratingCount++;
            }
        });
    });
    
    const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;
    
    // Calculate satisfaction rate (4+ stars)
    const satisfiedCount = allFeedbacks.filter(feedback => {
        const overallRating = parseInt(feedback.overall_satisfaction || 0);
        return overallRating >= 4;
    }).length;
    
    const satisfactionRate = totalFeedbacks > 0 ? Math.round((satisfiedCount / totalFeedbacks) * 100) : 0;
    
    // Update UI
    document.getElementById('totalFeedbacks').textContent = totalFeedbacks;
    document.getElementById('averageRating').textContent = averageRating;
    document.getElementById('todayFeedbacks').textContent = todayFeedbacks;
    document.getElementById('satisfactionRate').textContent = satisfactionRate + '%';
}

function renderFeedbackList() {
    const container = document.getElementById('feedbackContainer');
    
    if (!container) {
        console.error('❌ feedbackContainer not found!');
        return;
    }
    
    if (filteredFeedbacks.length === 0) {
        container.innerHTML = `
            <div class="no-feedback">
                <i class="fas fa-clipboard-list"></i>
                <h3>ምንም ግምገማ አልተገኘም</h3>
                <p>እስካሁን ምንም የአገልግሎት ግምገማ አልተቀበሉም።</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    filteredFeedbacks.forEach((feedback, index) => {
        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'feedback-item';
        
        const serviceTypeMap = {
            'security_guard': 'ቅጥር ጥበቃ አገልግሎት',
            'peace_force': 'ሰላም ሰራዊት',
            'conflict_resolution': 'ግጭት መፍታት',
            'community_security': 'የማህበረሰብ ፀጥታ',
            'risk_assessment': 'ስጋት ቦታ መለየት',
            'other': 'ሌላ'
        };
        
        const serviceType = serviceTypeMap[feedback.serviceType] || feedback.serviceType;
        
        feedbackElement.innerHTML = `
            <div class="feedback-header">
                <div class="feedback-info">
                    <h4>${feedback.fullName}</h4>
                    <div class="feedback-meta">
                        <span><i class="fas fa-calendar"></i> ${feedback.date}</span>
                        <span><i class="fas fa-user"></i> ${feedback.gender === 'male' ? 'ወንድ' : 'ሴት'}, ${feedback.age}</span>
                        <span><i class="fas fa-graduation-cap"></i> ${feedback.education}</span>
                        <span><i class="fas fa-cogs"></i> ${serviceType}</span>
                    </div>
                </div>
                <div class="feedback-actions">
                    <button class="export-btn" onclick="exportSingleFeedback(${index})">
                        <i class="fas fa-download"></i> ውጤት
                    </button>
                    <button class="delete-feedback-btn" onclick="deleteFeedback(${index})">
                        <i class="fas fa-trash"></i> ሰርዝ
                    </button>
                </div>
            </div>
            
            <div class="feedback-ratings">
                <div class="rating-item">
                    <span>የሰራተኞች ባህሪ:</span>
                    <div class="rating-stars-display">${generateStarDisplay(feedback.staff_behavior)}</div>
                </div>
                <div class="rating-item">
                    <span>የአገልግሎት ፍጥነት:</span>
                    <div class="rating-stars-display">${generateStarDisplay(feedback.service_speed)}</div>
                </div>
                <div class="rating-item">
                    <span>የአገልግሎት ጥራት:</span>
                    <div class="rating-stars-display">${generateStarDisplay(feedback.service_quality)}</div>
                </div>
                <div class="rating-item">
                    <span>አጠቃላይ እርካታ:</span>
                    <div class="rating-stars-display">${generateStarDisplay(feedback.overall_satisfaction)}</div>
                </div>
            </div>
            
            ${feedback.visitPurpose ? `
                <div class="feedback-text">
                    <h5>የጉብኝት ዓላማ:</h5>
                    <p>${feedback.visitPurpose}</p>
                </div>
            ` : ''}
            
            ${feedback.suggestions ? `
                <div class="feedback-text">
                    <h5>ለማሻሻያ ሀሳቦች:</h5>
                    <p>${feedback.suggestions}</p>
                </div>
            ` : ''}
            
            ${feedback.complaints ? `
                <div class="feedback-text">
                    <h5>ቅሬታዎች:</h5>
                    <p>${feedback.complaints}</p>
                </div>
            ` : ''}
        `;
        
        container.appendChild(feedbackElement);
    });
}

function generateStarDisplay(rating) {
    const stars = [];
    const numRating = parseInt(rating || 0);
    
    for (let i = 1; i <= 5; i++) {
        if (i <= numRating) {
            stars.push('<i class="fas fa-star"></i>');
        } else {
            stars.push('<i class="far fa-star"></i>');
        }
    }
    
    return stars.join('');
}

function filterFeedback() {
    const serviceFilter = document.getElementById('serviceFilter').value;
    const ratingFilter = document.getElementById('ratingFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    filteredFeedbacks = allFeedbacks.filter(feedback => {
        // Service type filter
        if (serviceFilter && feedback.serviceType !== serviceFilter) {
            return false;
        }
        
        // Rating filter
        if (ratingFilter) {
            const overallRating = parseInt(feedback.overall_satisfaction || 0);
            if (overallRating !== parseInt(ratingFilter)) {
                return false;
            }
        }
        
        // Date filter
        if (dateFilter) {
            const feedbackDate = new Date(feedback.timestamp).toISOString().split('T')[0];
            if (feedbackDate !== dateFilter) {
                return false;
            }
        }
        
        return true;
    });
    
    renderFeedbackList();
}

function deleteFeedback(index) {
    if (confirm('እርግጠኛ ነዎት ይህን ግምገማ መሰረዝ ይፈልጋሉ?')) {
        const feedbackToDelete = filteredFeedbacks[index];
        
        // Find and remove from allFeedbacks
        const allIndex = allFeedbacks.findIndex(f => f.timestamp === feedbackToDelete.timestamp);
        if (allIndex !== -1) {
            allFeedbacks.splice(allIndex, 1);
        }
        
        // Update localStorage
        localStorage.setItem('feedbackSurveys', JSON.stringify(allFeedbacks));
        
        // Reload data
        loadFeedbackData();
        
        alert('ግምገማ ተሰርዟል!');
    }
}
function exportAllFeedback() {
    if (allFeedbacks.length === 0) {
        alert('ለመውጣት ምንም ግምገማ የለም!');
        return;
    }
    
    // Create comprehensive CSV content with all fields
    const headers = [
        'መለያ ቁጥር', 'ሙሉ ስም', 'እድሜ', 'ጾታ', 'የትምህርት ደረጃ', 'የአገልግሎት ዓይነት',
        'የጉብኝት ዓላማ', 'የሰራተኞች ባህሪ', 'የአገልግሎት ፍጥነት', 'የአገልግሎት ጥራት', 
        'አጠቃላይ እርካታ', 'አማካይ ደረጃ', 'ለማሻሻያ ሀሳቦች', 'ቅሬታዎች', 'ቀን', 'ሰዓት'
    ];
    
    let csvContent = '\uFEFF' + headers.join(',') + '\n'; // Add BOM for proper UTF-8 encoding
    
    allFeedbacks.forEach((feedback, index) => {
        // Calculate average rating
        const ratings = [
            parseInt(feedback.staff_behavior || 0),
            parseInt(feedback.service_speed || 0),
            parseInt(feedback.service_quality || 0),
            parseInt(feedback.overall_satisfaction || 0)
        ].filter(r => r > 0);
        
        const averageRating = ratings.length > 0 ? 
            (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : 'N/A';
        
        // Map service types to Amharic
        const serviceTypeMap = {
            'security_guard': 'ቅጥር ጥበቃ አገልግሎት',
            'peace_force': 'ሰላም ሰራዊት',
            'conflict_resolution': 'ግጭት መፍታት',
            'community_security': 'የማህበረሰብ ፀጥታ',
            'risk_assessment': 'ስጋት ቦታ መለየት',
            'other': 'ሌላ'
        };
        
        const serviceType = serviceTypeMap[feedback.serviceType] || feedback.serviceType || '';
        
        // Extract time from timestamp
        const timestamp = feedback.timestamp ? new Date(feedback.timestamp) : new Date();
        const time = timestamp.toLocaleTimeString('am-ET');
        
        const row = [
            index + 1, // ID number
            `"${feedback.fullName || ''}"`,
            feedback.age || '',
            feedback.gender === 'male' ? 'ወንድ' : feedback.gender === 'female' ? 'ሴት' : feedback.gender || '',
            feedback.education || '',
            serviceType,
            `"${(feedback.visitPurpose || '').replace(/"/g, '""')}"`, // Escape quotes
            feedback.staff_behavior || '',
            feedback.service_speed || '',
            feedback.service_quality || '',
            feedback.overall_satisfaction || '',
            averageRating,
            `"${(feedback.suggestions || '').replace(/"/g, '""')}"`, // Escape quotes
            `"${(feedback.complaints || '').replace(/"/g, '""')}"`, // Escape quotes
            feedback.date || '',
            time
        ];
        csvContent += row.join(',') + '\n';
    });
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `የአገልግሎት_ግምገማ_ሁሉም_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`${allFeedbacks.length} ግምገማዎች በተሳካ ሁኔታ ወደ Excel ወጡ!`);
}

function exportFeedbackReport() {
    if (allFeedbacks.length === 0) {
        alert('ለሪፖርት ምንም ግምገማ የለም!');
        return;
    }
    
    // Calculate statistics
    const stats = calculateFeedbackStatistics();
    
    // Create detailed report CSV
    let reportContent = '\uFEFF'; // BOM for UTF-8
    
    // Report Header
    reportContent += 'የአገልግሎት ግምገማ ዝርዝር ሪፖርት\n';
    reportContent += `ሪፖርት ቀን: ${new Date().toLocaleDateString('am-ET')}\n`;
    reportContent += `ጠቅላላ ግምገማዎች: ${stats.totalFeedbacks}\n\n`;
    
    // Summary Statistics
    reportContent += 'አጠቃላይ ስታቲስቲክስ\n';
    reportContent += 'መለኪያ,ዋጋ\n';
    reportContent += `አማካይ የሰራተኞች ባህሪ ደረጃ,${stats.avgStaffBehavior}\n`;
    reportContent += `አማካይ የአገልግሎት ፍጥነት ደረጃ,${stats.avgServiceSpeed}\n`;
    reportContent += `አማካይ የአገልግሎት ጥራት ደረጃ,${stats.avgServiceQuality}\n`;
    reportContent += `አማካይ አጠቃላይ እርካታ ደረጃ,${stats.avgOverallSatisfaction}\n`;
    reportContent += `የእርካታ መጠን (4+ ኮከብ),${stats.satisfactionRate}%\n\n`;
    
    // Demographics
    reportContent += 'የእድሜ ክፍፍል\n';
    reportContent += 'እድሜ ክልል,ቁጥር,መቶኛ\n';
    Object.entries(stats.ageDistribution).forEach(([age, count]) => {
        const percentage = ((count / stats.totalFeedbacks) * 100).toFixed(1);
        reportContent += `${age},${count},${percentage}%\n`;
    });
    
    reportContent += '\nየጾታ ክፍፍል\n';
    reportContent += 'ጾታ,ቁጥር,መቶኛ\n';
    Object.entries(stats.genderDistribution).forEach(([gender, count]) => {
        const percentage = ((count / stats.totalFeedbacks) * 100).toFixed(1);
        const genderAmharic = gender === 'male' ? 'ወንድ' : gender === 'female' ? 'ሴት' : gender;
        reportContent += `${genderAmharic},${count},${percentage}%\n`;
    });
    
    // Download report
    const blob = new Blob([reportContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `የአገልግሎት_ግምገማ_ሪፖርት_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('ዝርዝር ሪፖርት በተሳካ ሁኔታ ወጣ!');
}

function calculateFeedbackStatistics() {
    const stats = {
        totalFeedbacks: allFeedbacks.length,
        avgStaffBehavior: 0,
        avgServiceSpeed: 0,
        avgServiceQuality: 0,
        avgOverallSatisfaction: 0,
        satisfactionRate: 0,
        ageDistribution: {},
        genderDistribution: {},
        serviceDistribution: {}
    };
    
    if (allFeedbacks.length === 0) return stats;
    
    let totalStaffBehavior = 0, totalServiceSpeed = 0, totalServiceQuality = 0, totalOverallSatisfaction = 0;
    let satisfiedCount = 0;
    
    allFeedbacks.forEach(feedback => {
        // Calculate averages
        const staffBehavior = parseInt(feedback.staff_behavior || 0);
        const serviceSpeed = parseInt(feedback.service_speed || 0);
        const serviceQuality = parseInt(feedback.service_quality || 0);
        const overallSatisfaction = parseInt(feedback.overall_satisfaction || 0);
        
        totalStaffBehavior += staffBehavior;
        totalServiceSpeed += serviceSpeed;
        totalServiceQuality += serviceQuality;
        totalOverallSatisfaction += overallSatisfaction;
        
        if (overallSatisfaction >= 4) satisfiedCount++;
        
        // Age distribution
        const age = feedback.age || 'Unknown';
        stats.ageDistribution[age] = (stats.ageDistribution[age] || 0) + 1;
        
        // Gender distribution
        const gender = feedback.gender || 'Unknown';
        stats.genderDistribution[gender] = (stats.genderDistribution[gender] || 0) + 1;
    });
    
    // Calculate averages
    stats.avgStaffBehavior = (totalStaffBehavior / allFeedbacks.length).toFixed(1);
    stats.avgServiceSpeed = (totalServiceSpeed / allFeedbacks.length).toFixed(1);
    stats.avgServiceQuality = (totalServiceQuality / allFeedbacks.length).toFixed(1);
    stats.avgOverallSatisfaction = (totalOverallSatisfaction / allFeedbacks.length).toFixed(1);
    stats.satisfactionRate = Math.round((satisfiedCount / allFeedbacks.length) * 100);
    
    return stats;
}

function exportSingleFeedback(index) {
    const feedback = filteredFeedbacks[index];
    
    // Create CSV content for single feedback
    const headers = [
        'ሙሉ ስም', 'እድሜ', 'ጾታ', 'የትምህርት ደረጃ', 'የአገልግሎት ዓይነት',
        'የሰራተኞች ባህሪ', 'የአገልግሎት ፍጥነት', 'የአገልግሎት ጥራት', 'አጠቃላይ እርካታ',
        'የጉብኝት ዓላማ', 'ለማሻሻያ ሀሳቦች', 'ቅሬታዎች', 'ቀን'
    ];
    
    let csvContent = headers.join(',') + '\n';
    
    const row = [
        feedback.fullName || '',
        feedback.age || '',
        feedback.gender === 'male' ? 'ወንድ' : 'ሴት',
        feedback.education || '',
        feedback.serviceType || '',
        feedback.staff_behavior || '',
        feedback.service_speed || '',
        feedback.service_quality || '',
        feedback.overall_satisfaction || '',
        (feedback.visitPurpose || '').replace(/,/g, ';'),
        (feedback.suggestions || '').replace(/,/g, ';'),
        (feedback.complaints || '').replace(/,/g, ';'),
        feedback.date || ''
    ];
    csvContent += row.join(',') + '\n';
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'feedback_' + feedback.fullName + '_' + feedback.date + '.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
// QUESTION MANAGEMENT SYSTEM
let questionConfig = {
    personal: [
        {
            id: 'fullName',
            label: 'ሙሉ ስም',
            type: 'text',
            required: true,
            placeholder: ''
        },
        {
            id: 'age',
            label: 'እድሜ',
            type: 'select',
            required: true,
            options: ['18-25', '26-35', '36-45', '46-55', '56+']
        },
        {
            id: 'gender',
            label: 'ጾታ',
            type: 'select',
            required: true,
            options: ['ወንድ', 'ሴት']
        },
        {
            id: 'education',
            label: 'የትምህርት ደረጃ',
            type: 'select',
            required: true,
            options: ['የመጀመሪያ ደረጃ', 'ሁለተኛ ደረጃ', 'ዲፕሎማ', 'ዲግሪ', 'ማስተርስ', 'ዶክትሬት']
        }
    ],
    service: [
        {
            id: 'serviceType',
            label: 'የተቀበሉት አገልግሎት',
            type: 'select',
            required: true,
            options: ['ቅጥር ጥበቃ አገልግሎት', 'ሰላም ሰራዊት', 'ግጭት መፍታት', 'የማህበረሰብ ፀጥታ', 'ስጋት ቦታ መለየት', 'ሌላ']
        },
        {
            id: 'visitPurpose',
            label: 'የጉብኝት ዓላማ',
            type: 'textarea',
            required: false,
            placeholder: 'የመጡበትን ዓላማ በአጭሩ ይግለጹ...'
        }
    ],
    rating: [
        {
            id: 'staff_behavior',
            label: 'የሰራተኞች ባህሪ እና አመለካከት',
            type: 'rating',
            required: true
        },
        {
            id: 'service_speed',
            label: 'የአገልግሎት ፍጥነት',
            type: 'rating',
            required: true
        },
        {
            id: 'service_quality',
            label: 'የአገልግሎት ጥራት',
            type: 'rating',
            required: true
        },
        {
            id: 'overall_satisfaction',
            label: 'አጠቃላይ እርካታ',
            type: 'rating',
            required: true
        }
    ],
    empathy: [
        {
            id: 'staff_understanding',
            label: 'የተቀመጡ አመራሮች አሁላም ተገልጽሮች አሁል ትከረት ለየተወ ማገልግሎችን እንዴት ይገለጻሉ',
            type: 'rating',
            required: true
        },
        {
            id: 'employee_empathy',
            label: 'የተቀመጡ ሰራተኞች አሁላም ተገልጽሮች አሁል ትከረት ለየተወ ማገልግሎችን እንዴት ይገለጻሉ',
            type: 'rating',
            required: true
        },
        {
            id: 'needs_understanding',
            label: 'አማዋሽው የተቀመጡ ሰራተኞች የተገልጽሮች ፍላጎቶች በአግባቡ የሚረዱ መሆኑን እንዴት ይገለጻሉ',
            type: 'rating',
            required: true
        }
    ],
    text: [
        {
            id: 'suggestions',
            label: 'ለማሻሻያ ሀሳቦች',
            type: 'textarea',
            required: false,
            placeholder: 'የአገልግሎታችንን ለማሻሻል ያሉዎትን ሀሳቦች ይጻፉ...'
        },
        {
            id: 'complaints',
            label: 'ቅሬታዎች (ካሉ)',
            type: 'textarea',
            required: false,
            placeholder: 'ያሉዎትን ቅሬታዎች ይጻፉ...'
        }
    ]
};

function loadQuestionConfig() {
    // Load from localStorage if available
    const savedConfig = localStorage.getItem('questionConfig');
    if (savedConfig) {
        try {
            const parsedConfig = JSON.parse(savedConfig);
            
            // Check if empathy section exists, if not, add it from default
            if (!parsedConfig.empathy) {
                parsedConfig.empathy = [
                    {
                        id: 'staff_understanding',
                        label: 'የተቀመጡ አመራሮች አሁላም ተገልጽሮች አሁል ትከረት ለየተወ ማገልግሎችን እንዴት ይገለጻሉ',
                        type: 'rating',
                        required: true
                    },
                    {
                        id: 'employee_empathy',
                        label: 'የተቀመጡ ሰራተኞች አሁላም ተገልጽሮች አሁል ትከረት ለየተወ ማገልግሎችን እንዴት ይገለጻሉ',
                        type: 'rating',
                        required: true
                    },
                    {
                        id: 'needs_understanding',
                        label: 'አማዋሽው የተቀመጡ ሰራተኞች የተገልጽሮች ፍላጎቶች በአግባቡ የሚረዱ መሆኑን እንዴት ይገለጻሉ',
                        type: 'rating',
                        required: true
                    }
                ];
                
                // Save the updated config back to localStorage
                localStorage.setItem('questionConfig', JSON.stringify(parsedConfig));
            }
            
            questionConfig = parsedConfig;
        } catch (error) {
            console.error('❌ Error loading question config:', error);
        }
    }
    
    renderQuestions();
}

function renderQuestions() {
    Object.keys(questionConfig).forEach(category => {
        const container = document.getElementById(category + 'Questions');
        if (!container) return;
        
        container.innerHTML = '';
        
        questionConfig[category].forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question-item';
            questionElement.innerHTML = `
                <div class="question-header">
                    <div>
                        <strong>${question.label}</strong>
                        <span class="question-type-badge">${getTypeLabel(question.type)}</span>
                        ${question.required ? '<span style="color: red;">*</span>' : ''}
                    </div>
                    <div class="question-actions">
                        <button class="edit-question-btn" onclick="editQuestion('${category}', ${index})">
                            <i class="fas fa-edit"></i> አርም
                        </button>
                        <button class="delete-question-btn" onclick="deleteQuestion('${category}', ${index})">
                            <i class="fas fa-trash"></i> ሰርዝ
                        </button>
                    </div>
                </div>
                <div class="question-details">
                    <p><strong>ID:</strong> ${question.id}</p>
                    <p><strong>ዓይነት:</strong> ${getTypeLabel(question.type)}</p>
                    ${question.placeholder ? `<p><strong>Placeholder:</strong> ${question.placeholder}</p>` : ''}
                    ${question.options ? `<p><strong>አማራጮች:</strong> ${question.options.join(', ')}</p>` : ''}
                </div>
                <div class="question-form" id="editForm_${category}_${index}">
                    ${generateQuestionForm(question, category, index)}
                </div>
            `;
            container.appendChild(questionElement);
        });
    });
}

function getTypeLabel(type) {
    const labels = {
        'text': 'ጽሁፍ',
        'textarea': 'ረጅም ጽሁፍ',
        'select': 'ምርጫ',
        'rating': 'ደረጃ አሰጣጥ'
    };
    return labels[type] || type;
}

function generateQuestionForm(question, category, index) {
    return `
        <div class="form-group">
            <label>የጥያቄ መለያ (ID)</label>
            <input type="text" id="questionId_${category}_${index}" value="${question.id}" required>
        </div>
        <div class="form-group">
            <label>የጥያቄ ስም</label>
            <input type="text" id="questionLabel_${category}_${index}" value="${question.label}" required>
        </div>
        <div class="form-group">
            <label>የጥያቄ ዓይነት</label>
            <select id="questionType_${category}_${index}" onchange="toggleOptionsField('${category}', ${index})">
                <option value="text" ${question.type === 'text' ? 'selected' : ''}>ጽሁፍ</option>
                <option value="textarea" ${question.type === 'textarea' ? 'selected' : ''}>ረጅም ጽሁፍ</option>
                <option value="select" ${question.type === 'select' ? 'selected' : ''}>ምርጫ</option>
                <option value="rating" ${question.type === 'rating' ? 'selected' : ''}>ደረጃ አሰጣጥ</option>
            </select>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" id="questionRequired_${category}_${index}" ${question.required ? 'checked' : ''}>
                አስፈላጊ ጥያቄ
            </label>
        </div>
        <div class="form-group">
            <label>Placeholder ጽሁፍ</label>
            <input type="text" id="questionPlaceholder_${category}_${index}" value="${question.placeholder || ''}">
        </div>
        <div class="form-group" id="optionsGroup_${category}_${index}" style="display: ${question.type === 'select' ? 'block' : 'none'}">
            <label>አማራጮች</label>
            <div class="options-list" id="optionsList_${category}_${index}">
                ${question.options ? question.options.map((option, optIndex) => `
                    <div class="option-item">
                        <input type="text" value="${option}" placeholder="አማራጭ ${optIndex + 1}">
                        <button type="button" class="remove-option-btn" onclick="removeOption('${category}', ${index}, ${optIndex})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('') : ''}
            </div>
            <button type="button" class="add-option-btn" onclick="addOption('${category}', ${index})">
                <i class="fas fa-plus"></i> አማራጭ ጨምር
            </button>
        </div>
        <div class="question-form-actions">
            <button type="button" class="save-question-btn" onclick="saveQuestion('${category}', ${index})">
                <i class="fas fa-save"></i> ያስቀምጡ
            </button>
            <button type="button" class="cancel-question-btn" onclick="cancelEditQuestion('${category}', ${index})">
                <i class="fas fa-times"></i> ሰርዝ
            </button>
        </div>
    `;
}

function editQuestion(category, index) {
    const formId = `editForm_${category}_${index}`;
    const form = document.getElementById(formId);
    
    if (form) {
        // Hide all other edit forms first
        document.querySelectorAll('.question-form.active').forEach(f => {
            f.classList.remove('active');
        });
        
        // Show this form
        form.classList.add('active');
        
        // Scroll to the form
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function cancelEditQuestion(category, index) {
    const form = document.getElementById(`editForm_${category}_${index}`);
    form.classList.remove('active');
}

function saveQuestion(category, index) {
    const id = document.getElementById(`questionId_${category}_${index}`).value;
    const label = document.getElementById(`questionLabel_${category}_${index}`).value;
    const type = document.getElementById(`questionType_${category}_${index}`).value;
    const required = document.getElementById(`questionRequired_${category}_${index}`).checked;
    const placeholder = document.getElementById(`questionPlaceholder_${category}_${index}`).value;
    
    // Get options if it's a select type
    let options = null;
    if (type === 'select') {
        const optionInputs = document.querySelectorAll(`#optionsList_${category}_${index} input`);
        options = Array.from(optionInputs).map(input => input.value).filter(value => value.trim());
    }
    
    // Update question config
    questionConfig[category][index] = {
        id: id,
        label: label,
        type: type,
        required: required,
        placeholder: placeholder,
        ...(options && { options: options })
    };
    
    // Save to localStorage
    localStorage.setItem('questionConfig', JSON.stringify(questionConfig));
    
    // Re-render questions
    renderQuestions();
    
    alert('ጥያቄ በተሳካ ሁኔታ ተቀይሯል!');
}

function deleteQuestion(category, index) {
    if (confirm('እርግጠኛ ነዎት ይህን ጥያቄ መሰረዝ ይፈልጋሉ?')) {
        questionConfig[category].splice(index, 1);
        localStorage.setItem('questionConfig', JSON.stringify(questionConfig));
        renderQuestions();
        alert('ጥያቄ ተሰርዟል!');
    }
}

function addQuestion(category) {
    const newQuestion = {
        id: 'new_question_' + Date.now(),
        label: 'አዲስ ጥያቄ',
        type: 'text',
        required: false,
        placeholder: ''
    };
    
    questionConfig[category].push(newQuestion);
    localStorage.setItem('questionConfig', JSON.stringify(questionConfig));
    renderQuestions();
}

function toggleOptionsField(category, index) {
    const type = document.getElementById(`questionType_${category}_${index}`).value;
    const optionsGroup = document.getElementById(`optionsGroup_${category}_${index}`);
    optionsGroup.style.display = type === 'select' ? 'block' : 'none';
}

function addOption(category, index) {
    const optionsList = document.getElementById(`optionsList_${category}_${index}`);
    const optionCount = optionsList.children.length;
    
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option-item';
    optionDiv.innerHTML = `
        <input type="text" placeholder="አማራጭ ${optionCount + 1}">
        <button type="button" class="remove-option-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    optionsList.appendChild(optionDiv);
}

function removeOption(category, index, optionIndex) {
    const optionsList = document.getElementById(`optionsList_${category}_${index}`);
    const optionItems = optionsList.children;
    if (optionItems[optionIndex]) {
        optionItems[optionIndex].remove();
    }
}

function saveQuestions() {
    localStorage.setItem('questionConfig', JSON.stringify(questionConfig));
    alert('ሁሉም ለውጦች ተቀምጠዋል! አዲሱ ቅጽ በ feedback.html ላይ ይታያል።');
}

function resetToDefaultQuestions() {
    if (confirm('እርግጠኛ ነዎት ወደ ነባር ጥያቄዎች መመለስ ይፈልጋሉ? ሁሉም ለውጦች ይጠፋሉ!')) {
        localStorage.removeItem('questionConfig');
        location.reload(); // Reload to reset to default
    }
}

function previewForm() {
    // Open feedback.html in a new tab for preview
    window.open('feedback.html', '_blank');
}
// Make functions globally available
window.filterFeedback = filterFeedback;
window.deleteFeedback = deleteFeedback;
window.exportAllFeedback = exportAllFeedback;
window.exportFeedbackReport = exportFeedbackReport;
window.exportSingleFeedback = exportSingleFeedback;
window.loadFeedbackData = loadFeedbackData;
window.loadQuestionConfig = loadQuestionConfig;
window.editQuestion = editQuestion;
window.saveQuestion = saveQuestion;
window.deleteQuestion = deleteQuestion;
window.addQuestion = addQuestion;
window.toggleOptionsField = toggleOptionsField;
window.addOption = addOption;
window.removeOption = removeOption;
window.saveQuestions = saveQuestions;
window.resetToDefaultQuestions = resetToDefaultQuestions;
window.previewForm = previewForm;
window.cancelEditQuestion = cancelEditQuestion;

// SIMPLE INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Simple admin initializing...');
    
    // Initialize the system (Firebase or localStorage)
    initializeSystem();
    
    // Setup login form listener
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ Login form listener added');
    }
    
    // Setup news form listener
    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleAddNews(e);
            return false;
        });
        
        newsForm.onsubmit = function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleAddNews(e);
            return false;
        };
        
        console.log('✅ News form listeners added');
    }
    
    // Load display after a short delay to ensure Firebase is ready
    setTimeout(() => {
        loadNewsData();
        updateStats();
        
        // Also initialize feedback data
        if (typeof loadFeedbackData === 'function') {
            loadFeedbackData();
        }
        
        // Initialize question config
        if (typeof loadQuestionConfig === 'function') {
            loadQuestionConfig();
        }
    }, 1000);
    
    console.log('✅ Simple admin ready!');
});

// Additional form submission handler for button clicks
async function submitNewsForm() {
    const form = document.getElementById('newsForm');
    if (form) {
        const fakeEvent = {
            preventDefault: () => console.log('preventDefault called'),
            stopPropagation: () => console.log('stopPropagation called'),
            target: form
        };
        await handleAddNews(fakeEvent);
    }
}

console.log('✅ Clean admin system loaded successfully');