// Mobile menu toggle
document.getElementById('mobileMenuToggle').addEventListener('click', function() {
    document.getElementById('mainMenu').classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            document.getElementById('mainMenu').classList.remove('active');
        }
    });
});

// News and Blog functionality
let currentNewsId = null;

// News data - will be loaded from database
let newsData = [];

// Load news data from Supabase
async function loadNewsData() {
    console.log('📡 Loading news data from Supabase...');
    updateNewsStatus('📡 Loading news from Supabase...');
    
    try {
        // Try to use the existing Supabase client that's already initialized
        let supabaseClient = null;
        
        // Check if there's already an initialized Supabase client
        if (typeof window.supabase !== 'undefined' && window.supabase && typeof window.supabase.from === 'function') {
            supabaseClient = window.supabase;
            console.log('✅ Using existing Supabase client');
        } else {
            // Fallback: Initialize new client
            let attempts = 0;
            while (attempts < 20) {
                if (typeof window.supabase !== 'undefined' && window.supabase && window.supabase.createClient) {
                try {
                    supabaseClient = window.supabase.createClient(
                        'https://asfrnjaegyzwpseryawi.supabase.co',
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZnJuamFlZ3l6d3BzZXJ5YXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDg4OTAsImV4cCI6MjA4MjQyNDg5MH0.7vLsda2lKd-9zEyeNJgGXQ39TmN1XZ-TfI4BHM_eWD8'
                    );
                    console.log('✅ Supabase initialized for main page');
                    break;
                } catch (error) {
                    console.error('❌ Supabase initialization error:', error);
                }
            } else {
                console.log(`🔍 Attempt ${attempts + 1}: window.supabase =`, typeof window.supabase, window.supabase?.createClient ? 'has createClient' : 'no createClient');
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
            }
        }
        
        if (!supabaseClient) {
            console.log('⚠️ Supabase library not loaded after 10 seconds');
            console.log('🔍 window.supabase available:', typeof window.supabase);
            console.log('🔍 Supabase CDN scripts:', document.querySelectorAll('script[src*="supabase"]').length);
            updateNewsStatus('⚠️ Database not available - Supabase library failed to load');
            newsData = [];
            renderNews();
            return;
        }
        
        // Fetch news from database
        console.log('🔍 Fetching news from database...');
        const { data, error } = await supabaseClient
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });
        
        console.log('📊 Database response:', { data, error, dataLength: data?.length });
        
        if (error) {
            console.error('❌ Error loading news:', error);
            updateNewsStatus('❌ Database error: ' + error.message);
            // Don't render sample data - show empty state instead
            newsData = [];
            renderNews();
            return;
        }
        
        if (data && data.length > 0) {
            // Convert database format to display format
            newsData = data.map(item => ({
                id: item.id,
                title: item.title,
                category: item.category,
                image: item.image || 'images/hero-bg.jpg',
                excerpt: item.excerpt,
                content: item.content,
                date: item.date_display || new Date(item.created_at).toLocaleDateString('am-ET'),
                likes: item.likes || 0,
                comments: item.comments || []
            }));
            
            console.log('✅ Loaded news from database:', newsData.length, 'items');
            updateNewsStatus(`✅ Loaded ${newsData.length} news items from database`);
        } else {
            // Database connected but no data
            newsData = [];
            console.log('📝 Database connected but no news found');
            updateNewsStatus('📝 Connected to database - no news items found');
        }
        
    } catch (error) {
        console.error('❌ Error loading news:', error);
        updateNewsStatus('❌ Error: ' + error.message);
    }
    
    renderNews(); // Always render, even if empty or using sample data
}

// Update news loading status
function updateNewsStatus(message) {
    const statusElement = document.getElementById('newsLoadingStatus');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.style.display = 'block';
        
        // Hide status after successful load
        if (message.includes('✅')) {
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 3000);
        }
    }
}

