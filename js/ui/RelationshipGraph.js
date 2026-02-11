/**
 * Relationship Graph Visualization
 * Mobile-first graph visualization with D3.js force-directed layout
 * Features: touch gestures, depth slider, filters, bottom sheet
 */

import { DataResolver } from '../core/dataResolver.js';

export class RelationshipGraph {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }

        // Configuration
        this.options = {
            width: options.width || window.innerWidth,
            height: options.height || window.innerHeight - 200,
            maxDepth: options.maxDepth || 3,
            defaultDepth: options.defaultDepth || 2,
            maxNodesMobile: options.maxNodesMobile || 50,
            maxNodesDesktop: options.maxNodesDesktop || 200,
            enableDrag: options.enableDrag !== false,  // Enable by default
            // Physics parameters
            velocityDecay: options.velocityDecay || 0.4,  // 0-1, higher = smoother but slower
            alphaTarget: options.alphaTarget || 0.3,      // 0-1, simulation heat during drag
            alphaDecay: options.alphaDecay || 0.02,       // 0-1, how fast simulation cools
            ...options
        };

        // State
        this.currentDepth = this.options.defaultDepth;
        this.currentNode = null;
        this.graphData = { nodes: [], edges: [] };
        this.filters = {
            goals: true,
            exercises: true,
            muscles: true,
            pain: true
        };

        // Hover state
        this.hoveredNode = null;
        this.highlightedNodes = new Set();

        // Drag state
        this.draggedNode = null;
        this.currentThreshold = 0;

        // Mobile detection
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // D3.js simulation
        this.simulation = null;
        this.svg = null;
        this.canvas = null;
        this.ctx = null;

        // Touch state
        this.touchState = {
            initialDistance: 0,
            scale: 1,
            translateX: 0,
            translateY: 0
        };

        // Cache for performance
        this.graphCache = new Map();

        // Load CSS variables for visual parameters
        this.loadCSSVariables();

        this.init();
    }

    /**
     * Load visual parameters from CSS variables
     */
    loadCSSVariables() {
        const root = getComputedStyle(document.documentElement);

        this.visualParams = {
            edgeWidth: parseFloat(root.getPropertyValue('--graph-edge-width')) || 2,
            edgeOpacity: parseFloat(root.getPropertyValue('--graph-edge-opacity')) || 0.15,
            edgeColor: root.getPropertyValue('--graph-edge-color').trim() || '255, 255, 255',

            nodeStrokeWidth: parseFloat(root.getPropertyValue('--graph-node-stroke-width')) || 3,
            nodeStrokeColor: root.getPropertyValue('--graph-node-stroke-color').trim() || '#ffffff',

            labelFontWeight: root.getPropertyValue('--graph-label-font-weight').trim() || '300',
            labelFontSize: root.getPropertyValue('--graph-label-font-size').trim() || '11px',
            labelColor: root.getPropertyValue('--graph-label-color').trim() || '#ffffff',
            labelShadow: root.getPropertyValue('--graph-label-shadow').trim() || 'rgba(0, 0, 0, 0.8)',

            colors: {
                goals: root.getPropertyValue('--graph-color-goals').trim() || '#4caf50',
                exercises: root.getPropertyValue('--graph-color-exercises').trim() || '#00d4ff',
                muscles: root.getPropertyValue('--graph-color-muscles').trim() || '#ff5252',
                pain: root.getPropertyValue('--graph-color-pain').trim() || '#f44336'
            }
        };
    }

    /**
     * Initialize the graph visualization
     */
    init() {
        this.container.innerHTML = '';
        this.container.className = 'relationship-graph-container';

        // Create UI structure
        this.createControls();
        this.createGraphCanvas();
        this.createBottomSheet();
        this.createLegend();

        // Load D3.js if not already loaded
        this.loadD3().then(() => {
            console.log('D3.js loaded, ready to render graphs');
        });
    }

    /**
     * Create control panel with depth slider and filters
     */
    createControls() {
        const controls = document.createElement('div');
        controls.className = 'graph-controls';

        // Threshold slider (replaces depth slider)
        const sliderContainer = this.createThresholdSlider();
        controls.appendChild(sliderContainer);

        // Filter buttons
        const filterContainer = this.createFilterButtons();
        controls.appendChild(filterContainer);

        this.container.appendChild(controls);
    }

    /**
     * Create threshold slider (filter by connections)
     */
    createThresholdSlider() {
        const container = document.createElement('div');
        container.className = 'threshold-slider-container';

        const label = document.createElement('label');
        label.textContent = 'Порог связей: ';
        label.className = 'threshold-label';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '10';
        slider.value = '0';
        slider.className = 'threshold-slider';
        slider.id = 'threshold-slider';

        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'threshold-value';
        valueDisplay.id = 'threshold-value';
        valueDisplay.textContent = '0+ связей';

        // Throttled update for performance
        let updateTimeout;
        slider.addEventListener('input', (e) => {
            const threshold = parseInt(e.target.value);
            valueDisplay.textContent = `${threshold}+ связей`;

            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                this.filterByThreshold(threshold);
            }, 300); // 300ms throttle
        });

        container.appendChild(label);
        container.appendChild(slider);
        container.appendChild(valueDisplay);

        return container;
    }

    /**
     * Create filter buttons with icons
     */
    createFilterButtons() {
        const container = document.createElement('div');
        container.className = 'filter-buttons';

        const filterTypes = [
            { type: 'goals', icon: '🎯', label: 'Цели' },
            { type: 'exercises', icon: '🏋️', label: 'Упражнения' },
            { type: 'muscles', icon: '💪', label: 'Мышцы' },
            { type: 'pain', icon: '⚠️', label: 'Боли' }
        ];

        filterTypes.forEach(({ type, icon, label }) => {
            const button = document.createElement('button');
            button.className = `filter-btn ${this.filters[type] ? 'active' : ''}`;
            button.dataset.type = type;
            button.title = label;

            const iconSpan = document.createElement('span');
            iconSpan.className = 'filter-icon';
            iconSpan.textContent = icon;

            const count = document.createElement('span');
            count.className = 'filter-count';
            count.id = `filter-count-${type}`;
            count.textContent = '0';

            button.appendChild(iconSpan);
            button.appendChild(count);

            button.addEventListener('click', () => {
                this.toggleFilter(type);
                button.classList.toggle('active');
            });

            container.appendChild(button);
        });

        return container;
    }

    /**
     * Create graph canvas/SVG
     */
    createGraphCanvas() {
        const graphContainer = document.createElement('div');
        graphContainer.className = 'graph-canvas-container';
        graphContainer.id = 'graph-canvas-container';

        // Always use Canvas for now (SVG not implemented yet)
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.canvas.className = 'graph-canvas';
        this.ctx = this.canvas.getContext('2d');
        graphContainer.appendChild(this.canvas);

        // Add touch event listeners
        this.setupTouchGestures();

        this.container.appendChild(graphContainer);
    }

    /**
     * Create bottom sheet for mobile node details
     */
    createBottomSheet() {
        const sheet = document.createElement('div');
        sheet.className = 'graph-bottom-sheet';
        sheet.id = 'graph-bottom-sheet';

        const handle = document.createElement('div');
        handle.className = 'sheet-handle';

        const content = document.createElement('div');
        content.className = 'sheet-content';
        content.id = 'graph-sheet-content';

        sheet.appendChild(handle);
        sheet.appendChild(content);

        // Swipe to close
        let startY = 0;
        handle.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });

        handle.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            if (diff > 0) {
                sheet.style.transform = `translateY(${diff}px)`;
            }
        });

        handle.addEventListener('touchend', (e) => {
            const currentY = e.changedTouches[0].clientY;
            const diff = currentY - startY;
            if (diff > 100) {
                this.closeBottomSheet();
            } else {
                sheet.style.transform = '';
            }
        });

        this.container.appendChild(sheet);
    }

    /**
     * Create legend
     */
    createLegend() {
        const legend = document.createElement('div');
        legend.className = 'graph-legend';

        const items = [
            { icon: '🎯', label: 'Цели', color: '#4CAF50' },
            { icon: '🏋️', label: 'Упражнения', color: '#2196F3' },
            { icon: '💪', label: 'Мышцы', color: '#FF9800' },
            { icon: '⚠️', label: 'Боли', color: '#F44336' }
        ];

        items.forEach(({ icon, label, color }) => {
            const item = document.createElement('div');
            item.className = 'legend-item';

            const dot = document.createElement('span');
            dot.className = 'legend-dot';
            dot.style.backgroundColor = color;

            const text = document.createElement('span');
            text.textContent = `${icon} ${label}`;

            item.appendChild(dot);
            item.appendChild(text);
            legend.appendChild(item);
        });

        this.container.appendChild(legend);
    }

    /**
     * Setup touch gestures for mobile and mouse events for desktop
     */
    setupTouchGestures() {
        if (!this.canvas) return;

        // Track touch position for pan and drag
        let lastTouchX = 0;
        let lastTouchY = 0;
        let isTouching = false;
        let draggedNode = null;
        let hasMoved = false;

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                this.touchState.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
                isTouching = false;
                draggedNode = null;
            } else if (e.touches.length === 1) {
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;

                // Check if touching a node
                const node = this.findNodeAtPosition(x, y);

                if (node && this.options.enableDrag) {
                    // Start dragging node
                    draggedNode = node;
                    node.fx = node.x;
                    node.fy = node.y;
                    // Reheat simulation with configured alpha
                    this.simulation.alphaTarget(this.options.alphaTarget).restart();
                    hasMoved = false;
                } else {
                    // Start panning
                    isTouching = true;
                    hasMoved = false;
                }

                lastTouchX = touch.clientX;
                lastTouchY = touch.clientY;
            }
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            hasMoved = true;

            if (e.touches.length === 2) {
                // Pinch zoom
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const scale = currentDistance / this.touchState.initialDistance;
                this.touchState.scale *= scale;
                this.touchState.initialDistance = currentDistance;
                this.render();
            } else if (e.touches.length === 1) {
                const touch = e.touches[0];
                const dx = touch.clientX - lastTouchX;
                const dy = touch.clientY - lastTouchY;

                if (draggedNode) {
                    // Drag node
                    const scale = this.touchState.scale;
                    draggedNode.fx += dx / scale;
                    draggedNode.fy += dy / scale;
                } else if (isTouching) {
                    // Pan graph
                    this.touchState.translateX += dx;
                    this.touchState.translateY += dy;
                    this.render();
                }

                lastTouchX = touch.clientX;
                lastTouchY = touch.clientY;
            }
        });

        // Double tap to reset zoom
        let lastTap = 0;
        let tapTimeout;
        this.canvas.addEventListener('touchend', (e) => {
            // Release dragged node
            if (draggedNode) {
                draggedNode.fx = null;
                draggedNode.fy = null;
                this.simulation.alphaTarget(0);
                draggedNode = null;
            }

            isTouching = false;

            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;

            if (tapLength < 300 && tapLength > 0) {
                // Double tap detected
                clearTimeout(tapTimeout);
                this.resetZoom();
                lastTap = 0;
            } else if (!hasMoved) {
                // Single tap without movement - check if it's on a node
                lastTap = currentTime;
                tapTimeout = setTimeout(() => {
                    if (e.changedTouches.length === 1) {
                        const touch = e.changedTouches[0];
                        const rect = this.canvas.getBoundingClientRect();
                        const x = touch.clientX - rect.left;
                        const y = touch.clientY - rect.top;
                        this.handleNodeTap(x, y);
                    }
                }, 300);
            }
        });

        // Mouse events for desktop
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleNodeTap(x, y);
        });

        // Mouse hover for highlighting
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isMobile) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const node = this.findNodeAtPosition(x, y);

                if (node !== this.hoveredNode) {
                    this.hoveredNode = node;
                    if (node) {
                        this.highlightConnectedNodes(node);
                        this.canvas.style.cursor = 'pointer';
                    } else {
                        this.clearHighlight();
                        this.canvas.style.cursor = 'grab';
                    }
                    this.render();
                }
            }
        });

        // Mouse wheel zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.touchState.scale *= delta;
            this.render();
        });

        // Mouse drag for nodes and pan
        let isDraggingCanvas = false;
        let draggedMouseNode = null;
        let lastX = 0;
        let lastY = 0;

        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check if clicking on a node
            const node = this.findNodeAtPosition(x, y);

            if (node && this.options.enableDrag) {
                // Start dragging node
                draggedMouseNode = node;
                node.fx = node.x;
                node.fy = node.y;
                this.simulation.alphaTarget(this.options.alphaTarget).restart();
            } else {
                // Start dragging canvas
                isDraggingCanvas = true;
                this.canvas.style.cursor = 'grabbing';
            }

            lastX = e.clientX;
            lastY = e.clientY;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (draggedMouseNode) {
                // Drag node
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const scale = this.touchState.scale;
                const dx = (x - (lastX - rect.left)) / scale;
                const dy = (y - (lastY - rect.top)) / scale;

                draggedMouseNode.fx += dx;
                draggedMouseNode.fy += dy;

                lastX = e.clientX;
                lastY = e.clientY;
            } else if (isDraggingCanvas) {
                // Drag canvas
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                this.touchState.translateX += dx;
                this.touchState.translateY += dy;
                lastX = e.clientX;
                lastY = e.clientY;
                this.render();
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            if (draggedMouseNode) {
                draggedMouseNode.fx = null;
                draggedMouseNode.fy = null;
                this.simulation.alphaTarget(0);
                draggedMouseNode = null;
            }
            isDraggingCanvas = false;
            this.canvas.style.cursor = 'grab';
        });

        this.canvas.addEventListener('mouseleave', () => {
            if (draggedMouseNode) {
                draggedMouseNode.fx = null;
                draggedMouseNode.fy = null;
                this.simulation.alphaTarget(0);
                draggedMouseNode = null;
            }
            isDraggingCanvas = false;
            this.canvas.style.cursor = 'grab';
        });

        // Set initial cursor
        this.canvas.style.cursor = 'grab';
    }

    /**
     * Get distance between two touch points
     */
    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Handle node tap
     */
    handleNodeTap(x, y) {
        const node = this.findNodeAtPosition(x, y);
        if (node) {
            this.showNodeDetails(node);
        }
    }

    /**
     * Find node at position
     */
    findNodeAtPosition(x, y) {
        if (!this.graphData.nodes) return null;

        // Account for zoom and pan
        const adjustedX = (x - this.touchState.translateX) / this.touchState.scale;
        const adjustedY = (y - this.touchState.translateY) / this.touchState.scale;

        return this.graphData.nodes.find(node => {
            const dx = node.x - adjustedX;
            const dy = node.y - adjustedY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < 25; // Node radius
        });
    }

    /**
     * Show node details in bottom sheet
     */
    showNodeDetails(node) {
        const sheet = document.getElementById('graph-bottom-sheet');
        const content = document.getElementById('graph-sheet-content');

        const data = node.data;
        const typeIcons = {
            goals: '🎯',
            exercises: '🏋️',
            muscles: '💪',
            pain: '⚠️'
        };

        content.innerHTML = `
            <div class="node-details">
                <div class="node-header">
                    <span class="node-icon">${typeIcons[node.type] || '•'}</span>
                    <h3>${data.title || data.name || 'Unknown'}</h3>
                </div>
                <p class="node-subtitle">${data.titleEn || data.nameEn || ''}</p>
                <div class="node-description">
                    ${data.description || data.content || 'No description available'}
                </div>
                <button class="btn-focus" data-type="${node.type}" data-id="${data.id}">
                    Фокус на этом узле
                </button>
            </div>
        `;

        // Add focus button handler
        const focusBtn = content.querySelector('.btn-focus');
        focusBtn.addEventListener('click', () => {
            this.show(node.type, data.id);
            this.closeBottomSheet();
        });

        sheet.classList.add('active');
    }

    /**
     * Close bottom sheet
     */
    closeBottomSheet() {
        const sheet = document.getElementById('graph-bottom-sheet');
        sheet.classList.remove('active');
    }

    /**
     * Reset zoom and pan
     */
    resetZoom() {
        this.touchState.scale = 1;
        this.touchState.translateX = 0;
        this.touchState.translateY = 0;
        this.render();
    }

    /**
     * Toggle filter
     */
    toggleFilter(type) {
        this.filters[type] = !this.filters[type];
        this.applyFilters();
    }

    /**
     * Filter by threshold (minimum connections)
     */
    filterByThreshold(minConnections) {
        if (!this.graphData.nodes) return;

        this.currentThreshold = minConnections;

        this.graphData.nodes.forEach(node => {
            const connections = this.graphData.edges.filter(edge => {
                const sourceId = edge.source?.id || edge.source;
                const targetId = edge.target?.id || edge.target;
                return sourceId === node.id || targetId === node.id;
            }).length;

            // Node visible if it has enough connections AND type filter is on
            node.visible = connections >= minConnections && this.filters[node.type] !== false;
        });

        this.applyFilters();
    }

    /**
     * Apply filters to graph
     */
    applyFilters() {
        if (!this.graphData.nodes) return;

        // Filter edges (hide if either node is hidden)
        this.graphData.edges.forEach(edge => {
            const sourceId = edge.source?.id || edge.source;
            const targetId = edge.target?.id || edge.target;
            const fromNode = this.graphData.nodes.find(n => n.id === sourceId);
            const toNode = this.graphData.nodes.find(n => n.id === targetId);
            edge.visible = fromNode?.visible && toNode?.visible;
        });

        this.render();
        this.updateFilterCounts();
    }

    /**
     * Update filter counts
     */
    updateFilterCounts() {
        Object.keys(this.filters).forEach(type => {
            const count = this.graphData.nodes.filter(n => n.type === type && n.visible).length;
            const countEl = document.getElementById(`filter-count-${type}`);
            if (countEl) {
                countEl.textContent = count;
            }
        });
    }

    /**
     * Get level text for depth slider
     */
    getLevelText(depth) {
        const texts = {
            1: 'уровень',
            2: 'уровня',
            3: 'уровня'
        };
        return texts[depth] || 'уровней';
    }

    /**
     * Load D3.js library
     */
    async loadD3() {
        if (window.d3) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://d3js.org/d3.v7.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Show graph for entity
     */
    async show(entityType, entityId, depth = 2) {
        await this.loadD3();

        this.currentNode = { type: entityType, id: entityId };

        // Get or build graph
        const cacheKey = `${entityType}:${entityId}:${depth}`;
        let graphData = this.graphCache.get(cacheKey);

        if (!graphData) {
            graphData = DataResolver.buildRelationshipGraph(entityType, entityId, depth);
            this.graphCache.set(cacheKey, graphData);
        }

        this.graphData = graphData;

        // Reset threshold slider
        const slider = document.getElementById('threshold-slider');
        if (slider) slider.value = '0';

        const valueDisplay = document.getElementById('threshold-value');
        if (valueDisplay) {
            valueDisplay.textContent = '0+ связей';
        }

        // Reset threshold
        this.currentThreshold = 0;

        // Check node limit
        const maxNodes = this.isMobile ? this.options.maxNodesMobile : this.options.maxNodesDesktop;
        if (graphData.nodes.length > maxNodes) {
            this.showWarning(`Слишком много узлов (${graphData.nodes.length}). Используйте фильтры или порог связей.`);
        }

        // Apply filters with threshold 0 (show all)
        this.filterByThreshold(0);
        this.renderGraph();
    }

    /**
     * Show all goals and their relationships
     */
    async showAllGoals(depth = 1) {
        await this.loadD3();

        this.currentNode = { type: 'goals', id: 'all' };

        // Get all goals
        const allGoals = DataResolver.getAllEntities('goals');

        // Build combined graph
        const combinedNodes = new Map();
        const combinedEdges = [];

        allGoals.forEach(goal => {
            const goalGraph = DataResolver.buildRelationshipGraph('goals', goal.id, depth);

            // Add nodes
            goalGraph.nodes.forEach(node => {
                if (!combinedNodes.has(node.id)) {
                    combinedNodes.set(node.id, node);
                }
            });

            // Add edges
            goalGraph.edges.forEach(edge => {
                // Check if edge already exists
                const edgeExists = combinedEdges.some(e =>
                    e.from === edge.from && e.to === edge.to
                );
                if (!edgeExists) {
                    combinedEdges.push(edge);
                }
            });
        });

        this.graphData = {
            nodes: Array.from(combinedNodes.values()),
            edges: combinedEdges
        };

        // Reset threshold slider
        const slider = document.getElementById('threshold-slider');
        if (slider) slider.value = '0';

        const valueDisplay = document.getElementById('threshold-value');
        if (valueDisplay) {
            valueDisplay.textContent = '0+ связей';
        }

        // Reset threshold
        this.currentThreshold = 0;

        console.log(`All goals graph: ${this.graphData.nodes.length} nodes, ${this.graphData.edges.length} edges`);

        // Apply filters with threshold 0 (show all)
        this.filterByThreshold(0);
        this.renderGraph();
    }

    /**
     * Update graph with new depth
     */
    updateGraph(entityType, entityId, depth) {
        this.show(entityType, entityId, depth);
    }

    /**
     * Render graph with D3.js force simulation
     */
    renderGraph() {
        if (!window.d3) {
            console.error('D3.js not loaded');
            return;
        }

        if (this.canvas) {
            this.renderCanvasGraph();
        } else if (this.svg) {
            this.renderSVGGraph();
        }
    }

    /**
     * Render graph on Canvas (mobile-optimized)
     */
    renderCanvasGraph() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Stop previous simulation if exists
        if (this.simulation) {
            this.simulation.stop();
        }

        // Debug: log all nodes
        console.log('All nodes:', this.graphData.nodes.map(n => ({ id: n.id, type: n.type })));

        // Validate nodes
        const nodeIds = new Set();
        this.graphData.nodes.forEach(node => {
            if (!node.id) {
                console.error('Node without ID:', node);
            } else {
                nodeIds.add(node.id);
            }
        });

        // Debug: log all edges
        console.log('All edges:', this.graphData.edges.map(e => ({
            from: e.from || e.source?.id || e.source,
            to: e.to || e.target?.id || e.target
        })));

        // Convert edges to D3 format with source/target instead of from/to
        const d3Edges = this.graphData.edges.map(edge => {
            // Handle both formats: {from, to} and {source, target}
            const sourceId = edge.from || edge.source?.id || edge.source;
            const targetId = edge.to || edge.target?.id || edge.target;

            return {
                source: sourceId,
                target: targetId,
                type: edge.type,
                label: edge.label
            };
        });

        // Validate edges
        const validEdges = d3Edges.filter(edge => {
            if (!edge.source || !edge.target) {
                console.error('Edge without source/target:', edge);
                return false;
            }
            if (!nodeIds.has(edge.source)) {
                console.error(`Edge references non-existent node (source): ${edge.source}`, edge);
                return false;
            }
            if (!nodeIds.has(edge.target)) {
                console.error(`Edge references non-existent node (target): ${edge.target}`, edge);
                return false;
            }
            return true;
        });

        console.log(`Graph: ${this.graphData.nodes.length} nodes, ${validEdges.length}/${d3Edges.length} valid edges`);

        // Adjust forces based on number of nodes
        const nodeCount = this.graphData.nodes.length;
        const linkDistance = nodeCount > 20 ? 35 : 60;  // Very close for many nodes
        const chargeStrength = nodeCount > 20 ? -100 : -200;  // Weak repulsion

        // Limit repulsion to ~2x link distance (very compact)
        const maxRepulsionDistance = linkDistance * 2;

        // Create force simulation with converted edges
        this.simulation = d3.forceSimulation(this.graphData.nodes)
            .force('link', d3.forceLink(validEdges)
                .id(d => d.id)
                .distance(linkDistance)
                .strength(1))  // Strong link force
            .force('charge', d3.forceManyBody()
                .strength(chargeStrength)
                .distanceMax(maxRepulsionDistance))  // Very limited repulsion
            .force('x', d3.forceX(width / 2)
                .strength(0.05))  // Weak horizontal centering
            .force('y', d3.forceY(height / 2)
                .strength(0.15))  // Stronger vertical centering (vertical layout)
            .force('collide', d3.forceCollide()
                .radius(25)
                .strength(0.9))  // Strong collision prevention
            .velocityDecay(this.options.velocityDecay)
            .alphaDecay(this.options.alphaDecay)
            .alphaMin(0.001);

        // Update edges reference to use valid edges
        this.graphData.edges = validEdges;

        // Setup drag behavior if enabled
        if (this.options.enableDrag) {
            this.setupNodeDrag();
        }

        // Track tick count for auto-zoom
        let tickCount = 0;
        let hasAutoZoomed = false;

        // Render on each tick
        this.simulation.on('tick', () => {
            this.render();

            // Auto-zoom after 50 ticks (early, while still animating)
            tickCount++;
            if (tickCount === 50 && !hasAutoZoomed) {
                hasAutoZoomed = true;
                this.autoZoomToFit();
            }
        });

        // Also auto-zoom on end
        this.simulation.on('end', () => {
            if (!hasAutoZoomed) {
                this.autoZoomToFit();
            }
        });
    }

    /**
     * Auto-zoom to fit all nodes in viewport
     */
    autoZoomToFit() {
        if (!this.graphData.nodes || this.graphData.nodes.length === 0) return;

        // Find bounding box of all visible nodes
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        this.graphData.nodes.forEach(node => {
            if (node.visible && node.x && node.y) {
                minX = Math.min(minX, node.x);
                maxX = Math.max(maxX, node.x);
                minY = Math.min(minY, node.y);
                maxY = Math.max(maxY, node.y);
            }
        });

        if (!isFinite(minX)) return;

        // Add padding
        const padding = 100;
        const graphWidth = maxX - minX + padding * 2;
        const graphHeight = maxY - minY + padding * 2;

        // Calculate scale to fit
        const scaleX = this.canvas.width / graphWidth;
        const scaleY = this.canvas.height / graphHeight;
        const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 1x

        // Apply zoom
        this.touchState.scale = scale;
        this.touchState.translateX = 0;
        this.touchState.translateY = 0;

        this.render();
    }

    /**
     * Setup node dragging for desktop
     */
    setupNodeDrag() {
        if (!this.canvas) return;

        let dragNode = null;
        let dragStartX = 0;
        let dragStartY = 0;

        const dragStart = (e) => {
            if (e.touches) return; // Skip for touch (handled in setupTouchGestures)

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            dragNode = this.findNodeAtPosition(x, y);

            if (dragNode) {
                dragStartX = x;
                dragStartY = y;

                // Fix node position during drag
                dragNode.fx = dragNode.x;
                dragNode.fy = dragNode.y;

                // Reheat simulation
                this.simulation.alphaTarget(this.options.alphaTarget).restart();

                e.preventDefault();
            }
        };

        const drag = (e) => {
            if (!dragNode || e.touches) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Account for zoom and pan
            const scale = this.touchState.scale;
            const dx = (x - dragStartX) / scale;
            const dy = (y - dragStartY) / scale;

            dragNode.fx += dx;
            dragNode.fy += dy;

            dragStartX = x;
            dragStartY = y;

            e.preventDefault();
        };

        const dragEnd = () => {
            if (dragNode) {
                // Release node
                dragNode.fx = null;
                dragNode.fy = null;

                // Cool down simulation
                this.simulation.alphaTarget(0);

                dragNode = null;
            }
        };

        // Mouse events only (touch handled separately)
        this.canvas.addEventListener('mousedown', dragStart);
        this.canvas.addEventListener('mousemove', drag);
        this.canvas.addEventListener('mouseup', dragEnd);
        this.canvas.addEventListener('mouseleave', dragEnd);
    }

    /**
     * Render current state to canvas
     */
    render() {
        if (!this.ctx || !this.graphData.nodes) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Apply transformations
        ctx.save();

        // First translate to center, then apply user transforms, then scale
        ctx.translate(width / 2, height / 2);
        ctx.scale(this.touchState.scale, this.touchState.scale);
        ctx.translate(this.touchState.translateX / this.touchState.scale, this.touchState.translateY / this.touchState.scale);
        ctx.translate(-width / 2, -height / 2);

        // Draw edges (D3 converts source/target to node objects)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;  // Жирнее в 2 раза
        this.graphData.edges.forEach(edge => {
            if (edge.visible === false) return;

            // D3 converts source/target from IDs to node objects
            const source = edge.source;
            const target = edge.target;

            if (source && target && source.x && source.y && target.x && target.y) {
                ctx.beginPath();
                ctx.moveTo(source.x, source.y);
                ctx.lineTo(target.x, target.y);
                ctx.stroke();
            }
        });

        // Draw nodes
        this.graphData.nodes.forEach(node => {
            if (!node.visible || !node.x || !node.y) return;

            const isHighlighted = this.highlightedNodes.has(node.id);
            const isHovered = this.hoveredNode === node;
            const isDimmed = this.hoveredNode && !isHighlighted;

            const color = this.getNodeColor(node.type);
            let radius = this.getNodeRadius(node);

            // Увеличение при hover
            if (isHovered) {
                radius *= 1.2;
            }

            // Затемнение несвязанных
            const opacity = isDimmed ? 0.3 : 1.0;

            // Node circle
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();

            // Подсветка границы только для hovered
            if (isHovered) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            ctx.globalAlpha = 1.0;

            // Node label with shadow for readability
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 6;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;
            ctx.font = '300 11px Inter, sans-serif';  // Thin, compact font
            ctx.textAlign = 'center';
            const label = (node.data.title || node.data.name || '').substring(0, 15);
            ctx.fillText(label, node.x, node.y + radius + 16);

            // Reset shadow
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
        });

        ctx.restore();
    }

    /**
     * Get node color by type (using existing palette)
     */
    getNodeColor(type) {
        const colors = {
            goals: '#4caf50',      // var(--layer-respiratory)
            exercises: '#00d4ff',  // var(--layer-muscles)
            muscles: '#ff5252',    // var(--layer-pain)
            pain: '#f44336'        // var(--layer-cardiovascular)
        };
        return colors[type] || '#999';
    }

    /**
     * Get node radius based on connections
     */
    getNodeRadius(node) {
        // Count connections
        const connections = this.graphData.edges.filter(edge => {
            const sourceId = edge.source?.id || edge.source;
            const targetId = edge.target?.id || edge.target;
            return sourceId === node.id || targetId === node.id;
        }).length;

        // Formula: base + connections bonus
        const baseSize = 15;
        const connectionBonus = connections * 3;
        const maxSize = 50;

        return Math.min(baseSize + connectionBonus, maxSize);
    }

    /**
     * Highlight connected nodes
     */
    highlightConnectedNodes(selectedNode) {
        this.highlightedNodes.clear();
        this.highlightedNodes.add(selectedNode.id);

        this.graphData.edges.forEach(edge => {
            const sourceId = edge.source?.id || edge.source;
            const targetId = edge.target?.id || edge.target;

            if (sourceId === selectedNode.id) {
                this.highlightedNodes.add(targetId);
            }
            if (targetId === selectedNode.id) {
                this.highlightedNodes.add(sourceId);
            }
        });
    }

    /**
     * Clear highlight
     */
    clearHighlight() {
        this.highlightedNodes.clear();
        this.hoveredNode = null;
    }

    /**
     * Render graph on SVG (desktop)
     */
    renderSVGGraph() {
        // TODO: Implement SVG rendering for desktop
        console.log('SVG rendering not yet implemented');
    }

    /**
     * Show warning message
     */
    showWarning(message) {
        const warning = document.createElement('div');
        warning.className = 'graph-warning';
        warning.textContent = message;
        this.container.appendChild(warning);

        setTimeout(() => {
            warning.remove();
        }, 5000);
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.graphCache.clear();
    }

    /**
     * Destroy graph and cleanup
     */
    destroy() {
        if (this.simulation) {
            this.simulation.stop();
        }
        this.container.innerHTML = '';
        this.clearCache();
    }
}
