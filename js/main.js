/**
 * Main application entry point
 */

import { loadSVG } from './core/svgLoader.js';
import { setupInteractivity } from './core/interactivity.js';
import { setupZoomControls, setupPanZoom, initZoom } from './core/zoom.js';
import { setupSidebarToggle } from './ui/sidebar.js';
import { isMobile, setupMobile } from './core/mobile.js';

// NEW: Multi-layer system imports
import { ThemeToggle } from './ui/themeToggle.js';
import { LayerSlider } from './ui/layerSlider.js';
import { SystemSwitcher } from './core/systemSwitcher.js';
import { SystemBlocks } from './ui/systemBlocks.js';

// Global instances
let themeToggle;
let layerSlider;
let systemSwitcher;
let systemBlocks;

/**
 * Initialize application
 */
async function init() {
    const mobile = isMobile();

    // Initialize new components first
    initializeNewComponents();

    // Load initial layer (muscles) through systemSwitcher
    await systemSwitcher.switchTo('muscles');

    // Setup mobile-specific features
    if (mobile) {
        setupMobile();
    }

    // Setup UI (common for both)
    setupSidebarToggle();
    setupZoomControls();
    initZoom();

    console.log('✅ Application initialized with multi-layer system');
}

/**
 * Initialize new multi-layer components
 */
function initializeNewComponents() {
    // 1. Theme Toggle
    themeToggle = new ThemeToggle();
    console.log('✅ Theme toggle initialized');

    // 2. Layer Slider
    layerSlider = new LayerSlider();
    console.log('✅ Layer slider initialized');

    // 3. System Switcher
    systemSwitcher = new SystemSwitcher();
    console.log('✅ System switcher initialized');

    // 4. System Blocks Renderer
    systemBlocks = new SystemBlocks();
    console.log('✅ System blocks renderer initialized');

    // Setup event listeners
    setupLayerChangeListener();
}

/**
 * Setup layer change event listener
 */
function setupLayerChangeListener() {
    window.addEventListener('layerChange', async (event) => {
        const { layerId, layer } = event.detail;

        console.log(`🔄 Layer change event: ${layer.name}`);

        try {
            // CRITICAL: Wait for system switch to complete
            await systemSwitcher.switchTo(layerId);

            // Only render blocks AFTER switch is fully complete
            if (layer.hasBlocks) {
                systemBlocks.render(layerId);
            } else {
                systemBlocks.clear();
            }
        } catch (error) {
            console.error('❌ Error handling layer change:', error);
        }
    });
}

// Start when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
