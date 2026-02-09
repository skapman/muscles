// Muscle hierarchy data
const muscleHierarchy = {
    "Upper Body": {
        "Neck": ["Sternocleidomastoid", "Splenius"],
        "Shoulders": [
            "Deltoid Anterior",
            "Deltoid Medial/Lateral",
            "Deltoid Posterior",
            "Supraspinatus"
        ],
        "Upper Arms": [
            "Biceps Brachii",
            "Triceps Brachii",
            "Brachialis"
        ],
        "Forearms": [
            "Brachioradialis",
            "Wrist Extensors",
            "Wrist Flexors",
            "Pronators",
            "Supinators"
        ],
        "Hands": [],
        "Back": [
            "Latissimus Dorsi & Teres Major",
            "Trapezius Upper",
            "Trapezius Middle",
            "Trapezius Lower",
            "Levator Scapulae",
            "Rhomboids",
            "Infraspinatus & Teres Minor",
            "Subscapularis",
            "Erector Spinae"
        ],
        "Chest": [
            "Pectoralis Major",
            "Pectoralis Minor",
            "Serratus Anterior"
        ],
        "Waist": [
            "Rectus Abdominis",
            "Obliques",
            "Quadratus Lumborum"
        ]
    },
    "Lower Body": {
        "Hips": [
            "Gluteus Maximus",
            "Abductors",
            "Hip Flexors",
            "Hip Adductors",
            "Deep External Rotators"
        ],
        "Thighs": [
            "Quadriceps",
            "Hamstrings",
            "Sartorius"
        ],
        "Calves": [
            "Gastrocnemius",
            "Soleus",
            "Tibialis Anterior"
        ],
        "Feet": []
    }
};

// State
let mappedMuscles = {};
let selectedElements = new Set(); // Changed to Set for multiple selection
let allPaths = [];

// Load SVGs
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

// Initialize
async function init() {
    // Load saved data
    const saved = localStorage.getItem('muscle-mapping');
    if (saved) {
        mappedMuscles = JSON.parse(saved);
    }

    // Load SVGs
    const frontSvg = await loadSVG('body-front.svg', 'front-container');
    const backSvg = await loadSVG('body-back.svg', 'back-container');

    if (frontSvg) {
        setupSVGInteraction(frontSvg, 'front');
        allPaths.push(...Array.from(frontSvg.querySelectorAll('path')));
    }

    if (backSvg) {
        setupSVGInteraction(backSvg, 'back');
        allPaths.push(...Array.from(backSvg.querySelectorAll('path')));
    }

    // Populate region dropdown
    populateRegions();

    // Setup event listeners
    setupEventListeners();

    // Update UI
    updateStats();
    updateMappedVisuals();
}

// Setup SVG interaction
function setupSVGInteraction(svg, view) {
    const paths = svg.querySelectorAll('path');

    paths.forEach(path => {
        path.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleElementSelection(path, view);
        });
    });
}

// Toggle element selection (for multiple selection)
function toggleElementSelection(path, view) {
    // Get or create ID
    let elementId = path.id;
    if (!elementId) {
        elementId = `${view}-path-${Array.from(path.parentElement.children).indexOf(path)}`;
        path.id = elementId;
    }

    // Check if already mapped
    if (mappedMuscles[elementId]) {
        alert('Эта мышца уже размечена!');
        return;
    }

    // Toggle selection
    if (selectedElements.has(elementId)) {
        selectedElements.delete(elementId);
        path.classList.remove('selected');
    } else {
        selectedElements.add(elementId);
        path.classList.add('selected');
    }

    updateSelectedList();
    updateSaveButton();
}

// Update selected list display
function updateSelectedList() {
    const listContainer = document.getElementById('selected-list');
    const countSpan = document.getElementById('selected-count');

    countSpan.textContent = selectedElements.size;

    if (selectedElements.size === 0) {
        listContainer.innerHTML = '<p style="color: #a1a1aa; font-size: 0.9rem;">Кликните на мышцы...</p>';
        return;
    }

    listContainer.innerHTML = '';
    selectedElements.forEach(elementId => {
        const item = document.createElement('div');
        item.className = 'selected-item';
        item.innerHTML = `
            <span>${elementId}</span>
            <button onclick="removeFromSelection('${elementId}')">×</button>
        `;
        listContainer.appendChild(item);
    });
}

// Remove from selection
window.removeFromSelection = function(elementId) {
    selectedElements.delete(elementId);
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('selected');
    }
    updateSelectedList();
    updateSaveButton();
};

// Populate regions
function populateRegions() {
    const select = document.getElementById('region-select');
    select.innerHTML = '<option value="">-- Выберите регион --</option>';

    Object.keys(muscleHierarchy).forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        select.appendChild(option);
    });
}

// Populate groups
function populateGroups(region) {
    const select = document.getElementById('group-select');
    select.innerHTML = '<option value="">-- Выберите группу --</option>';

    if (!region) {
        select.disabled = true;
        return;
    }

    const groups = muscleHierarchy[region];
    Object.keys(groups).forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        select.appendChild(option);
    });

    select.disabled = false;
}

// Populate muscles
function populateMuscles(region, group) {
    const select = document.getElementById('muscle-select');
    select.innerHTML = '<option value="">-- Выберите мышцу --</option>';

    if (!region || !group) {
        select.disabled = true;
        return;
    }

    const muscles = muscleHierarchy[region][group];
    muscles.forEach(muscle => {
        const option = document.createElement('option');
        option.value = muscle;
        option.textContent = muscle;
        select.appendChild(option);
    });

    select.disabled = false;
}

