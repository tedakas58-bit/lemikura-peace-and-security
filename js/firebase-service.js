// Firebase Service - Database Operations
// This file handles all Firebase database operations

// Initialize Firebase App
let db;
let auth;

function initializeFirebase() {
    // Initialize Firebase with config
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    // Get Firestore and Auth instances
    db = firebase.firestore();
    auth = firebase.auth();
    
    console.log('Firebase initialized successfully');
}

// ==================== COMMENTS OPERATIONS ====================

// Add a new public comment
async function addPublicComment(commentData) {
    try {
        const docRef = await db.collection('comments').add({
            author: commentData.author,
            email: commentData.email || '',
            subject: commentData.subject,
            text: commentData.text,
            status: 'pending',
            type: 'public_comment',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            timestamp: new Date().toISOString()
        });
        
        console.log('Comment added with ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error adding comment:', error);
        return { success: false, error: error.message };
    }
}

// Get all comments (for admin)
async function getAllComments() {
    try {
        const snapshot = await db.collection('comments')
            .orderBy('createdAt', 'desc')
            .get();
        
        const comments = [];
        snapshot.forEach(doc => {
            comments.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return comments;
    } catch (error) {
        console.error('Error getting comments:', error);
        return [];
    }
}

// Listen to comments in real-time
function listenToComments(callback) {
    return db.collection('comments')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const comments = [];
            snapshot.forEach(doc => {
                comments.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(comments);
        }, error => {
            console.error('Error listening to comments:', error);
        });
}

// Update comment status (approve/reject)
async function updateCommentStatus(commentId, status) {
    try {
        await db.collection('comments').doc(commentId).update({
            status: status,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('Comment status updated:', commentId, status);
        return { success: true };
    } catch (error) {
        console.error('Error updating comment:', error);
        return { success: false, error: error.message };
    }
}

// Delete a comment
async function deleteComment(commentId) {
    try {
        await db.collection('comments').doc(commentId).delete();
        console.log('Comment deleted:', commentId);
        return { success: true };
    } catch (error) {
        console.error('Error deleting comment:', error);
        return { success: false, error: error.message };
    }
}

// ==================== NEWS OPERATIONS ====================

// Add a new news article
async function addNewsArticle(newsData) {
    try {
        const docRef = await db.collection('news').add({
            title: newsData.title,
            category: newsData.category,
            image: newsData.image || 'images/hero-bg.jpg',
            excerpt: newsData.excerpt,
            content: newsData.content,
            likes: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            timestamp: new Date().toISOString()
        });
        
        console.log('News article added with ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error adding news:', error);
        return { success: false, error: error.message };
    }
}

// Get all news articles
async function getAllNews() {
    try {
        const snapshot = await db.collection('news')
            .orderBy('createdAt', 'desc')
            .get();
        
        const news = [];
        snapshot.forEach(doc => {
            news.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return news;
    } catch (error) {
        console.error('Error getting news:', error);
        return [];
    }
}

// Listen to news in real-time
function listenToNews(callback) {
    return db.collection('news')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const news = [];
            snapshot.forEach(doc => {
                news.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(news);
        }, error => {
            console.error('Error listening to news:', error);
        });
}

// Update a news article
async function updateNewsArticle(newsId, newsData) {
    try {
        await db.collection('news').doc(newsId).update({
            ...newsData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('News article updated:', newsId);
        return { success: true };
    } catch (error) {
        console.error('Error updating news:', error);
        return { success: false, error: error.message };
    }
}

// Delete a news article
async function deleteNewsArticle(newsId) {
    try {
        await db.collection('news').doc(newsId).delete();
        console.log('News article deleted:', newsId);
        return { success: true };
    } catch (error) {
        console.error('Error deleting news:', error);
        return { success: false, error: error.message };
    }
}

// ==================== AUTHENTICATION ====================

// Admin login
async function adminLogin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('Admin logged in:', userCredential.user.email);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

// Admin logout
async function adminLogout() {
    try {
        await auth.signOut();
        console.log('Admin logged out');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
}

// Check if user is logged in
function onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
}

// Export functions for use in other files
window.firebaseService = {
    initializeFirebase,
    // Comments
    addPublicComment,
    getAllComments,
    listenToComments,
    updateCommentStatus,
    deleteComment,
    // News
    addNewsArticle,
    getAllNews,
    listenToNews,
    updateNewsArticle,
    deleteNewsArticle,
    // Auth
    adminLogin,
    adminLogout,
    onAuthStateChanged
};
