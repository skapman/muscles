/**
 * Mobile-specific functionality
 * Improved UX with persistent selection and better state management
 */

import { muscleData } from '../config/muscleData.js';

// State
let touchStartX = 0;
let touchStartY = 0;
let currentView = 'front';
let selectedMuscle = null;
let sheetState = 'hidden'; // hidden, collapsed, expanded
let sheetStartY = 0;
let sheetCurrentY = 0;
let isDraggingSheet = false;
let allMuscleElements = {};

/**
 * Check if device is mobile
 */
export function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Setup mobile-specific features
 */
export function setupMobile() {
    if (!isMobile()) return;

    setupViewSwipe();
    setupBottomSheet();
    setupMuscleInteraction();
    setupSwipeHint();
    setupInfoButton();

    console.log('Mobile mode initialized');
}

/**
 * Store muscle elements for selection management
 */
export function registerMuscleElements(elements) {
    allMuscleElements = elements;
}

/**
 * Setup horizontal swipe for view switching
 */
function setupViewSwipe() {
    const container = document.querySelector('.mobile-view-container');
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    container.addEventListener('touchstart', (e) => {
        // Don't interfere with sheet dragging
        if (e.target.closest('.mobile-bottom-sheet')) return;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            e.preventDefault();
        }
    }, { passive: false });

    container.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;
        const threshold = 50;

        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0 && currentView === 'back') {
                switchView('front');
                hideSwipeHint();
            } else if (deltaX < 0 && currentView === 'front') {
                switchView('back');
                hideSwipeHint();
            }
        }
    }, { passive: true });
}

/**
 * Switch between front and back views
 */
