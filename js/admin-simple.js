// SIMPLE ADMIN SYSTEM WITH FIREBASE
console.log('🚀 Simple Admin System Loading...');

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
        // Note: Firebase saves individual items in handleAddNews function
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
    
    console.log('Form data:', { title, category, excerpt, content, image, editId });
    
    // Validate required fields
    if (!title || !category || !excerpt || !content) {
        alert('እባክዎ ሁሉንም የሚያስፈልጉ መስኮች ይሙሉ!');
        return false;
    }
    
    if (editId) {
        // EDIT MODE
        console.log('📝 Editing news with ID:', editId);
        
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
                console.log('💾 Updating in Firebase...');
                await firebaseService.updateNewsArticle(editId, {
                    title: title,
                    category: category,
                    image: image || 'images/hero-bg.jpg',
                    excerpt: excerpt,
                    content: content
                });
                console.log('✅ Updated in Firebase');
            } catch (error) {
                console.error('❌ Firebase update error:', error);
            }
        }
        
        alert('ዜና በተሳካ ሁኔታ ተሻሽሏል!');
        console.log('✅ News updated successfully');
        
    } else {
        // ADD MODE
        console.log('📝 Adding new news...');
        
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
        
        console.log('Creating news item:', newsItem);
        
        // Save to Firebase if available
        if (useFirebase && firebaseInitialized) {
            try {
                console.log('💾 Saving to Firebase...');
                const result = await firebaseService.addNewsArticle(newsItem);
                if (result.success) {
                    newsItem.id = result.id; // Use Firebase ID
                    console.log('✅ Saved to Firebase with ID:', result.id);
                }
            } catch (error) {
                console.error('❌ Firebase save error:', error);
            }
        }
        
        // Add to local array
        adminNewsData.unshift(newsItem);
        alert('ዜና በተሳካ ሁኔታ ተጨምሯል!');
        console.log('✅ News added successfully');
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
    
    console.log('📰 Loading news display with', adminNewsData.length, 'items');
    container.innerHTML = '';
    
    adminNewsData.forEach((news, index) => {
        console.log(`📝 Creating news item ${index + 1}:`, news.title);
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
        console.log(`✅ Added news item ${index + 1} with edit button`);
    });
    
    console.log('✅ News display updated:', adminNewsData.length, 'items with edit buttons');
}

