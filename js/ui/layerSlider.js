/**
 * Layer Slider Component
 * UI for switching between 6 anatomical/functional layers
 * Mobile-first design with touch support
 */

import { systemLayers, getLayerIds } from '../config/systemLayers.js';

export class LayerSlider {
    constructor(containerId = 'layer-slider-container') {
        this.containerId = containerId;
        this.container = null;
        this.currentLayer = 'muscles'; // Default layer
        this.buttons = new Map();
        this.init();
    }

    /**
     * Initialize slider
     */
    init() {
        this.createContainer();
        this.createButtons();
        this.setActiveLayer(this.currentLayer);
    }

    /**
     * Create slider container
     */
    createContainer() {
        // Check if container already exists
        let container = document.getElementById(this.containerId);

        if (!container) {
            container = document.createElement('div');
            container.id = this.containerId;
            container.className = 'layer-slider-container';
            document.body.appendChild(container);
        }

        this.container = container;
    }

    /**
     * Create layer buttons
     */
    createButtons() {
        const layerIds = getLayerIds();

        layerIds.forEach(layerId => {
            const layer = systemLayers[layerId];
            const button = this.createButton(layer);
            this.buttons.set(layerId, button);
            this.container.appendChild(button);
        });
    }

    /**
     * Create individual layer button
     * @param {Object} layer - Layer configuration
     * @returns {HTMLElement} Button element
     */
    createButton(layer) {
        const button = document.createElement('button');
        button.className = 'layer-btn';
        button.dataset.layer = layer.id;
        button.dataset.name = layer.name;
        button.innerHTML = layer.icon;
        button.title = layer.name;
        button.setAttribute('aria-label', layer.name);

        // Click handler
        button.addEventListener('click', () => {
            this.switchLayer(layer.id);
        });

        // Touch feedback (mobile)
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });

        button.addEventListener('touchend', () => {
            button.style.transform = '';
        });

        return button;
    }

    /**
     * Switch to a different layer
     * @param {string} layerId - Layer identifier
     */
    switchLayer(layerId) {
        if (layerId === this.currentLayer) return;

        const layer = systemLayers[layerId];
        if (!layer) {
            console.warn(`Layer not found: ${layerId}`);
            return;
        }

        // Update visual state
        this.setActiveLayer(layerId);

        // Update document attribute for CSS
        document.documentElement.setAttribute('data-layer', layerId);

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('layerChange', {
            detail: {
                layerId,
                layer,
                previousLayer: this.currentLayer
            }
        }));

        this.currentLayer = layerId;

        console.log(`Switched to layer: ${layer.name}`);
    }

    /**
     * Set active layer visually
     * @param {string} layerId - Layer identifier
     */
    setActiveLayer(layerId) {
        // Remove active class from all buttons
        this.buttons.forEach((button, id) => {
            if (id === layerId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
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
     * Programmatically switch to layer
     * @param {string} layerId - Layer identifier
     */
    setLayer(layerId) {
        this.switchLayer(layerId);
    }

    /**
     * Show slider
     */
    show() {
        if (this.container) {
            this.container.style.display = 'flex';
        }
    }

    /**
     * Hide slider
     */
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    /**
     * Destroy slider
     */
    destroy() {
        if (this.container) {
            this.container.remove();
        }
        this.buttons.clear();
    }
}
