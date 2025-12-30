// Enhanced Android-compatible mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mainMenu = document.getElementById('mainMenu');
    
    if (!mobileToggle || !mainMenu) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    console.log('🔧 Initializing Android-compatible mobile menu...');
    
    let isMenuOpen = false;
    
    // Function to toggle menu
    function toggleMobileMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        console.log('📱 Mobile menu toggle clicked', isMenuOpen ? '(closing)' : '(opening)');
        
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            // Open menu
            mainMenu.classList.add('active');
            mobileToggle.classList.add('active');
            document.body.classList.add('menu-open');
            
            // Change icon
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
            
            // Prevent background scroll
            document.body.style.overflow = 'hidden';
            
            console.log('✅ Mobile menu opened');
        } else {
            // Close menu
            mainMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Change icon back
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            // Restore background scroll
            document.body.style.overflow = 'auto';
            
            console.log('✅ Mobile menu closed');
        }
    }
    
    // Function to close menu
    function closeMobileMenu() {
        if (isMenuOpen) {
            console.log('📱 Closing mobile menu');
            toggleMobileMenu();
        }
    }
    
    // Add multiple event listeners for better Android compatibility
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    // Add touch events for Android
    mobileToggle.addEventListener('touchstart', function(e) {
        e.preventDefault();
        // Add visual feedback
        this.style.transform = 'scale(0.95)';
    }, { passive: false });
    
    mobileToggle.addEventListener('touchend', function(e) {
        e.preventDefault();
        // Remove visual feedback
        this.style.transform = 'scale(1)';
        // Trigger toggle
        toggleMobileMenu(e);
    }, { passive: false });
    
    // Prevent double-tap zoom on Android
    mobileToggle.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Close mobile menu when clicking on links
    const menuLinks = document.querySelectorAll('#mainMenu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
        link.addEventListener('touchend', closeMobileMenu);
    });
    
    // Close menu when clicking outside (Android-compatible)
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !mainMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu when touching outside (Android-specific)
    document.addEventListener('touchstart', function(e) {
        if (isMenuOpen && !mainMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    }, { passive: true });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Handle orientation change on Android
    window.addEventListener('orientationchange', function() {
        if (isMenuOpen) {
            // Close menu on orientation change
            setTimeout(closeMobileMenu, 100);
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && isMenuOpen) {
            // Close menu if screen becomes large
            closeMobileMenu();
        }
    });
    
    console.log('✅ Android-compatible mobile menu initialized successfully');
    
    // Debug function for testing
    window.testMobileMenu = function() {
        console.log('🔧 Testing mobile menu...');
        console.log('Toggle button:', mobileToggle);
        console.log('Menu element:', mainMenu);
        console.log('Menu open:', isMenuOpen);
        console.log('Menu classes:', mainMenu ? mainMenu.className : 'not found');
        
        if (mobileToggle && mainMenu) {
            console.log('✅ Elements found, triggering toggle...');
            toggleMobileMenu();
            console.log('Menu classes after toggle:', mainMenu.className);
        } else {
            console.error('❌ Mobile menu elements not found');
        }
    };
});

// Enhanced smooth scrolling for navigation links (Android-compatible)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Close mobile menu if open
            const mainMenu = document.getElementById('mainMenu');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            
            if (mainMenu && mainMenu.classList.contains('active')) {
                mainMenu.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.classList.remove('active');
                    const icon = mobileToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
                document.body.classList.remove('menu-open');
                document.body.style.overflow = 'auto';
            }
            
            // Calculate header height for offset
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            // Smooth scroll with Android optimization
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                // Fallback for older Android browsers
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 800;
                let start = null;
                
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const progressPercentage = Math.min(progress / duration, 1);
                    
                    // Easing function
                    const easeInOutCubic = progressPercentage < 0.5 
                        ? 4 * progressPercentage * progressPercentage * progressPercentage 
                        : (progressPercentage - 1) * (2 * progressPercentage - 2) * (2 * progressPercentage - 2) + 1;
                    
                    window.scrollTo(0, startPosition + distance * easeInOutCubic);
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                }
                
                window.requestAnimationFrame(step);
            }
        }
    });
    
    // Add touch event for better Android responsiveness
    anchor.addEventListener('touchend', function(e) {
        // Small delay to prevent conflicts with click
        setTimeout(() => {
            if (!this.clickHandled) {
                this.click();
            }
            this.clickHandled = false;
        }, 10);
    }, { passive: true });
    
    // Mark click as handled to prevent double-firing
    anchor.addEventListener('click', function() {
        this.clickHandled = true;
    });
});

// News and Blog functionality
let currentNewsId = null;

// News data - will be loaded from database
let newsData = [];

