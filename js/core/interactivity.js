/**
 * Muscle interactivity and highlighting
 */

import { muscleData } from '../config/muscleData.js';
import { muscleIdMap } from '../config/muscleIdMap.js';
import { showTooltip, hideTooltip, updateTooltipPosition } from '../ui/tooltip.js';
import { showMuscleDetails } from '../ui/sidebar.js';
import { isMobile, registerMuscleElements } from '../core/mobile.js';

// Store all muscle elements grouped by muscle key
let allMuscleElements = {};

/**
 * Setup interactive behavior for SVG muscles
 * @param {SVGElement} svg - SVG element
 * @param {string} view - View identifier ('front' or 'back')
 */
export function setupInteractivity(svg, view) {
    Object.keys(muscleIdMap).forEach(elementId => {
        const muscleElement = svg.querySelector(`#${elementId}`);

        if (muscleElement) {
            const muscleKey = muscleIdMap[elementId];

            muscleElement.classList.add('muscle-interactive');
            muscleElement.dataset.muscle = muscleKey;
            muscleElement.dataset.elementId = elementId;

            // Store for cross-view highlighting
            if (!allMuscleElements[muscleKey]) {
                allMuscleElements[muscleKey] = [];
            }
            allMuscleElements[muscleKey].push(muscleElement);

            // Hover: highlight all parts of muscle (desktop only)
            if (!isMobile()) {
                muscleElement.addEventListener('mouseenter', function(e) {
                    highlightMuscleGroup(muscleKey, true);
                    showTooltip(e, muscleKey);
                });

                muscleElement.addEventListener('mouseleave', function() {
                    highlightMuscleGroup(muscleKey, false);
                    hideTooltip();
                });

                muscleElement.addEventListener('mousemove', function(e) {
                    updateTooltipPosition(e);
                });

                // Click: show details (desktop)
                muscleElement.addEventListener('click', function() {
                    showMuscleDetails(muscleKey);
                });
            }
            // Mobile: click handled in mobile.js

            console.log(`Initialized: ${elementId} -> ${muscleKey}`);
        } else {
            console.warn(`Element #${elementId} not found in ${view}`);
        }
    });

    // Register elements with mobile module
    if (isMobile()) {
        registerMuscleElements(allMuscleElements);
    }
}

/**
 * Highlight all elements of a muscle group (both views)
 * @param {string} muscleKey - Muscle identifier
 * @param {boolean} highlight - True to highlight, false to remove
 */
function highlightMuscleGroup(muscleKey, highlight) {
    const elements = allMuscleElements[muscleKey];
    if (!elements) return;

    elements.forEach(element => {
        if (highlight) {
            element.classList.add('highlighted');
        } else {
            element.classList.remove('highlighted');
        }
    });
}
