// Android Select-Based Navigation Enhancement
// Replaces scrolling navigation with a select dropdown for better mobile usability

document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Initializing Android select-based navigation...');
    
    // Check if we're on a mobile device (Android specifically)
    const isMobile = window.innerWidth <= 992;
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        initializeSelectNavigation();
    }
    
    // Re-initialize on window resize
    window.addEventListener('resize', function() {
        const nowMobile = window.innerWidth <= 992;
        if (nowMobile && !document.querySelector('.mobile-nav-select')) {
            initializeSelectNavigation();
        } else if (!nowMobile && document.querySelector('.mobile-nav-select')) {
            restoreOriginalNavigation();
        }
    });
});

function initializeSelectNavigation() {
    const nav = document.querySelector('nav');
    const originalMenu = document.querySelector('#mainMenu');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!nav || !originalMenu) {
        console.log('❌ Navigation elements not found');
        return;
    }
    
    // Hide original mobile toggle and menu
    if (mobileToggle) {
        mobileToggle.style.display = 'none';
    }
    originalMenu.style.display = 'none';
    
    // Create select-based navigation
    createSelectNavigation(nav, originalMenu);
    
    console.log('✅ Select-based navigation initialized');
}

function createSelectNavigation(nav, originalMenu) {
    // Create container for select navigation
    const selectContainer = document.createElement('div');
    selectContainer.className = 'mobile-nav-select-container';
    
    // Create the select element
    const select = document.createElement('select');
    select.className = 'mobile-nav-select';
    select.id = 'mobileNavSelect';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '📋 Choose Menu / Select Navigation';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    
    // Get all menu items from original navigation
    const menuItems = originalMenu.querySelectorAll('li a');
    
    menuItems.forEach((link, index) => {
        const option = document.createElement('option');
        
        // Get the href and text
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        
        // Skip if it's an external link or admin link for security
        if (href && !href.startsWith('http') && !href.includes('admin.html')) {
            option.value = href;
            option.textContent = text;
            
            // Add icons for better visual identification
            if (href.includes('#home') || href === '#home') {
                option.textContent = '🏠 ' + text;
            } else if (href.includes('#about') || href === '#about') {
                option.textContent = '📋 ' + text;
            } else if (href.includes('#services') || href === '#services') {
                option.textContent = '⚙️ ' + text;
            } else if (href.includes('#news') || href === '#news') {
                option.textContent = '📰 ' + text;
            } else if (href.includes('#comments') || href === '#comments') {
                option.textContent = '💬 ' + text;
            } else if (href.includes('#contact') || href === '#contact') {
                option.textContent = '📞 ' + text;
            } else if (href.includes('feedback.html')) {
                option.textContent = '⭐ ' + text;
            } else {
                option.textContent = '📄 ' + text;
            }
            
            select.appendChild(option);
        }
    });
    
    // Add admin option separately with security consideration
    const adminLink = originalMenu.querySelector('a[href="admin.html"]');
    if (adminLink) {
        const adminOption = document.createElement('option');
        adminOption.value = 'admin.html';
        adminOption.textContent = '🔐 ' + adminLink.textContent.trim();
        select.appendChild(adminOption);
    }
    
    // Add change event listener
    select.addEventListener('change', function() {
        const selectedValue = this.value;
        
        if (selectedValue) {
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
            
            // Android haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
            
            // Navigate to selected page/section
            if (selectedValue.startsWith('#')) {
                // Smooth scroll to section
                const targetSection = document.querySelector(selectedValue);
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL hash
                    history.pushState(null, null, selectedValue);
                }
            } else {
                // Navigate to page
                window.location.href = selectedValue;
            }
            
            // Reset select after a delay
            setTimeout(() => {
                this.selectedIndex = 0;
            }, 1000);
        }
    });
    
    // Add touch-friendly styling
    select.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
        this.style.transition = 'transform 0.1s ease';
    });
    
    select.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Create label for accessibility
    const label = document.createElement('label');
    label.setAttribute('for', 'mobileNavSelect');
    label.className = 'mobile-nav-label';
    label.innerHTML = '<i class="fas fa-bars"></i> <span>Menu</span>';
    
    // Assemble the container
    selectContainer.appendChild(label);
    selectContainer.appendChild(select);
    
    // Insert into navigation
    nav.appendChild(selectContainer);
    
    // Add custom styles
    addSelectNavigationStyles();
}