// Safe image parsing function
function parseImages(imagesJson, fallbackImage) {
    try {
        // If imagesJson exists and is not null/empty
        if (imagesJson && imagesJson.trim() !== '') {
            const parsed = JSON.parse(imagesJson);
            // Make sure it's an array and has content
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (error) {
        console.warn('Error parsing images JSON:', error);
    }
    
    // Fallback to single image or default
    return [fallbackImage || 'images/hero-bg.jpg'];
}

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
                images: parseImages(item.images, item.image), // Safe image parsing
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

// Render news items to the page with enhanced animations
function renderNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error('❌ News container not found');
        return;
    }
    
    console.log('🎨 Rendering news items:', newsData.length);
    updateNewsStatus(`🎨 Rendering ${newsData.length} news items...`);
    
    // Clear container and add loading class
    newsContainer.innerHTML = '';
    newsContainer.classList.add('loading');
    
    if (newsData.length === 0) {
        newsContainer.innerHTML = `
            <div class="no-news">
                <h3>ምንም ዜና የለም</h3>
                <p>በዚህ ጊዜ ምንም አዲስ ዜና የለም። እባክዎ ቆየት ብለው ይሞክሩ።</p>
                <button class="refresh-button" onclick="loadNewsData()">
                    <i class="fas fa-sync"></i> ገጹን አድስ
                </button>
            </div>
        `;
        updateNewsStatus('📝 No news to display');
        newsContainer.classList.remove('loading');
        return;
    }
    
    // Show loading skeletons first
    showLoadingSkeletons(newsContainer, Math.min(newsData.length, 6));
    
    // Render actual news with staggered animation
    setTimeout(() => {
        newsContainer.innerHTML = '';
        newsContainer.classList.remove('loading');
        
        newsData.forEach((news, index) => {
            setTimeout(() => {
                const newsCard = createNewsCard(news, index);
                newsContainer.appendChild(newsCard);
                
                // Trigger entrance animation
                requestAnimationFrame(() => {
                    newsCard.style.animationDelay = `${index * 0.1}s`;
                    newsCard.classList.add('animate-in');
                });
            }, index * 100);
        });
        
        console.log('✅ News rendered successfully with animations');
        updateNewsStatus(`✅ Successfully displayed ${newsData.length} news items`);
        
        // Initialize liked state after all animations
        setTimeout(() => {
            initializeLikedState();
        }, newsData.length * 100 + 500);
    }, 1500);
}

// Android-optimized news card creation
function createNewsCard(news, index) {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';
    newsCard.style.animationDelay = `${index * 0.1}s`;
    
    // Android performance optimization
    newsCard.style.willChange = 'transform, opacity';
    newsCard.style.transform = 'translateZ(0)';
    
    // Handle multiple images - create collage/grid if more than one image
    let imageHtml = '';
    const images = news.images || [news.image || 'images/hero-bg.jpg'];
    
    if (images.length > 1) {
        // Multiple images - create collage grid
        const imageGrid = images.map((img, imgIndex) => {
            const imgSrc = img.startsWith('data:') ? img : (img || 'images/hero-bg.jpg');
            return `
                <div class="grid-image" onclick="openImageModal('${imgSrc}', '${news.title}')">
                    <img src="${imgSrc}" alt="${news.title} - Image ${imgIndex + 1}" loading="lazy" decoding="async" style="transform: translateZ(0);">
                </div>
            `;
        }).join('');
        
        // Determine grid class based on number of images
        let gridClass = 'image-grid';
        if (images.length === 2) gridClass += ' grid-2';
        else if (images.length === 3) gridClass += ' grid-3';
        else if (images.length === 4) gridClass += ' grid-4';
        else gridClass += ' grid-many';
        
        imageHtml = `
            <div class="${gridClass}">
                ${imageGrid}
                ${images.length > 4 ? `<div class="more-images">+${images.length - 4}</div>` : ''}
            </div>
        `;
    } else {
        // Single image
        const imgSrc = images[0];
        if (imgSrc && imgSrc.startsWith('data:')) {
            imageHtml = `<img src="${imgSrc}" alt="${news.title}" loading="lazy" decoding="async" style="transform: translateZ(0);" onclick="openImageModal('${imgSrc}', '${news.title}')">`;
        } else {
            imageHtml = `<img src="${imgSrc || 'images/hero-bg.jpg'}" alt="${news.title}" onerror="this.src='images/hero-bg.jpg'" loading="lazy" decoding="async" style="transform: translateZ(0);" onclick="openImageModal('${imgSrc}', '${news.title}')">`;
        }
    }
    
    newsCard.innerHTML = `
        <div class="news-image">
            ${imageHtml}
            <div class="news-category">${news.category}</div>
            ${images.length > 1 ? `<div class="image-count"><i class="fas fa-images"></i> ${images.length}</div>` : ''}
        </div>
        <div class="news-content">
            <h3 class="news-title" onclick="openNewsModal(${news.id})" role="button" tabindex="0" aria-label="Read full article: ${news.title}">${news.title}</h3>
            <p class="news-excerpt">${news.excerpt}</p>
            <div class="news-meta">
                <span><i class="fas fa-calendar-alt" aria-hidden="true"></i> ${news.date}</span>
                <span><i class="fas fa-eye" aria-hidden="true"></i> ዕይታ</span>
            </div>
            
            <!-- Facebook-style like section -->
            <div class="facebook-like-section">
                <div class="like-summary" id="like-summary-${news.id}">
                    <div class="like-reactions">
                        <span class="reaction-icons">
                            <span class="reaction-icon like-icon">👍</span>
                            <span class="reaction-icon love-icon">❤️</span>
                        </span>
                        <span class="like-count-text">${formatLikeCount(news.likes)}</span>
                    </div>
                </div>
                
                <div class="engagement-actions">
                    <button class="engagement-btn like-btn" onclick="likeNews(${news.id})" data-news-id="${news.id}" aria-label="Like this article">
                        <i class="far fa-thumbs-up" aria-hidden="true"></i>
                        <span class="action-text">ወደድኩት</span>
                    </button>
                    <button class="engagement-btn comment-btn" onclick="openNewsModal(${news.id})" aria-label="Comment on article">
                        <i class="far fa-comment" aria-hidden="true"></i>
                        <span class="action-text">አስተያየት</span>
                    </button>
                    <button class="engagement-btn share-btn" onclick="shareNews(${news.id})" aria-label="Share article">
                        <i class="far fa-share" aria-hidden="true"></i>
                        <span class="action-text">አጋራ</span>
                    </button>
                </div>
            </div>
            
            <div class="news-actions" style="display: none;">
                <!-- Hidden old actions for backward compatibility -->
                <button class="btn btn-primary" onclick="openNewsModal(${news.id})" aria-label="Read full article">
                    <i class="fas fa-book-open" aria-hidden="true"></i> <span data-translate="readMore">ሙሉውን ያንብቡ</span>
                </button>
            </div>
        </div>
    `;
    
    // Add Android-specific touch event listeners
    if ('ontouchstart' in window) {
        newsCard.addEventListener('touchstart', function(e) {
            this.style.transform = 'translateY(-2px) scale(0.98) translateZ(0)';
        }, { passive: true });
        
        newsCard.addEventListener('touchend', function(e) {
            this.style.transform = 'translateZ(0)';
        }, { passive: true });
        
        newsCard.addEventListener('touchcancel', function(e) {
            this.style.transform = 'translateZ(0)';
        }, { passive: true });
    }
    
    return newsCard;
}

