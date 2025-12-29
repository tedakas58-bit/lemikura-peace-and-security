// SIMPLE NEWS SYSTEM - JUST WORKS!
console.log('📰 Loading Simple News System...');

let newsData = [];

// Initialize simple news system
async function initSimpleNews() {
    console.log('🚀 Initializing Simple News System...');
    
    // Wait for Supabase
    let attempts = 0;
    while (attempts < 20) {
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            if (window.initSimpleSupabase()) {
                console.log('✅ Simple news system ready');
                return true;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
    }
    
    console.log('⚠️ Using offline mode');
    return true;
}

// Load news
async function loadSimpleNews() {
    console.log('📡 Loading news...');
    
    try {
        const result = await window.simpleSupabase.getAllNews();
        if (result.success) {
            newsData = result.data || [];
            console.log('✅ Loaded', newsData.length, 'news items');
            return newsData;
        }
    } catch (error) {
        console.log('⚠️ Using fallback mode:', error.message);
    }
    
    newsData = [];
    return newsData;
}

// Render news on main page
function renderMainNews() {
    console.log('🎨 Rendering main page news...');
    
    const container = document.getElementById('newsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (newsData.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-newspaper" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <h3>ምንም ዜና የለም</h3>
                <p>አዲስ ዜናዎች ሲታተሙ እዚህ ይታያሉ።</p>
            </div>
        `;
        return;
    }
    
    newsData.forEach(news => {
        const card = document.createElement('div');
        card.className = 'news-card';
        
        const imageHtml = news.image ? 
            `<img src="${news.image}" alt="${news.title}" onerror="this.src='images/hero-bg.jpg'" loading="lazy">` :
            `<img src="images/hero-bg.jpg" alt="${news.title}" loading="lazy">`;
        
        card.innerHTML = `
            <div class="news-image">
                ${imageHtml}
                <div class="news-category">${news.category || 'General'}</div>
            </div>
            <div class="news-content">
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <div class="news-meta">
                    <span class="news-date">
                        <i class="fas fa-calendar"></i> ${news.date_display || new Date(news.created_at).toLocaleDateString('am-ET')}
                    </span>
                    <span class="news-likes">
                        <i class="fas fa-heart"></i> ${news.likes || 0}
                    </span>
                </div>
                <div class="news-actions">
                    <button class="btn btn-primary" onclick="openSimpleModal(${news.id})">
                        <i class="fas fa-eye"></i> ሙሉውን ያንብቡ
                    </button>
                    <button class="btn btn-secondary">
                        <i class="far fa-heart"></i> ${news.likes || 0} ወዳጅነት
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    console.log('✅ Main news rendered');
}

// Render news in admin
function renderAdminNews() {
    console.log('🎨 Rendering admin news...');
    
    const container = document.getElementById('adminNewsList');
    if (!container) return;
    
    // Update count
    const countElement = document.getElementById('newsCount');
    if (countElement) {
        countElement.textContent = newsData.length;
    }
    
    container.innerHTML = '';
    
    if (newsData.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-newspaper" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <h3>ምንም ዜና የለም</h3>
                <p>አዲስ ዜና ለመጨመር ከላይ ያለውን ቅጽ ይጠቀሙ።</p>
            </div>
        `;
        return;
    }
    
    newsData.forEach(news => {
        const card = document.createElement('div');
        card.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            background: white;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
        `;
        
        const imageHtml = news.image ? 
            `<img src="${news.image}" alt="${news.title}" onerror="this.src='images/hero-bg.jpg'" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;">` :
            `<img src="images/hero-bg.jpg" alt="${news.title}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;">`;
        
        card.innerHTML = `
            <div style="flex: 1;">
                <h4 style="margin: 0 0 8px 0; color: #333;">${news.title}</h4>
                <div style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 14px; color: #666;">
                    <span><i class="fas fa-tag"></i> ${news.category || 'General'}</span>
                    <span><i class="fas fa-calendar"></i> ${news.date_display || new Date(news.created_at).toLocaleDateString('am-ET')}</span>
                    <span><i class="fas fa-heart"></i> ${news.likes || 0} ወዳጅነቶች</span>
                </div>
                <p style="margin: 0; color: #666; font-size: 14px;">${news.excerpt}</p>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                ${imageHtml}
                <button class="btn btn-sm btn-danger" onclick="deleteSimpleNews(${news.id})" style="padding: 4px 8px; font-size: 12px;">
                    <i class="fas fa-trash"></i> ሰርዝ
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    console.log('✅ Admin news rendered');
}

// Add news
async function addSimpleNews(formData) {
    console.log('➕ Adding news...');
    console.log('📋 Form data received:', formData);
    
    const newsData = {
        title: formData.get('title'),
        category: formData.get('category'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        image: formData.get('image') || formData.get('imageUrl') || 'images/hero-bg.jpg'
    };
    
    console.log('📰 News data prepared:', newsData);
    
    if (!newsData.title || !newsData.excerpt || !newsData.content) {
        console.error('❌ Validation failed:', newsData);
        alert('እባክዎ ሁሉንም የሚያስፈልጉ መስኮች ይሙሉ!');
        return false;
    }
    
    console.log('✅ Validation passed, calling Supabase...');
    const result = await window.simpleSupabase.addNews(newsData);
    
    if (result.success) {
        console.log('✅ News added successfully');
        alert('✅ ዜና በተሳካ ሁኔታ ተጨምሯል!');
        await loadSimpleNews();
        renderAdminNews();
        renderMainNews();
        return true;
    } else {
        console.error('❌ Failed to add news:', result);
        return false;
    }
}

// Delete news
async function deleteSimpleNews(id) {
    if (!confirm('እርግጠኛ ነዎት ይህን ዜና መሰረዝ ይፈልጋሉ?')) return;
    
    console.log('🗑️ Deleting news:', id);
    
    const result = await window.simpleSupabase.deleteNews(id);
    
    if (result.success) {
        alert('✅ ዜና በተሳካ ሁኔታ ተሰርዟል!');
        await loadSimpleNews();
        renderAdminNews();
        renderMainNews();
    }
}

// Open modal
function openSimpleModal(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    const modal = document.getElementById('newsModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) return;
    
    const imageHtml = news.image ? 
        `<img src="${news.image}" alt="${news.title}" onerror="this.src='images/hero-bg.jpg'" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin: 20px 0;">` :
        `<img src="images/hero-bg.jpg" alt="${news.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin: 20px 0;">`;
    
    modalContent.innerHTML = `
        <h2>${news.title}</h2>
        <div style="margin-bottom: 20px; color: #666;">
            <span><i class="fas fa-calendar"></i> ${news.date_display || new Date(news.created_at).toLocaleDateString('am-ET')}</span>
            <span style="margin-left: 20px;"><i class="fas fa-tag"></i> ${news.category || 'General'}</span>
            <span style="margin-left: 20px;"><i class="fas fa-heart"></i> ${news.likes || 0} ወዳጅነቶች</span>
        </div>
        ${imageHtml}
        <div>
            ${news.content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeSimpleModal() {
    const modal = document.getElementById('newsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Global functions
window.initSimpleNews = initSimpleNews;
window.loadSimpleNews = loadSimpleNews;
window.renderMainNews = renderMainNews;
window.renderAdminNews = renderAdminNews;
window.addSimpleNews = addSimpleNews;
window.deleteSimpleNews = deleteSimpleNews;
window.openSimpleModal = openSimpleModal;
window.closeSimpleModal = closeSimpleModal;

// Aliases for compatibility
window.openNewsModal = openSimpleModal;
window.closeNewsModal = closeSimpleModal;

console.log('✅ Simple News System loaded');