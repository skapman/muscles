// Muscle data
const muscleData = {
    "trapezius-upper": {
        "name": "Trapezius Upper",
        "region": "Upper Body",
        "group": "Back",
        "latinName": "Musculus trapezius upper",
        "function": "TODO: Add function description",
        "origin": "TODO: Add origin",
        "insertion": "TODO: Add insertion",
        "description": "TODO: Add description"
    },
    "trapezius-middle": {
        "name": "Trapezius Middle",
        "region": "Upper Body",
        "group": "Back",
        "latinName": "Musculus trapezius middle",
        "function": "TODO: Add function description",
        "origin": "TODO: Add origin",
        "insertion": "TODO: Add insertion",
        "description": "TODO: Add description"
    },
    "trapezius-lower": {
        "name": "Trapezius Lower",
        "region": "Upper Body",
        "group": "Back",
        "latinName": "Musculus trapezius lower",
        "function": "TODO: Add function description",
        "origin": "TODO: Add origin",
        "insertion": "TODO: Add insertion",
        "description": "TODO: Add description"
    },
    "pectoralis-major": {
        "name": "Pectoralis Major",
        "region": "Upper Body",
        "group": "Chest",
        "latinName": "Musculus pectoralis major",
        "function": "TODO: Add function description",
        "origin": "TODO: Add origin",
        "insertion": "TODO: Add insertion",
        "description": "TODO: Add description"
    },
    "rectus-abdominis": {
        "name": "Rectus Abdominis",
        "region": "Upper Body",
        "group": "Waist",
        "latinName": "Musculus rectus abdominis",
        "function": "TODO: Add function description",
        "origin": "TODO: Add origin",
        "insertion": "TODO: Add insertion",
        "description": "TODO: Add description"
    },
    "obliques": {
        "name": "Obliques",
        "region": "Upper Body",
        "group": "Waist",
        "latinName": "Musculus obliques",
        "function": "TODO: Add function description",
        "origin": "TODO: Add origin",
        "insertion": "TODO: Add insertion",
        "description": "TODO: Add description"
    },
    "deltoid-anterior": {
        "name": "Deltoid Anterior",
        "region": "Upper Body",
        "group": "Shoulders",
        "latinName": "Musculus deltoid anterior",
        "function": "TODO: Add function description",
        "origin": "TODO: Add origin",
        "insertion": "TODO: Add insertion",
        "description": "TODO: Add description"
    },
    "deltoid-medial-lateral": {
        "name": "Deltoid Medial/Lateral",
        "region": "Upper Body",
        "group": "Shoulders",
        "latinName": "Musculus deltoid medial/lateral",
        "function": "TODO: Add function description",
        "origin": "TODO: Add origin",
        "insertion": "TODO: Add insertion",
        "description": "TODO: Add description"
    },
    "deltoid-posterior": {
        "name": "Deltoid Posterior",
        "region": "Upper Body",
        "group": "Shoulders",
        "latinName": "Musculus deltoid posterior",
        "function": "TODO: Add function description",
        "origin": "TODO: Add origin",
        "insertion": "TODO: Add insertion",
        "description": "TODO: Add description"
    }
};

// Zoom and pan state
let zoomLevel = 0.9; // Start at 90% to show margins
let minZoomLevel = 0.9; // Minimum 90% of full height
let maxZoomLevel = 3;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX = 0;
let startY = 0;

// Load SVG files
async function loadSVG(url, containerId) {
    try {
        const response = await fetch(url);
        const svgText = await response.text();
        const container = document.getElementById(containerId);
        container.innerHTML = svgText;
        const svg = container.querySelector('svg');

        // Automatically add IDs to all path elements if they don't have one
        if (svg) {
            const view = containerId.includes('front') ? 'front' : 'back';
            const paths = svg.querySelectorAll('path');
            paths.forEach((path, index) => {
                if (!path.id) {
                    path.id = `${view}-path-${index}`;
                }
            });
            console.log(`Added IDs to ${paths.length} paths in ${view} view`);
        }

        return svg;
    } catch (error) {
        console.error(`Error loading SVG from ${url}:`, error);
        return null;
    }
}

// Initialize the application
async function init() {
    // Load both SVG files
    const frontSvg = await loadSVG('body-front.svg', 'front-svg-wrapper');
    const backSvg = await loadSVG('body-back.svg', 'back-svg-wrapper');

    if (frontSvg) {
        setupInteractivity(frontSvg, 'front');
        setupPanZoom(document.getElementById('front-svg-wrapper'));
    }

    if (backSvg) {
        setupInteractivity(backSvg, 'back');
        setupPanZoom(document.getElementById('back-svg-wrapper'));
    }

    // Setup sidebar toggle
    setupSidebarToggle();

    // Setup zoom controls
    setupZoomControls();

    // Setup tooltip
    setupTooltip();

    // Apply initial zoom
    applyTransform();
}

// Store all SVG elements globally for cross-view highlighting
let allMuscleElements = {};

