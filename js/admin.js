// Admin Panel JavaScript

// Sample data storage (in a real application, this would be a database)
let adminNewsData = [
    {
        id: 1,
        title: "የሰላምና ፀጥታ አዲስ ፕሮግራም ተጀመረ",
        category: "ዜና",
        image: "images/hero-bg.jpg",
        excerpt: "በለሚ ኩራ ክ/ከተማ አዲስ የሰላምና ፀጥታ ፕሮግራም ተጀምሯል። ይህ ፕሮግራም የማህበረሰቡን ተሳትፎ በመጨመር...",
        content: "በለሚ ኩራ ክ/ከተማ አዲስ የሰላምና ፀጥታ ፕሮግራም ተጀምሯል። ይህ ፕሮግራም የማህበረሰቡን ተሳትፎ በመጨመር የወረዳውን ሰላምና ፀጥታ ለማጠናከር ይረዳል። ፕሮግራሙ የተለያዩ ክፍሎችን ያካትታል፣ ከነዚህም መካከል የማህበረሰብ ፖሊስ፣ የሰላም ኮሚቴዎች እና የወጣቶች ተሳትፎ ዋና ዋናዎቹ ናቸው።",
        date: "ታህሳስ 19, 2017",
        likes: 12,
        comments: []
    },
    {
        id: 2,
        title: "የማህበረሰብ ስብሰባ ማስታወቂያ",
        category: "ማስታወቂያ",
        image: "images/pro.jpg",
        excerpt: "ሁሉም ነዋሪዎች በታህሳስ 25 ቀን 2017 ዓ.ም በማህበረሰብ ስብሰባ እንዲሳተፉ ተጋብዘዋል...",
        content: "ሁሉም ነዋሪዎች በታህሳስ 25 ቀን 2017 ዓ.ም በማህበረሰብ ስብሰባ እንዲሳተፉ ተጋብዘዋል። ስብሰባው በጠዋቱ 9:00 ሰዓት በወረዳ ቢሮ ይካሄዳል። በስብሰባው ላይ የሚወያዩ ዋና ዋና ጉዳዮች፣ የወረዳው የሰላምና ፀጥታ ሁኔታ፣ የማህበረሰብ ተሳትፎ እና የመጪው ዓመት እቅዶች ይሆናሉ።",
        date: "ታህሳስ 15, 2017",
        likes: 8,
        comments: []
    },
    {
        id: 3,
        title: "የሰላም ግንባታ አስፈላጊነት",
        category: "ብሎግ",
        image: "images/hero-bg.png",
        excerpt: "ሰላም ማለት ከግጭት መላቀቅ ብቻ ሳይሆን፣ ዘላቂ የሆነ የማህበረሰብ መረጋጋት ማለት ነው...",
        content: "ሰላም ማለት ከግጭት መላቀቅ ብቻ ሳይሆን፣ ዘላቂ የሆነ የማህበረሰብ መረጋጋት ማለት ነው። የሰላም ግንባታ ሂደት የሁሉንም የማህበረሰብ ክፍሎች ተሳትፎ ይጠይቃል። ይህም ከመንግስት ተቋማት ጀምሮ እስከ ግለሰብ ዜጎች ድረስ የሁሉንም ሚና ያካትታል። በእኛ ወረዳ የሰላም ግንባታ ስራ በተለያዩ መንገዶች ይካሄዳል።",
        date: "ታህሳስ 10, 2017",
        likes: 15,
        comments: []
    }
];

let commentsData = [];
let publicComments = []; // Public comments from the website
let currentUser = null;