// Render news items to the page
function renderNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error('❌ News container not found');
        return;
    }
    
    console.log('🎨 Rendering news items:', newsData.length);
    updateNewsStatus(`🎨 Rendering ${newsData.length} news items...`);
    newsContainer.innerHTML = '';
    
    if (newsData.length === 0) {
        newsContainer.innerHTML = '<p class="no-news">ምንም ዜና የለም።</p>';
        updateNewsStatus('📝 No news to display');
        return;
    }
    
    newsData.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        
        // Handle image display - support both URL and base64
        let imageHtml = '';
        if (news.image) {
            if (news.image.startsWith('data:')) {
                // Base64 image
                imageHtml = `<img src="${news.image}" alt="${news.title}" style="width: 100%; height: 200px; object-fit: cover;">`;
            } else {
                // URL image with fallback
                imageHtml = `<img src="${news.image}" alt="${news.title}" onerror="this.src='images/hero-bg.jpg'" style="width: 100%; height: 200px; object-fit: cover;">`;
            }
        } else {
            // Default image
            imageHtml = `<img src="images/hero-bg.jpg" alt="${news.title}" style="width: 100%; height: 200px; object-fit: cover;">`;
        }
        
        newsCard.innerHTML = `
            <div class="news-image">
                ${imageHtml}
                <div class="news-category">${news.category}</div>
            </div>
            <div class="news-content">
                <h3>${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <div class="news-meta">
                    <span><i class="fas fa-calendar"></i> ${news.date}</span>
                    <span><i class="fas fa-heart"></i> <span class="like-count">${news.likes}</span></span>
                </div>
                <div class="news-actions">
                    <button class="btn btn-primary" onclick="openNewsModal(${news.id})">
                        <i class="fas fa-eye"></i> <span data-translate="readMore">ሙሉውን ያንብቡ</span>
                    </button>
                    <button class="btn btn-secondary like-btn" onclick="likeNews(${news.id})" data-news-id="${news.id}">
                        <i class="far fa-heart"></i> <span class="like-count">${news.likes}</span> <span data-translate="like">ወዳጅነት</span>
                    </button>
                </div>
            </div>
        `;
        newsContainer.appendChild(newsCard);
    });
    
    console.log('✅ News rendered successfully');
    updateNewsStatus(`✅ Successfully displayed ${newsData.length} news items`);
    
    // Initialize liked state after rendering
    setTimeout(() => {
        initializeLikedState();
    }, 100);
}

// Initialize news data
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Home page DOM loaded, initializing...');
    
    // Check if newsContainer exists
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error('❌ News container not found');
        return;
    }
    
    // Initialize Supabase first
    if (typeof initializeSupabase === 'function' && typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
        console.log('🚀 Initializing Supabase on home page...');
        initializeSupabase();
    }
    
    // Load news data with proper timing
    setTimeout(() => {
        console.log('⏰ Starting news data load from Supabase...');
        loadNewsData();
    }, 1000);
    
    // Retry loading if no data after delay (network issues, etc.)
    setTimeout(() => {
        if (newsData.length === 0) {
            console.log('🔄 Retrying news data load...');
            loadNewsData();
        }
    }, 5000);
    
    // Initialize comment form handling with delay for script loading
    setTimeout(() => {
        initializeCommentForm();
    }, 2000);
});

// Get default news data
// Default news data removed - using Supabase only

