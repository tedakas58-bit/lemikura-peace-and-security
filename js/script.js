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

// Sample news data (this will be loaded from admin panel)
let newsData = [
    {
        id: 1,
        title: "የሰላምና ፀጥታ አዲስ ፕሮግራም ተጀመረ",
        category: "ዜና",
        image: "images/hero-bg.jpg",
        excerpt: "በለሚ ኩራ ክ/ከተማ አዲስ የሰላምና ፀጥታ ፕሮግራም ተጀምሯል። ይህ ፕሮግራም የማህበረሰቡን ተሳትፎ በመጨመር...",
        content: "በለሚ ኩራ ክ/ከተማ አዲስ የሰላምና ፀጥታ ፕሮግራም ተጀምሯል። ይህ ፕሮግራም የማህበረሰቡን ተሳትፎ በመጨመር የወረዳውን ሰላምና ፀጥታ ለማጠናከር ይረዳል። ፕሮግራሙ የተለያዩ ክፍሎችን ያካትታል፣ ከነዚህም መካከል የማህበረሰብ ፖሊስ፣ የሰላም ኮሚቴዎች እና የወጣቶች ተሳትፎ ዋና ዋናዎቹ ናቸው። በዚህ ፕሮግራም ማህበረሰቡ በራሱ ሰላምና ፀጥታ ላይ ንቁ ተሳትፎ እንዲያደርግ ይበረታታል።",
        date: "ታህሳስ 19, 2017",
        likes: 12,
        comments: [
            {
                id: 1,
                author: "አበበ ተስፋዬ",
                text: "በጣም ጥሩ ፕሮግራም ነው። ማህበረሰቡ በሙሉ መደገፍ አለበት።",
                date: "ታህሳስ 19, 2017"
            },
            {
                id: 2,
                author: "ወ/ሮ ሳራ አሸናፊ",
                text: "ይህ ፕሮግራም በወረዳችን ሰላም እንዲሰፍን ይረዳል። እናመሰግናለን።",
                date: "ታህሳስ 20, 2017"
            }
        ]
    },
    {
        id: 2,
        title: "የማህበረሰብ ስብሰባ ማስታወቂያ",
        category: "ማስታወቂያ",
        image: "images/pro.jpg",
        excerpt: "ሁሉም ነዋሪዎች በታህሳስ 25 ቀን 2017 ዓ.ም በማህበረሰብ ስብሰባ እንዲሳተፉ ተጋብዘዋል...",
        content: "ሁሉም ነዋሪዎች በታህሳስ 25 ቀን 2017 ዓ.ም በማህበረሰብ ስብሰባ እንዲሳተፉ ተጋብዘዋል። ስብሰባው በጠዋቱ 9:00 ሰዓት በወረዳ ቢሮ ይካሄዳል። በስብሰባው ላይ የሚወያዩ ዋና ዋና ጉዳዮች፣ የወረዳው የሰላምና ፀጥታ ሁኔታ፣ የማህበረሰብ ተሳትፎ እና የመጪው ዓመት እቅዶች ይሆናሉ። ሁሉም ነዋሪዎች በስብሰባው እንዲሳተፉ በአክብሮት ተጋብዘዋል።",
        date: "ታህሳስ 15, 2017",
        likes: 8,
        comments: [
            {
                id: 3,
                author: "ዳንኤል መንግስቱ",
                text: "በእርግጠኝነት እሳተፋለሁ። ጠቃሚ ስብሰባ ይሆናል።",
                date: "ታህሳስ 16, 2017"
            }
        ]
    },
    {
        id: 3,
        title: "የሰላም ግንባታ አስፈላጊነት",
        category: "ብሎግ",
        image: "images/hero-bg.png",
        excerpt: "ሰላም ማለት ከግጭት መላቀቅ ብቻ ሳይሆን፣ ዘላቂ የሆነ የማህበረሰብ መረጋጋት ማለት ነው...",
        content: "ሰላም ማለት ከግጭት መላቀቅ ብቻ ሳይሆን፣ ዘላቂ የሆነ የማህበረሰብ መረጋጋት ማለት ነው። የሰላም ግንባታ ሂደት የሁሉንም የማህበረሰብ ክፍሎች ተሳትፎ ይጠይቃል። ይህም ከመንግስት ተቋማት ጀምሮ እስከ ግለሰብ ዜጎች ድረስ የሁሉንም ሚና ያካትታል። በእኛ ወረዳ የሰላም ግንባታ ስራ በተለያዩ መንገዶች ይካሄዳል። ከነዚህም መካከል የማህበረሰብ ውይይቶች፣ የግጭት መፍቻ ስልጠናዎች እና የሰላም ኮሚቴዎች ዋና ዋናዎቹ ናቸው።",
        date: "ታህሳስ 10, 2017",
        likes: 15,
        comments: [
            {
                id: 4,
                author: "ፋሲል ገብረመድህን",
                text: "በጣም ጠቃሚ ጽሁፍ ነው። ሰላም ግንባታ የሁላችንም ሃላፊነት ነው።",
                date: "ታህሳስ 11, 2017"
            },
            {
                id: 5,
                author: "ወ/ሮ ሄለን ታደሰ",
                text: "እንደዚህ አይነት ጽሁፎች ማህበረሰቡን ያስተምራሉ። እናመሰግናለን።",
                date: "ታህሳስ 12, 2017"
            }
        ]
    }
];

