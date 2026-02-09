/**
 * Tooltip functionality
 */

import { muscleData } from '../config/muscleData.js';

/**
 * Show tooltip with muscle info
 * @param {MouseEvent} event - Mouse event
 * @param {string} muscleKey - Muscle identifier
 */
export function showTooltip(event, muscleKey) {
    const data = muscleData[muscleKey];
    if (!data) return;

    const tooltip = document.getElementById('hover-tooltip');
    const tooltipName = document.getElementById('tooltip-name');
    const tooltipFunction = document.getElementById('tooltip-function');

    tooltipName.textContent = data.name;
    tooltipFunction.textContent = data.function;

    tooltip.style.display = 'block';
    updateTooltipPosition(event);
}

/**
 * Update tooltip position
 * @param {MouseEvent} event - Mouse event
 */
export function updateTooltipPosition(event) {
    const tooltip = document.getElementById('hover-tooltip');
    const offset = 15;

    tooltip.style.left = (event.clientX + offset) + 'px';
    tooltip.style.top = (event.clientY + offset) + 'px';
}

/**
 * Hide tooltip
 */
export function hideTooltip() {
    document.getElementById('hover-tooltip').style.display = 'none';
}
