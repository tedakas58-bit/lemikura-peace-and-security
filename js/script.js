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

// Load news data from localStorage if available
async function loadNewsData() {
    // Try Firebase first
    if (typeof firebaseService !== 'undefined' && typeof firebaseConfig !== 'undefined') {
        try {
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
                renderNews();
                return;
            }
        } catch (error) {
            console.error('Firebase load error:', error);
        }
    }
    
    // Fallback to localStorage
    const savedNews = localStorage.getItem('newsData') || localStorage.getItem('adminNewsData');
    if (savedNews) {
        try {
            newsData = JSON.parse(savedNews);
        } catch (error) {
            console.error('Error parsing saved data:', error);
            newsData = getDefaultNewsData();
        }
    } else {
        newsData = getDefaultNewsData();
    }
    
    renderNews(); // Render news after loading
}

// Render news items to the page
function renderNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        return;
    }
    
    newsContainer.innerHTML = '';
    
    newsData.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <div class="news-image">
                <img src="${news.image}" alt="${news.title}" onerror="this.src='images/hero-bg.jpg'">
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
    
    // Initialize liked state after rendering
    setTimeout(() => {
        initializeLikedState();
    }, 100);
}

// Initialize news data
document.addEventListener('DOMContentLoaded', function() {
    // Check if newsContainer exists
    const newsContainer = document.getElementById('newsContainer');
    
    // Load news data with a delay to ensure Firebase is ready
    setTimeout(() => {
        loadNewsData();
    }, 2000);
    
    // Also render news if admin updates are available
    if (typeof adminFunctions !== 'undefined' && adminFunctions.adminNewsData) {
        newsData = adminFunctions.adminNewsData;
        renderNews();
    }
    
    // Force render with default data as fallback
    setTimeout(() => {
        if (newsData.length === 0) {
            newsData = getDefaultNewsData();
        }
        renderNews();
    }, 3000);
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
    modalContent.innerHTML = `
        <h2>${news.title}</h2>
        <div class="news-meta">
            <span class="news-date"><i class="far fa-calendar"></i> ${news.date}</span>
            <span class="news-category">${news.category}</span>
            <span class="news-likes"><i class="fas fa-heart"></i> ${news.likes} ወዳጅነቶች</span>
        </div>
        <img src="${news.image}" alt="${news.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin: 20px 0;">
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