// ==================== ADMIN NEWS MANAGEMENT ====================
// Complete admin interface for news management
// Version: 2.0 - Clean Rewrite

console.log('🔧 Admin News Management v2.0 Loading...');

// ==================== ADMIN VARIABLES ====================
let adminNews = {
    currentEdit: null,
    uploadedImage: null,
    isSubmitting: false
};

// ==================== FORM HANDLING ====================

// Initialize admin news management
function initializeAdminNews() {
    console.log('🚀 Initializing admin news management...');
    
    // Setup form submission
    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', handleNewsSubmit);
    }
    
    // Setup image upload
    const imageUpload = document.getElementById('newsImageUpload');
    const imageUrl = document.getElementById('newsImageUrl');
    
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
    
    // Setup tab switching
    setupImageTabs();
    
    console.log('✅ Admin news management initialized');
}

// Handle form submission
async function handleNewsSubmit(event) {
    event.preventDefault();
    
    if (adminNews.isSubmitting) {
        console.log('⏳ Already submitting...');
        return;
    }
    
    adminNews.isSubmitting = true;
    const submitBtn = document.getElementById('submitNewsBtn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> እየተቀመጠ...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(event.target);
        const newsData = {
            title: formData.get('title')?.trim(),
            category: formData.get('category')?.trim(),
            excerpt: formData.get('excerpt')?.trim(),
            content: formData.get('content')?.trim(),
            image: getSelectedImage(),
            date: new Date().toLocaleDateString('am-ET')
        };
        
        // Validate required fields
        if (!newsData.title || !newsData.category || !newsData.excerpt || !newsData.content) {
            throw new Error('እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ');
        }
        
        let result;
        if (adminNews.currentEdit) {
            // Update existing news
            result = await updateNewsItem(adminNews.currentEdit, newsData);
        } else {
            // Add new news
            result = await addNewsItem(newsData);
        }
        
        if (result.success) {
            // Success feedback
            showNotification('success', adminNews.currentEdit ? 'ዜናው በተሳካ ሁኔታ ተዘምኗል!' : 'አዲስ ዜና በተሳካ ሁኔታ ተጨምሯል!');
            
            // Reset form
            resetNewsForm();
            
            // Refresh displays
            await refreshNewsDisplays();
        } else {
            throw new Error(result.error || 'Unknown error occurred');
        }
        
    } catch (error) {
        console.error('❌ Error submitting news:', error);
        showNotification('error', 'ስህተት: ' + error.message);
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        adminNews.isSubmitting = false;
    }
}

// Get selected image (upload or URL)
function getSelectedImage() {
    const activeTab = document.querySelector('.image-tab.active');
    if (!activeTab) return null;
    
    if (activeTab.dataset.tab === 'upload') {
        return adminNews.uploadedImage;
    } else {
        const imageUrl = document.getElementById('newsImageUrl').value.trim();
        return imageUrl || null;
    }
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        adminNews.uploadedImage = null;
        updateImagePreview(null);
        return;
    }
    
    // Validate file
    if (!file.type.startsWith('image/')) {
        showNotification('error', 'እባክዎ ምስል ፋይል ይምረጡ');
        event.target.value = '';
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('error', 'ምስሉ ከ5MB በታች መሆን አለበት');
        event.target.value = '';
        return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        adminNews.uploadedImage = e.target.result;
        updateImagePreview(e.target.result);
        console.log('✅ Image uploaded and converted to base64');
    };
    reader.onerror = function() {
        showNotification('error', 'ምስሉን ማንበብ አልተቻለም');
        event.target.value = '';
    };
    reader.readAsDataURL(file);
}

// Update image preview
function updateImagePreview(imageSrc) {
    const preview = document.getElementById('imagePreview');
    if (!preview) return;
    
    if (imageSrc) {
        preview.innerHTML = `
            <img src="${imageSrc}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
            <p style="margin-top: 8px; font-size: 12px; color: #666;">ምስል ተመርጧል</p>
        `;
    } else {
        preview.innerHTML = `
            <div style="padding: 40px; text-align: center; border: 2px dashed #ddd; border-radius: 8px;">
                <i class="fas fa-image" style="font-size: 32px; color: #ccc; margin-bottom: 8px;"></i>
                <p style="color: #666;">ምስል ይምረጡ</p>
            </div>
        `;
    }
}

// Setup image tabs
function setupImageTabs() {
    const tabs = document.querySelectorAll('.image-tab');
    const contents = document.querySelectorAll('.image-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const targetContent = document.getElementById(tab.dataset.tab + 'Tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Clear previews when switching tabs
            if (tab.dataset.tab === 'upload') {
                updateImagePreview(adminNews.uploadedImage);
            } else {
                updateImagePreview(null);
            }
        });
    });
}

// ==================== EDIT FUNCTIONALITY ====================

