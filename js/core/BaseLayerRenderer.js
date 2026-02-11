/**
 * Base Layer Renderer
 * Abstract base class for all layer renderers (pain, nervous, respiratory, etc.)
 * Provides common functionality for positioning, rendering, and managing layer elements
 */

export class BaseLayerRenderer {
    /**
     * @param {string} layerName - Name of the layer (e.g., 'pain', 'nervous')
     * @param {string} containerClass - CSS class for the container
     */
    constructor(layerName, containerClass) {
        this.layerName = layerName;
        this.containerClass = containerClass;
        this.container = null;
        this.items = [];
    }

    /**
     * Wait for SVG to be loaded in DOM
     * @param {number} timeout - Maximum wait time in ms
     * @returns {Promise<SVGElement>}
     */
    waitForSVG(timeout = 5000) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = timeout / 50;

            const checkSVG = () => {
                attempts++;

                const svg = document.querySelector('.svg-wrapper svg') ||
                           document.querySelector('.view-panel svg') ||
                           document.querySelector('.mobile-view-panel svg');

                if (svg && svg.getBoundingClientRect().width > 0) {
                    console.log(`✅ SVG found for ${this.layerName} after ${attempts} attempts`);
                    resolve(svg);
                } else if (attempts >= maxAttempts) {
                    console.error(`❌ SVG not found for ${this.layerName} after ${timeout}ms`);
                    reject(new Error('SVG not found'));
                } else {
                    setTimeout(checkSVG, 50);
                }
            };
            checkSVG();
        });
    }

    /**
     * Position container exactly over SVG using getBoundingClientRect
     * @param {SVGElement} svg - The SVG element
     */
    positionContainerOverSVG(svg) {
        const rect = svg.getBoundingClientRect();
        const mainContent = document.querySelector('.main-content');
        const mainRect = mainContent ? mainContent.getBoundingClientRect() : { left: 0, top: 0 };

        // Position relative to main-content
        this.container.style.left = `${rect.left - mainRect.left}px`;
        this.container.style.top = `${rect.top - mainRect.top}px`;
        this.container.style.width = `${rect.width}px`;
        this.container.style.height = `${rect.height}px`;

        console.log(`📍 ${this.layerName} container positioned: ${rect.width}×${rect.height}px at (${rect.left - mainRect.left}, ${rect.top - mainRect.top})`);
    }

    /**
     * Ensure container exists
     */
    ensureContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = this.containerClass;
            this.container.id = this.containerClass;

            // Append to main content area
            const mainContent = document.querySelector('.main-content') || document.body;
            mainContent.appendChild(this.container);

            console.log(`✅ ${this.layerName} container created`);
        }
    }

    /**
     * Clear all items
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.items = [];
    }

    /**
     * Hide container
     */
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    /**
     * Show container
     */
    show() {
        if (this.container) {
            this.container.style.display = 'block';
        }
    }

    /**
     * Destroy component
     */
    destroy() {
        this.clear();
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }

    // ========================================
    // Abstract methods (must be implemented by subclasses)
    // ========================================

    /**
     * Render layer elements
     * @abstract
     */
    render() {
        throw new Error(`${this.constructor.name} must implement render() method`);
    }

    /**
     * Create a single item element
     * @abstract
     * @param {Object} data - Item data
     * @returns {HTMLElement}
     */
    createItem(data) {
        throw new Error(`${this.constructor.name} must implement createItem() method`);
    }

    /**
     * Get data for this layer
     * @abstract
     * @returns {Array}
     */
    getData() {
        throw new Error(`${this.constructor.name} must implement getData() method`);
    }
}
