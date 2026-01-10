// CORS Error Handler for Supabase
// This module provides better error handling and user feedback for CORS issues

class CORSErrorHandler {
    constructor() {
        this.corsErrorDetected = false;
        this.fallbackMode = false;
    }

    // Check if an error is CORS-related
    isCORSError(error) {
        if (!error) return false;
        
        const corsIndicators = [
            'CORS request did not succeed',
            'NetworkError when attempting to fetch resource',
            'Cross-Origin Request Blocked',
            'Access to fetch blocked by CORS policy',
            'Failed to fetch'
        ];
        
        const errorMessage = error.message || error.toString();
        return corsIndicators.some(indicator => 
            errorMessage.includes(indicator)
        );
    }

    // Handle CORS errors with user-friendly messages
    handleCORSError(operation, error) {
        this.corsErrorDetected = true;
        
        console.warn(`🚫 CORS Error in ${operation}:`, error);
        
        // Show user-friendly notification
        this.showCORSNotification(operation);
        
        // Enable fallback mode
        this.enableFallbackMode();
        
        return {
            success: false,
            error: 'CORS_ERROR',
            message: 'Database connection blocked. Using local storage as fallback.',
            fallbackMode: true
        };
    }

    // Show notification to user about CORS issue
    showCORSNotification(operation) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('cors-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'cors-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                max-width: 400px;
                font-family: Arial, sans-serif;
                font-size: 14px;
            `;
            document.body.appendChild(notification);
        }

        notification.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 18px; margin-right: 8px;">⚠️</span>
                <strong>Database Connection Issue</strong>
            </div>
            <p style="margin: 0 0 10px 0;">
                The website cannot connect to the cloud database due to CORS restrictions. 
                Using local storage as backup.
            </p>
            <details style="margin-top: 10px;">
                <summary style="cursor: pointer; color: #007bff;">Technical Details</summary>
                <div style="margin-top: 8px; font-size: 12px; color: #666;">
                    <p><strong>Operation:</strong> ${operation}</p>
                    <p><strong>Issue:</strong> Cross-Origin Request Blocked</p>
                    <p><strong>Solution:</strong> Configure Supabase CORS settings</p>
                </div>
            </details>
            <button onclick="this.parentElement.style.display='none'" 
                    style="background: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                Dismiss
            </button>
        `;

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (notification && notification.parentElement) {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 10000);
    }

    // Enable fallback mode indicators
    enableFallbackMode() {
        this.fallbackMode = true;
        
        // Update database status indicators
        const dbStatus = document.getElementById('dbStatus');
        if (dbStatus) {
            dbStatus.textContent = '⚠️';
            dbStatus.title = 'Using local storage (CORS issue)';
        }

        // Add fallback mode indicator to page
        this.addFallbackModeIndicator();
    }

    // Add visual indicator that we're in fallback mode
    addFallbackModeIndicator() {
        let indicator = document.getElementById('fallback-mode-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'fallback-mode-indicator';
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 9999;
                font-family: Arial, sans-serif;
            `;
            indicator.innerHTML = '⚠️ Offline Mode (Local Storage)';
            document.body.appendChild(indicator);
        }
    }

    // Wrap Supabase operations with CORS error handling
    async wrapSupabaseOperation(operation, supabasePromise, fallbackFunction = null) {
        try {
            const result = await supabasePromise;
            
            // Check if the result indicates a CORS error
            if (result.error && this.isCORSError(result.error)) {
                return this.handleCORSError(operation, result.error);
            }
            
            return {
                success: true,
                data: result.data,
                error: result.error
            };
        } catch (error) {
            if (this.isCORSError(error)) {
                const corsResult = this.handleCORSError(operation, error);
                
                // Try fallback if provided
                if (fallbackFunction && typeof fallbackFunction === 'function') {
                    try {
                        const fallbackData = await fallbackFunction();
                        return {
                            success: true,
                            data: fallbackData,
                            error: null,
                            fallbackUsed: true
                        };
                    } catch (fallbackError) {
                        console.error('Fallback also failed:', fallbackError);
                    }
                }
                
                return corsResult;
            }
            
            // Re-throw non-CORS errors
            throw error;
        }
    }

    // Check if we're in fallback mode
    isFallbackMode() {
        return this.fallbackMode;
    }

    // Reset CORS error state
    reset() {
        this.corsErrorDetected = false;
        this.fallbackMode = false;
        
        // Remove notifications
        const notification = document.getElementById('cors-notification');
        if (notification) notification.remove();
        
        const indicator = document.getElementById('fallback-mode-indicator');
        if (indicator) indicator.remove();
    }
}

// Create global instance
window.corsErrorHandler = new CORSErrorHandler();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CORSErrorHandler;
}

console.log('🛡️ CORS Error Handler loaded');