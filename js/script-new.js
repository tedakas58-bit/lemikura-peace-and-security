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

// News and Blog functionality with translation support
let currentNewsId = null;

// Sample news data with bilingual content
let newsData = [
    {
        id: 1,
        title: {
            am: "የሰላምና ፀጥታ አዲስ ፕሮግራም ተጀመረ",
            en: "New Peace and Security Program Launched"
        },
        category: {
            am: "ዜና",
            en: "News"
        },
        image: "images/hero-bg.jpg",
        excerpt: {
            am: "በለሚ ኩራ ክ/ከተማ አዲስ የሰላምና ፀጥታ ፕሮግራም ተጀምሯል። ይህ ፕሮግራም የማህበረሰቡን ተሳትፎ በመጨመር...",
            en: "A new peace and security program has been launched in Lemi Kura Sub-city. This program aims to strengthen community participation..."
        },
        content: {
            am: "በለሚ ኩራ ክ/ከተማ አዲስ የሰላምና ፀጥታ ፕሮግራም ተጀምሯል። ይህ ፕሮግራም የማህበረሰቡን ተሳትፎ በመጨመር የወረዳውን ሰላምና ፀጥታ ለማጠናከር ይረዳል። ፕሮግራሙ የተለያዩ ክፍሎችን ያካትታል፣ ከነዚህም መካከል የማህበረሰብ ፖሊስ፣ የሰላም ኮሚቴዎች እና የወጣቶች ተሳትፎ ዋና ዋናዎቹ ናቸው። በዚህ ፕሮግራም ማህበረሰቡ በራሱ ሰላምና ፀጥታ ላይ ንቁ ተሳትፎ እንዲያደርግ ይበረታታል።",
            en: "A new peace and security program has been launched in Lemi Kura Sub-city. This program will help strengthen the peace and security of the district by increasing community participation. The program includes various components, including community policing, peace committees and youth participation. Through this program, the community is encouraged to actively participate in its own peace and security."
        },
        date: {
            am: "ታህሳስ 19, 2017",
            en: "December 19, 2024"
        },
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
        title: {
            am: "የማህበረሰብ ስብሰባ ማስታወቂያ",
            en: "Community Meeting Announcement"
        },
        category: {
            am: "ማስታወቂያ",
            en: "Announcement"
        },
        image: "images/pro.jpg",
        excerpt: {
            am: "ሁሉም ነዋሪዎች በታህሳስ 25 ቀን 2017 ዓ.ም በማህበረሰብ ስብሰባ እንዲሳተፉ ተጋብዘዋል...",
            en: "All residents are invited to participate in a community meeting on December 25, 2024..."
        },
        content: {
            am: "ሁሉም ነዋሪዎች በታህሳስ 25 ቀን 2017 ዓ.ም በማህበረሰብ ስብሰባ እንዲሳተፉ ተጋብዘዋል። ስብሰባው በጠዋቱ 9:00 ሰዓት በወረዳ ቢሮ ይካሄዳል። በስብሰባው ላይ የሚወያዩ ዋና ዋና ጉዳዮች፣ የወረዳው የሰላምና ፀጥታ ሁኔታ፣ የማህበረሰብ ተሳትፎ እና የመጪው ዓመት እቅዶች ይሆናሉ። ሁሉም ነዋሪዎች በስብሰባው እንዲሳተፉ በአክብሮት ተጋብዘዋል።",
            en: "All residents are invited to participate in a community meeting on December 25, 2024. The meeting will be held at 9:00 AM at the district office. The main topics to be discussed at the meeting will be the peace and security situation of the district, community participation and plans for the coming year. All residents are respectfully invited to participate in the meeting."
        },
        date: {
            am: "ታህሳስ 15, 2017",
            en: "December 15, 2024"
        },
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
        title: {
            am: "የሰላም ግንባታ አስፈላጊነት",
            en: "The Importance of Peace Building"
        },
        category: {
            am: "ብሎግ",
            en: "Blog"
        },
        image: "images/hero-bg.png",
        excerpt: {
            am: "ሰላም ማለት ከግጭት መላቀቅ ብቻ ሳይሆን፣ ዘላቂ የሆነ የማህበረሰብ መረጋጋት ማለት ነው...",
            en: "Peace means not only freedom from conflict, but also sustainable community stability..."
        },
        content: {
            am: "ሰላም ማለት ከግጭት መላቀቅ ብቻ ሳይሆን፣ ዘላቂ የሆነ የማህበረሰብ መረጋጋት ማለት ነው። የሰላም ግንባታ ሂደት የሁሉንም የማህበረሰብ ክፍሎች ተሳትፎ ይጠይቃል። ይህም ከመንግስት ተቋማት ጀምሮ እስከ ግለሰብ ዜጎች ድረስ የሁሉንም ሚና ያካትታል። በእኛ ወረዳ የሰላም ግንባታ ስራ በተለያዩ መንገዶች ይካሄዳል። ከነዚህም መካከል የማህበረሰብ ውይይቶች፣ የግጭት መፍቻ ስልጠናዎች እና የሰላም ኮሚቴዎች ዋና ዋናዎቹ ናቸው።",
            en: "Peace means not only freedom from conflict, but also sustainable community stability. The peace building process requires the participation of all segments of society. This includes the role of everyone from government institutions to individual citizens. Peace building work in our district is carried out in various ways. Among these, community dialogues, conflict resolution trainings and peace committees are the main ones."
        },
        date: {
            am: "ታህሳስ 10, 2017",
            en: "December 10, 2024"
        },
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
function loadNewsData() {
    const savedNews = localStorage.getItem('newsData');
    if (savedNews) {
        newsData = JSON.parse(savedNews);
    }
    renderNewsCards();
}

// Render news cards with current language
function renderNewsCards() {
    const container = document.getElementById('newsContainer');
    if (!container) return;
    
    const currentLang = languageManager ? languageManager.currentLang : 'am';
    
    container.innerHTML = '';
    
    newsData.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <div class="news-image">
                <img src="${news.image}" alt="News Image">
            </div>
            <div class="news-content">
                <div class="news-meta">
                    <span class="news-date"><i class="far fa-calendar"></i> ${news.date[currentLang]}</span>
                    <span class="news-category">${news.category[currentLang]}</span>
                </div>
                <h3>${news.title[currentLang]}</h3>
                <p>${news.excerpt[currentLang]}</p>
                <a href="#" class="read-more" onclick="openNewsModal(${news.id})" data-translate="readMore">ሙሉ ዜናውን ያንብቡ</a>
                <div class="news-actions">
                    <button class="like-btn ${isNewsLiked(news.id) ? 'liked' : ''}" onclick="likeNews(${news.id})">
                        <i class="${isNewsLiked(news.id) ? 'fas' : 'far'} fa-heart"></i> <span class="like-count">${news.likes}</span>
                    </button>
                    <button class="comment-btn" onclick="showComments(${news.id})">
                        <i class="far fa-comment"></i> <span class="comment-count">${news.comments.length}</span>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(newsCard);
    });
    
    // Apply translations to newly created elements
    if (languageManager) {
        languageManager.applyTranslations();
    }
}

