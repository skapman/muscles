// Muscle data for demonstration (2 muscles as PoC)
const muscleData = {
    // Front view muscles
    'pectoralis-major': {
        name: 'Большая грудная мышца',
        latinName: 'Musculus pectoralis major',
        function: 'Приведение и внутренняя ротация плеча, участие в дыхании',
        origin: 'Ключица, грудина, хрящи верхних 6 ребер',
        insertion: 'Гребень большого бугорка плечевой кости',
        description: 'Крупная веерообразная мышца, покрывающая переднюю часть грудной клетки. Состоит из ключичной, грудинной и брюшной частей.'
    },
    'biceps-brachii': {
        name: 'Двуглавая мышца плеча',
        latinName: 'Musculus biceps brachii',
        function: 'Сгибание предплечья, супинация предплечья, сгибание плеча',
        origin: 'Длинная головка: надсуставной бугорок лопатки; Короткая головка: клювовидный отросток лопатки',
        insertion: 'Бугристость лучевой кости',
        description: 'Двуглавая мышца передней поверхности плеча. Имеет две головки (длинную и короткую), которые соединяются в общее брюшко.'
    },
    // Back view muscles
    'trapezius': {
        name: 'Трапециевидная мышца',
        latinName: 'Musculus trapezius',
        function: 'Поднимание, опускание и приведение лопатки, разгибание головы',
        origin: 'Затылочная кость, выйная связка, остистые отростки C7-T12',
        insertion: 'Ключица, акромион, ость лопатки',
        description: 'Плоская широкая мышца треугольной формы, расположенная в верхней части спины. Состоит из верхней, средней и нижней частей.'
    },
    'latissimus-dorsi': {
        name: 'Широчайшая мышца спины',
        latinName: 'Musculus latissimus dorsi',
        function: 'Приведение, разгибание и внутренняя ротация плеча',
        origin: 'Остистые отростки T7-L5, крестец, подвздошный гребень, нижние 3-4 ребра',
        insertion: 'Гребень малого бугорка плечевой кости',
        description: 'Самая широкая мышца спины, занимающая всю нижнюю часть спины. Имеет треугольную форму.'
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
        return container.querySelector('svg');
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

// Setup interactivity for SVG
function setupInteractivity(svg, view) {
    // Map of SVG element IDs to muscle data keys
    const muscleIdMap = {
        'pectoralis-right': 'pectoralis-major',
        'pectoralis-left': 'pectoralis-major',
        'abs': 'biceps-brachii' // Using biceps data for abs as placeholder for PoC
    };

    // Setup interactions for muscles with IDs
    Object.keys(muscleIdMap).forEach(elementId => {
        const muscleElement = svg.querySelector(`#${elementId}`);

        if (muscleElement) {
            const muscleKey = muscleIdMap[elementId];

            muscleElement.classList.add('muscle-interactive');
            muscleElement.dataset.muscle = muscleKey;
            muscleElement.dataset.elementId = elementId;

            // Hover effect
            muscleElement.addEventListener('mouseenter', function(e) {
                this.classList.add('highlighted');
                showTooltip(e, muscleKey);
            });

            muscleElement.addEventListener('mouseleave', function() {
                this.classList.remove('highlighted');
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