// Admin credentials (in a real application, this would be secure)
const adminCredentials = {
    username: "admin",
    password: "admin123"
};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel initializing...');
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
        console.log('Found saved user, showing dashboard');
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        console.log('No saved user found, showing login');
    }

    // Load saved data - use admin-specific key to avoid conflicts
    try {
        loadSavedData();
        console.log('Data loaded successfully');
    } catch (error) {
        console.error('Error loading data:', error);
    }
    
    // Setup event listeners
    setupEventListeners();
    console.log('Event listeners set up');
    
    // Update stats
    try {
        updateStats();
    } catch (error) {
        console.error('Error updating stats:', error);
    }
    
    // Sync with main newsData if available from main script
    try {
        syncWithMainNewsData();
    } catch (error) {
        console.error('Error syncing data:', error);
    }
});

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Login form
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form event listener added');
    } else {
        console.error('Login form not found!');
    }
    
    // Also add click listener to login button as backup
    const loginButton = document.querySelector('#adminLoginForm button[type="submit"]');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            console.log('Login button clicked');
            e.preventDefault(); // Prevent default form submission
            handleLogin(e); // Directly call the login handler
        });
        console.log('Login button click listener added');
    }

    // News form
    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', handleAddNews);
        console.log('News form event listener added');
    }

    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSaveSettings);
        console.log('Settings form event listener added');
    }
}

function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Username:', username, 'Password length:', password.length);
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        console.log('Login successful');
        currentUser = { username: username, loginTime: new Date() };
        localStorage.setItem('adminUser', JSON.stringify(currentUser));
        showDashboard();
    } else {
        console.log('Login failed');
        alert('የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል!');
    }
}