// Check if news is liked by user
function isNewsLiked(newsId) {
    const likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
    return likedNews.includes(newsId);
}

// Initialize news data
document.addEventListener('DOMContentLoaded', function() {
    loadNewsData();
    
    // Re-render news when language changes
    const originalToggle = window.toggleLanguage;
    window.toggleLanguage = function() {
        originalToggle();
        setTimeout(renderNewsCards, 100); // Small delay to ensure language is updated
    };
});

// Open news modal with current language
function openNewsModal(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    currentNewsId = newsId;
    const currentLang = languageManager ? languageManager.currentLang : 'am';
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <h2>${news.title[currentLang]}</h2>
        <div class="news-meta">
            <span class="news-date"><i class="far fa-calendar"></i> ${news.date[currentLang]}</span>
            <span class="news-category">${news.category[currentLang]}</span>
        </div>
        <img src="${news.image}" alt="${news.title[currentLang]}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin: 20px 0;">
        <div class="news-full-content">
            ${news.content[currentLang].split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
        </div>
    `;
    
    loadComments(newsId);
    document.getElementById('newsModal').style.display = 'block';
}

// Close news modal
function closeNewsModal() {
    document.getElementById('newsModal').style.display = 'none';
    currentNewsId = null;
}

// Like news
function likeNews(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    const likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
    const likeBtn = document.querySelector(`[onclick="likeNews(${newsId})"]`);
    const likeCount = likeBtn.querySelector('.like-count');
    const heartIcon = likeBtn.querySelector('i');
    
    if (likedNews.includes(newsId)) {
        // Unlike
        news.likes--;
        likeBtn.classList.remove('liked');
        heartIcon.className = 'far fa-heart';
        const index = likedNews.indexOf(newsId);
        likedNews.splice(index, 1);
    } else {
        // Like
        news.likes++;
        likeBtn.classList.add('liked');
        heartIcon.className = 'fas fa-heart';
        likedNews.push(newsId);
    }
    
    likeCount.textContent = news.likes;
    localStorage.setItem('likedNews', JSON.stringify(likedNews));
    saveNewsData();
}

// Show comments
function showComments(newsId) {
    openNewsModal(newsId);
}

// Load comments for a news item
function loadComments(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    const commentsContainer = document.getElementById('commentsContainer');
    commentsContainer.innerHTML = '';
    
    if (news.comments.length === 0) {
        const currentLang = languageManager ? languageManager.currentLang : 'am';
        const noCommentsText = currentLang === 'am' ? 'ምንም አስተያየት የለም። የመጀመሪያው ይሁኑ!' : 'No comments yet. Be the first!';
        commentsContainer.innerHTML = `<p>${noCommentsText}</p>`;
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

// Add comment
function addComment() {
    if (!currentNewsId) return;
    
    const commentText = document.getElementById('commentText').value.trim();
    if (!commentText) {
        const currentLang = languageManager ? languageManager.currentLang : 'am';
        const alertText = currentLang === 'am' ? 'እባክዎ አስተያየትዎን ይጻፉ።' : 'Please write your comment.';
        alert(alertText);
        return;
    }
    
    const currentLang = languageManager ? languageManager.currentLang : 'am';
    const namePrompt = currentLang === 'am' ? 'እባክዎ ስምዎን ያስገቡ:' : 'Please enter your name:';
    const authorName = prompt(namePrompt);
    if (!authorName) return;
    
    const news = newsData.find(n => n.id === currentNewsId);
    if (!news) return;
    
    const newComment = {
        id: Date.now(),
        author: authorName,
        text: commentText,
        date: new Date().toLocaleDateString(currentLang === 'am' ? 'am-ET' : 'en-US')
    };
    
    news.comments.push(newComment);
    saveNewsData();
    
    // Update comment count in the news card
    const commentBtn = document.querySelector(`[onclick="showComments(${currentNewsId})"] .comment-count`);
    if (commentBtn) {
        commentBtn.textContent = news.comments.length;
    }
    
    // Reload comments
    loadComments(currentNewsId);
    
    // Clear the comment form
    document.getElementById('commentText').value = '';
    
    const successText = currentLang === 'am' ? 'አስተያየትዎ ተጨምሯል!' : 'Your comment has been added!';
    alert(successText);
}

// Save news data to localStorage
function saveNewsData() {
    localStorage.setItem('newsData', JSON.stringify(newsData));
}

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const currentLang = languageManager ? languageManager.currentLang : 'am';
        const alertText = currentLang === 'am' ? 'አስተያየትዎ ተልኳል። በቅርቡ ምላሽ እንሰጣለን።' : 'Your message has been sent. We will respond soon.';
        alert(alertText);
        this.reset();
    });
}

// Add active class to navigation links based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('newsModal');
    if (event.target === modal) {
        closeNewsModal();
    }
});