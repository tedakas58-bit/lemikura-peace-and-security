// ==================== COMPLETE NEWS & BLOG SYSTEM ====================
// Clean, modern news management system with Supabase integration
// Author: Kiro AI Assistant
// Version: 2.0 - Complete Rewrite

console.log('📰 News System v2.0 Loading...');

// ==================== GLOBAL VARIABLES ====================
let newsSystem = {
    data: [],
    initialized: false,
    supabaseReady: false,
    currentModal: null
};

// ==================== SUPABASE CONNECTION ====================
async function initializeNewsSystem() {
    console.log('🚀 Initializing News System...');
    
    try {
        // Check if we're in browser environment
        if (typeof window === 'undefined') {
            throw new Error('Not in browser environment');
        }
        
        // Check Supabase availability with more thorough checks
        if (typeof window.supabaseConfig === 'undefined' && typeof supabaseConfig === 'undefined') {
            console.log('📦 Loading inline Supabase configuration...');
            window.supabaseConfig = {
                url: 'https://asfrnjaegyzwpseryawi.supabase.co',
                anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZnJuamFlZ3l6d3BzZXJ5YXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDg4OTAsImV4cCI6MjA4MjQyNDg5MH0.7vLsda2lKd-9zEyeNJgGXQ39TmN1XZ-TfI4BHM_eWD8'
            };
        }
        
        // Ensure supabaseConfig is available globally
        if (typeof supabaseConfig === 'undefined') {
            window.supabaseConfig = window.supabaseConfig || {
                url: 'https://asfrnjaegyzwpseryawi.supabase.co',
                anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZnJuamFlZ3l6d3BzZXJ5YXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDg4OTAsImV4cCI6MjA4MjQyNDg5MH0.7vLsda2lKd-9zEyeNJgGXQ39TmN1XZ-TfI4BHM_eWD8'
            };
        }
        
        // Check if Supabase library is loaded
        if (typeof window.supabase === 'undefined') {
            throw new Error('Supabase library not loaded');
        }
        
        // Check if supabaseService is available
        if (typeof supabaseService === 'undefined') {
            throw new Error('Supabase service not available');
        }
        
        // Initialize Supabase if needed
        if (typeof initializeSupabase === 'function') {
            initializeSupabase();
        } else {
            // Manual initialization
            const supabaseLib = window.supabase;
            const config = window.supabaseConfig || supabaseConfig;
            window.supabase = supabaseLib.createClient(config.url, config.anonKey);
        }
        
        newsSystem.supabaseReady = true;
        newsSystem.initialized = true;
        console.log('✅ News system initialized successfully');
        return true;
        
    } catch (error) {
        console.error('❌ News System initialization failed:', error);
        newsSystem.initialized = false;
        newsSystem.supabaseReady = false;
        return false;
    }
}

// ==================== DATA OPERATIONS ====================

// Load all news from Supabase
async function loadAllNews() {
    console.log('📡 Loading news from Supabase...');
    
    if (!newsSystem.supabaseReady) {
        console.error('❌ Supabase not ready');
        return { success: false, error: 'Supabase not ready' };
    }
    
    try {
        const result = await supabaseService.getAllNews();
        
        if (result.success && result.data) {
            newsSystem.data = result.data.map(item => ({
                id: item.id,
                title: item.title || 'Untitled',
                category: item.category || 'General',
                image: item.image || 'images/hero-bg.jpg',
                excerpt: item.excerpt || '',
                content: item.content || '',
                date: item.date_display || new Date(item.created_at).toLocaleDateString('am-ET'),
                likes: item.likes || 0,
                comments: item.comments || [],
                created_at: item.created_at,
                updated_at: item.updated_at
            }));
            
            console.log('✅ Loaded', newsSystem.data.length, 'news items');
            return { success: true, data: newsSystem.data };
        } else {
            console.log('📝 No news data found');
            newsSystem.data = [];
            return { success: true, data: [] };
        }
    } catch (error) {
        console.error('❌ Error loading news:', error);
        return { success: false, error: error.message };
    }
}