// Open news modal
function openNewsModal(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    currentNewsId = newsId;
    
    const modalContent = document.getElementById('modalContent');
    
    // Handle image display in modal - support both URL and base64
    let imageHtml = '';
    if (news.image) {
        if (news.image.startsWith('data:')) {
            // Base64 image
            imageHtml = `<img src="${news.image}" alt="${news.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin: 20px 0;">`;
        } else {
            // URL image with fallback
            imageHtml = `<img src="${news.image}" alt="${news.title}" onerror="this.src='images/hero-bg.jpg'" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin: 20px 0;">`;
        }
    } else {
        // Default image
        imageHtml = `<img src="images/hero-bg.jpg" alt="${news.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin: 20px 0;">`;
    }
    
    modalContent.innerHTML = `
        <h2>${news.title}</h2>
        <div class="news-meta">
            <span class="news-date"><i class="far fa-calendar"></i> ${news.date}</span>
            <span class="news-category">${news.category}</span>
            <span class="news-likes"><i class="fas fa-heart"></i> ${news.likes} ወዳጅነቶች</span>
        </div>
        ${imageHtml}
        <div class="news-full-content">
            ${news.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
        </div>
    `;
    
    // Hide the comments section in the modal
    const commentsSection = document.querySelector('.comments-section');
    if (commentsSection) {
        commentsSection.style.display = 'none';
    }
    
    document.getElementById('newsModal').style.display = 'block';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close news modal
function closeNewsModal() {
    document.getElementById('newsModal').style.display = 'none';
    currentNewsId = null;
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
    
    // Show comments section again (in case it was hidden)
    const commentsSection = document.querySelector('.comments-section');
    if (commentsSection) {
        commentsSection.style.display = 'block';
    }
}

// Like news
function likeNews(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) {
        return;
    }
    
    // Check if user has already liked this news
    const likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
    const hasLiked = likedNews.includes(newsId);
    
    // Find the like button using data attribute
    const likeBtn = document.querySelector(`[data-news-id="${newsId}"]`);
    if (!likeBtn) {
        return;
    }
    
    const likeCount = likeBtn.querySelector('.like-count');
    const heartIcon = likeBtn.querySelector('i');
    
    if (hasLiked) {
        // Unlike - remove from liked list
        news.likes--;
        const updatedLikedNews = likedNews.filter(id => id !== newsId);
        localStorage.setItem('likedNews', JSON.stringify(updatedLikedNews));
        
        likeBtn.classList.remove('liked');
        heartIcon.className = 'far fa-heart';
        
        // Show feedback
        showLikeFeedback(likeBtn, 'unliked', 'ወዳጅነት ተወግዷል');
    } else {
        // Like - add to liked list
        news.likes++;
        likedNews.push(newsId);
        localStorage.setItem('likedNews', JSON.stringify(likedNews));
        
        likeBtn.classList.add('liked');
        heartIcon.className = 'fas fa-heart';
        
        // Show feedback
        showLikeFeedback(likeBtn, 'liked', 'አመሰግናለን! ወዳጅነትዎ ተመዝግቧል');
    }
    
    if (likeCount) {
        likeCount.textContent = news.likes;
    }
    
    // Note: Like counts are now stored locally only (not synced to Supabase)
    // This is intentional to avoid database writes for every like action
    
    // Show visual feedback
    likeBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        likeBtn.style.transform = 'scale(1)';
    }, 150);
}

// Show like feedback message
function showLikeFeedback(button, type, message) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `like-feedback ${type}`;
    feedback.innerHTML = `
        <i class="fas fa-${type === 'liked' ? 'heart' : 'heart-broken'}"></i>
        <span>${message}</span>
    `;
    
    // Position it near the button
    const rect = button.getBoundingClientRect();
    feedback.style.position = 'fixed';
    feedback.style.top = (rect.top - 50) + 'px';
    feedback.style.left = (rect.left + rect.width / 2) + 'px';
    feedback.style.transform = 'translateX(-50%)';
    feedback.style.zIndex = '1000';
    feedback.style.background = type === 'liked' ? '#38a169' : '#e53e3e';
    feedback.style.color = 'white';
    feedback.style.padding = '8px 16px';
    feedback.style.borderRadius = '20px';
    feedback.style.fontSize = '14px';
    feedback.style.fontWeight = '500';
    feedback.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    feedback.style.opacity = '0';
    feedback.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(feedback);
    
    // Animate in
    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateX(-50%) translateY(-10px)';
    }, 10);
    
    // Remove after 2 seconds
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

