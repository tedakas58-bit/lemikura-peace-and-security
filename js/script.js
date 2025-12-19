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
function loadNewsData() {
    const savedNews = localStorage.getItem('newsData');
    if (savedNews) {
        newsData = JSON.parse(savedNews);
    }
}

// Initialize news data
document.addEventListener('DOMContentLoaded', function() {
    loadNewsData();
});

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
        </div>
        <img src="${news.image}" alt="${news.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin: 20px 0;">
        <div class="news-full-content">
            ${news.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
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
    
    const likeBtn = document.querySelector(`[onclick="likeNews(${newsId})"]`);
    const likeCount = likeBtn.querySelector('.like-count');
    const heartIcon = likeBtn.querySelector('i');
    
    if (likeBtn.classList.contains('liked')) {
        // Unlike
        news.likes--;
        likeBtn.classList.remove('liked');
        heartIcon.className = 'far fa-heart';
    } else {
        // Like
        news.likes++;
        likeBtn.classList.add('liked');
        heartIcon.className = 'fas fa-heart';
    }
    
    likeCount.textContent = news.likes;
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

// Add comment
function addComment() {
    if (!currentNewsId) return;
    
    const commentText = document.getElementById('commentText').value.trim();
    if (!commentText) {
        alert('እባክዎ አስተያየትዎን ይጻፉ።');
        return;
    }
    
    // Simple author name prompt (in a real app, this would be from user authentication)
    const authorName = prompt('እባክዎ ስምዎን ያስገቡ:');
    if (!authorName) return;
    
    const news = newsData.find(n => n.id === currentNewsId);
    if (!news) return;
    
    const newComment = {
        id: Date.now(),
        author: authorName,
        text: commentText,
        date: new Date().toLocaleDateString('am-ET')
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
    
    alert('አስተያየትዎ ተጨምሯል!');
}

// Save news data to localStorage
function saveNewsData() {
    localStorage.setItem('newsData', JSON.stringify(newsData));
}

// Contact form submission (keeping the original functionality)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('አስተያየትዎ ተልኳል። በቅርቡ ምላሽ እንሰጣለን።');
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

// Make toggleLanguage available globally
window.toggleLanguage = toggleLanguage;
// Public Comment Submission System
let publicComments = [];

// Initialize comment system
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing comment system...');
    
    // Load existing comments
    loadPublicComments();
    
    // Setup comment form
    const commentForm = document.getElementById('publicCommentForm');
    if (commentForm) {
        console.log('Comment form found:', commentForm);
        commentForm.addEventListener('submit', handlePublicCommentSubmission);
        console.log('Public comment form event listener added');
        
        // Also add a direct button click listener as backup
        const submitButton = commentForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                console.log('Submit button clicked');
            });
        }
    } else {
        console.error('Public comment form not found! Looking for element with id: publicCommentForm');
        // List all forms on the page for debugging
        const allForms = document.querySelectorAll('form');
        console.log('All forms found on page:', allForms);
    }
});

function loadPublicComments() {
    const savedComments = localStorage.getItem('publicComments');
    if (savedComments) {
        publicComments = JSON.parse(savedComments);
        console.log('Loaded public comments:', publicComments.length);
    }
}

function handlePublicCommentSubmission(e) {
    e.preventDefault();
    console.log('Public comment form submitted');
    
    const formData = new FormData(e.target);
    const comment = {
        id: Date.now(),
        author: formData.get('author'),
        email: formData.get('email') || '',
        subject: formData.get('subject'),
        text: formData.get('text'),
        date: new Date().toLocaleDateString('am-ET'),
        timestamp: new Date().toISOString(),
        status: 'pending', // pending, approved, rejected
        type: 'public_comment'
    };
    
    console.log('New comment created:', comment);
    
    // Add to public comments array
    publicComments.unshift(comment);
    
    // Save to localStorage
    localStorage.setItem('publicComments', JSON.stringify(publicComments));
    console.log('Comment saved to localStorage');
    
    // Show success message
    showCommentSuccessMessage();
    
    // Reset form
    e.target.reset();
    
    // Notify admin (if admin functions are available)
    if (window.adminFunctions) {
        try {
            // Trigger admin notification
            notifyAdminOfNewComment(comment);
        } catch (error) {
            console.log('Admin notification not available');
        }
    }
    
    // Dispatch custom event for admin dashboard
    const event = new CustomEvent('newPublicComment', { detail: comment });
    document.dispatchEvent(event);
    console.log('Custom event dispatched');
}