// Setup event listeners
function setupEventListeners() {
    // Region change
    document.getElementById('region-select').addEventListener('change', (e) => {
        populateGroups(e.target.value);
        document.getElementById('muscle-select').value = '';
        document.getElementById('muscle-select').disabled = true;
        updateSaveButton();
    });

    // Group change
    document.getElementById('group-select').addEventListener('change', (e) => {
        const region = document.getElementById('region-select').value;
        populateMuscles(region, e.target.value);
        updateSaveButton();
    });

    // Muscle change
    document.getElementById('muscle-select').addEventListener('change', () => {
        updateSaveButton();
    });

    // Save button
    document.getElementById('save-btn').addEventListener('click', saveMuscles);

    // Clear selection button
    document.getElementById('clear-selection-btn').addEventListener('click', clearSelection);

    // Clear form button
    document.getElementById('clear-form-btn').addEventListener('click', clearForm);

    // Export button
    document.getElementById('export-btn').addEventListener('click', exportData);

    // Reset button
    document.getElementById('reset-btn').addEventListener('click', resetData);
}

// Update save button state
function updateSaveButton() {
    const region = document.getElementById('region-select').value;
    const group = document.getElementById('group-select').value;
    const muscle = document.getElementById('muscle-select').value;
    const hasSelection = selectedElements.size > 0;

    document.getElementById('save-btn').disabled = !(hasSelection && region && group && muscle);
}

// Save muscles (all selected elements)
function saveMuscles() {
    if (selectedElements.size === 0) return;

    const region = document.getElementById('region-select').value;
    const group = document.getElementById('group-select').value;
    const muscle = document.getElementById('muscle-select').value;

    // Save all selected elements with the same muscle data
    selectedElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        const view = elementId.startsWith('front-') ? 'front' : 'back';

        mappedMuscles[elementId] = {
            region,
            group,
            muscle,
            view
        };

        // Update visuals
        element.classList.remove('selected');
        element.classList.add('mapped');
    });

    // Save to localStorage
    localStorage.setItem('muscle-mapping', JSON.stringify(mappedMuscles));

    // Clear selection
    selectedElements.clear();
    updateSelectedList();

    // Clear form
    clearForm();

    // Update stats
    updateStats();
}

// Clear selection
function clearSelection() {
    selectedElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('selected');
        }
    });
    selectedElements.clear();
    updateSelectedList();
    updateSaveButton();
}

// Clear form
function clearForm() {
    document.getElementById('region-select').value = '';
    document.getElementById('group-select').value = '';
    document.getElementById('group-select').disabled = true;
    document.getElementById('muscle-select').value = '';
    document.getElementById('muscle-select').disabled = true;
    updateSaveButton();
}

// Update stats
function updateStats() {
    const mapped = Object.keys(mappedMuscles).length;
    const total = allPaths.length;
    const percentage = total > 0 ? (mapped / total) * 100 : 0;

    document.getElementById('mapped-count').textContent = mapped;
    document.getElementById('total-count').textContent = total;
    document.getElementById('progress-text').textContent = `${mapped}/${total}`;
    document.getElementById('progress-fill').style.width = `${percentage}%`;
}

// Update mapped visuals
function updateMappedVisuals() {
    Object.keys(mappedMuscles).forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('mapped');
        }
    });
}

// Export data
function exportData() {
    if (Object.keys(mappedMuscles).length === 0) {
        alert('Нет данных для экспорта. Сначала разметьте мышцы.');
        return;
    }

    // Generate code
    const code = generateCode();

    // Copy to clipboard
    navigator.clipboard.writeText(code).then(() => {
        alert('✅ Код скопирован в буфер обмена!\n\nВставьте его в script.js, заменив существующие muscleIdMap и muscleData.');
    }).catch(err => {
        console.error('Failed to copy:', err);
        // Fallback: show in modal
        showCodeModal(code);
    });
}

// Show code modal
function showCodeModal(code) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:10000;padding:40px;overflow:auto;';
    modal.innerHTML = `
        <div style="max-width:800px;margin:0 auto;background:#1a1a2e;padding:30px;border-radius:16px;">
            <h2 style="color:#00d4ff;margin-bottom:20px;">Сгенерированный код</h2>
            <pre style="background:#0f0f23;padding:20px;border-radius:8px;overflow:auto;max-height:500px;"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-top:20px;padding:12px 24px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;">Закрыть</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Generate code
function generateCode() {
    const muscleIdMap = {};
    const muscleData = {};

    Object.entries(mappedMuscles).forEach(([elementId, data]) => {
        const muscleKey = data.muscle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        muscleIdMap[elementId] = muscleKey;

        if (!muscleData[muscleKey]) {
            muscleData[muscleKey] = {
                name: data.muscle,
                region: data.region,
                group: data.group,
                latinName: `Musculus ${data.muscle.toLowerCase()}`,
                function: 'TODO: Add function description',
                origin: 'TODO: Add origin',
                insertion: 'TODO: Add insertion',
                description: 'TODO: Add description'
            };
        }
    });

    return `// Generated by Muscle Mapper
// Total muscles mapped: ${Object.keys(mappedMuscles).length}
// Unique muscles: ${Object.keys(muscleData).length}

// Mapping SVG element IDs to muscle keys
const muscleIdMap = ${JSON.stringify(muscleIdMap, null, 4)};

// Muscle data
const muscleData = ${JSON.stringify(muscleData, null, 4)};`;
}

// Reset data
function resetData() {
    if (!confirm('Вы уверены? Все данные разметки будут удалены.')) {
        return;
    }

    mappedMuscles = {};
    localStorage.removeItem('muscle-mapping');

    // Remove visual classes
    document.querySelectorAll('.mapped').forEach(el => {
        el.classList.remove('mapped');
    });

    clearSelection();
    updateStats();
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
