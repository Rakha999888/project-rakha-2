/**
 * View Transitions API Polyfill
 * Provides smooth transitions between pages even for browsers without
 * native View Transitions API support
 */

// Check if View Transitions API is supported
const isViewTransitionsSupported = !!document.startViewTransition;

/**
 * Perform a page transition
 * @param {Function} updateCallback - Function to update the DOM
 * @returns {Promise} Promise that resolves when transition is complete
 */
export const transitionHelper = async (updateCallback) => {
  // If View Transitions API is supported, use it
  if (isViewTransitionsSupported) {
    return await document.startViewTransition(updateCallback).finished;
  }
  
  // Fallback for browsers without View Transitions API
  const content = document.getElementById('mainContent');
  content.classList.add('page-transition');
  
  // Update the DOM
  updateCallback();
  
  // Remove the transition class after animation completes
  return new Promise((resolve) => {
    const handleAnimationEnd = () => {
      content.classList.remove('page-transition');
      content.removeEventListener('animationend', handleAnimationEnd);
      resolve();
    };
    
    content.addEventListener('animationend', handleAnimationEnd);
  });
};

/**
 * Apply transition class to main content
 * @param {string} pageType - Type of page for specific transition effect
 */
export const applyTransitionClass = (pageType) => {
  const content = document.getElementById('mainContent');
  
  // Remove any existing transition classes
  content.classList.remove(
    'home-transition',
    'detail-transition',
    'add-transition',
    'login-transition',
    'register-transition'
  );
  
  // Add the appropriate transition class
  content.classList.add(`${pageType}-transition`);
};

// Export as default for easy importing
export default {
  transitionHelper,
  applyTransitionClass,
  isViewTransitionsSupported,
};