// Add new news item
async function addNewsItem(newsData) {
    console.log('➕ Adding news item:', newsData.title);
    
    if (!newsSystem.supabaseReady) {
        return { success: false, error: 'Supabase not ready' };
    }
    
    try {
        const result = await supabaseService.addNewsArticle({
            title: newsData.title,
            category: newsData.category,
            image: newsData.image,
            excerpt: newsData.excerpt,
            content: newsData.content,
            date: newsData.date || new Date().toLocaleDateString('am-ET'),
            likes: 0,
            comments: []
        });
        
        if (result.success) {
            console.log('✅ News item added with ID:', result.id);
            // Reload data to get updated list
            await loadAllNews();
            return { success: true, id: result.id };
        } else {
            console.error('❌ Failed to add news:', result.error);
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('❌ Error adding news:', error);
        return { success: false, error: error.message };
    }
}

// Update news item
async function updateNewsItem(id, newsData) {
    console.log('✏️ Updating news item:', id);
    
    if (!newsSystem.supabaseReady) {
        return { success: false, error: 'Supabase not ready' };
    }
    
    try {
        const result = await supabaseService.updateNewsArticle(id, newsData);
        
        if (result.success) {
            console.log('✅ News item updated:', id);
            // Reload data to get updated list
            await loadAllNews();
            return { success: true };
        } else {
            console.error('❌ Failed to update news:', result.error);
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('❌ Error updating news:', error);
        return { success: false, error: error.message };
    }
}

// Delete news item
async function deleteNewsItem(id) {
    console.log('🗑️ Deleting news item:', id);
    
    if (!newsSystem.supabaseReady) {
        return { success: false, error: 'Supabase not ready' };
    }
    
    try {
        const result = await supabaseService.deleteNewsArticle(id);
        
        if (result.success) {
            console.log('✅ News item deleted:', id);
            // Reload data to get updated list
            await loadAllNews();
            return { success: true };
        } else {
            console.error('❌ Failed to delete news:', result.error);
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('❌ Error deleting news:', error);
        return { success: false, error: error.message };
    }
}

// ==================== MAIN PAGE RENDERING ====================

// Render news on main page
function renderMainPageNews() {
    console.log('🎨 Rendering news on main page...');
    
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error('❌ News container not found');
        return;
    }
    
    // Clear container
    newsContainer.innerHTML = '';
    
    if (newsSystem.data.length === 0) {
        newsContainer.innerHTML = `
            <div class="no-news">
                <i class="fas fa-newspaper" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <h3>ምንም ዜና የለም</h3>
                <p>አዲስ ዜናዎች ሲታተሙ እዚህ ይታያሉ።</p>
            </div>
        `;
        return;
    }
    
    // Create news cards
    newsSystem.data.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.setAttribute('data-news-id', news.id);
        
        // Handle image
        let imageHtml = '';
        if (news.image) {
            if (news.image.startsWith('data:')) {
                // Base64 image
                imageHtml = `<img src="${news.image}" alt="${news.title}" loading="lazy">`;
            } else {
                // URL image with fallback
                imageHtml = `<img src="${news.image}" alt="${news.title}" onerror="this.src='images/hero-bg.jpg'" loading="lazy">`;
            }
        } else {
            // Default image
            imageHtml = `<img src="images/hero-bg.jpg" alt="${news.title}" loading="lazy">`;
        }
        
        newsCard.innerHTML = `
            <div class="news-image">
                ${imageHtml}
                <div class="news-category">${news.category}</div>
            </div>
            <div class="news-content">
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <div class="news-meta">
                    <span class="news-date">
                        <i class="fas fa-calendar"></i> ${news.date}
                    </span>
                    <span class="news-likes">
                        <i class="fas fa-heart"></i> ${news.likes}
                    </span>
                </div>
                <div class="news-actions">
                    <button class="btn btn-primary" onclick="openNewsModal(${news.id})">
                        <i class="fas fa-eye"></i> ሙሉውን ያንብቡ
                    </button>
                    <button class="btn btn-secondary like-btn" onclick="likeNews(${news.id})" data-news-id="${news.id}">
                        <i class="far fa-heart"></i> <span class="like-count">${news.likes}</span> ወዳጅነት
                    </button>
                </div>
            </div>
        `;
        
        newsContainer.appendChild(newsCard);
    });
    
    console.log('✅ Main page news rendered:', newsSystem.data.length, 'items');
    
    // Initialize like states
    initializeLikeStates();
}

