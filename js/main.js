/**
 * Main application entry point
 */

import { loadSVG } from './core/svgLoader.js';
import { setupInteractivity } from './core/interactivity.js';
import { setupZoomControls, setupPanZoom, initZoom } from './core/zoom.js';
import { setupSidebarToggle } from './ui/sidebar.js';
import { isMobile, setupMobile } from './core/mobile.js';

/**
 * Initialize application
 */
async function init() {
    const mobile = isMobile();

    // Load SVGs for appropriate layout
    if (mobile) {
        // Mobile: Load into mobile containers
        const frontSvg = await loadSVG('body-front.svg', 'front-svg-wrapper-mobile');
        const backSvg = await loadSVG('body-back.svg', 'back-svg-wrapper-mobile');

        if (frontSvg) {
            setupInteractivity(frontSvg, 'front');
            setupPanZoom(document.getElementById('front-svg-wrapper-mobile'));
        }

        if (backSvg) {
            setupInteractivity(backSvg, 'back');
            setupPanZoom(document.getElementById('back-svg-wrapper-mobile'));
        }

        // Setup mobile-specific features
        setupMobile();
    } else {
        // Desktop: Load into desktop containers
        const frontSvg = await loadSVG('body-front.svg', 'front-svg-wrapper');
        const backSvg = await loadSVG('body-back.svg', 'back-svg-wrapper');

        if (frontSvg) {
            setupInteractivity(frontSvg, 'front');
            setupPanZoom(document.getElementById('front-svg-wrapper'));
        }

        if (backSvg) {
            setupInteractivity(backSvg, 'back');
            setupPanZoom(document.getElementById('back-svg-wrapper'));
        }
    }

    // Setup UI (common for both)
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