// SIMPLE DELETE FUNCTION
async function deleteNews(id) {
    if (confirm('እርግጠኛ ነዎት ይህን ዜና መሰረዝ ይፈልጋሉ?')) {
        // Delete from Firebase if available
        if (useFirebase && firebaseInitialized) {
            try {
                console.log('🗑️ Deleting from Firebase:', id);
                await firebaseService.deleteNewsArticle(id);
                console.log('✅ Deleted from Firebase');
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
    console.log('📊 Stats updated:', totalNews, 'news items');
}

// SIMPLE FORM FUNCTIONS
function showAddNewsForm() {
    document.getElementById('addNewsForm').style.display = 'block';
    document.getElementById('newsForm').reset();
    document.getElementById('editNewsId').value = ''; // Clear edit ID
    document.querySelector('#addNewsForm h3').innerHTML = '<i class="fas fa-edit"></i> አዲስ ዜና/ብሎግ ጨምር';
    document.querySelector('#newsForm button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> ዜና ይለጥፉ';
}

function hideAddNewsForm() {
    document.getElementById('addNewsForm').style.display = 'none';
    document.getElementById('newsForm').reset();
    document.getElementById('editNewsId').value = ''; // Clear edit ID
}

// EDIT NEWS FUNCTION
function editNews(id) {
    const news = adminNewsData.find(n => n.id == id);
    if (!news) {
        alert('ዜና አልተገኘም!');
        return;
    }
    
    console.log('📝 Editing news:', news.title);
    
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
    console.log('🔐 Simple login...');
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Try Firebase Auth first
    if (useFirebase && firebaseInitialized) {
        try {
            console.log('🔐 Trying Firebase Auth...');
            const result = await firebaseService.adminLogin(username, password);
            if (result.success) {
                console.log('✅ Firebase login successful');
                currentUser = { email: username, loginTime: new Date() };
                showDashboard();
                return;
            } else {
                console.log('❌ Firebase login failed:', result.error);
            }
        } catch (error) {
            console.error('❌ Firebase auth error:', error);
        }
    }
    
    // Fallback to simple login check
    if ((username === 'admin' && password === 'admin123') || 
        (username === 'admin@lemikurapeace.com' && password === 'Word@1212')) {
        console.log('✅ Local login successful');
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
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
    
    if (tabName === 'news') {
        loadNewsData();
    }
}
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Simple admin initializing...');
    
    // Setup form listener
    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', handleAddNews);
        console.log('✅ Form listener added');
    }
    
    // Load display
    loadNewsData();
    updateStats();
    
    console.log('✅ Simple admin ready!');
});

// TEST FUNCTIONS
window.testAddNews = function() {
    const testNews = {
        id: Date.now(),
        title: 'Test News ' + Date.now(),
        category: 'ዜና',
        image: 'images/hero-bg.jpg',
        excerpt: 'Test excerpt',
        content: 'Test content',
        date: new Date().toLocaleDateString('am-ET'),
        likes: 0,
        comments: []
    };
    
    adminNewsData.unshift(testNews);
    saveData();
    loadNewsData();
    updateStats();
    
    console.log('✅ Test news added');
    alert('Test news added!');
};

window.testFormAdd = function() {
    console.log('🧪 Testing form-based news creation...');
    
    // Fill the form
    const titleInput = document.getElementById('newsTitle');
    const categorySelect = document.getElementById('newsCategory');
    const excerptTextarea = document.getElementById('newsExcerpt');
    const contentTextarea = document.getElementById('newsContent');
    
    if (titleInput) titleInput.value = 'Test Form News ' + Date.now();
    if (categorySelect) categorySelect.value = 'ዜና';
    if (excerptTextarea) excerptTextarea.value = 'Test excerpt from form';
    if (contentTextarea) contentTextarea.value = 'Test content from form submission';
    
    console.log('✅ Form filled with test data');
    
    // Trigger form submission
    const form = document.getElementById('newsForm');
    if (form) {
        const fakeEvent = {
            preventDefault: () => console.log('preventDefault called'),
            stopPropagation: () => console.log('stopPropagation called'),
            target: form
        };
        
        handleAddNews(fakeEvent);
        console.log('✅ Form submission triggered');
    }
};

window.checkData = function() {
    console.log('Current data:', adminNewsData.length, 'items');
    console.log('localStorage:', localStorage.getItem('adminNewsData') ? 'exists' : 'missing');
    console.log('Data preview:', adminNewsData.slice(0, 2));
};

window.clearData = function() {
    adminNewsData = [];
    localStorage.removeItem('adminNewsData');
    localStorage.removeItem('newsData');
    loadNewsData();
    updateStats();
    console.log('✅ Data cleared');
};

window.resetToDefault = function() {
    adminNewsData = getDefaultData();
    saveData();
    loadNewsData();
    updateStats();
    console.log('✅ Reset to default data');
};

// Test function to verify admin-to-public sync
window.testSync = function() {
    console.log('🧪 Testing admin-to-public sync...');
    
    const testNews = {
        id: Date.now(),
        title: 'SYNC TEST: ' + new Date().toLocaleTimeString(),
        category: 'ዜና',
        image: 'images/hero-bg.jpg',
        excerpt: 'This is a sync test to verify admin panel connects to main website',
        content: 'If you can see this news on the main website, the sync is working properly!',
        date: new Date().toLocaleDateString('am-ET'),
        likes: 0,
        comments: []
    };
    
    adminNewsData.unshift(testNews);
    saveData();
    loadNewsData();
    updateStats();
    
    console.log('✅ Sync test news added');
    alert('Sync test news added! Check the main website to see if it appears.');
};

// Test edit functionality
window.testEdit = function() {
    if (adminNewsData.length === 0) {
        alert('No news items to edit! Add some news first.');
        return;
    }
    
    const firstNews = adminNewsData[0];
    console.log('🧪 Testing edit functionality with:', firstNews.title);
    editNews(firstNews.id);
};

// Force refresh news display
window.refreshNews = function() {
    console.log('🔄 Force refreshing news display...');
    loadNewsData();
    console.log('✅ News display refreshed');
};

// Debug function to check buttons
window.checkButtons = function() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    console.log('🔍 Found edit buttons:', editButtons.length);
    console.log('🔍 Found delete buttons:', deleteButtons.length);
    console.log('🔍 News data length:', adminNewsData.length);
    
    if (editButtons.length === 0) {
        console.log('❌ No edit buttons found! Refreshing...');
        loadNewsData();
    }
};

console.log('🎉 Simple admin system loaded successfully! v2.0 with edit functionality');

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
    
    // Setup news form listener with multiple approaches
    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        // Remove any existing listeners
        newsForm.removeEventListener('submit', handleAddNews);
        
        // Method 1: Direct form submission
        newsForm.addEventListener('submit', function(e) {
            console.log('🎯 News form submit captured via addEventListener');
            e.preventDefault();
            e.stopPropagation();
            handleAddNews(e);
            return false;
        });
        
        // Method 2: Override form onsubmit
        newsForm.onsubmit = function(e) {
            console.log('🎯 News form submit captured via onsubmit');
            e.preventDefault();
            e.stopPropagation();
            handleAddNews(e);
            return false;
        };
        
        console.log('✅ News form listeners added (multiple methods)');
    }
    
    // Load display after a short delay to ensure Firebase is ready
    setTimeout(() => {
        loadNewsData();
        updateStats();
    }, 1000);
    
    console.log('✅ Simple admin ready!');
});

// Additional form submission handler for button clicks
async function submitNewsForm() {
    console.log('🎯 Manual form submission triggered');
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