// Show loading skeletons
function showLoadingSkeletons(container, count) {
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'news-skeleton';
        skeleton.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-meta">
                    <div class="skeleton-meta-item"></div>
                    <div class="skeleton-meta-item"></div>
                </div>
                <div class="skeleton-actions">
                    <div class="skeleton-button"></div>
                    <div class="skeleton-button"></div>
                </div>
            </div>
        `;
        container.appendChild(skeleton);
    }
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

// Enhanced news modal with modern reader
function openNewsModal(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    currentNewsId = newsId;
    
    const modalContent = document.getElementById('modalContent');
    const newsModal = document.getElementById('newsModal');
    
    // Handle image display in modal - support both URL and base64
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
    
    // Create enhanced article content
    modalContent.innerHTML = `
        <div class="article-meta">
            <div class="meta-item">
                <i class="far fa-calendar"></i>
                <span>${news.date}</span>
            </div>
            <div class="meta-category">${news.category}</div>
            <div class="meta-item">
                <i class="fas fa-heart"></i>
                <span>${news.likes} ወዳጅነቶች</span>
            </div>
        </div>
        
        <h1>${news.title}</h1>
        
        ${imageHtml}
        
        <div class="article-content">
            ${formatArticleContent(news.content)}
        </div>
    `;
    
    // Show modal with animation
    newsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize reading progress
    initializeReadingProgress();
    
    // Update engagement counts
    updateEngagementCounts(news);
    
    // Load comments if available
    if (news.comments && news.comments.length > 0) {
        loadNewsComments(newsId);
    }
}

// Close enhanced news modal
function closeNewsModal() {
    const newsModal = document.getElementById('newsModal');
    const commentsSection = document.getElementById('commentsSection');
    
    // Hide comments if open
    if (commentsSection.classList.contains('active')) {
        commentsSection.classList.remove('active');
    }
    
    // Close modal with animation
    newsModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    currentNewsId = null;
    
    // Clear any text size adjustments
    document.documentElement.style.removeProperty('--reader-font-size');
}

// Format article content with better typography
function formatArticleContent(content) {
    if (!content) return '';
    
    // Split content into paragraphs and format
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return paragraphs.map(paragraph => {
        const trimmed = paragraph.trim();
        
        // Check if it's a heading (starts with #)
        if (trimmed.startsWith('# ')) {
            return `<h2>${trimmed.substring(2)}</h2>`;
        } else if (trimmed.startsWith('## ')) {
            return `<h3>${trimmed.substring(3)}</h3>`;
        } else if (trimmed.startsWith('> ')) {
            return `<blockquote>${trimmed.substring(2)}</blockquote>`;
        } else {
            return `<p>${trimmed}</p>`;
        }
    }).join('');
}

// Initialize reading progress tracking
function initializeReadingProgress() {
    const article = document.getElementById('newsArticle');
    const progressFill = document.querySelector('.progress-fill');
    
    if (!article || !progressFill) return;
    
    const updateProgress = () => {
        const scrollTop = article.scrollTop;
        const scrollHeight = article.scrollHeight - article.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        progressFill.style.width = `${Math.min(progress, 100)}%`;
    };
    
    article.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call
}

// Update engagement counts in reader
function updateEngagementCounts(news) {
    const likeCounts = document.querySelectorAll('.like-article-btn .engagement-count');
    const commentCounts = document.querySelectorAll('.comment-toggle-btn .engagement-count');
    
    likeCounts.forEach(count => {
        count.textContent = news.likes || 0;
    });
    
    commentCounts.forEach(count => {
        count.textContent = (news.comments && news.comments.length) || 0;
    });
    
    // Update like button state
    const likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
    const likeBtn = document.querySelector('.like-article-btn');
    
    if (likeBtn) {
        if (likedNews.includes(currentNewsId)) {
            likeBtn.classList.add('liked');
            likeBtn.querySelector('i').className = 'fas fa-heart';
        } else {
            likeBtn.classList.remove('liked');
            likeBtn.querySelector('i').className = 'far fa-heart';
        }
    }
}

// Toggle comments section
function toggleComments() {
    const commentsSection = document.getElementById('commentsSection');
    
    if (commentsSection.classList.contains('active')) {
        commentsSection.classList.remove('active');
    } else {
        commentsSection.classList.add('active');
        // Load comments if not already loaded
        if (currentNewsId) {
            loadNewsComments(currentNewsId);
        }
    }
}

// Like current article
function likeCurrentArticle() {
    if (currentNewsId) {
        likeNews(currentNewsId);
        
        // Update the reader engagement counts
        const news = newsData.find(n => n.id === currentNewsId);
        if (news) {
            updateEngagementCounts(news);
        }
    }
}

// Share news functionality
function shareNews() {
    if (!currentNewsId) return;
    
    const news = newsData.find(n => n.id === currentNewsId);
    if (!news) return;
    
    if (navigator.share) {
        // Use native sharing if available
        navigator.share({
            title: news.title,
            text: news.excerpt,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback to clipboard
        const shareText = `${news.title}\n\n${news.excerpt}\n\n${window.location.href}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                showShareFeedback('ሊንክ ወደ ክሊፕቦርድ ተቀድቷል!');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showShareFeedback('ሊንክ ወደ ክሊፕቦርድ ተቀድቷል!');
        }
    }
}

