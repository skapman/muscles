/**
 * System Switcher
 * Handles switching between different anatomical/functional layers
 * Manages SVG loading, transitions, and layer-specific behavior
 */

import { systemLayers } from '../config/systemLayers.js';
import { loadSVG } from './svgLoader.js';
import { setupInteractivity } from './interactivity.js';
import { setupPanZoom } from './zoom.js';
import { isMobile } from './mobile.js';

export class SystemSwitcher {
    constructor() {
        this.currentLayer = null; // Start with no layer loaded
        this.svgCache = new Map(); // Cache loaded SVGs
        this.containers = this.getContainers();
        this.isTransitioning = false;
    }

    /**
     * Get SVG containers based on device type
     * @returns {Object} Container elements
     */
    getContainers() {
        const mobile = isMobile();

        if (mobile) {
            return {
                front: document.getElementById('front-svg-wrapper-mobile'),
                back: document.getElementById('back-svg-wrapper-mobile'),
                single: document.getElementById('front-svg-wrapper-mobile') // For single SVG layers
            };
        } else {
            return {
                front: document.getElementById('front-svg-wrapper'),
                back: document.getElementById('back-svg-wrapper'),
                single: document.getElementById('front-svg-wrapper') // For single SVG layers
            };
        }
    }

    /**
     * Switch to a different layer
     * @param {string} layerId - Layer identifier
     */
    async switchTo(layerId) {
        // Prevent rapid clicking
        if (this.isTransitioning) {
            console.log('⏳ Transition in progress, ignoring click...');
            return Promise.resolve();
        }

        if (layerId === this.currentLayer) {
            console.log(`Already on layer: ${layerId}`);
            return Promise.resolve();
        }

        const layer = systemLayers[layerId];
        if (!layer) {
            console.error(`Layer not found: ${layerId}`);
            return Promise.reject(new Error(`Layer not found: ${layerId}`));
        }

        // Lock transitions
        this.isTransitioning = true;
        const previousLayer = this.currentLayer;

        try {
            // Only fade out if we have a current layer
            if (previousLayer !== null) {
                await this.fadeOut();
            }

            // Clear current content
            this.clearContainers();

            // Reset container visibility
            this.resetContainerVisibility();

            // Load new layer
            await this.loadLayer(layer);

            // Fade in (or just show if first load)
            if (previousLayer !== null) {
                await this.fadeIn();
            } else {
                // First load - no fade, just show
                this.showContainers();
            }

            // Update current layer AFTER everything is done
            this.currentLayer = layerId;

            // Update view indicators visibility
            this.updateViewIndicators(layer);

            console.log(`✅ Switched to layer: ${layer.name}`);
            return Promise.resolve();
        } catch (error) {
            console.error('❌ Error switching layers:', error);
            // Restore previous layer on error
            this.currentLayer = previousLayer;
            return Promise.reject(error);
        } finally {
            // Unlock immediately
            this.isTransitioning = false;
        }
    }

    /**
     * Update view indicators visibility based on layer
     * @param {Object} layer - Layer configuration
     */
    updateViewIndicators(layer) {
        const viewIndicators = document.querySelector('.view-indicators');

        if (!viewIndicators) return;

        // Hide indicators for single-SVG layers
        if (layer.svgFiles.length === 1) {
            viewIndicators.style.display = 'none';
        } else {
            viewIndicators.style.display = '';
        }
    }

    /**
     * Load layer SVGs and setup
     * @param {Object} layer - Layer configuration
     */
    async loadLayer(layer) {
        const { svgFiles, hasInteractivity, type } = layer;

        if (type === 'blocks-only') {
            // Gadgets layer - no SVG, only blocks
            console.log('Blocks-only layer, no SVG to load');
            return;
        }

        // Load SVG files
        if (svgFiles && svgFiles.length > 0) {
            for (const svgFile of svgFiles) {
                await this.loadSVGFile(svgFile, hasInteractivity);
            }
        }
    }

