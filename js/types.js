/**
 * Type Definitions for the Muscles Project
 * JSDoc type definitions for better IDE support and LLM understanding
 */

/**
 * @typedef {Object} Position
 * @property {number} x - X coordinate in percentage (0-100)
 * @property {number} y - Y coordinate in percentage (0-100)
 */

/**
 * @typedef {Object} PainPoint
 * @property {string} id - Unique identifier
 * @property {string} title - Display title
 * @property {Position} position - Position on SVG
 * @property {string} content - HTML content for detail view
 * @property {boolean} [calloutTop] - Position callout above point
 */

/**
 * @typedef {Object} AffectedArea
 * @property {string} muscleId - ID of affected muscle
 * @property {'low'|'medium'|'high'} intensity - Pain intensity level
 */

/**
 * @typedef {Object} SystemBlock
 * @property {string} id - Unique identifier
 * @property {string} title - Display title
 * @property {'intro'|'info'|'tips'|'calculator'|'issue'|'category'} type - Block type
 * @property {string} content - HTML content
 * @property {Position} position - Position on SVG
 * @property {Array<string>} [relatedMuscles] - Related muscle IDs
 * @property {Array<string>} [exerciseIds] - Related exercise IDs
 * @property {Array<string>} [goalIds] - Related goal IDs
 * @property {Array<AffectedArea>} [affectedAreas] - For pain/issue blocks
 * @property {Object} [metrics] - Metrics data (capacity, HR, etc.)
 * @property {Array<Object>} [zones] - HR zones or similar
 * @property {Array<Object>} [devices] - For gadgets category
 * @property {Object} [comparison] - Comparison data
 * @property {Array<string>} [tips] - Tips list
 * @property {Array<string>} [causes] - Causes list
 * @property {Array<string>} [symptoms] - Symptoms list
 * @property {'common'|'moderate'|'severe'} [severity] - Issue severity
 */

/**
 * @typedef {Object} SVGFile
 * @property {string} id - SVG identifier ('front', 'back', or layer name)
 * @property {string} path - Path to SVG file
 */

/**
 * @typedef {Object} Layer
 * @property {string} id - Unique layer identifier
 * @property {string} name - Display name
 * @property {string} icon - Emoji icon
 * @property {string} color - Theme color (hex)
 * @property {Array<SVGFile>} svgFiles - SVG files for this layer
 * @property {boolean} hasInteractivity - Whether layer has interactive elements
 * @property {boolean} hasBlocks - Whether layer has info blocks
 * @property {'normal'|'blocks-only'} [type] - Layer type
 */

/**
 * @typedef {Object} Muscle
 * @property {string} id - Unique identifier
 * @property {string} name - Russian name
 * @property {string} latinName - Latin name
 * @property {string} group - Muscle group
 * @property {string} region - Body region
 * @property {string} function - Muscle function
 * @property {string} origin - Origin point
 * @property {string} insertion - Insertion point
 * @property {string} description - Detailed description
 * @property {Array<string>} exerciseIds - Related exercise IDs
 * @property {Array<string>} goalIds - Related goal IDs
 * @property {Array<string>} issueIds - Related issue IDs
 * @property {Array<string>} tags - Tags for filtering
 * @property {string} slug - URL slug
 */

/**
 * @typedef {Object} Exercise
 * @property {string} id - Unique identifier
 * @property {string} name - Exercise name
 * @property {string} description - Description
 * @property {Array<string>} muscleIds - Target muscle IDs
 * @property {Array<string>} tags - Tags for filtering
 */

/**
 * @typedef {Object} Goal
 * @property {string} id - Unique identifier
 * @property {string} name - Goal name
 * @property {string} description - Description
 * @property {Array<string>} exerciseIds - Recommended exercise IDs
 * @property {Array<string>} muscleIds - Target muscle IDs
 */

/**
 * @typedef {Object} DetailViewData
 * @property {string} title - Main title
 * @property {string} [subtitle] - Optional subtitle
 * @property {string} content - HTML content
 * @property {Function} [onClose] - Callback when closed
 */

/**
 * @typedef {Object} GraphNode
 * @property {string} id - Node ID
 * @property {'muscles'|'exercises'|'goals'|'issues'} type - Node type
 * @property {Object} data - Node data (Muscle, Exercise, etc.)
 * @property {number} [x] - X coordinate (for rendering)
 * @property {number} [y] - Y coordinate (for rendering)
 * @property {number} [radius] - Node radius (for rendering)
 */

/**
 * @typedef {Object} GraphEdge
 * @property {string} from - Source node ID
 * @property {string} to - Target node ID
 * @property {string} type - Edge type/relationship
 */

/**
 * @typedef {Object} RelationshipGraph
 * @property {Array<GraphNode>} nodes - Graph nodes
 * @property {Array<GraphEdge>} edges - Graph edges
 */

/**
 * @typedef {Object} Theme
 * @property {'light'|'dark'} mode - Theme mode
 */

/**
 * @typedef {Object} ZoneData
 * @property {string} name - Zone name
 * @property {string} percent - Percentage range
 * @property {string} color - Zone color
 */

// Export empty object to make this a module
export {};
