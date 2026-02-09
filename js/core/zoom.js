/**
 * Zoom and pan functionality
 */

// State
let zoomLevel = 0.9;
const minZoomLevel = 0.9;
const maxZoomLevel = 3;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX = 0;
let startY = 0;

/**
 * Setup zoom controls
 */
export function setupZoomControls() {
    document.getElementById('zoom-in').addEventListener('click', () => adjustZoom(0.2));
    document.getElementById('zoom-out').addEventListener('click', () => adjustZoom(-0.2));
    document.getElementById('zoom-reset').addEventListener('click', resetZoom);
}

/**
 * Setup pan and zoom for SVG wrapper
 * @param {HTMLElement} wrapper - SVG wrapper element
 */
export function setupPanZoom(wrapper) {
    wrapper.addEventListener('mousedown', (e) => {
        isPanning = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
        wrapper.style.cursor = 'grabbing';
    });

    wrapper.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        applyTransform();
    });

    wrapper.addEventListener('mouseup', () => {
        isPanning = false;
        wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('mouseleave', () => {
        isPanning = false;
        wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        adjustZoom(e.deltaY > 0 ? -0.1 : 0.1);
    });
}

/**
 * Adjust zoom level
 * @param {number} delta - Zoom delta
 */
function adjustZoom(delta) {
    zoomLevel = Math.max(minZoomLevel, Math.min(maxZoomLevel, zoomLevel + delta));
    applyTransform();
}

/**
 * Reset zoom and pan
 */
function resetZoom() {
    zoomLevel = minZoomLevel;
    panX = 0;
    panY = 0;
    applyTransform();
}

/**
 * Apply transform to both SVGs
 */
function applyTransform() {
    const transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
    const frontSvg = document.querySelector('#front-svg-wrapper svg');
    const backSvg = document.querySelector('#back-svg-wrapper svg');

    if (frontSvg) frontSvg.style.transform = transform;
    if (backSvg) backSvg.style.transform = transform;
}

/**
 * Initialize zoom (apply initial transform)
 */
export function initZoom() {
    applyTransform();
}
