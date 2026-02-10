/**
 * System Blocks Renderer
 * Renders information blocks for overlay-type layers
 * (pain, nervous, respiratory, cardiovascular, gadgets)
 */

import { getBlocksForLayer } from '../config/systemBlocks.js';

export class SystemBlocks {
    constructor() {
        this.container = null;
        this.currentLayer = null;
        this.blocks = [];
    }

    /**
     * Render blocks for a specific layer
     * @param {string} layerId - Layer identifier
     */
    render(layerId) {
        this.clear();
        this.currentLayer = layerId;

        const blocks = getBlocksForLayer(layerId);
        if (!blocks || blocks.length === 0) {
            console.log(`No blocks for layer: ${layerId}`);
            return;
        }

        // Create container if needed
        this.ensureContainer();

        // Render each block (hidden by default - will show on user interaction)
        blocks.forEach(blockData => {
            const blockElement = this.createBlock(blockData);
            // Hide blocks by default - they should only appear on click/hover
            blockElement.style.display = 'none';
            this.container.appendChild(blockElement);
            this.blocks.push({ data: blockData, element: blockElement });
        });

        console.log(`Rendered ${blocks.length} blocks for layer: ${layerId} (hidden by default)`);
    }

    /**
     * Ensure container exists
     */
    ensureContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'system-blocks-container';
            this.container.id = 'system-blocks-container';

            // Append to main content area
            const mainContent = document.querySelector('.main-content') ||
                               document.querySelector('.mobile-view-container') ||
                               document.body;
            mainContent.appendChild(this.container);
        }
    }

    /**
     * Create block element
     * @param {Object} blockData - Block data
     * @returns {HTMLElement} Block element
     */
    createBlock(blockData) {
        const block = document.createElement('div');
        block.className = `system-block block-type-${blockData.type}`;
        block.dataset.blockId = blockData.id;

        // Position block
        if (blockData.position) {
            block.style.left = `${blockData.position.x}px`;
            block.style.top = `${blockData.position.y}px`;
        }

        // Create header
        const header = this.createBlockHeader(blockData);
        block.appendChild(header);

        // Create content
        const content = this.createBlockContent(blockData);
        block.appendChild(content);

        // Add click handler
        block.addEventListener('click', () => {
            this.onBlockClick(blockData);
        });

        return block;
    }

    /**
     * Create block header
     * @param {Object} blockData - Block data
     * @returns {HTMLElement} Header element
     */
    createBlockHeader(blockData) {
        const header = document.createElement('div');
        header.className = 'block-header';

        // Icon (if available)
        if (blockData.icon) {
            const icon = document.createElement('span');
            icon.className = 'block-icon';
            icon.textContent = blockData.icon;
            header.appendChild(icon);
        }

        // Title
        const title = document.createElement('h3');
        title.className = 'block-title';
        title.textContent = blockData.title;
        header.appendChild(title);

        return header;
    }

    /**
     * Create block content
     * @param {Object} blockData - Block data
     * @returns {HTMLElement} Content element
     */
    createBlockContent(blockData) {
        const content = document.createElement('div');
        content.className = 'block-content';

        // Main content text
        if (blockData.content) {
            const text = document.createElement('p');
            text.textContent = blockData.content;
            content.appendChild(text);
        }

        // Lists (causes, symptoms, tips, etc.)
        if (blockData.causes) {
            content.appendChild(this.createList('Причины:', blockData.causes));
        }
        if (blockData.symptoms) {
            content.appendChild(this.createList('Симптомы:', blockData.symptoms));
        }
        if (blockData.tips) {
            content.appendChild(this.createList('Советы:', blockData.tips));
        }
        if (blockData.links) {
            content.appendChild(this.createList('Связи:', blockData.links));
        }

        // Metrics
        if (blockData.metrics) {
            content.appendChild(this.createMetrics(blockData.metrics));
        }

        return content;
    }

    /**
     * Create list element
     * @param {string} title - List title
     * @param {Array} items - List items
     * @returns {HTMLElement} List element
     */
    createList(title, items) {
        const container = document.createElement('div');
        container.className = 'block-list-container';

        const titleEl = document.createElement('h4');
        titleEl.textContent = title;
        titleEl.style.fontSize = '0.85rem';
        titleEl.style.fontWeight = '600';
        titleEl.style.marginTop = '12px';
        titleEl.style.marginBottom = '6px';
        container.appendChild(titleEl);

        const list = document.createElement('ul');
        list.className = 'block-list';

        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });

        container.appendChild(list);
        return container;
    }

    /**
     * Create metrics display
     * @param {Object} metrics - Metrics object
     * @returns {HTMLElement} Metrics element
     */
    createMetrics(metrics) {
        const container = document.createElement('div');
        container.className = 'block-metrics';

        Object.entries(metrics).forEach(([key, value]) => {
            const item = document.createElement('div');
            item.className = 'metric-item';

            const label = document.createElement('span');
            label.className = 'metric-label';
            label.textContent = this.formatMetricLabel(key);

            const valueEl = document.createElement('span');
            valueEl.className = 'metric-value';
            valueEl.textContent = value;

            item.appendChild(label);
            item.appendChild(valueEl);
            container.appendChild(item);
        });

        return container;
    }

    /**
     * Format metric label
     * @param {string} key - Metric key
     * @returns {string} Formatted label
     */
    formatMetricLabel(key) {
        const labels = {
            capacity: 'Объём:',
            vo2max: 'VO2 max:',
            respiratoryRate: 'Частота:',
            restingHR: 'ЧСС покоя:',
            maxHR: 'Макс ЧСС:',
            strokeVolume: 'Ударный объём:'
        };
        return labels[key] || key;
    }

    /**
     * Handle block click
     * @param {Object} blockData - Block data
     */
    onBlockClick(blockData) {
        console.log('Block clicked:', blockData);

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('blockClick', {
            detail: { block: blockData }
        }));

        // TODO: Show detailed view in sidebar/modal
    }

    /**
     * Clear all blocks
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.blocks = [];
        this.currentLayer = null;
    }

    /**
     * Hide blocks
     */
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    /**
     * Show blocks
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
