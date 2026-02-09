/**
 * Main application entry point
 */

import { loadSVG } from './core/svgLoader.js';
import { setupInteractivity } from './core/interactivity.js';
import { setupZoomControls, setupPanZoom, initZoom } from './core/zoom.js';
import { setupSidebarToggle } from './ui/sidebar.js';

/**
 * Initialize application
 */
async function init() {
    // Load SVGs
    const frontSvg = await loadSVG('body-front.svg', 'front-svg-wrapper');
    const backSvg = await loadSVG('body-back.svg', 'back-svg-wrapper');

    // Setup interactivity
    if (frontSvg) {
        setupInteractivity(frontSvg, 'front');
        setupPanZoom(document.getElementById('front-svg-wrapper'));
    }

    if (backSvg) {
        setupInteractivity(backSvg, 'back');
        setupPanZoom(document.getElementById('back-svg-wrapper'));
    }

    // Setup UI
    setupSidebarToggle();
    setupZoomControls();
    initZoom();
}

// Start when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