// Edit news item
async function editNewsItem(newsId) {
    console.log('✏️ Editing news item:', newsId);
    
    const news = newsSystem.data.find(n => n.id === newsId);
    if (!news) {
        showNotification('error', 'ዜናው አልተገኘም');
        return;
    }
    
    // Set current edit
    adminNews.currentEdit = newsId;
    
    // Fill form with news data
    document.getElementById('newsTitle').value = news.title;
    document.getElementById('newsCategory').value = news.category;
    document.getElementById('newsExcerpt').value = news.excerpt;
    document.getElementById('newsContent').value = news.content;
    
    // Handle image
    if (news.image && news.image.startsWith('data:')) {
        // Base64 image - set to upload tab
        adminNews.uploadedImage = news.image;
        document.querySelector('[data-tab="upload"]').click();
        updateImagePreview(news.image);
    } else if (news.image && news.image !== 'images/hero-bg.jpg') {
        // URL image - set to URL tab
        document.querySelector('[data-tab="url"]').click();
        document.getElementById('newsImageUrl').value = news.image;
    }
    
    // Update form UI
    const submitBtn = document.getElementById('submitNewsBtn');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> ዜናውን ያዘምኑ';
    
    const formTitle = document.querySelector('.news-form-title');
    if (formTitle) {
        formTitle.textContent = 'ዜና አርም';
    }
    
    // Show cancel button
    showCancelButton();
    
    // Scroll to form
    document.getElementById('newsForm').scrollIntoView({ behavior: 'smooth' });
    
    showNotification('info', 'ዜናው ለማርም ተዘጋጅቷል');
}

// Cancel edit
function cancelEdit() {
    adminNews.currentEdit = null;
    resetNewsForm();
    hideCancelButton();
    showNotification('info', 'ማርም ተሰርዟል');
}

// Show cancel button
function showCancelButton() {
    let cancelBtn = document.getElementById('cancelEditBtn');
    if (!cancelBtn) {
        cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancelEditBtn';
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.innerHTML = '<i class="fas fa-times"></i> ሰርዝ';
        cancelBtn.onclick = cancelEdit;
        
        const submitBtn = document.getElementById('submitNewsBtn');
        submitBtn.parentNode.insertBefore(cancelBtn, submitBtn);
    }
    cancelBtn.style.display = 'inline-block';
}

// Hide cancel button
function hideCancelButton() {
    const cancelBtn = document.getElementById('cancelEditBtn');
    if (cancelBtn) {
        cancelBtn.style.display = 'none';
    }
}

// Reset form
function resetNewsForm() {
    const form = document.getElementById('newsForm');
    if (form) {
        form.reset();
    }
    
    adminNews.currentEdit = null;
    adminNews.uploadedImage = null;
    
    // Reset UI
    const submitBtn = document.getElementById('submitNewsBtn');
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> ዜና ጨምር';
    
    const formTitle = document.querySelector('.news-form-title');
    if (formTitle) {
        formTitle.textContent = 'አዲስ ዜና ጨምር';
    }
    
    // Reset image preview
    updateImagePreview(null);
    
    // Reset to upload tab
    document.querySelector('[data-tab="upload"]').click();
    
    hideCancelButton();
}

// ==================== DELETE FUNCTIONALITY ====================

// Delete news item with confirmation
async function confirmDeleteNews(newsId) {
    const news = newsSystem.data.find(n => n.id === newsId);
    if (!news) {
        showNotification('error', 'ዜናው አልተገኘም');
        return;
    }
    
    const confirmed = confirm(`"${news.title}" የሚለውን ዜና መሰረዝ ይፈልጋሉ?\n\nይህ ተግባር መልሰው ማድረግ አይችሉም።`);
    
    if (confirmed) {
        try {
            const result = await deleteNewsItem(newsId);
            
            if (result.success) {
                showNotification('success', 'ዜናው በተሳካ ሁኔታ ተሰርዟል');
                await refreshNewsDisplays();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('❌ Error deleting news:', error);
            showNotification('error', 'ዜናውን መሰረዝ አልተቻለም: ' + error.message);
        }
    }
}

// ==================== UTILITY FUNCTIONS ====================

// Refresh all news displays
async function refreshNewsDisplays() {
    console.log('🔄 Refreshing news displays...');
    
    try {
        // Reload data from Supabase
        await loadAllNews();
        
        // Update admin display
        renderAdminNews();
        
        // Update main page display if on same domain
        if (typeof renderMainPageNews === 'function') {
            renderMainPageNews();
        }
        
        console.log('✅ News displays refreshed');
    } catch (error) {
        console.error('❌ Error refreshing displays:', error);
    }
}

// Show notification
function showNotification(type, message) {
    // Remove existing notifications
    const existing = document.querySelectorAll('.admin-notification');
    existing.forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ==================== INITIALIZATION ====================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        initializeAdminNews();
    }, 500);
});

// ==================== GLOBAL FUNCTIONS ====================

// Make functions globally available
window.adminNews = adminNews;
window.initializeAdminNews = initializeAdminNews;
window.editNewsItem = editNewsItem;
window.confirmDeleteNews = confirmDeleteNews;
window.cancelEdit = cancelEdit;
window.refreshNewsDisplays = refreshNewsDisplays;

// Override the global deleteNewsItem to use confirmation
window.deleteNewsItem = confirmDeleteNews;

console.log('✅ Admin News Management v2.0 Loaded Successfully');