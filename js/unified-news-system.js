// ==================== UNIFIED NEWS SYSTEM ====================
// Single, simple, working news system for both admin and main page
// Version: FINAL - No more conflicts!

console.log('📰 Loading Unified News System...');

// Global news data
let unifiedNewsData = [];
let isSupabaseReady = false;

// ==================== INITIALIZATION ====================
async function initializeUnifiedNewsSystem() {
    console.log('🚀 Initializing Unified News System...');
    
    try {
        // Wait for Supabase to be ready
        let attempts = 0;
        while (attempts < 10) {
            if (typeof window.supabase !== 'undefined' && 
                typeof supabaseService !== 'undefined' && 
                !window.supabaseLoadFailed) {
                isSupabaseReady = true;
                console.log('✅ Supabase is ready');
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        
        if (!isSupabaseReady) {
            console.log('⚠️ Supabase not available - using fallback mode');
        }
        
        return true;
    } catch (error) {
        console.log('⚠️ News system error:', error.message);
        return true; // Always continue
    }
}

// ==================== DATA OPERATIONS ====================

// Load all news
async function loadUnifiedNews() {
    console.log('📡 Loading news...');
    
    if (!isSupabaseReady) {
        console.log('📝 No database connection - showing empty state');
        unifiedNewsData = [];
        return { success: true, data: [] };
    }
    
    try {
        const result = await supabaseService.getAllNews();
        
        if (result.success && result.data) {
            unifiedNewsData = result.data.map(item => ({
                id: item.id,
                title: item.title || 'Untitled',
                category: item.category || 'General',
                image: item.image || 'images/hero-bg.jpg',
                excerpt: item.excerpt || '',
                content: item.content || '',
                date: item.date_display || new Date(item.created_at).toLocaleDateString('am-ET'),
                likes: item.likes || 0,
                created_at: item.created_at
            }));
            
            console.log('✅ Loaded', unifiedNewsData.length, 'news items');
            return { success: true, data: unifiedNewsData };
        } else {
            console.log('📝 No news found');
            unifiedNewsData = [];
            return { success: true, data: [] };
        }
    } catch (error) {
        console.log('⚠️ Error loading news:', error.message);
        unifiedNewsData = [];
        return { success: true, data: [] };
    }
}

// Add news
async function addUnifiedNews(newsData) {
    console.log('➕ Adding news:', newsData.title);
    
    if (!isSupabaseReady) {
        alert('❌ Database not available. Please try again later.');
        return { success: false, error: 'Database not available' };
    }
    
    try {
        const result = await supabaseService.addNewsArticle(newsData);
        
        if (result.success) {
            console.log('✅ News added successfully');
            await loadUnifiedNews(); // Reload data
            return { success: true };
        } else {
            console.error('❌ Failed to add news:', result.error);
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('❌ Error adding news:', error);
        return { success: false, error: error.message };
    }
}

// Delete news
async function deleteUnifiedNews(id) {
    console.log('🗑️ Deleting news:', id);
    
    if (!isSupabaseReady) {
        alert('❌ Database not available. Please try again later.');
        return { success: false, error: 'Database not available' };
    }
    
    try {
        const result = await supabaseService.deleteNewsArticle(id);
        
        if (result.success) {
            console.log('✅ News deleted successfully');
            await loadUnifiedNews(); // Reload data
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

function renderMainPageNews() {
    console.log('🎨 Rendering main page news...');
    
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error('❌ News container not found');
        return;
    }
    
    newsContainer.innerHTML = '';
    
    if (unifiedNewsData.length === 0) {
        newsContainer.innerHTML = `
            <div class="no-news" style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-newspaper" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <h3>ምንም ዜና የለም</h3>
                <p>አዲስ ዜናዎች ሲታተሙ እዚህ ይታያሉ።</p>
            </div>
        `;
        return;
    }
    
    unifiedNewsData.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        
        // Handle image
        let imageHtml = '';
        if (news.image) {
            if (news.image.startsWith('data:')) {
                imageHtml = `<img src="${news.image}" alt="${news.title}" loading="lazy">`;
            } else {
                imageHtml = `<img src="${news.image}" alt="${news.title}" onerror="this.src='images/hero-bg.jpg'" loading="lazy">`;
            }
        } else {
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
                    <button class="btn btn-primary" onclick="openUnifiedNewsModal(${news.id})">
                        <i class="fas fa-eye"></i> ሙሉውን ያንብቡ
                    </button>
                    <button class="btn btn-secondary like-btn" onclick="likeUnifiedNews(${news.id})" data-news-id="${news.id}">
                        <i class="far fa-heart"></i> <span class="like-count">${news.likes}</span> ወዳጅነት
                    </button>
                </div>
            </div>
        `;
        
        newsContainer.appendChild(newsCard);
    });
    
    console.log('✅ Main page news rendered');
}

// ==================== ADMIN PAGE RENDERING ====================

function renderAdminNews() {
    console.log('🎨 Rendering admin news...');
    
    const newsContainer = document.getElementById('adminNewsList') || 
                         document.getElementById('newsManagementContainer');
    
    if (!newsContainer) {
        console.error('❌ Admin news container not found');
        return;
    }
    
    // Update count
    const newsCount = document.getElementById('newsCount');
    if (newsCount) {
        newsCount.textContent = unifiedNewsData.length;
    }
    
    newsContainer.innerHTML = '';
    
    if (unifiedNewsData.length === 0) {
        newsContainer.innerHTML = `
            <div class="no-news-admin" style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-newspaper" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <h3>ምንም ዜና የለም</h3>
                <p>አዲስ ዜና ለመጨመር ከላይ ያለውን ቅጽ ይጠቀሙ።</p>
            </div>
        `;
        return;
    }
    
    unifiedNewsData.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'admin-news-item';
        newsCard.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            background: white;
        `;
        
        // Handle image preview
        let imagePreview = '';
        if (news.image) {
            if (news.image.startsWith('data:')) {
                imagePreview = `<img src="${news.image}" alt="${news.title}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;">`;
            } else {
                imagePreview = `<img src="${news.image}" alt="${news.title}" onerror="this.src='images/hero-bg.jpg'" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;">`;
            }
        } else {
            imagePreview = `<img src="images/hero-bg.jpg" alt="${news.title}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;">`;
        }
        
        newsCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 8px 0; color: #333;">${news.title}</h4>
                    <div style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 14px; color: #666;">
                        <span><i class="fas fa-tag"></i> ${news.category}</span>
                        <span><i class="fas fa-calendar"></i> ${news.date}</span>
                        <span><i class="fas fa-heart"></i> ${news.likes} ወዳጅነቶች</span>
                    </div>
                    <p style="margin: 0; color: #666; font-size: 14px;">${news.excerpt}</p>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    ${imagePreview}
                    <button class="btn btn-sm btn-danger" onclick="confirmDeleteUnifiedNews(${news.id})" style="padding: 4px 8px; font-size: 12px;">
                        <i class="fas fa-trash"></i> ሰርዝ
                    </button>
                </div>
            </div>
        `;
        
        newsContainer.appendChild(newsCard);
    });
    
    console.log('✅ Admin news rendered');
}

// ==================== MODAL FUNCTIONS ====================

function openUnifiedNewsModal(newsId) {
    const news = unifiedNewsData.find(n => n.id === newsId);
    if (!news) {
        console.error('❌ News not found:', newsId);
        return;
    }
    
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
            imageHtml = `<img src="${news.image}" alt="${news.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin: 20px 0;">`;
        } else {
            imageHtml = `<img src="${news.image}" alt="${news.title}" onerror="this.src='images/hero-bg.jpg'" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin: 20px 0;">`;
        }
    }
    
    modalContent.innerHTML = `
        <h2>${news.title}</h2>
        <div class="news-meta" style="margin-bottom: 20px; color: #666;">
            <span><i class="fas fa-calendar"></i> ${news.date}</span>
            <span style="margin-left: 20px;"><i class="fas fa-tag"></i> ${news.category}</span>
            <span style="margin-left: 20px;"><i class="fas fa-heart"></i> ${news.likes} ወዳጅነቶች</span>
        </div>
        ${imageHtml}
        <div class="news-full-content">
            ${news.content.split('\n').map(paragraph => paragraph.trim() ? `<p>${paragraph}</p>` : '').join('')}
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeUnifiedNewsModal() {
    const modal = document.getElementById('newsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ==================== LIKE FUNCTIONALITY ====================

function likeUnifiedNews(newsId) {
    const news = unifiedNewsData.find(n => n.id === newsId);
    if (!news) return;
    
    // Get liked news from localStorage
    const likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
    const hasLiked = likedNews.includes(newsId);
    
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
    } else {
        // Like
        news.likes++;
        likedNews.push(newsId);
        localStorage.setItem('likedNews', JSON.stringify(likedNews));
        
        likeBtn.classList.add('liked');
        heartIcon.className = 'fas fa-heart';
    }
    
    if (likeCount) {
        likeCount.textContent = news.likes;
    }
    
    // Visual feedback
    likeBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        likeBtn.style.transform = 'scale(1)';
    }, 150);
}

// ==================== ADMIN FUNCTIONS ====================

async function handleUnifiedNewsSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const newsData = {
        title: formData.get('title'),
        category: formData.get('category'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        image: formData.get('image') || 'images/hero-bg.jpg'
    };
    
    // Validate
    if (!newsData.title || !newsData.excerpt || !newsData.content) {
        alert('እባክዎ ሁሉንም የሚያስፈልጉ መስኮች ይሙሉ!');
        return;
    }
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> እየጨመር ነው...';
    submitBtn.disabled = true;
    
    try {
        const result = await addUnifiedNews(newsData);
        
        if (result.success) {
            alert('✅ ዜና በተሳካ ሁኔታ ተጨምሯል!');
            form.reset();
            
            // Refresh displays
            renderAdminNews();
            renderMainPageNews();
        } else {
            alert('❌ ዜና መጨመር አልተቻለም: ' + result.error);
        }
    } catch (error) {
        alert('❌ ስህተት ተፈጥሯል: ' + error.message);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function confirmDeleteUnifiedNews(newsId) {
    const news = unifiedNewsData.find(n => n.id === newsId);
    if (!news) return;
    
    if (confirm(`እርግጠኛ ነዎት "${news.title}" ዜና መሰረዝ ይፈልጋሉ?`)) {
        try {
            const result = await deleteUnifiedNews(newsId);
            
            if (result.success) {
                alert('✅ ዜና በተሳካ ሁኔታ ተሰርዟል!');
                
                // Refresh displays
                renderAdminNews();
                renderMainPageNews();
            } else {
                alert('❌ ዜና መሰረዝ አልተቻለም: ' + result.error);
            }
        } catch (error) {
            alert('❌ ስህተት ተፈጥሯል: ' + error.message);
        }
    }
}

// ==================== GLOBAL FUNCTIONS ====================

// Make functions globally available
window.initializeUnifiedNewsSystem = initializeUnifiedNewsSystem;
window.loadUnifiedNews = loadUnifiedNews;
window.renderMainPageNews = renderMainPageNews;
window.renderAdminNews = renderAdminNews;
window.openUnifiedNewsModal = openUnifiedNewsModal;
window.closeUnifiedNewsModal = closeUnifiedNewsModal;
window.likeUnifiedNews = likeUnifiedNews;
window.handleUnifiedNewsSubmit = handleUnifiedNewsSubmit;
window.confirmDeleteUnifiedNews = confirmDeleteUnifiedNews;

// Alias for modal close
window.closeNewsModal = closeUnifiedNewsModal;
window.openNewsModal = openUnifiedNewsModal;
window.likeNews = likeUnifiedNews;

console.log('✅ Unified News System Loaded - NO MORE CONFLICTS!');