function showCommentSuccessMessage() {
    // Create success message if it doesn't exist
    let successMessage = document.querySelector('.comment-success');
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'comment-success';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>አመሰግናለን!</h3>
            <p>አስተያየትዎ በተሳካ ሁኔታ ተልኳል። በቅርቡ ምላሽ እንሰጣለን።</p>
        `;
        
        const formContainer = document.querySelector('.comment-form-container');
        if (formContainer) {
            formContainer.insertBefore(successMessage, formContainer.firstChild);
        }
    }
    
    successMessage.classList.add('show');
    
    // Hide after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
}

function notifyAdminOfNewComment(comment) {
    // This function will be called when a new comment is submitted
    // It can be used to update admin dashboard in real-time
    console.log('New comment submitted:', comment);
    
    // Dispatch custom event for admin dashboard
    const event = new CustomEvent('newPublicComment', { detail: comment });
    document.dispatchEvent(event);
}

// Export functions for admin access
window.publicCommentFunctions = {
    publicComments,
    loadPublicComments,
    getPublicComments: () => publicComments
};
// Debug function to test comment submission
window.testCommentSubmission = function() {
    console.log('Testing comment submission...');
    
    const form = document.getElementById('publicCommentForm');
    if (!form) {
        console.error('Comment form not found!');
        return;
    }
    
    console.log('Form found:', form);
    
    // Fill form with test data
    const authorInput = document.getElementById('commentAuthor');
    const subjectSelect = document.getElementById('commentSubject');
    const textArea = document.getElementById('commentText');
    
    if (authorInput) authorInput.value = 'Test User';
    if (subjectSelect) subjectSelect.value = 'አጠቃላይ አስተያየት';
    if (textArea) textArea.value = 'This is a test comment';
    
    console.log('Form filled with test data');
    
    // Manually trigger submission
    const event = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(event);
    
    console.log('Form submission triggered');
};

// Debug function to check localStorage
window.checkComments = function() {
    const comments = localStorage.getItem('publicComments');
    console.log('Public comments in localStorage:', comments);
    if (comments) {
        console.log('Parsed comments:', JSON.parse(comments));
    }
};
// Simple test function to manually add a comment
window.addTestComment = function() {
    console.log('Adding test comment...');
    
    const testComment = {
        id: Date.now(),
        author: 'Test User',
        email: 'test@example.com',
        subject: 'አጠቃላይ አስተያየት',
        text: 'This is a test comment to verify the system is working.',
        date: new Date().toLocaleDateString('am-ET'),
        timestamp: new Date().toISOString(),
        status: 'pending',
        type: 'public_comment'
    };
    
    // Add to array
    if (!publicComments) {
        publicComments = [];
    }
    publicComments.unshift(testComment);
    
    // Save to localStorage
    localStorage.setItem('publicComments', JSON.stringify(publicComments));
    
    console.log('Test comment added:', testComment);
    console.log('Total comments now:', publicComments.length);
    
    // Dispatch event for admin
    const event = new CustomEvent('newPublicComment', { detail: testComment });
    document.dispatchEvent(event);
    
    alert('Test comment added! Check admin panel.');
};

// Function to check current comments
window.checkStoredComments = function() {
    const stored = localStorage.getItem('publicComments');
    console.log('Stored comments:', stored);
    if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Parsed comments:', parsed);
        console.log('Number of comments:', parsed.length);
    } else {
        console.log('No comments found in localStorage');
    }
};

// Function to clear all comments (for testing)
window.clearAllComments = function() {
    localStorage.removeItem('publicComments');
    publicComments = [];
    console.log('All comments cleared');
};