function addSelectNavigationStyles() {
    // Check if styles already added
    if (document.querySelector('#android-select-nav-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'android-select-nav-styles';
    style.textContent = `
        /* Android Select Navigation Styles */
        @media (max-width: 992px) {
            .mobile-nav-select-container {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 0;
                margin-left: auto;
            }
            
            .mobile-nav-label {
                display: flex;
                align-items: center;
                gap: 8px;
                color: var(--white);
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
            }
            
            .mobile-nav-label i {
                font-size: 18px;
            }
            
            .mobile-nav-select {
                background: rgba(255, 255, 255, 0.95);
                border: 2px solid rgba(45, 125, 126, 0.3);
                border-radius: 12px;
                padding: 12px 16px;
                font-size: 16px;
                font-weight: 500;
                color: var(--dark);
                min-width: 200px;
                max-width: 280px;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232d7d7e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
                background-repeat: no-repeat;
                background-position: right 12px center;
                background-size: 20px;
                padding-right: 45px;
                box-shadow: 0 4px 12px rgba(45, 125, 126, 0.15);
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            
            .mobile-nav-select:focus {
                outline: none;
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(45, 125, 126, 0.2);
                transform: translateY(-1px);
            }
            
            .mobile-nav-select:active {
                transform: scale(0.98);
            }
            
            .mobile-nav-select option {
                padding: 12px 16px;
                font-size: 16px;
                font-weight: 500;
                color: var(--dark);
                background: white;
                border: none;
            }
            
            .mobile-nav-select option:first-child {
                color: #666;
                font-style: italic;
            }
            
            .mobile-nav-select option:hover,
            .mobile-nav-select option:focus {
                background: rgba(45, 125, 126, 0.1);
                color: var(--primary);
            }
            
            /* Android-specific enhancements */
            .mobile-nav-select {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Ethiopic', sans-serif;
                line-height: 1.4;
                letter-spacing: 0.02em;
            }
            
            /* Better touch targets for Android */
            .mobile-nav-select {
                min-height: 48px;
                padding-top: 14px;
                padding-bottom: 14px;
            }
            
            /* Android Material Design ripple effect */
            .mobile-nav-select::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(45, 125, 126, 0.2);
                transform: translate(-50%, -50%);
                transition: width 0.3s ease, height 0.3s ease;
                pointer-events: none;
                z-index: -1;
            }
            
            .mobile-nav-select:active::before {
                width: 100%;
                height: 100%;
            }
            
            /* Responsive adjustments */
            @media (max-width: 480px) {
                .mobile-nav-select {
                    min-width: 180px;
                    max-width: 220px;
                    font-size: 15px;
                    padding: 10px 14px;
                    padding-right: 40px;
                }
                
                .mobile-nav-label span {
                    display: none;
                }
            }
            
            /* High DPI displays */
            @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                .mobile-nav-select {
                    border-width: 1px;
                }
            }
            
            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .mobile-nav-select {
                    background: rgba(255, 255, 255, 0.9);
                    border-color: rgba(255, 255, 255, 0.3);
                }
                
                .mobile-nav-select option {
                    background: #2a2a2a;
                    color: white;
                }
            }
            
            /* Animation for smooth transitions */
            @keyframes selectFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .mobile-nav-select-container {
                animation: selectFadeIn 0.3s ease-out;
            }
            
            /* Accessibility improvements */
            .mobile-nav-select:focus-visible {
                outline: 2px solid var(--primary);
                outline-offset: 2px;
            }
            
            /* Ensure original navigation is hidden on mobile */
            #mainMenu {
                display: none !important;
            }
            
            .mobile-menu-toggle {
                display: none !important;
            }
        }
        
        /* Desktop - show original navigation */
        @media (min-width: 993px) {
            .mobile-nav-select-container {
                display: none !important;
            }
            
            #mainMenu {
                display: flex !important;
            }
            
            .mobile-menu-toggle {
                display: none !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}

function restoreOriginalNavigation() {
    // Remove select navigation
    const selectContainer = document.querySelector('.mobile-nav-select-container');
    if (selectContainer) {
        selectContainer.remove();
    }
    
    // Show original navigation
    const originalMenu = document.querySelector('#mainMenu');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (originalMenu) {
        originalMenu.style.display = '';
    }
    
    if (mobileToggle) {
        mobileToggle.style.display = '';
    }
    
    // Remove select navigation styles
    const selectStyles = document.querySelector('#android-select-nav-styles');
    if (selectStyles) {
        selectStyles.remove();
    }
}

// Utility function to handle deep linking
function handleDeepLinking() {
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }
}

// Initialize deep linking
window.addEventListener('load', handleDeepLinking);

// Debug function
window.testSelectNavigation = function() {
    console.log('🔧 Testing select navigation...');
    
    const select = document.querySelector('.mobile-nav-select');
    const container = document.querySelector('.mobile-nav-select-container');
    
    console.log('Select element:', select);
    console.log('Container:', container);
    console.log('Options count:', select ? select.options.length : 0);
    
    if (select) {
        console.log('✅ Select navigation is active');
        console.log('Available options:');
        Array.from(select.options).forEach((option, index) => {
            console.log(`  ${index}: ${option.textContent} -> ${option.value}`);
        });
    } else {
        console.log('❌ Select navigation not found');
    }
};

console.log('✅ Android select-based navigation script loaded');