// Load news data from Supabase, Firebase, or localStorage
async function loadNewsData() {
    console.log('📡 Loading news data for home page...');
    updateNewsStatus('📡 Loading news from Supabase...');
    
    // Try Supabase first (for cross-browser sync)
    if (typeof supabaseConfig !== 'undefined') {
        try {
            console.log('🔧 Checking Supabase configuration...');
            
            // Initialize Supabase if not already done
            if (typeof initializeSupabase === 'function' && typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
                console.log('🚀 Initializing Supabase for home page...');
                const initialized = initializeSupabase();
                
                if (initialized && typeof supabaseService !== 'undefined') {
                    console.log('📡 Fetching news from Supabase...');
                    updateNewsStatus('📡 Fetching news from Supabase...');
                    
                    const supabaseNews = await supabaseService.getAllNews();
                    
                    if (supabaseNews && supabaseNews.success && supabaseNews.data && supabaseNews.data.length > 0) {
                        newsData = supabaseNews.data.map(item => ({
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
                        console.log('✅ Loaded news from Supabase:', newsData.length, 'items');
                        console.log('📰 News items:', newsData.map(n => ({ title: n.title, hasImage: !!n.image, imageType: n.image.startsWith('data:') ? 'base64' : 'url' })));
                        updateNewsStatus(`✅ Loaded ${newsData.length} news items from Supabase`);
                        renderNews();
                        return;
                    } else {
                        console.log('📝 No Supabase news data found or error:', supabaseNews);
                        updateNewsStatus('📝 No Supabase news data found, trying Firebase...');
                    }
                } else {
                    console.log('❌ Supabase service not available or initialization failed');
                    updateNewsStatus('❌ Supabase service not available, trying Firebase...');
                }
            } else {
                console.log('❌ Supabase not configured properly');
                updateNewsStatus('❌ Supabase not configured, trying Firebase...');
            }
        } catch (error) {
            console.error('❌ Supabase load error:', error);
            updateNewsStatus('❌ Supabase error: ' + error.message);
        }
    } else {
        console.log('❌ Supabase config not loaded');
        updateNewsStatus('❌ Supabase config not loaded, trying Firebase...');
    }
    
    // Try Firebase as fallback
    if (typeof firebaseService !== 'undefined' && typeof firebaseConfig !== 'undefined') {
        try {
            updateNewsStatus('📡 Trying Firebase...');
            const firebaseNews = await firebaseService.getAllNews();
            
            if (firebaseNews && firebaseNews.length > 0) {
                newsData = firebaseNews.map(item => ({
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
                console.log('✅ Loaded news from Firebase:', newsData.length, 'items');
                updateNewsStatus(`✅ Loaded ${newsData.length} news items from Firebase`);
                renderNews();
                return;
            }
        } catch (error) {
            console.error('❌ Firebase load error:', error);
            updateNewsStatus('❌ Firebase error: ' + error.message);
        }
    }
    
    // Fallback to localStorage
    updateNewsStatus('📡 Trying localStorage...');
    const savedNews = localStorage.getItem('newsData') || localStorage.getItem('adminNewsData');
    if (savedNews) {
        try {
            newsData = JSON.parse(savedNews);
            console.log('✅ Loaded news from localStorage:', newsData.length, 'items');
            updateNewsStatus(`✅ Loaded ${newsData.length} news items from localStorage`);
        } catch (error) {
            console.error('Error parsing saved data:', error);
            newsData = getDefaultNewsData();
            updateNewsStatus('❌ localStorage error, using default data');
        }
    } else {
        newsData = getDefaultNewsData();
        console.log('📝 Using default news data');
        updateNewsStatus('📝 Using default news data');
    }
    
    renderNews(); // Render news after loading
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
        console.log('⏰ Starting news data load...');
        loadNewsData();
    }, 1000);
    
    // Also render news if admin updates are available
    if (typeof adminFunctions !== 'undefined' && adminFunctions.adminNewsData) {
        newsData = adminFunctions.adminNewsData;
        renderNews();
    }
    
    // Force render with default data as fallback after longer delay
    setTimeout(() => {
        if (newsData.length === 0) {
            console.log('📝 No news loaded, using default data');
            newsData = getDefaultNewsData();
            renderNews();
        }
    }, 5000);
});

// Get default news data
function getDefaultNewsData() {
    return [
        {
            id: 1,
            title: "የሰላምና ፀጥታ አዲስ ፕሮግራም ተጀመረ",
            category: "ዜና",
            image: "images/hero-bg.jpg",
            excerpt: "በለሚ ኩራ ክ/ከተማ አዲስ የሰላምና ፀጥታ ፕሮግራም ተጀምሯል። ይህ ፕሮግራም የማህበረሰቡን ተሳትፎ በመጨመር...",
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
            excerpt: "ሁሉም ነዋሪዎች በታህሳስ 25 ቀን 2017 ዓ.ም በማህበረሰብ ስብሰባ እንዲሳተፉ ተጋብዘዋል...",
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
            excerpt: "ሰላም ማለት ከግጭት መላቀቅ ብቻ ሳይሆን፣ ዘላቂ የሆነ የማህበረሰብ መረጋጋት ማለት ነው...",
            content: "ሰላም ማለት ከግጭት መላቀቅ ብቻ ሳይሆን፣ ዘላቂ የሆነ የማህበረሰብ መረጋጋት ማለት ነው። የሰላም ግንባታ ሂደት የሁሉንም የማህበረሰብ ክፍሎች ተሳትፎ ይጠይቃል።",
            date: "ታህሳስ 10, 2017",
            likes: 15,
            comments: []
        }
    ];
}

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
    
    saveNewsData();
    
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
    newsData.forEach((item, index) => {
        console.log(`📰 Current News ${index + 1}:`, {
            id: item.id,
            title: item.title,
            hasImage: !!item.image
        });
    });
    
    // Force reload news
    console.log('🔄 Force reloading news...');
    await loadNewsData();
};

// Save news data to localStorage
function saveNewsData() {
    localStorage.setItem('newsData', JSON.stringify(newsData));
}

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
    saveNewsData();
}