function switchView(view) {
    currentView = view;
    const wrapper = document.querySelector('.mobile-view-wrapper');
    const indicators = document.querySelectorAll('.view-indicator');

    if (view === 'back') {
        wrapper.classList.add('show-back');
    } else {
        wrapper.classList.remove('show-back');
    }

    indicators.forEach(indicator => {
        if (indicator.dataset.view === view) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });

    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

/**
 * Setup bottom sheet interactions
 */
function setupBottomSheet() {
    const sheet = document.getElementById('mobile-bottom-sheet');
    const handle = document.getElementById('sheet-handle');
    const closeBtn = document.getElementById('sheet-close');

    if (!sheet || !handle) return;

    // Handle drag
    handle.addEventListener('touchstart', (e) => {
        sheetStartY = e.touches[0].clientY;
        isDraggingSheet = true;
    }, { passive: true });

    handle.addEventListener('touchmove', (e) => {
        if (!isDraggingSheet) return;
        sheetCurrentY = e.touches[0].clientY;
    }, { passive: true });

    handle.addEventListener('touchend', () => {
        if (!isDraggingSheet) return;
        isDraggingSheet = false;

        const deltaY = sheetCurrentY - sheetStartY;
        const threshold = 50;

        if (sheetState === 'collapsed') {
            if (deltaY < -threshold) {
                expandSheet();
            } else if (deltaY > threshold) {
                hideSheet();
            }
        } else if (sheetState === 'expanded') {
            if (deltaY > threshold) {
                collapseSheet();
            }
        }
    }, { passive: true });

    // Tap handle or sheet to expand when collapsed
    const tapToExpand = () => {
        if (sheetState === 'collapsed') {
            expandSheet();
        }
    };

    handle.addEventListener('click', tapToExpand);
    sheet.addEventListener('click', (e) => {
        if (e.target.closest('.sheet-compact')) {
            tapToExpand();
        }
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', hideSheet);
    }
}

/**
 * Setup muscle interaction for mobile
 */
function setupMuscleInteraction() {
    // Tap on muscle
    document.addEventListener('click', (e) => {
        if (!isMobile()) return;

        const muscle = e.target.closest('.muscle-interactive');

        if (muscle) {
            e.preventDefault();
            const muscleKey = muscle.dataset.muscle;

            if (muscleKey === selectedMuscle) {
                // Tap on selected muscle: deselect
                deselectMuscle();
            } else {
                // Tap on new muscle: select and show sheet
                selectMuscle(muscleKey);
            }
        } else if (!e.target.closest('.mobile-bottom-sheet') &&
                   !e.target.closest('.mobile-info-btn')) {
            // Tap on empty space: deselect and hide
            deselectMuscle();
        }
    });

    // Long press to expand directly
    let longPressTimer;
    document.addEventListener('touchstart', (e) => {
        const muscle = e.target.closest('.muscle-interactive');
        if (muscle && isMobile()) {
            const muscleKey = muscle.dataset.muscle;
            longPressTimer = setTimeout(() => {
                if (muscleKey) {
                    selectMuscle(muscleKey);
                    setTimeout(() => expandSheet(), 100);
                }
            }, 500);
        }
    });

    document.addEventListener('touchend', () => {
        clearTimeout(longPressTimer);
    });

    document.addEventListener('touchmove', () => {
        clearTimeout(longPressTimer);
    });
}

/**
 * Select a muscle (persistent highlight)
 */
function selectMuscle(muscleKey) {
    console.log('[Mobile] Selecting muscle:', muscleKey);

    // Deselect previous
    if (selectedMuscle && selectedMuscle !== muscleKey) {
        deselectMuscle();
    }

    selectedMuscle = muscleKey;

    // Add selected class to all parts of this muscle
    const elements = allMuscleElements[muscleKey];
    console.log('[Mobile] Found elements:', elements ? elements.length : 0);

    if (elements) {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            elements.forEach((el, index) => {
                console.log(`[Mobile] Element ${index}:`, el.id, 'classes before:', el.className.baseVal);
                el.classList.remove('highlighted');
                el.classList.add('selected');
                console.log(`[Mobile] Element ${index}:`, el.id, 'classes after:', el.className.baseVal);
            });
        }, 0);
    }

    // Show sheet in collapsed state
    showSheet(muscleKey);

    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

/**
 * Deselect current muscle
 */
function deselectMuscle() {
    if (!selectedMuscle) return;

    // Remove selected class
    const elements = allMuscleElements[selectedMuscle];
    if (elements) {
        elements.forEach(el => {
            el.classList.remove('selected', 'highlighted');
        });
    }

    selectedMuscle = null;
    hideSheet();
}

/**
 * Show bottom sheet in collapsed state
 */
function showSheet(muscleKey) {
    const sheet = document.getElementById('mobile-bottom-sheet');
    const data = muscleData[muscleKey];

    if (!sheet || !data) return;

    // Update compact view
    document.getElementById('compact-title').textContent = data.name;
    document.getElementById('compact-function').textContent = data.function;

    // Update expanded view
    document.getElementById('sheet-title').textContent = data.name;
    document.getElementById('sheet-subtitle').textContent = data.latinName;
    document.getElementById('sheet-function').textContent = data.function;
    document.getElementById('sheet-origin').textContent = data.origin;
    document.getElementById('sheet-insertion').textContent = data.insertion;
    document.getElementById('sheet-description').textContent = data.description;

    // Show in collapsed state
    sheet.classList.add('visible', 'collapsed');
    sheet.classList.remove('expanded');
    sheetState = 'collapsed';
}

/**
 * Expand bottom sheet
 */
function expandSheet() {
    const sheet = document.getElementById('mobile-bottom-sheet');
    if (!sheet) return;

    sheet.classList.remove('collapsed');
    sheet.classList.add('expanded');
    sheetState = 'expanded';

    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

/**
 * Collapse bottom sheet
 */
function collapseSheet() {
    const sheet = document.getElementById('mobile-bottom-sheet');
    if (!sheet) return;

    sheet.classList.add('collapsed');
    sheet.classList.remove('expanded');
    sheetState = 'collapsed';

    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

/**
 * Hide bottom sheet
 */
function hideSheet() {
    const sheet = document.getElementById('mobile-bottom-sheet');
    if (!sheet) return;

    sheet.classList.remove('visible', 'collapsed', 'expanded');
    sheetState = 'hidden';
}

/**
 * Setup info button
 */
function setupInfoButton() {
    const infoBtn = document.getElementById('mobile-info-btn');
    if (!infoBtn) return;

    infoBtn.addEventListener('click', () => {
        // Deselect any muscle
        if (selectedMuscle) {
            deselectMuscle();
        }

        // Show general info in sheet
        showGeneralInfo();
    });
}

/**
 * Show general information
 */
function showGeneralInfo() {
    const sheet = document.getElementById('mobile-bottom-sheet');
    if (!sheet) return;

    // Update compact view
    document.getElementById('compact-title').textContent = 'Muscle Anatomy';
    document.getElementById('compact-function').textContent = 'Interactive guide to human muscles';

    // Update expanded view
    document.getElementById('sheet-title').textContent = 'Muscle Anatomy Guide';
    document.getElementById('sheet-subtitle').textContent = 'Interactive Learning Tool';
    document.getElementById('sheet-function').textContent = 'Explore human muscle anatomy by tapping on muscles to learn about their function, origin, and insertion points.';
    document.getElementById('sheet-origin').textContent = 'Swipe left/right to switch between front and back views. Tap any muscle to see details.';
    document.getElementById('sheet-insertion').textContent = 'Long press on a muscle to see full details immediately.';
    document.getElementById('sheet-description').textContent = 'This interactive tool helps you learn about human muscle anatomy. Each muscle is color-coded and can be selected for detailed information.';

    // Show in expanded state
    sheet.classList.add('visible', 'expanded');
    sheet.classList.remove('collapsed');
    sheetState = 'expanded';

    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

/**
 * Setup swipe hint
 */
function setupSwipeHint() {
    const hint = document.getElementById('swipe-hint');
    if (!hint) return;

    const hintShown = localStorage.getItem('swipe-hint-shown');

    if (hintShown) {
        hint.classList.add('hidden');
    } else {
        setTimeout(() => {
            hint.classList.add('hidden');
        }, 3000);
    }
}

/**
 * Hide swipe hint permanently
 */
function hideSwipeHint() {
    const hint = document.getElementById('swipe-hint');
    if (hint) {
        hint.classList.add('hidden');
        localStorage.setItem('swipe-hint-shown', 'true');
    }
}

/**
 * Handle window resize
 */
export function handleResize() {
    const wasMobile = document.body.classList.contains('mobile');
    const nowMobile = isMobile();

    if (wasMobile !== nowMobile) {
        location.reload();
    }
}

window.addEventListener('resize', handleResize);

export { showSheet, expandSheet, collapseSheet, hideSheet, selectMuscle, deselectMuscle };
