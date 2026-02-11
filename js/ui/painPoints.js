/**
 * Pain Points Renderer
 * Displays pulsating red circles with callouts on the body map
 * Extends BaseLayerRenderer for common functionality
 */

import { BaseLayerRenderer } from '../core/BaseLayerRenderer.js';
import { getPainPoints } from '../config/painPointsData.js';
import { DetailView } from './DetailView.js';

export class PainPoints extends BaseLayerRenderer {
    constructor() {
        super('pain', 'pain-points-container');
        this.detailView = new DetailView();
    }

    /**
     * Get data for pain layer
     * @returns {Array} Pain points data
     */
    getData() {
        return getPainPoints();
    }

    /**
     * Render pain points on the SVG
     */
    render() {
        console.log('🎯 PainPoints.render() called');
        this.clear();

        const painPoints = this.getData();
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
                    const pointElement = this.createItem(point);
                    this.container.appendChild(pointElement);
                    this.items.push({ data: point, element: pointElement });
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
     * Create pain point element
     * @param {Object} pointData - Pain point data
     * @returns {HTMLElement} Point element
     */
    createItem(pointData) {
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
     * Handle point click - show detail view
     * @param {Object} pointData - Pain point data
     */
    onPointClick(pointData) {
        console.log('Pain point clicked:', pointData.title);

        // Show detail view
        this.detailView.show({
            title: pointData.title,
            content: pointData.content,
            onClose: () => {
                console.log('Detail view closed');
            }
        });
    }

    /**
     * Destroy component
     */
    destroy() {
        // Destroy detail view
        if (this.detailView) {
            this.detailView.destroy();
        }

        // Call parent destroy
        super.destroy();
    }
}
