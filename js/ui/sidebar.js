/**
 * Sidebar functionality
 */

import { muscleData } from '../config/muscleData.js';

/**
 * Setup sidebar toggle
 */
export function setupSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}

/**
 * Show muscle details in sidebar
 * @param {string} muscleKey - Muscle identifier
 */
export function showMuscleDetails(muscleKey) {
    const data = muscleData[muscleKey];
    if (!data) return;

    document.getElementById('muscle-name').textContent = data.name;
    document.getElementById('latin-name').textContent = data.latinName;
    document.getElementById('muscle-function').textContent = data.function;
    document.getElementById('muscle-origin').textContent = data.origin;
    document.getElementById('muscle-insertion').textContent = data.insertion;
    document.getElementById('muscle-description').textContent = data.description;

    document.querySelector('.placeholder').style.display = 'none';
    document.getElementById('details-content').style.display = 'block';

    // Ensure sidebar is visible
    document.getElementById('sidebar').classList.remove('collapsed');
}