// Show share feedback
function showShareFeedback(message) {
    const feedback = document.createElement('div');
    feedback.className = 'share-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #38a169;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10001;
        animation: fadeInOut 2s ease-out forwards;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// Adjust text size
function adjustTextSize() {
    const currentSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--reader-font-size') || '16');
    const sizes = [14, 16, 18, 20, 22];
    const currentIndex = sizes.indexOf(currentSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    
    document.documentElement.style.setProperty('--reader-font-size', `${sizes[nextIndex]}px`);
    
    // Apply to article
    const article = document.querySelector('.news-article');
    if (article) {
        article.style.fontSize = `${sizes[nextIndex]}px`;
    }
    
    showShareFeedback(`የጽሁፍ መጠን: ${sizes[nextIndex]}px`);
}

// Toggle bookmark (placeholder for future implementation)
function toggleBookmark() {
    if (!currentNewsId) return;
    
    const bookmarkedNews = JSON.parse(localStorage.getItem('bookmarkedNews') || '[]');
    const isBookmarked = bookmarkedNews.includes(currentNewsId);
    
    if (isBookmarked) {
        const updatedBookmarks = bookmarkedNews.filter(id => id !== currentNewsId);
        localStorage.setItem('bookmarkedNews', JSON.stringify(updatedBookmarks));
        showShareFeedback('ከመዝገብ ተወግዷል');
    } else {
        bookmarkedNews.push(currentNewsId);
        localStorage.setItem('bookmarkedNews', JSON.stringify(bookmarkedNews));
        showShareFeedback('ወደ መዝገብ ተጨምሯል');
    }
    
    // Update bookmark button
    const bookmarkBtn = document.querySelector('.reader-action-btn[onclick="toggleBookmark()"] i');
    if (bookmarkBtn) {
        bookmarkBtn.className = isBookmarked ? 'far fa-bookmark' : 'fas fa-bookmark';
    }
}

// Clear comment textarea
function clearComment() {
    const textarea = document.getElementById('newsCommentText');
    if (textarea) {
        textarea.value = '';
        textarea.focus();
    }
}

// Load news comments for reader
function loadNewsComments(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    const commentsContainer = document.getElementById('commentsContainer');
    
    if (!news.comments || news.comments.length === 0) {
        commentsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #718096;">
                <i class="far fa-comment" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>ምንም አስተያየት የለም። የመጀመሪያው ይሁኑ!</p>
            </div>
        `;
        return;
    }
    
    commentsContainer.innerHTML = news.comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
        </div>
    `).join('');
}

// Add CSS for fade in/out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

// Enhanced like news with Android-optimized animations
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
    
    // Prevent multiple clicks during animation
    if (likeBtn.classList.contains('animating')) {
        return;
    }
    
    likeBtn.classList.add('animating');
    
    // Android haptic feedback simulation
    if (navigator.vibrate) {
        navigator.vibrate(hasLiked ? 50 : [50, 30, 50]);
    }
    
    if (hasLiked) {
        // Unlike - remove from liked list
        news.likes--;
        const updatedLikedNews = likedNews.filter(id => id !== newsId);
        localStorage.setItem('likedNews', JSON.stringify(updatedLikedNews));
        
        // Android-optimized unlike animation
        likeBtn.style.transform = 'scale(0.9)';
        likeBtn.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            likeBtn.classList.remove('liked');
            heartIcon.className = 'far fa-heart';
            likeBtn.style.transform = 'scale(1)';
            
            // Show Android-style feedback
            showAndroidFeedback(likeBtn, 'unliked', 'ወዳጅነት ተወግዷል', '💔');
        }, 150);
    } else {
        // Like - add to liked list
        news.likes++;
        likedNews.push(newsId);
        localStorage.setItem('likedNews', JSON.stringify(likedNews));
        
        // Android-optimized like animation with ripple effect
        createAndroidRipple(likeBtn);
        createHeartExplosion(likeBtn);
        
        likeBtn.style.transform = 'scale(1.1)';
        likeBtn.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        setTimeout(() => {
            likeBtn.classList.add('liked');
            heartIcon.className = 'fas fa-heart';
            likeBtn.style.transform = 'scale(1)';
            
            // Show Android-style feedback
            showAndroidFeedback(likeBtn, 'liked', 'አመሰግናለን! ወዳጅነትዎ ተመዝግቧል', '❤️');
        }, 200);
    }
    
    // Update like count with Android-style animation
    if (likeCount) {
        likeCount.style.transform = 'scale(1.2)';
        likeCount.style.color = hasLiked ? '#e53e3e' : '#38a169';
        likeCount.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            likeCount.textContent = news.likes;
            likeCount.style.transform = 'scale(1)';
            likeCount.style.color = '';
        }, 200);
    }
    
    // Remove animating class
    setTimeout(() => {
        likeBtn.classList.remove('animating');
        likeBtn.style.transition = '';
    }, 600);
}

