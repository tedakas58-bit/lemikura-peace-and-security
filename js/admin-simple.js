// SIMPLE ADMIN SYSTEM - NO COMPLEX SYNC LOGIC
console.log('🚀 Simple Admin System Loading...');

// Load data immediately
let adminNewsData = [];
const savedData = localStorage.getItem('adminNewsData');
if (savedData) {
    try {
        adminNewsData = JSON.parse(savedData);
        console.log('✅ Loaded data:', adminNewsData.length, 'items');
    } catch (error) {
        console.error('Error loading data:', error);
        adminNewsData = getDefaultData();
    }
} else {
    adminNewsData = getDefaultData();
    console.log('Using default data');
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
function saveData() {
    console.log('💾 Saving data:', adminNewsData.length, 'items');
    localStorage.setItem('adminNewsData', JSON.stringify(adminNewsData));
    localStorage.setItem('newsData', JSON.stringify(adminNewsData)); // For public site
    console.log('✅ Data saved successfully');
}

// SIMPLE ADD NEWS FUNCTION
function handleAddNews(e) {
    e.preventDefault();
    console.log('📝 Adding news...');
    
    const formData = new FormData(e.target);
    const newsItem = {
        id: Date.now(),
        title: formData.get('title'),
        category: formData.get('category'),
        image: formData.get('image') || 'images/hero-bg.jpg',
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        date: new Date().toLocaleDateString('am-ET'),
        likes: 0,
        comments: []
    };
    
    adminNewsData.unshift(newsItem);
    saveData();
    loadNewsData();
    hideAddNewsForm();
    updateStats();
    
    alert('ዜና በተሳካ ሁኔታ ተጨምሯል!');
    console.log('✅ News added successfully');
    return false;
}

// SIMPLE LOAD NEWS DISPLAY
function loadNewsData() {
    const container = document.getElementById('adminNewsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    adminNewsData.forEach(news => {
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
                <button class="delete-btn" onclick="deleteNews(${news.id})">ሰርዝ</button>
            </div>
        `;
        container.appendChild(newsElement);
    });
    
    console.log('✅ News display updated:', adminNewsData.length, 'items');
}

// SIMPLE DELETE FUNCTION
function deleteNews(id) {
    if (confirm('እርግጠኛ ነዎት ይህን ዜና መሰረዝ ይፈልጋሉ?')) {
        adminNewsData = adminNewsData.filter(n => n.id !== id);
        saveData();
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
}

function hideAddNewsForm() {
    document.getElementById('addNewsForm').style.display = 'none';
    document.getElementById('newsForm').reset();
}

// SIMPLE LOGIN FUNCTIONS
let currentUser = null;

function handleLogin(e) {
    e.preventDefault();
    console.log('🔐 Simple login...');
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Simple login check
    if ((username === 'admin' && password === 'admin123') || 
        (username === 'admin@lemikurapeace.com' && password === 'Word@1212')) {
        console.log('✅ Login successful');
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

function logout() {
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

window.checkData = function() {
    console.log('Current data:', adminNewsData.length, 'items');
    console.log('localStorage:', localStorage.getItem('adminNewsData') ? 'exists' : 'missing');
};

console.log('🎉 Simple admin system loaded successfully!');

// SIMPLE INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Simple admin initializing...');
    
    // Setup login form listener
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ Login form listener added');
    }
    
    // Setup news form listener
    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', handleAddNews);
        console.log('✅ News form listener added');
    }
    
    // Load display
    loadNewsData();
    updateStats();
    
    console.log('✅ Simple admin ready!');
});