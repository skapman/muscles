/**
 * Pain Points Renderer
 * Displays pulsating red circles with callouts on the body map
 */

import { getPainPoints } from '../config/painPointsData.js';

export class PainPoints {
    constructor() {
        this.container = null;
        this.points = [];
    }

    /**
     * Render pain points on the SVG
     */
    render() {
        console.log('🎯 PainPoints.render() called');
        this.clear();

        const painPoints = getPainPoints();
        if (!painPoints || painPoints.length === 0) {
            console.log('⚠️ No pain points to render');
            return;
        }

        console.log(`📊 Got ${painPoints.length} pain points, waiting for SVG...`);

        // Wait for SVG to load, then position container and render points
        this.waitForSVG()
            .then(svg => {
                console.log('✅ SVG found:', svg);
                this.ensureContainer();
                this.positionContainerOverSVG(svg);

                // Render each point
                painPoints.forEach(point => {
                    const pointElement = this.createPainPoint(point);
                    this.container.appendChild(pointElement);
                    this.points.push({ data: point, element: pointElement });
                });

                // Trigger fade-in animation
                requestAnimationFrame(() => {
                    this.container.classList.add('fade-in');
                });

                console.log(`✅ Rendered ${painPoints.length} pain points over SVG`);
            })
            .catch(error => {
                console.error('❌ Error rendering pain points:', error);
            });
    }

    /**
     * Wait for SVG to be loaded in DOM
     * @returns {Promise<SVGElement>}
     */
    waitForSVG() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 100; // 5 seconds max

            const checkSVG = () => {
                attempts++;

                const svg = document.querySelector('.svg-wrapper svg') ||
                           document.querySelector('.view-panel svg') ||
                           document.querySelector('.mobile-view-panel svg');

                if (svg && svg.getBoundingClientRect().width > 0) {
                    console.log(`✅ SVG found after ${attempts} attempts`);
                    resolve(svg);
                } else if (attempts >= maxAttempts) {
                    console.error('❌ SVG not found after 5 seconds');
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

        console.log(`📍 Container positioned: ${rect.width}×${rect.height}px at (${rect.left - mainRect.left}, ${rect.top - mainRect.top})`);
        console.log(`📍 Container element:`, this.container);
    }

    /**
     * Ensure container exists
     */
    ensureContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'pain-points-container';
            this.container.id = 'pain-points-container';

            // Append to main content area
            // Note: Coordinates are % based, so they scale with the container
            const mainContent = document.querySelector('.main-content') || document.body;
            mainContent.appendChild(this.container);

            console.log('✅ Pain points container attached to main-content');
        }
    }

    /**
     * Create pain point element
     * @param {Object} pointData - Pain point data
     * @returns {HTMLElement} Point element
     */
    createPainPoint(pointData) {
        const point = document.createElement('div');
        point.className = 'pain-point';
        point.dataset.pointId = pointData.id;

        // Position (% based)
        point.style.left = `${pointData.position.x}%`;
        point.style.top = `${pointData.position.y}%`;

        // Pulsating circle
        const circle = document.createElement('div');
        circle.className = 'pain-circle';
        point.appendChild(circle);

        // Callout with title (кликабельный)
        const callout = document.createElement('div');
        callout.className = `pain-callout ${pointData.calloutTop ? 'callout-top' : ''}`;
        callout.textContent = pointData.title;
        point.appendChild(callout);

        // Click handler для точки
        circle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onPointClick(pointData);
        });

        // Click handler для callout
        callout.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onPointClick(pointData);
        });

        return point;
    }

    /**
     * Handle point click - navigate to detail view
     * @param {Object} pointData - Pain point data
     */
    onPointClick(pointData) {
        console.log('Pain point clicked:', pointData.title);

        // Dispatch event for detail view
        window.dispatchEvent(new CustomEvent('painPointClick', {
            detail: { point: pointData }
        }));
    }

    /**
     * Clear all points
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.points = [];
    }

    /**
     * Hide points
     */
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    /**
     * Show points
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
}