// Create Android Material Design ripple effect
function createAndroidRipple(button) {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('div');
    
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(56, 161, 105, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'androidRipple 0.6s linear';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.marginLeft = '-10px';
    ripple.style.marginTop = '-10px';
    ripple.style.pointerEvents = 'none';
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Android-optimized floating feedback
function showAndroidFeedback(button, type, message, emoji) {
    const feedback = document.createElement('div');
    feedback.className = `android-feedback ${type}`;
    feedback.innerHTML = `
        <span class="feedback-emoji">${emoji}</span>
        <span class="feedback-text">${message}</span>
    `;
    
    // Position it near the button
    const rect = button.getBoundingClientRect();
    feedback.style.position = 'fixed';
    feedback.style.top = (rect.top - 70) + 'px';
    feedback.style.left = (rect.left + rect.width / 2) + 'px';
    feedback.style.transform = 'translateX(-50%) translateY(20px) scale(0.8)';
    feedback.style.zIndex = '9999';
    feedback.style.background = type === 'liked' ? 
        'linear-gradient(135deg, #38a169, #2f855a)' : 
        'linear-gradient(135deg, #e53e3e, #c53030)';
    feedback.style.color = 'white';
    feedback.style.padding = '12px 20px';
    feedback.style.borderRadius = '24px';
    feedback.style.fontSize = '14px';
    feedback.style.fontWeight = '500';
    feedback.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    feedback.style.opacity = '0';
    feedback.style.pointerEvents = 'none';
    feedback.style.display = 'flex';
    feedback.style.alignItems = 'center';
    feedback.style.gap = '8px';
    feedback.style.whiteSpace = 'nowrap';
    feedback.style.maxWidth = '280px';
    feedback.style.textAlign = 'center';
    
    // Android-specific styling
    feedback.style.backdropFilter = 'blur(8px)';
    feedback.style.webkitBackdropFilter = 'blur(8px)';
    feedback.style.border = '1px solid rgba(255,255,255,0.1)';
    
    document.body.appendChild(feedback);
    
    // Android-style animation
    const animation = feedback.animate([
        {
            opacity: 0,
            transform: 'translateX(-50%) translateY(20px) scale(0.8)'
        },
        {
            opacity: 1,
            transform: 'translateX(-50%) translateY(0px) scale(1)'
        }
    ], {
        duration: 250,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
    
    // Auto-hide with Android timing
    setTimeout(() => {
        feedback.animate([
            {
                opacity: 1,
                transform: 'translateX(-50%) translateY(0px) scale(1)'
            },
            {
                opacity: 0,
                transform: 'translateX(-50%) translateY(-20px) scale(0.8)'
            }
        ], {
            duration: 200,
            easing: 'cubic-bezier(0.4, 0, 1, 1)'
        }).onfinish = () => {
            feedback.remove();
        };
    }, 2000);
}

// Create heart explosion effect
function createHeartExplosion(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create multiple heart particles
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = centerX + 'px';
        heart.style.top = centerY + 'px';
        heart.style.fontSize = '12px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(heart);
        
        // Animate heart particles
        const angle = (i / 8) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const duration = 800 + Math.random() * 400;
        
        heart.animate([
            {
                transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1) rotate(360deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            heart.remove();
        };
    }
}

// Enhanced floating feedback with better animations
function showFloatingFeedback(button, type, message, emoji) {
    const feedback = document.createElement('div');
    feedback.className = `like-feedback ${type}`;
    feedback.innerHTML = `
        <span class="feedback-emoji">${emoji}</span>
        <span class="feedback-text">${message}</span>
    `;
    
    // Position it near the button
    const rect = button.getBoundingClientRect();
    feedback.style.position = 'fixed';
    feedback.style.top = (rect.top - 60) + 'px';
    feedback.style.left = (rect.left + rect.width / 2) + 'px';
    feedback.style.transform = 'translateX(-50%) translateY(20px) scale(0.8)';
    feedback.style.zIndex = '1000';
    feedback.style.background = type === 'liked' ? 
        'linear-gradient(135deg, #38a169, #2f855a)' : 
        'linear-gradient(135deg, #e53e3e, #c53030)';
    feedback.style.color = 'white';
    feedback.style.padding = '12px 20px';
    feedback.style.borderRadius = '25px';
    feedback.style.fontSize = '14px';
    feedback.style.fontWeight = '500';
    feedback.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
    feedback.style.opacity = '0';
    feedback.style.pointerEvents = 'none';
    feedback.style.display = 'flex';
    feedback.style.alignItems = 'center';
    feedback.style.gap = '8px';
    feedback.style.whiteSpace = 'nowrap';
    
    document.body.appendChild(feedback);
    
    // Animate in
    feedback.animate([
        {
            opacity: 0,
            transform: 'translateX(-50%) translateY(20px) scale(0.8)'
        },
        {
            opacity: 1,
            transform: 'translateX(-50%) translateY(0px) scale(1)'
        }
    ], {
        duration: 300,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
    
    // Animate out and remove
    setTimeout(() => {
        feedback.animate([
            {
                opacity: 1,
                transform: 'translateX(-50%) translateY(0px) scale(1)'
            },
            {
                opacity: 0,
                transform: 'translateX(-50%) translateY(-20px) scale(0.8)'
            }
        ], {
            duration: 300,
            easing: 'ease-in'
        }).onfinish = () => {
            feedback.remove();
        };
    }, 2500);
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

// Image Carousel Functions
function showCarouselImage(newsId, imageIndex) {
    const carousel = document.querySelector(`[data-news-id="${newsId}"] .image-carousel`);
    if (!carousel) return;
    
    const images = carousel.querySelectorAll('img');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    const counter = carousel.querySelector('.current-image');
    
    // Remove active class from all images and indicators
    images.forEach(img => img.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active class to current image and indicator
    if (images[imageIndex]) {
        images[imageIndex].classList.add('active');
    }
    if (indicators[imageIndex]) {
        indicators[imageIndex].classList.add('active');
    }
    if (counter) {
        counter.textContent = imageIndex + 1;
    }
}

function nextCarouselImage(newsId) {
    const carousel = document.querySelector(`[data-news-id="${newsId}"] .image-carousel`);
    if (!carousel) return;
    
    const images = carousel.querySelectorAll('img');
    const currentActive = carousel.querySelector('img.active');
    let currentIndex = Array.from(images).indexOf(currentActive);
    
    currentIndex = (currentIndex + 1) % images.length;
    showCarouselImage(newsId, currentIndex);
}

function prevCarouselImage(newsId) {
    const carousel = document.querySelector(`[data-news-id="${newsId}"] .image-carousel`);
    if (!carousel) return;
    
    const images = carousel.querySelectorAll('img');
    const currentActive = carousel.querySelector('img.active');
    let currentIndex = Array.from(images).indexOf(currentActive);
    
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showCarouselImage(newsId, currentIndex);
}

// Facebook-style like count formatting
function formatLikeCount(count) {
    if (count === 0) return '';
    if (count === 1) return '1 ሰው ወደደው';
    if (count < 1000) return `${count} ሰዎች ወደዱት`;
    if (count < 1000000) return `${(count / 1000).toFixed(1)}ሺ ሰዎች ወደዱት`;
    return `${(count / 1000000).toFixed(1)}ሚ ሰዎች ወደዱት`;
}

// Enhanced Facebook-style like news function
async function likeNews(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) {
        console.error('News not found:', newsId);
        return;
    }
    
    // Check if user has already liked this news
    const likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
    const hasLiked = likedNews.includes(newsId);
    
    // Find the like button and summary elements
    const likeBtn = document.querySelector(`[data-news-id="${newsId}"]`);
    const likeSummary = document.getElementById(`like-summary-${newsId}`);
    
    if (!likeBtn || !likeSummary) {
        console.error('Like elements not found for news:', newsId);
        return;
    }
    
    const actionText = likeBtn.querySelector('.action-text');
    const likeIcon = likeBtn.querySelector('i');
    const likeCountText = likeSummary.querySelector('.like-count-text');
    
    // Prevent multiple clicks during animation
    if (likeBtn.classList.contains('animating')) {
        return;
    }
    
    likeBtn.classList.add('animating');
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(hasLiked ? 50 : [50, 30, 50]);
    }
    
    try {
        let newLikeCount;
        
        if (hasLiked) {
            // Unlike
            newLikeCount = Math.max(0, news.likes - 1);
            const updatedLikedNews = likedNews.filter(id => id !== newsId);
            localStorage.setItem('likedNews', JSON.stringify(updatedLikedNews));
            
            // Facebook-style unlike animation
            likeBtn.classList.remove('liked');
            likeIcon.className = 'far fa-thumbs-up';
            actionText.textContent = 'ወደድኩት';
            
            // Animate button
            likeBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                likeBtn.style.transform = 'scale(1)';
            }, 150);
            
        } else {
            // Like
            newLikeCount = news.likes + 1;
            likedNews.push(newsId);
            localStorage.setItem('likedNews', JSON.stringify(likedNews));
            
            // Facebook-style like animation
            likeBtn.classList.add('liked');
            likeIcon.className = 'fas fa-thumbs-up';
            actionText.textContent = 'ወደድኩት';
            
            // Create Facebook-style like animation
            createFacebookLikeAnimation(likeBtn);
            
            // Animate button
            likeBtn.style.transform = 'scale(1.1)';
            likeBtn.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            
            setTimeout(() => {
                likeBtn.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Update local data
        news.likes = newLikeCount;
        
        // Update like count display with Facebook-style animation
        updateLikeCountDisplay(likeSummary, newLikeCount, !hasLiked);
        
        // Update database if Supabase is available
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            try {
                const { error } = await supabaseClient
                    .from('news')
                    .update({ likes: newLikeCount })
                    .eq('id', newsId);
                
                if (error) {
                    console.error('Error updating likes in database:', error);
                } else {
                    console.log('✅ Likes updated in database:', newsId, newLikeCount);
                }
            } catch (dbError) {
                console.error('Database update failed:', dbError);
            }
        }
        
    } catch (error) {
        console.error('Error in likeNews:', error);
        // Revert changes on error
        if (hasLiked) {
            likedNews.push(newsId);
        } else {
            const index = likedNews.indexOf(newsId);
            if (index > -1) likedNews.splice(index, 1);
        }
        localStorage.setItem('likedNews', JSON.stringify(likedNews));
    } finally {
        // Remove animating class
        setTimeout(() => {
            likeBtn.classList.remove('animating');
            likeBtn.style.transition = '';
        }, 600);
    }
}

// Update like count display with Facebook-style animation
function updateLikeCountDisplay(likeSummary, newCount, isLiking) {
    const likeCountText = likeSummary.querySelector('.like-count-text');
    const reactionIcons = likeSummary.querySelector('.reaction-icons');
    
    if (newCount === 0) {
        // Hide the entire summary if no likes
        likeSummary.style.opacity = '0';
        likeSummary.style.transform = 'scale(0.8)';
        setTimeout(() => {
            likeSummary.style.display = 'none';
        }, 300);
    } else {
        // Show and update the summary
        likeSummary.style.display = 'flex';
        likeSummary.style.opacity = '1';
        likeSummary.style.transform = 'scale(1)';
        
        // Animate the count change
        likeCountText.style.transform = 'scale(1.2)';
        likeCountText.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            likeCountText.textContent = formatLikeCount(newCount);
            likeCountText.style.transform = 'scale(1)';
        }, 150);
        
        // Animate reaction icons if liking
        if (isLiking) {
            reactionIcons.style.transform = 'scale(1.3)';
            setTimeout(() => {
                reactionIcons.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// Create Facebook-style like animation
function createFacebookLikeAnimation(button) {
    // Create floating thumbs up
    const floatingThumb = document.createElement('div');
    floatingThumb.className = 'floating-reaction';
    floatingThumb.innerHTML = '👍';
    
    const rect = button.getBoundingClientRect();
    floatingThumb.style.position = 'fixed';
    floatingThumb.style.left = rect.left + rect.width / 2 + 'px';
    floatingThumb.style.top = rect.top + 'px';
    floatingThumb.style.fontSize = '24px';
    floatingThumb.style.pointerEvents = 'none';
    floatingThumb.style.zIndex = '9999';
    floatingThumb.style.animation = 'facebookLikeFloat 1s ease-out forwards';
    
    document.body.appendChild(floatingThumb);
    
    setTimeout(() => {
        floatingThumb.remove();
    }, 1000);
    
    // Create ripple effect
    createFacebookRipple(button);
}

// Create Facebook-style ripple effect
function createFacebookRipple(button) {
    const ripple = document.createElement('div');
    ripple.className = 'facebook-ripple';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(24, 119, 242, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'facebookRipple 0.6s linear';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.marginLeft = -size/2 + 'px';
    ripple.style.marginTop = -size/2 + 'px';
    ripple.style.pointerEvents = 'none';
    
    button.style.position = 'relative';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Share news function
function shareNews(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    if (navigator.share) {
        // Use native sharing if available
        navigator.share({
            title: news.title,
            text: news.excerpt,
            url: window.location.href + '#news-' + newsId
        }).catch(console.error);
    } else {
        // Fallback to clipboard
        const shareText = `${news.title}\n\n${news.excerpt}\n\n${window.location.href}#news-${newsId}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showAndroidFeedback(null, 'shared', 'ሊንክ ተቀድቷል!', '🔗');
        }).catch(() => {
            // Fallback alert
            alert('ሊንክ: ' + window.location.href + '#news-' + newsId);
        });
    }
}

// Initialize liked state for all news items (Facebook-style)
function initializeLikedState() {
    const likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
    
    likedNews.forEach(newsId => {
        const likeBtn = document.querySelector(`[data-news-id="${newsId}"]`);
        if (likeBtn) {
            likeBtn.classList.add('liked');
            const thumbIcon = likeBtn.querySelector('i');
            const actionText = likeBtn.querySelector('.action-text');
            if (thumbIcon) {
                thumbIcon.className = 'fas fa-thumbs-up';
            }
            if (actionText) {
                actionText.textContent = 'ወደድኩት';
            }
        }
    });
    
    console.log('✅ Initialized Facebook-style liked state for', likedNews.length, 'items');
}
// Create Android Material Design ripple effect
function createAndroidRipple(button) {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('div');
    
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(56, 161, 105, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'androidRipple 0.6s linear';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.marginLeft = '-10px';
    ripple.style.marginTop = '-10px';
    ripple.style.pointerEvents = 'none';
    
    button.style.position = 'relative';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Create heart explosion effect
function createHeartExplosion(button) {
    const hearts = ['❤️', '💖', '💕', '💗'];
    const numHearts = 5;
    
    for (let i = 0; i < numHearts; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-explosion';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            
            const rect = button.getBoundingClientRect();
            heart.style.left = rect.left + rect.width / 2 + 'px';
            heart.style.top = rect.top + rect.height / 2 + 'px';
            heart.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 800);
        }, i * 100);
    }
}

// Show Android-style feedback toast
function showAndroidFeedback(button, type, message, emoji) {
    // Remove any existing feedback
    const existingFeedback = document.querySelector('.android-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    const feedback = document.createElement('div');
    feedback.className = 'android-feedback';
    feedback.innerHTML = `
        <span style="font-size: 18px;">${emoji}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// Update Supabase client initialization
let supabaseClient = null;

// Wait for Supabase to be available and initialize client
function initializeSupabaseClient() {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        try {
            supabaseClient = window.supabase.createClient(
                'https://asfrnjaegyzwpseryawi.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZnJuamFlZ3l6d3BzZXJ5YXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDg4OTAsImV4cCI6MjA4MjQyNDg5MH0.7vLsda2lKd-9zEyeNJgGXQ39TmN1XZ-TfI4BHM_eWD8'
            );
            console.log('✅ Supabase client initialized for likes');
            return true;
        } catch (error) {
            console.error('❌ Error initializing Supabase client:', error);
            return false;
        }
    }
    return false;
}

// Initialize Supabase client when available
document.addEventListener('DOMContentLoaded', function() {
    // Try to initialize immediately
    if (!initializeSupabaseClient()) {
        // If not available, keep trying
        let attempts = 0;
        const maxAttempts = 20;
        
        const checkSupabase = setInterval(() => {
            attempts++;
            if (initializeSupabaseClient() || attempts >= maxAttempts) {
                clearInterval(checkSupabase);
            }
        }, 500);
    }
});
// Image Modal Functions
function openImageModal(imageSrc, title) {
    // Remove existing modal if any
    const existingModal = document.getElementById('imageModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeImageModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeImageModal()">
                <i class="fas fa-times"></i>
            </button>
            <img src="${imageSrc}" alt="${title}" loading="lazy">
            <div class="modal-title">${title}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageModal();
    }
});