function showDashboard() {
    console.log('Showing dashboard...');
    const loginSection = document.getElementById('loginSection');
    const adminDashboard = document.getElementById('adminDashboard');
    
    if (loginSection) {
        loginSection.style.display = 'none';
        console.log('Login section hidden');
    }
    
    if (adminDashboard) {
        adminDashboard.style.display = 'block';
        console.log('Admin dashboard shown');
    }
    
    // Try to load data, but don't let errors stop the dashboard from showing
    try {
        loadNewsData();
        loadCommentsData();
        updateStats();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function logout() {
    localStorage.removeItem('adminUser');
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
    
    // Load data for the selected tab
    if (tabName === 'news') {
        loadNewsData();
    } else if (tabName === 'comments') {
        loadCommentsData();
    }
}

function showAddNewsForm() {
    document.getElementById('addNewsForm').style.display = 'block';
}

function hideAddNewsForm() {
    document.getElementById('addNewsForm').style.display = 'none';
    document.getElementById('newsForm').reset();
}

function handleAddNews(e) {
    e.preventDefault();
    
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
}

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
                    <span><i class="fas fa-comment"></i> ${news.comments.length} አስተያየቶች</span>
                </div>
                <p>${news.excerpt}</p>
            </div>
            <div class="admin-news-actions">
                <button class="edit-btn" onclick="editNews(${news.id})">አርም</button>
                <button class="delete-btn" onclick="deleteNews(${news.id})">ሰርዝ</button>
            </div>
        `;
        container.appendChild(newsElement);
    });
}

function editNews(id) {
    const news = adminNewsData.find(n => n.id === id);
    if (!news) return;
    
    // Fill the form with existing data
    document.getElementById('newsTitle').value = news.title;
    document.getElementById('newsCategory').value = news.category;
    document.getElementById('newsImage').value = news.image;
    document.getElementById('newsExcerpt').value = news.excerpt;
    document.getElementById('newsContent').value = news.content;
    
    // Show the form
    showAddNewsForm();
    
    // Change form submission to update instead of add
    const form = document.getElementById('newsForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        updateNews(id, new FormData(e.target));
    };
}

function updateNews(id, formData) {
    const newsIndex = adminNewsData.findIndex(n => n.id === id);
    if (newsIndex === -1) return;
    
    adminNewsData[newsIndex] = {
        ...adminNewsData[newsIndex],
        title: formData.get('title'),
        category: formData.get('category'),
        image: formData.get('image') || adminNewsData[newsIndex].image,
        excerpt: formData.get('excerpt'),
        content: formData.get('content')
    };
    
    saveData();
    loadNewsData();
    hideAddNewsForm();
    
    // Reset form submission
    const form = document.getElementById('newsForm');
    form.onsubmit = handleAddNews;
    
    alert('ዜና በተሳካ ሁኔታ ተዘምኗል!');
}

function deleteNews(id) {
    if (confirm('እርግጠኛ ነዎት ይህን ዜና መሰረዝ ይፈልጋሉ?')) {
        adminNewsData = adminNewsData.filter(n => n.id !== id);
        saveData();
        loadNewsData();
        updateStats();
        alert('ዜና ተሰርዟል!');
    }
}

function loadCommentsData() {
    console.log('Admin: Loading comments data...');
    const container = document.getElementById('adminCommentsList');
    if (!container) {
        console.error('Admin: Comments container not found!');
        return;
    }
    
    container.innerHTML = '';
    
    // Load public comments from localStorage
    loadPublicComments();
    
    // Get all comments from news items
    const newsComments = [];
    adminNewsData.forEach(news => {
        news.comments.forEach(comment => {
            newsComments.push({
                ...comment,
                newsTitle: news.title,
                newsId: news.id,
                type: 'news_comment'
            });
        });
    });
    
    // Combine all comments (public comments + news comments)
    const allComments = [...publicComments, ...newsComments];
    console.log('Admin: Total comments to display:', allComments.length);
    console.log('Admin: Public comments:', publicComments.length);
    console.log('Admin: News comments:', newsComments.length);
    
    if (allComments.length === 0) {
        container.innerHTML = '<div class="no-comments"><i class="fas fa-comments"></i><p>ምንም አስተያየት የለም።</p></div>';
        return;
    }
    
    // Sort by timestamp (newest first)
    allComments.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));
    
    allComments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = `comment-item ${comment.type || 'news_comment'}`;
        
        if (comment.type === 'public_comment') {
            // Public comment from website
            commentElement.innerHTML = `
                <div class="comment-header">
                    <div class="comment-meta">
                        <strong><i class="fas fa-globe"></i> ${comment.author}</strong>
                        ${comment.email ? `<br><small><i class="fas fa-envelope"></i> ${comment.email}</small>` : ''}
                        <br><small><i class="fas fa-tag"></i> ${comment.subject}</small>
                        <br><small><i class="fas fa-calendar"></i> ${comment.date}</small>
                        <span class="comment-status status-${comment.status}">${getStatusText(comment.status)}</span>
                    </div>
                    <div class="comment-actions">
                        <button class="approve-btn" onclick="approvePublicComment(${comment.id})" ${comment.status === 'approved' ? 'disabled' : ''}>
                            <i class="fas fa-check"></i> ተቀበል
                        </button>
                        <button class="reject-btn" onclick="rejectPublicComment(${comment.id})">
                            <i class="fas fa-times"></i> ሰርዝ
                        </button>
                    </div>
                </div>
                <div class="comment-content">
                    <p>${comment.text}</p>
                </div>
            `;
        } else {
            // News comment
            commentElement.innerHTML = `
                <div class="comment-header">
                    <div class="comment-meta">
                        <strong><i class="fas fa-newspaper"></i> ${comment.author}</strong> በ "${comment.newsTitle}" ላይ
                        <br><small><i class="fas fa-calendar"></i> ${comment.date}</small>
                    </div>
                    <div class="comment-actions">
                        <button class="approve-btn" onclick="approveComment(${comment.newsId}, ${comment.id})">
                            <i class="fas fa-check"></i> ተቀበል
                        </button>
                        <button class="reject-btn" onclick="deleteComment(${comment.newsId}, ${comment.id})">
                            <i class="fas fa-times"></i> ሰርዝ
                        </button>
                    </div>
                </div>
                <div class="comment-content">
                    <p>${comment.text}</p>
                </div>
            `;
        }
        
        container.appendChild(commentElement);
    });
}

function approveComment(newsId, commentId) {
    // In a real application, this would update the comment status
    alert('አስተያየት ተቀባይነት አግኝቷል!');
}

function deleteComment(newsId, commentId) {
    if (confirm('እርግጠኛ ነዎት ይህን አስተያየት መሰረዝ ይፈልጋሉ?')) {
        const news = adminNewsData.find(n => n.id === newsId);
        if (news) {
            news.comments = news.comments.filter(c => c.id !== commentId);
            saveData();
            loadCommentsData();
            updateStats();
            alert('አስተያየት ተሰርዟል!');
        }
    }
}

function handleSaveSettings(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const settings = {
        siteName: formData.get('siteName'),
        contactEmail: formData.get('contactEmail'),
        contactPhone: formData.get('contactPhone'),
        officeHours: formData.get('officeHours')
    };
    
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    alert('ቅንብሮች ተቀምጠዋል!');
}

function updateStats() {
    const totalNews = adminNewsData.length;
    const newsComments = adminNewsData.reduce((sum, news) => sum + news.comments.length, 0);
    const publicCommentsCount = publicComments.length;
    const totalComments = newsComments + publicCommentsCount;
    const totalLikes = adminNewsData.reduce((sum, news) => sum + news.likes, 0);
    
    const totalNewsEl = document.getElementById('totalNews');
    const totalCommentsEl = document.getElementById('totalComments');
    const totalLikesEl = document.getElementById('totalLikes');
    
    if (totalNewsEl) totalNewsEl.textContent = totalNews;
    if (totalCommentsEl) totalCommentsEl.textContent = totalComments;
    if (totalLikesEl) totalLikesEl.textContent = totalLikes;
}

function saveData() {
    localStorage.setItem('adminNewsData', JSON.stringify(adminNewsData));
    // Also update the main newsData for the public site
    localStorage.setItem('newsData', JSON.stringify(adminNewsData));
}

function loadSavedData() {
    const savedNews = localStorage.getItem('adminNewsData');
    if (savedNews) {
        adminNewsData = JSON.parse(savedNews);
    }
}

// Sync with main newsData to avoid conflicts
function syncWithMainNewsData() {
    const mainNewsData = localStorage.getItem('newsData');
    if (mainNewsData && !localStorage.getItem('adminNewsData')) {
        // If main newsData exists but admin doesn't, use main data
        adminNewsData = JSON.parse(mainNewsData);
        saveData();
    } else if (adminNewsData.length > 0) {
        // If admin has data, sync it to main
        localStorage.setItem('newsData', JSON.stringify(adminNewsData));
    }
}

// Test function for debugging - can be called from browser console
window.testLogin = function() {
    console.log('Testing login function...');
    const username = document.getElementById('username').value || 'admin';
    const password = document.getElementById('password').value || 'admin123';
    
    console.log('Test username:', username, 'Test password:', password);
    
    if (username === 'admin' && password === 'admin123') {
        console.log('Test login successful');
        currentUser = { username: username, loginTime: new Date() };
        localStorage.setItem('adminUser', JSON.stringify(currentUser));
        showDashboard();
    } else {
        console.log('Test login failed');
        alert('Test login failed!');
    }
};

// Export functions for use in main script
window.adminFunctions = {
    adminNewsData,
    saveData,
    loadSavedData
};
// Public Comment Management Functions
function loadPublicComments() {
    const savedComments = localStorage.getItem('publicComments');
    if (savedComments) {
        publicComments = JSON.parse(savedComments);
        console.log('Admin: Loaded public comments:', publicComments.length);
    } else {
        console.log('Admin: No public comments found in localStorage');
    }
}

function savePublicComments() {
    localStorage.setItem('publicComments', JSON.stringify(publicComments));
}

function approvePublicComment(commentId) {
    const comment = publicComments.find(c => c.id === commentId);
    if (comment) {
        comment.status = 'approved';
        savePublicComments();
        loadCommentsData();
        updateStats();
        alert('አስተያየት ተቀባይነት አግኝቷል!');
    }
}

function rejectPublicComment(commentId) {
    if (confirm('እርግጠኛ ነዎት ይህን አስተያየት መሰረዝ ይፈልጋሉ?')) {
        publicComments = publicComments.filter(c => c.id !== commentId);
        savePublicComments();
        loadCommentsData();
        updateStats();
        alert('አስተያየት ተሰርዟል!');
    }
}

function getStatusText(status) {
    switch (status) {
        case 'pending': return 'በመጠባበቅ ላይ';
        case 'approved': return 'ተቀባይነት አግኝቷል';
        case 'rejected': return 'ተቀባይነት አላገኘም';
        default: return 'በመጠባበቅ ላይ';
    }
}

// Listen for new public comments
document.addEventListener('newPublicComment', function(event) {
    console.log('New public comment received in admin:', event.detail);
    loadPublicComments();
    if (currentUser) {
        loadCommentsData();
        updateStats();
        
        // Show notification
        showAdminNotification('አዲስ አስተያየት ተቀብሏል!', 'success');
    }
});

function showAdminNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}