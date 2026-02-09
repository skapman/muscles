/**
 * SVG loading and initialization
 */

/**
 * Load SVG file and auto-generate IDs for path elements
 * @param {string} url - SVG file URL
 * @param {string} containerId - Container element ID
 * @returns {Promise<SVGElement|null>}
 */
export async function loadSVG(url, containerId) {
    try {
        const response = await fetch(url);
        const svgText = await response.text();
        const container = document.getElementById(containerId);
        container.innerHTML = svgText;
        const svg = container.querySelector('svg');

        if (svg) {
            const view = containerId.includes('front') ? 'front' : 'back';
            const paths = svg.querySelectorAll('path');
            paths.forEach((path, index) => {
                if (!path.id) {
                    path.id = `${view}-path-${index}`;
                }
            });
            console.log(`Loaded ${paths.length} paths in ${view} view`);
        }

        return svg;
    } catch (error) {
        console.error(`Error loading SVG from ${url}:`, error);
        return null;
    }
}
