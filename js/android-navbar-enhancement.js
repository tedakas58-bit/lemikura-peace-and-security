// Android Navbar Enhancement Script
// Improves mobile navigation accessibility and usability on Android devices

document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Initializing Android navbar enhancements...');
    
    // Enhanced mobile menu functionality for Android
    const mobileToggle = document.getElementById('mobileMenuToggle') || document.querySelector('.mobile-menu-toggle');
    const mainMenu = document.getElementById('mainMenu') || document.querySelector('nav ul');
    
    if (!mobileToggle || !mainMenu) {
        console.log('⚠️ Mobile menu elements not found, creating fallback...');
        createFallbackMobileMenu();
        return;
    }
    
    // Android-specific enhancements
    enhanceAndroidNavigation(mobileToggle, mainMenu);
    
    // Add Android-specific touch gestures
    addAndroidTouchGestures(mainMenu);
    
    // Improve accessibility for Android screen readers
    improveAndroidAccessibility(mobileToggle, mainMenu);
    
    // Add Android-specific visual feedback
    addAndroidVisualFeedback();
    
    console.log('✅ Android navbar enhancements initialized');
});

// Create fallback mobile menu if elements don't exist
function createFallbackMobileMenu() {
    console.log('🔧 Creating fallback mobile menu...');
    
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    if (!header || !nav) {
        console.log('❌ Header or nav not found, cannot create fallback');
        return;
    }
    
    // Create mobile toggle button if it doesn't exist
    let mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (!mobileToggle) {
        mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.id = 'mobileMenuToggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
        mobileToggle.setAttribute('aria-expanded', 'false');
        
        // Insert before nav or at end of header
        const headerContainer = header.querySelector('.header-container') || header;
        headerContainer.appendChild(mobileToggle);
    }
    
    // Ensure nav ul has proper ID
    const navUl = nav.querySelector('ul');
    if (navUl && !navUl.id) {
        navUl.id = 'mainMenu';
    }
    
    // Re-initialize with created elements
    enhanceAndroidNavigation(mobileToggle, navUl);
}