// Initialize liked news state when rendering
function initializeLikedState() {
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

// Debug function to test news loading
window.debugNewsLoading = async function() {
    console.log('🔧 DEBUG: Testing news loading...');
    
    // Check if elements exist
    const newsContainer = document.getElementById('newsContainer');
    console.log('📦 News container found:', !!newsContainer);
    
    // Check Supabase configuration
    console.log('🔧 Supabase config available:', typeof supabaseConfig !== 'undefined');
    console.log('🔧 Supabase service available:', typeof supabaseService !== 'undefined');
    console.log('🔧 Initialize function available:', typeof initializeSupabase === 'function');
    console.log('🔧 Is configured function available:', typeof isSupabaseConfigured === 'function');
    
    if (typeof isSupabaseConfigured === 'function') {
        console.log('🔧 Is Supabase configured:', isSupabaseConfigured());
    }
    
    // Test Supabase initialization
    if (typeof initializeSupabase === 'function' && typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
        console.log('🚀 Attempting Supabase initialization...');
        const initialized = initializeSupabase();
        console.log('✅ Supabase initialized:', initialized);
        
        if (initialized && typeof supabaseService !== 'undefined') {
            console.log('📡 Testing Supabase news fetch...');
            try {
                const result = await supabaseService.getAllNews();
                console.log('📰 Supabase result:', result);
                
                if (result && result.success && result.data) {
                    console.log('✅ Found news items:', result.data.length);
                    result.data.forEach((item, index) => {
                        console.log(`📰 News ${index + 1}:`, {
                            id: item.id,
                            title: item.title,
                            hasImage: !!item.image,
                            imageType: item.image ? (item.image.startsWith('data:') ? 'base64' : 'url') : 'none'
                        });
                    });
                } else {
                    console.log('❌ No news data or error:', result);
                }
            } catch (error) {
                console.error('❌ Supabase fetch error:', error);
            }
        }
    }
    
    // Check current newsData
    console.log('📊 Current newsData:', newsData.length, 'items');
    if (newsData.length > 0) {
        console.log('� CData source analysis:');
        newsData.forEach((item, index) => {
            console.log(`📰 News ${index + 1}:`, {
                id: item.id,
                title: item.title,
                hasImage: !!item.image,
                isSupabaseId: typeof item.id === 'number' && item.id > 1000, // Supabase IDs are typically larger
                isDefaultData: item.id <= 3 // Default data has IDs 1, 2, 3
            });
        });
    }
    
    // Force reload news
    console.log('🔄 Force reloading news...');
    await loadNewsData();
};

// News data is now managed exclusively through Supabase
// No local storage operations needed

// Load comments for a news item
function loadComments(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    const commentsContainer = document.getElementById('commentsContainer');
    commentsContainer.innerHTML = '';
    
    if (news.comments.length === 0) {
        commentsContainer.innerHTML = '<p>ምንም አስተያየት የለም። የመጀመሪያው ይሁኑ!</p>';
        return;
    }
    
    news.comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-author">${comment.author}</div>
            <div class="comment-date">${comment.date}</div>
            <div class="comment-text">${comment.text}</div>
        `;
        commentsContainer.appendChild(commentElement);
    });
}

// Add comment to news
function addNewsComment() {
    if (!currentNewsId) {
        return;
    }
    
    const commentText = document.getElementById('newsCommentText').value.trim();
    if (!commentText) {
        alert('እባክዎ አስተያየትዎን ይጻፉ!');
        return;
    }
    
    const news = newsData.find(n => n.id === currentNewsId);
    if (!news) {
        return;
    }
    
    const newComment = {
        id: Date.now(),
        author: "ጎብኚ", // Guest user
        text: commentText,
        date: new Date().toLocaleDateString('am-ET')
    };
    
    news.comments.push(newComment);
    document.getElementById('newsCommentText').value = '';
    
    // Reload comments in modal
    loadComments(currentNewsId);
    
    // Update the news display
    renderNews();
    
    // Note: Comments are stored locally only for this demo
    // In production, you might want to sync comments to Supabase
}

// ==================== COMMENT SYSTEM ====================

// Initialize comment form handling
function initializeCommentForm() {
    console.log('💬 Initializing comment form...');
    
    const commentForm = document.getElementById('publicCommentForm');
    if (!commentForm) {
        console.log('📝 Comment form not found on this page');
        return;
    }
    
    console.log('✅ Comment form found:', commentForm);
    commentForm.addEventListener('submit', handleCommentSubmission);
    console.log('✅ Comment form initialized with submit handler');
}

// Handle comment form submission
async function handleCommentSubmission(e) {
    e.preventDefault();
    
    console.log('💬 Comment form submitted!');
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Get form values
    const commentData = {
        author: formData.get('author'),
        email: formData.get('email') || null,
        subject: formData.get('subject'),
        text: formData.get('text'),
        type: 'public_comment'
    };
    
    console.log('💬 Comment data:', commentData);
    
    // Validate required fields
    if (!commentData.author || !commentData.subject || !commentData.text) {
        alert('እባክዎ ሁሉንም የሚያስፈልጉ መስኮች ይሙሉ!');
        console.log('❌ Validation failed - missing required fields');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> እየላክ ነው...';
    submitBtn.disabled = true;
    
    try {
        console.log('🔍 Checking Supabase availability...');
        
        // Check if supabaseService is available
        if (typeof supabaseService === 'undefined') {
            console.error('❌ supabaseService not available');
            throw new Error('Comment service not available');
        }
        
        // Check if Supabase is configured
        if (typeof isSupabaseConfigured !== 'function' || !isSupabaseConfigured()) {
            console.error('❌ Supabase not configured');
            throw new Error('Database not configured');
        }
        
        console.log('💾 Saving comment to Supabase...');
        const result = await supabaseService.addComment(commentData);
        
        if (result.success) {
            console.log('✅ Comment saved to Supabase:', result.id);
            
            // Also save to localStorage as backup
            saveCommentToLocalStorage(commentData);
            
            // Show success message
            alert('✅ አስተያየትዎ በተሳካ ሁኔታ ተላከ! ከተገመገመ በኋላ ይታያል።');
            
            // Reset form
            form.reset();
            
        } else {
            console.error('❌ Failed to save comment to Supabase:', result.error);
            throw new Error('Failed to save comment: ' + result.error);
        }
        
    } catch (error) {
        console.error('❌ Error submitting comment:', error);
        
        // Try to save to localStorage as fallback
        try {
            console.log('💾 Saving to localStorage as fallback...');
            saveCommentToLocalStorage(commentData);
            alert('✅ አስተያየትዎ በተሳካ ሁኔታ ተላከ! ከተገመገመ በኋላ ይታያል።');
            form.reset();
        } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError);
            alert('❌ አስተያየትዎን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
        }
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Save comment to localStorage as backup
function saveCommentToLocalStorage(commentData) {
    try {
        console.log('💾 Saving comment to localStorage...');
        const existingComments = JSON.parse(localStorage.getItem('publicComments') || '[]');
        
        const newComment = {
            ...commentData,
            id: Date.now(),
            date: new Date().toLocaleDateString('am-ET'),
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        existingComments.push(newComment);
        localStorage.setItem('publicComments', JSON.stringify(existingComments));
        
        console.log('✅ Comment saved to localStorage:', newComment);
    } catch (error) {
        console.error('❌ Error saving comment to localStorage:', error);
        throw error;
    }
}

// Load and display approved comments (for future use)
async function loadApprovedComments() {
    try {
        if (typeof supabaseService !== 'undefined' && typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
            const result = await supabaseService.getApprovedComments();
            
            if (result.success && result.data) {
                console.log('✅ Loaded approved comments:', result.data.length);
                return result.data;
            }
        }
        
        // Fallback to localStorage
        const localComments = JSON.parse(localStorage.getItem('publicComments') || '[]');
        return localComments.filter(c => c.status === 'approved');
        
    } catch (error) {
        console.error('❌ Error loading approved comments:', error);
        return [];
    }
}

// Display comments in a container (for future use)
function displayComments(comments, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (comments.length === 0) {
        container.innerHTML = '<p>ምንም አስተያየት የለም።</p>';
        return;
    }
    
    container.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <strong>${comment.author}</strong>
                <span class="comment-date">${comment.date || new Date(comment.created_at).toLocaleDateString('am-ET')}</span>
            </div>
            <div class="comment-subject">
                <strong>${comment.subject}</strong>
            </div>
            <div class="comment-text">
                ${comment.text}
            </div>
        </div>
    `).join('');
}

console.log('💬 Comment system functions loaded');