// Open news modal on main page
function openNewsModal(newsId) {
    const news = newsSystem.data.find(n => n.id === newsId);
    if (!news) {
        console.error('❌ News not found:', newsId);
        return;
    }
    
    console.log('📖 Opening news modal:', news.title);
    
    const modal = document.getElementById('newsModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) {
        console.error('❌ Modal elements not found');
        return;
    }
    
    // Handle image in modal
    let imageHtml = '';
    if (news.image) {
        if (news.image.startsWith('data:')) {
            imageHtml = `<img src="${news.image}" alt="${news.title}" class="modal-image">`;
        } else {
            imageHtml = `<img src="${news.image}" alt="${news.title}" onerror="this.src='images/hero-bg.jpg'" class="modal-image">`;
        }
    } else {
        imageHtml = `<img src="images/hero-bg.jpg" alt="${news.title}" class="modal-image">`;
    }
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${news.title}</h2>
            <div class="modal-meta">
                <span class="modal-category">${news.category}</span>
                <span class="modal-date">
                    <i class="fas fa-calendar"></i> ${news.date}
                </span>
                <span class="modal-likes">
                    <i class="fas fa-heart"></i> ${news.likes} ወዳጅነቶች
                </span>
            </div>
        </div>
        <div class="modal-image-container">
            ${imageHtml}
        </div>
        <div class="modal-content-text">
            ${news.content.split('\n').map(paragraph => paragraph.trim() ? `<p>${paragraph}</p>` : '').join('')}
        </div>
    `;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    newsSystem.currentModal = newsId;
}

// Close news modal
function closeNewsModal() {
    const modal = document.getElementById('newsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        newsSystem.currentModal = null;
    }
}

// Like news functionality
function likeNews(newsId) {
    const news = newsSystem.data.find(n => n.id === newsId);
    if (!news) return;
    
    // Get liked news from localStorage
    const likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
    const hasLiked = likedNews.includes(newsId);
    
    // Find like button
    const likeBtn = document.querySelector(`[data-news-id="${newsId}"]`);
    if (!likeBtn) return;
    
    const likeCount = likeBtn.querySelector('.like-count');
    const heartIcon = likeBtn.querySelector('i');
    
    if (hasLiked) {
        // Unlike
        news.likes = Math.max(0, news.likes - 1);
        const updatedLikedNews = likedNews.filter(id => id !== newsId);
        localStorage.setItem('likedNews', JSON.stringify(updatedLikedNews));
        
        likeBtn.classList.remove('liked');
        heartIcon.className = 'far fa-heart';
        
        showLikeFeedback(likeBtn, 'unliked', 'ወዳጅነት ተወግዷል');
    } else {
        // Like
        news.likes++;
        likedNews.push(newsId);
        localStorage.setItem('likedNews', JSON.stringify(likedNews));
        
        likeBtn.classList.add('liked');
        heartIcon.className = 'fas fa-heart';
        
        showLikeFeedback(likeBtn, 'liked', 'አመሰግናለን! ወዳጅነትዎ ተመዝግቧል');
    }
    
    // Update like count display
    if (likeCount) {
        likeCount.textContent = news.likes;
    }
    
    // Update modal if open
    if (newsSystem.currentModal === newsId) {
        const modalLikes = document.querySelector('.modal-likes');
        if (modalLikes) {
            modalLikes.innerHTML = `<i class="fas fa-heart"></i> ${news.likes} ወዳጅነቶች`;
        }
    }
    
    // Visual feedback
    likeBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        likeBtn.style.transform = 'scale(1)';
    }, 150);
}

// Show like feedback
function showLikeFeedback(button, type, message) {
    const feedback = document.createElement('div');
    feedback.className = `like-feedback ${type}`;
    feedback.innerHTML = `
        <i class="fas fa-${type === 'liked' ? 'heart' : 'heart-broken'}"></i>
        <span>${message}</span>
    `;
    
    const rect = button.getBoundingClientRect();
    feedback.style.cssText = `
        position: fixed;
        top: ${rect.top - 50}px;
        left: ${rect.left + rect.width / 2}px;
        transform: translateX(-50%);
        z-index: 1000;
        background: ${type === 'liked' ? '#38a169' : '#e53e3e'};
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateX(-50%) translateY(-10px)';
    }, 10);
    
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 2000);
}

// Initialize like states
function initializeLikeStates() {
    const likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
    
    likedNews.forEach(newsId => {
        const likeBtn = document.querySelector(`[data-news-id="${newsId}"]`);
        if (likeBtn) {
            likeBtn.classList.add('liked');
            const heartIcon = likeBtn.querySelector('i');
            if (heartIcon) {
                heartIcon.className = 'fas fa-heart';
            }
        }
    });
}

// ==================== ADMIN PAGE RENDERING ====================

