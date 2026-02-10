/**
 * System Layers Configuration
 * Defines the 6 anatomical/functional layers of the application
 */

export const systemLayers = {
    muscles: {
        id: 'muscles',
        name: 'Мышечная система',
        nameEn: 'Muscular System',
        icon: '💪',
        color: '#00d4ff',
        glowColor: 'rgba(0, 212, 255, 0.8)',

        // SVG files to load
        svgFiles: [
            { id: 'front', path: 'img/body-front.svg' },
            { id: 'back', path: 'img/body-back.svg' }
        ],

        // Layer behavior
        hasInteractivity: true,  // Only muscles are clickable/hoverable
        type: 'detailed',        // Detailed system with individual elements
        hasBlocks: false,        // No overlay blocks

        description: 'Детальная анатомия мышечной системы с интерактивными элементами'
    },

    pain: {
        id: 'pain',
        name: 'Боли и травмы',
        nameEn: 'Pain & Injuries',
        icon: '🩹',
        color: '#ff5252',
        glowColor: 'rgba(255, 82, 82, 0.8)',

        // Uses colored muscle SVGs for better visualization
        svgFiles: [
            { id: 'front', path: 'img/body-front-color.svg' },
            { id: 'back', path: 'img/body-back-color.svg' }
        ],

        hasInteractivity: false,
        type: 'overlay',         // Blocks overlaid on muscle SVG
        hasBlocks: true,         // Shows info blocks
        hasHeatmap: true,        // Shows affected muscle areas

        description: 'Распространённые боли и травмы с тепловыми картами поражённых областей'
    },

    nervous: {
        id: 'nervous',
        name: 'Нервная система',
        nameEn: 'Nervous System',
        icon: '🧠',
        color: '#ffeb3b',
        glowColor: 'rgba(255, 235, 59, 0.8)',

        svgFiles: [
            { id: 'nervous', path: 'img/nervous-system.svg' }
        ],

        hasInteractivity: false,
        type: 'overlay',
        hasBlocks: true,

        description: 'Центральная и периферическая нервная система'
    },

    respiratory: {
        id: 'respiratory',
        name: 'Дыхательная система',
        nameEn: 'Respiratory System',
        icon: '🫁',
        color: '#4caf50',
        glowColor: 'rgba(76, 175, 80, 0.8)',

        svgFiles: [
            { id: 'respiratory', path: 'img/respiratory-system.svg' }
        ],

        hasInteractivity: false,
        type: 'overlay',
        hasBlocks: true,

        description: 'Дыхательная система: лёгкие, диафрагма, паттерны дыхания'
    },

    cardiovascular: {
        id: 'cardiovascular',
        name: 'Сердечно-сосудистая система',
        nameEn: 'Cardiovascular System',
        icon: '❤️',
        color: '#f44336',
        glowColor: 'rgba(244, 67, 54, 0.8)',

        svgFiles: [
            { id: 'cardiovascular', path: 'img/circulatory-system.svg' }
        ],

        hasInteractivity: false,
        type: 'overlay',
        hasBlocks: true,
        hasCalculator: true,     // HR zones calculator

        description: 'Сердце, сосуды, зоны ЧСС'
    },

    gadgets: {
        id: 'gadgets',
        name: 'Гаджеты и технологии',
        nameEn: 'Gadgets & Technology',
        icon: '⌚',
        color: '#9c27b0',
        glowColor: 'rgba(156, 39, 176, 0.8)',

        svgFiles: [],  // No SVG background

        hasInteractivity: false,
        type: 'blocks-only',     // Only blocks, no SVG
        hasBlocks: true,

        description: 'Фитнес-трекеры, пульсометры, умные весы и другие устройства'
    }
};

/**
 * Get layer by ID
 * @param {string} layerId - Layer identifier
 * @returns {Object|null} Layer configuration or null
 */
export function getLayer(layerId) {
    return systemLayers[layerId] || null;
}

/**
 * Get all layer IDs in order
 * @returns {string[]} Array of layer IDs
 */
export function getLayerIds() {
    return Object.keys(systemLayers);
}

/**
 * Get layer color
 * @param {string} layerId - Layer identifier
 * @returns {string} Hex color code
 */
export function getLayerColor(layerId) {
    return systemLayers[layerId]?.color || '#00d4ff';
}

/**
 * Check if layer has interactivity
 * @param {string} layerId - Layer identifier
 * @returns {boolean}
 */
export function isInteractiveLayer(layerId) {
    return systemLayers[layerId]?.hasInteractivity || false;
}