    /**
     * Load individual SVG file
     * @param {Object} svgFile - SVG file configuration
     * @param {boolean} hasInteractivity - Whether to setup interactivity
     */
    async loadSVGFile(svgFile, hasInteractivity) {
        const { id, path } = svgFile;

        // Determine container
        let container;
        if (id === 'front') {
            container = this.containers.front;
        } else if (id === 'back') {
            container = this.containers.back;
        } else {
            // Single SVG (nervous, respiratory, cardiovascular)
            container = this.containers.single;
            // Hide back container for single SVG layers
            if (this.containers.back) {
                this.containers.back.style.display = 'none';
            }
        }

        if (!container) {
            console.error(`Container not found for: ${id}`);
            return;
        }

        // Always load fresh SVG (caching disabled for stability)
        const svg = await loadSVG(path, container.id);

        if (svg) {
            // Setup interactivity only for muscles layer
            if (hasInteractivity) {
                setupInteractivity(svg, id);
            }

            // Setup pan & zoom
            setupPanZoom(container);

            console.log(`✅ Loaded SVG: ${path}`);
        }
    }

    /**
     * Reset container visibility
     */
    resetContainerVisibility() {
        // Show both front and back containers by default
        if (this.containers.front) {
            this.containers.front.style.display = '';
        }
        if (this.containers.back) {
            this.containers.back.style.display = '';
        }
    }

    /**
     * Show containers (for first load)
     */
    showContainers() {
        const containers = Object.values(this.containers).filter(Boolean);
        containers.forEach(container => {
            container.classList.remove('layer-transition', 'fade-out', 'fade-in');
        });
    }

    /**
     * Clear all containers
     */
    clearContainers() {
        Object.values(this.containers).forEach(container => {
            if (container) {
                container.innerHTML = '';
            }
        });
    }

    /**
     * Fade out transition using transitionend event
     * @returns {Promise}
     */
    fadeOut() {
        return new Promise(resolve => {
            const containers = Object.values(this.containers).filter(Boolean);

            if (containers.length === 0) {
                resolve();
                return;
            }

            // Remove any existing transition classes first
            containers.forEach(container => {
                container.classList.remove('fade-in');
                container.classList.add('layer-transition', 'fade-out');
            });

            // Listen for transitionend on first container
            const firstContainer = containers[0];
            const handleTransitionEnd = (e) => {
                // Only respond to opacity transitions
                if (e.propertyName === 'opacity') {
                    firstContainer.removeEventListener('transitionend', handleTransitionEnd);
                    resolve();
                }
            };

            firstContainer.addEventListener('transitionend', handleTransitionEnd);

            // Fallback timeout in case transitionend doesn't fire
            setTimeout(() => {
                firstContainer.removeEventListener('transitionend', handleTransitionEnd);
                resolve();
            }, 600);
        });
    }

    /**
     * Fade in transition using transitionend event
     * @returns {Promise}
     */
    fadeIn() {
        return new Promise(resolve => {
            const containers = Object.values(this.containers).filter(Boolean);

            if (containers.length === 0) {
                resolve();
                return;
            }

            containers.forEach(container => {
                container.classList.remove('fade-out');
                // Force reflow to ensure transition works
                void container.offsetHeight;
                container.classList.add('fade-in');
            });

            // Listen for transitionend on first container
            const firstContainer = containers[0];
            const handleTransitionEnd = (e) => {
                // Only respond to opacity transitions
                if (e.propertyName === 'opacity') {
                    firstContainer.removeEventListener('transitionend', handleTransitionEnd);

                    // Clean up classes
                    containers.forEach(container => {
                        container.classList.remove('layer-transition', 'fade-in');
                    });

                    resolve();
                }
            };

            firstContainer.addEventListener('transitionend', handleTransitionEnd);

            // Fallback timeout in case transitionend doesn't fire
            setTimeout(() => {
                firstContainer.removeEventListener('transitionend', handleTransitionEnd);
                containers.forEach(container => {
                    container.classList.remove('layer-transition', 'fade-in');
                });
                resolve();
            }, 600);
        });
    }

    /**
     * Get current layer
     * @returns {string} Current layer ID
     */
    getCurrentLayer() {
        return this.currentLayer;
    }

    /**
     * Clear SVG cache
     */
    clearCache() {
        this.svgCache.clear();
        console.log('SVG cache cleared');
    }

    /**
     * Preload layer SVGs
     * @param {string} layerId - Layer to preload
     */
    async preload(layerId) {
        const layer = systemLayers[layerId];
        if (!layer || !layer.svgFiles) return;

        console.log(`Preloading layer: ${layer.name}`);

        // Preload in background without affecting current view
        // TODO: Implement background preloading
    }
}