// Render news in admin panel
function renderAdminNews() {
    console.log('🎨 Rendering news in admin panel...');
    
    // Try multiple possible container IDs for backward compatibility
    let newsContainer = document.getElementById('newsManagementContainer') || 
                       document.getElementById('adminNewsList') ||
                       document.querySelector('.news-management-container');
    
    if (!newsContainer) {
        console.error('❌ Admin news container not found! Available containers:', 
            Array.from(document.querySelectorAll('[id*="news"], [class*="news"]')).map(el => el.id || el.className));
        
        // Try to create the container if the parent exists
        const parentContainer = document.querySelector('#newsTab .news-management-section') ||
                               document.querySelector('#newsTab');
        
        if (parentContainer) {
            newsContainer = document.createElement('div');
            newsContainer.id = 'newsManagementContainer';
            newsContainer.className = 'news-management-container';
            parentContainer.appendChild(newsContainer);
            console.log('✅ Created missing news container');
        } else {
            console.error('❌ Cannot create news container - parent not found');
            return;
        }
    }
    
    // Update news count
    const newsCount = document.getElementById('newsCount');
    if (newsCount) {
        newsCount.textContent = newsSystem.data.length;
    }
    
    // Clear container
    newsContainer.innerHTML = '';
    
    if (newsSystem.data.length === 0) {
        newsContainer.innerHTML = `
            <div class="no-news-admin">
                <i class="fas fa-newspaper" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <h3>ምንም ዜና የለም</h3>
                <p>አዲስ ዜና ለመጨመር ከላይ ያለውን ቅጽ ይጠቀሙ።</p>
            </div>
        `;
        return;
    }
    
    // Create admin news cards
    newsSystem.data.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'admin-news-card';
        newsCard.setAttribute('data-news-id', news.id);
        
        // Handle image preview
        let imagePreview = '';
        if (news.image) {
            if (news.image.startsWith('data:')) {
                imagePreview = `<img src="${news.image}" alt="${news.title}" class="admin-news-image">`;
            } else {
                imagePreview = `<img src="${news.image}" alt="${news.title}" onerror="this.src='images/hero-bg.jpg'" class="admin-news-image">`;
            }
        } else {
            imagePreview = `<img src="images/hero-bg.jpg" alt="${news.title}" class="admin-news-image">`;
        }
        
        newsCard.innerHTML = `
            <div class="admin-news-header">
                <div class="admin-news-info">
                    <h4 class="admin-news-title">${news.title}</h4>
                    <div class="admin-news-meta">
                        <span class="admin-news-category">${news.category}</span>
                        <span class="admin-news-date">${news.date}</span>
                        <span class="admin-news-likes">${news.likes} ወዳጅነቶች</span>
                    </div>
                </div>
                <div class="admin-news-actions">
                    <button class="btn btn-sm btn-primary" onclick="editNewsItem(${news.id})">
                        <i class="fas fa-edit"></i> አርም
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="confirmDeleteNews(${news.id})">
                        <i class="fas fa-trash"></i> ሰርዝ
                    </button>
                </div>
            </div>
            <div class="admin-news-body">
                <div class="admin-news-image-container">
                    ${imagePreview}
                </div>
                <div class="admin-news-content">
                    <p class="admin-news-excerpt">${news.excerpt}</p>
                    <div class="admin-news-full-content" style="display: none;">
                        ${news.content}
                    </div>
                    <button class="btn btn-sm btn-secondary" onclick="toggleNewsContent(${news.id})">
                        <i class="fas fa-eye"></i> ሙሉውን ይመልከቱ
                    </button>
                </div>
            </div>
        `;
        
        newsContainer.appendChild(newsCard);
    });
    
    console.log('✅ Admin news rendered:', newsSystem.data.length, 'items');
}

// Toggle full content view in admin
function toggleNewsContent(newsId) {
    const newsCard = document.querySelector(`[data-news-id="${newsId}"]`);
    if (!newsCard) return;
    
    const excerpt = newsCard.querySelector('.admin-news-excerpt');
    const fullContent = newsCard.querySelector('.admin-news-full-content');
    const toggleBtn = newsCard.querySelector('button[onclick*="toggleNewsContent"]');
    
    if (fullContent.style.display === 'none') {
        excerpt.style.display = 'none';
        fullContent.style.display = 'block';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i> ሰብስብ';
    } else {
        excerpt.style.display = 'block';
        fullContent.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i> ሙሉውን ይመልከቱ';
    }
}

// ==================== GLOBAL FUNCTIONS ====================

// Make functions globally available
window.newsSystem = newsSystem;
window.initializeNewsSystem = initializeNewsSystem;
window.loadAllNews = loadAllNews;
window.addNewsItem = addNewsItem;
window.updateNewsItem = updateNewsItem;
window.deleteNewsItem = deleteNewsItem;
window.renderMainPageNews = renderMainPageNews;
window.renderAdminNews = renderAdminNews;
window.openNewsModal = openNewsModal;
window.closeNewsModal = closeNewsModal;
window.likeNews = likeNews;
window.toggleNewsContent = toggleNewsContent;

console.log('✅ News System v2.0 Loaded Successfully');