// Setup interactivity for SVG
function setupInteractivity(svg, view) {
    // Map of SVG element IDs to muscle data keys
    // Generated by Muscle Mapper
    // Total muscles mapped: 43
    // Unique muscles: 9

    // Mapping SVG element IDs to muscle keys
    const muscleIdMap = {
        "front-path-98": "trapezius-upper",
        "front-path-97": "trapezius-upper",
        "back-path-71": "trapezius-upper",
        "back-path-73": "trapezius-upper",
        "back-path-66": "trapezius-middle",
        "back-path-65": "trapezius-middle",
        "back-path-67": "trapezius-lower",
        "back-path-69": "trapezius-lower",
        "front-path-94": "pectoralis-major",
        "front-path-93": "pectoralis-major",
        "front-path-90": "rectus-abdominis",
        "front-path-89": "rectus-abdominis",
        "pectoralis-left": "rectus-abdominis",
        "pectoralis-right": "rectus-abdominis",
        "front-path-88": "rectus-abdominis",
        "front-path-87": "rectus-abdominis",
        "abs": "rectus-abdominis",
        "front-path-81": "obliques",
        "front-path-77": "obliques",
        "front-path-73": "obliques",
        "front-path-69": "obliques",
        "front-path-71": "obliques",
        "front-path-79": "obliques",
        "front-path-75": "obliques",
        "front-path-67": "obliques",
        "front-path-66": "obliques",
        "front-path-74": "obliques",
        "front-path-70": "obliques",
        "front-path-68": "obliques",
        "front-path-72": "obliques",
        "front-path-80": "obliques",
        "front-path-76": "obliques",
        "front-path-78": "obliques",
        "back-path-28": "obliques",
        "back-path-27": "obliques",
        "front-path-122": "deltoid-anterior",
        "front-path-124": "deltoid-anterior",
        "front-path-92": "deltoid-medial-lateral",
        "front-path-91": "deltoid-medial-lateral",
        "back-path-60": "deltoid-medial-lateral",
        "back-path-59": "deltoid-medial-lateral",
        "back-path-61": "deltoid-posterior",
        "back-path-63": "deltoid-posterior"
    };

    // Setup interactions for muscles with IDs
    Object.keys(muscleIdMap).forEach(elementId => {
        const muscleElement = svg.querySelector(`#${elementId}`);

        if (muscleElement) {
            const muscleKey = muscleIdMap[elementId];

            muscleElement.classList.add('muscle-interactive');
            muscleElement.dataset.muscle = muscleKey;
            muscleElement.dataset.elementId = elementId;

            // Store element for cross-view highlighting
            if (!allMuscleElements[muscleKey]) {
                allMuscleElements[muscleKey] = [];
            }
            allMuscleElements[muscleKey].push(muscleElement);

            // Hover effect - highlight all elements with same muscleKey
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

            // Click to show details in sidebar
            muscleElement.addEventListener('click', function() {
                showMuscleDetails(muscleKey);
            });

            console.log(`Initialized muscle: ${elementId} -> ${muscleKey}`);
        } else {
            console.warn(`Muscle element #${elementId} not found in ${view} view`);
        }
    });
}

// Highlight all elements of a muscle group (across both views)
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

// Setup sidebar toggle
function setupSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');

    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });
}

// Setup zoom controls
function setupZoomControls() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');

    zoomInBtn.addEventListener('click', () => adjustZoom(0.2));
    zoomOutBtn.addEventListener('click', () => adjustZoom(-0.2));
    zoomResetBtn.addEventListener('click', resetZoom);
}

// Adjust zoom level
function adjustZoom(delta) {
    zoomLevel = Math.max(minZoomLevel, Math.min(maxZoomLevel, zoomLevel + delta));
    applyTransform();
}

// Reset zoom and pan
function resetZoom() {
    zoomLevel = minZoomLevel;
    panX = 0;
    panY = 0;
    applyTransform();
}

// Apply transform to both SVGs
function applyTransform() {
    const frontSvg = document.querySelector('#front-svg-wrapper svg');
    const backSvg = document.querySelector('#back-svg-wrapper svg');

    const transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;

    if (frontSvg) frontSvg.style.transform = transform;
    if (backSvg) backSvg.style.transform = transform;
}

// Setup pan and zoom for SVG wrapper
function setupPanZoom(wrapper) {
    wrapper.addEventListener('mousedown', function(e) {
        isPanning = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
        wrapper.style.cursor = 'grabbing';
    });

    wrapper.addEventListener('mousemove', function(e) {
        if (!isPanning) return;

        panX = e.clientX - startX;
        panY = e.clientY - startY;
        applyTransform();
    });

    wrapper.addEventListener('mouseup', function() {
        isPanning = false;
        wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('mouseleave', function() {
        isPanning = false;
        wrapper.style.cursor = 'grab';
    });

    // Zoom with mouse wheel
    wrapper.addEventListener('wheel', function(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        adjustZoom(delta);
    });
}

// Setup tooltip
function setupTooltip() {
    // Tooltip is already in HTML, just needs to be positioned
}

// Show tooltip on hover
function showTooltip(event, muscleKey) {
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

// Update tooltip position
function updateTooltipPosition(event) {
    const tooltip = document.getElementById('hover-tooltip');
    const offset = 15;

    tooltip.style.left = (event.clientX + offset) + 'px';
    tooltip.style.top = (event.clientY + offset) + 'px';
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('hover-tooltip');
    tooltip.style.display = 'none';
}

// Show muscle details in sidebar
function showMuscleDetails(muscleKey) {
    const data = muscleData[muscleKey];
    if (!data) return;

    // Update sidebar content
    document.getElementById('muscle-name').textContent = data.name;
    document.getElementById('latin-name').textContent = data.latinName;
    document.getElementById('muscle-function').textContent = data.function;
    document.getElementById('muscle-origin').textContent = data.origin;
    document.getElementById('muscle-insertion').textContent = data.insertion;
    document.getElementById('muscle-description').textContent = data.description;

    // Show details content, hide placeholder
    document.querySelector('.placeholder').style.display = 'none';
    document.getElementById('details-content').style.display = 'block';

    // Ensure sidebar is visible
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('collapsed');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