// Enhanced Android navigation functionality
function enhanceAndroidNavigation(mobileToggle, mainMenu) {
    let isMenuOpen = false;
    let touchStartY = 0;
    let touchStartTime = 0;
    
    // Enhanced toggle function with Android optimizations
    function toggleMobileMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        isMenuOpen = !isMenuOpen;
        
        // Update ARIA attributes for accessibility
        mobileToggle.setAttribute('aria-expanded', isMenuOpen.toString());
        mainMenu.setAttribute('aria-hidden', (!isMenuOpen).toString());
        
        if (isMenuOpen) {
            // Open menu with Android optimizations
            mainMenu.classList.add('active');
            mobileToggle.classList.add('active');
            document.body.classList.add('menu-open');
            
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${window.scrollY}px`;
            
            // Change icon with animation
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                    icon.style.transform = 'rotate(0deg)';
                }, 150);
            }
            
            // Focus management for accessibility
            setTimeout(() => {
                const firstLink = mainMenu.querySelector('a');
                if (firstLink) firstLink.focus();
            }, 300);
            
            // Android haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
        } else {
            // Close menu with Android optimizations
            const scrollY = document.body.style.top;
            
            mainMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Restore scrolling
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
            
            // Change icon back with animation
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    icon.style.transform = 'rotate(0deg)';
                }, 150);
            }
            
            // Return focus to toggle button
            mobileToggle.focus();
        }
    }
    
    // Multiple event listeners for better Android compatibility
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    // Enhanced touch events for Android
    mobileToggle.addEventListener('touchstart', function(e) {
        touchStartTime = Date.now();
        touchStartY = e.touches[0].clientY;
        
        // Visual feedback
        this.style.transform = 'scale(0.95) translateZ(0)';
        this.style.transition = 'transform 0.1s ease';
        
        // Prevent default to avoid double-tap zoom
        e.preventDefault();
    }, { passive: false });
    
    mobileToggle.addEventListener('touchmove', function(e) {
        // Prevent scrolling during touch
        e.preventDefault();
    }, { passive: false });
    
    mobileToggle.addEventListener('touchend', function(e) {
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        const touchEndY = e.changedTouches[0].clientY;
        const touchDistance = Math.abs(touchEndY - touchStartY);
        
        // Remove visual feedback
        this.style.transform = 'scale(1) translateZ(0)';
        
        // Only trigger if it's a tap (not a swipe)
        if (touchDuration < 300 && touchDistance < 10) {
            setTimeout(() => toggleMobileMenu(e), 50);
        }
        
        e.preventDefault();
    }, { passive: false });
    
    // Close menu when clicking/touching outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !mainMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Android-specific touch outside handler
    document.addEventListener('touchstart', function(e) {
        if (isMenuOpen && !mainMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    }, { passive: true });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMobileMenu();
        }
    });
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        if (isMenuOpen) {
            setTimeout(() => {
                toggleMobileMenu();
            }, 100);
        }
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 992 && isMenuOpen) {
                toggleMobileMenu();
            }
        }, 100);
    });
    
    // Close menu when clicking on menu links
    const menuLinks = mainMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isMenuOpen) {
                setTimeout(() => toggleMobileMenu(), 100);
            }
        });
        
        // Android touch handler for links
        link.addEventListener('touchend', function() {
            if (isMenuOpen) {
                setTimeout(() => toggleMobileMenu(), 100);
            }
        }, { passive: true });
    });
}

// Add Android-specific touch gestures
function addAndroidTouchGestures(mainMenu) {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    mainMenu.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        isDragging = false;
    }, { passive: true });
    
    mainMenu.addEventListener('touchmove', function(e) {
        if (!startY) return;
        
        currentY = e.touches[0].clientY;
        const diffY = startY - currentY;
        
        // If swiping up significantly, close menu
        if (diffY > 100 && !isDragging) {
            isDragging = true;
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileToggle && mainMenu.classList.contains('active')) {
                mobileToggle.click();
            }
        }
    }, { passive: true });
    
    mainMenu.addEventListener('touchend', function() {
        startY = 0;
        currentY = 0;
        isDragging = false;
    }, { passive: true });
}

// Improve accessibility for Android screen readers
function improveAndroidAccessibility(mobileToggle, mainMenu) {
    // Add proper ARIA attributes
    mobileToggle.setAttribute('role', 'button');
    mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-controls', mainMenu.id || 'mainMenu');
    
    mainMenu.setAttribute('role', 'navigation');
    mainMenu.setAttribute('aria-label', 'Main navigation');
    mainMenu.setAttribute('aria-hidden', 'true');
    
    // Add keyboard navigation support
    const menuLinks = mainMenu.querySelectorAll('a');
    menuLinks.forEach((link, index) => {
        link.setAttribute('tabindex', mainMenu.classList.contains('active') ? '0' : '-1');
        
        // Add keyboard navigation
        link.addEventListener('keydown', function(e) {
            if (!mainMenu.classList.contains('active')) return;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextLink = menuLinks[index + 1];
                    if (nextLink) nextLink.focus();
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    const prevLink = menuLinks[index - 1];
                    if (prevLink) prevLink.focus();
                    else mobileToggle.focus();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    menuLinks[0].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    menuLinks[menuLinks.length - 1].focus();
                    break;
            }
        });
    });
    
    // Update tabindex when menu opens/closes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const isActive = mainMenu.classList.contains('active');
                menuLinks.forEach(link => {
                    link.setAttribute('tabindex', isActive ? '0' : '-1');
                });
                mobileToggle.setAttribute('aria-expanded', isActive.toString());
                mainMenu.setAttribute('aria-hidden', (!isActive).toString());
            }
        });
    });
    
    observer.observe(mainMenu, { attributes: true, attributeFilter: ['class'] });
}

// Add Android-specific visual feedback
function addAndroidVisualFeedback() {
    // Add CSS for Android-specific animations
    const style = document.createElement('style');
    style.textContent = `
        /* Android-specific mobile menu enhancements */
        @media (max-width: 992px) {
            .mobile-menu-toggle {
                position: relative;
                overflow: hidden;
                -webkit-tap-highlight-color: transparent;
                touch-action: manipulation;
                user-select: none;
                -webkit-user-select: none;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .mobile-menu-toggle::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: translate(-50%, -50%);
                transition: width 0.3s ease, height 0.3s ease;
                pointer-events: none;
            }
            
            .mobile-menu-toggle:active::after {
                width: 100px;
                height: 100px;
            }
            
            .mobile-menu-toggle i {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: block;
                transform-origin: center;
            }
            
            /* Enhanced menu animation for Android */
            nav ul {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                will-change: transform, opacity;
                -webkit-overflow-scrolling: touch;
                overscroll-behavior: contain;
            }
            
            nav ul.active {
                animation: androidSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            nav ul li a {
                position: relative;
                overflow: hidden;
                -webkit-tap-highlight-color: rgba(45, 125, 126, 0.1);
                touch-action: manipulation;
            }
            
            nav ul li a::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(45, 125, 126, 0.1), transparent);
                transition: left 0.5s ease;
            }
            
            nav ul li a:active::before {
                left: 100%;
            }
            
            /* Android ripple effect */
            @keyframes androidRipple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes androidSlideIn {
                from {
                    transform: translateX(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            /* Android-specific focus styles */
            .mobile-menu-toggle:focus {
                outline: 2px solid rgba(255, 255, 255, 0.5);
                outline-offset: 2px;
            }
            
            nav ul li a:focus {
                background: rgba(45, 125, 126, 0.1);
                outline: 2px solid var(--primary);
                outline-offset: -2px;
            }
            
            /* Android safe area support */
            @supports (padding: max(0px)) {
                nav ul {
                    padding-left: max(20px, env(safe-area-inset-left));
                    padding-right: max(20px, env(safe-area-inset-right));
                }
            }
        }
        
        /* Android landscape optimizations */
        @media (max-width: 768px) and (orientation: landscape) {
            nav ul {
                padding-top: 80px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0;
                align-content: start;
            }
            
            nav ul li {
                border-right: 1px solid rgba(45, 125, 126, 0.1);
            }
            
            nav ul li:nth-child(even) {
                border-right: none;
            }
            
            nav ul li a {
                padding: 16px 20px;
                font-size: 15px;
                min-height: 52px;
            }
        }
        
        /* High DPI Android displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .mobile-menu-toggle {
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            nav ul li a {
                border-bottom: 0.5px solid rgba(45, 125, 126, 0.1);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Add Android-specific performance optimizations
function optimizeForAndroid() {
    // Optimize scrolling performance
    const menuElements = document.querySelectorAll('nav ul, .mobile-menu-toggle');
    menuElements.forEach(element => {
        element.style.willChange = 'transform';
        element.style.transform = 'translateZ(0)';
        element.style.backfaceVisibility = 'hidden';
    });
    
    // Optimize touch events
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
    document.addEventListener('touchend', function() {}, { passive: true });
}

// Initialize Android optimizations
optimizeForAndroid();

// Debug function for testing
window.testAndroidNavbar = function() {
    console.log('🔧 Testing Android navbar...');
    
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainMenu = document.querySelector('nav ul');
    
    console.log('Toggle button:', mobileToggle);
    console.log('Main menu:', mainMenu);
    console.log('Menu classes:', mainMenu ? mainMenu.className : 'not found');
    
    if (mobileToggle) {
        console.log('✅ Triggering menu toggle...');
        mobileToggle.click();
        
        setTimeout(() => {
            console.log('Menu classes after toggle:', mainMenu ? mainMenu.className : 'not found');
        }, 500);
    } else {
        console.error('❌ Mobile toggle button not found');
    }
};

console.log('✅ Android navbar enhancement script loaded');