/**
 * Mobile-specific functionality
 * Handles touch events, swipe gestures, and responsive behavior
 */

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let currentView = 'front';

/**
 * Check if device is mobile
 * @returns {boolean}
 */
export function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Setup mobile-specific features
 */
export function setupMobile() {
    if (!isMobile()) return;

    setupViewTabs();
    setupSwipeGestures();
    setupSidebarDrawer();
    setupTouchInteractions();
}

/**
 * Setup view tabs for mobile
 */
function setupViewTabs() {
    const tabs = document.querySelectorAll('.view-tab');
    const wrapper = document.querySelector('.mobile-view-wrapper');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const view = tab.dataset.view;
            switchView(view);
        });
    });
}

/**
 * Switch between front and back views
 * @param {string} view - 'front' or 'back'
 */
function switchView(view) {
    currentView = view;
    const wrapper = document.querySelector('.mobile-view-wrapper');
    const tabs = document.querySelectorAll('.view-tab');

    // Update wrapper position
    if (view === 'back') {
        wrapper.classList.add('show-back');
    } else {
        wrapper.classList.remove('show-back');
    }

    // Update active tab
    tabs.forEach(tab => {
        if (tab.dataset.view === view) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

/**
 * Setup swipe gestures for view switching
 */
function setupSwipeGestures() {
    const container = document.querySelector('.mobile-view-container');
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
}

/**
 * Handle touch start
 * @param {TouchEvent} e
 */
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

/**
 * Handle touch move
 * @param {TouchEvent} e
 */
function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
}

/**
 * Handle touch end - detect swipe direction
 * @param {TouchEvent} e
 */
function handleTouchEnd(e) {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50;

    // Check if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && currentView === 'back') {
            // Swipe right: back to front
            switchView('front');
        } else if (deltaX < 0 && currentView === 'front') {
            // Swipe left: front to back
            switchView('back');
        }
    }
}

/**
 * Setup sidebar as bottom drawer
 */
function setupSidebarDrawer() {
    const sidebar = document.getElementById('sidebar');
    const handle = document.querySelector('.sidebar-handle');

    if (!sidebar || !handle) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    // Click handle to toggle
    handle.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
    });

    // Swipe to open/close
    handle.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    handle.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
    }, { passive: true });

    handle.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;

        const deltaY = currentY - startY;
        const threshold = 50;

        if (deltaY < -threshold) {
            // Swipe up: expand
            sidebar.classList.add('expanded');
        } else if (deltaY > threshold) {
            // Swipe down: collapse
            sidebar.classList.remove('expanded');
        }
    }, { passive: true });
}

/**
 * Setup touch interactions for muscles
 */
function setupTouchInteractions() {
    // Touch events are handled by existing interactivity module
    // This function can be extended for mobile-specific touch behaviors

    // Prevent default touch behaviors on SVG to avoid conflicts
    const svgWrappers = document.querySelectorAll('.svg-wrapper');
    svgWrappers.forEach(wrapper => {
        wrapper.addEventListener('touchstart', (e) => {
            // Allow single touch for interaction
            if (e.touches.length === 1) {
                e.stopPropagation();
            }
        }, { passive: false });
    });
}

/**
 * Handle window resize
 */
export function handleResize() {
    // Reload page if switching between mobile/desktop
    const wasMobile = document.body.classList.contains('mobile');
    const nowMobile = isMobile();

    if (wasMobile !== nowMobile) {
        if (nowMobile) {
            document.body.classList.add('mobile');
            setupMobile();
        } else {
            document.body.classList.remove('mobile');
        }
    }
}

// Setup resize listener
window.addEventListener('resize', handleResize);
