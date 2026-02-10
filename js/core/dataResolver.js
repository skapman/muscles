/**
 * Data Resolver
 * Handles relationships between different entities (muscles, exercises, goals, pain, etc.)
 * Builds relationship graphs for visualization
 */

import { muscleData } from '../config/muscleData.js';
import { systemBlocks } from '../config/systemBlocks.js';

export class DataResolver {
    /**
     * Resolve entity by type and ID
     * @param {string} type - Entity type (muscles, pain, nervous, etc.)
     * @param {string} id - Entity ID
     * @returns {Object|null} Entity data or null
     */
    static resolveEntity(type, id) {
        const dataMap = {
            muscles: muscleData,
            pain: systemBlocks.pain,
            nervous: systemBlocks.nervous,
            respiratory: systemBlocks.respiratory,
            cardiovascular: systemBlocks.cardiovascular,
            gadgets: systemBlocks.gadgets
        };

        const data = dataMap[type];
        if (!data) return null;

        // For arrays (blocks), find by id
        if (Array.isArray(data)) {
            return data.find(item => item.id === id) || null;
        }

        // For objects (like muscleData), direct access
        return data[id] || null;
    }

    /**
     * Build relationship graph for an entity
     * @param {string} entityType - Type of entity
     * @param {string} entityId - Entity ID
     * @param {number} depth - How many levels deep to traverse (default: 2)
     * @returns {Object} Graph with nodes and edges
     */
    static buildRelationshipGraph(entityType, entityId, depth = 2) {
        const nodes = [];
        const edges = [];
        const visited = new Set();

        // Start with the root entity
        const rootEntity = this.resolveEntity(entityType, entityId);
        if (!rootEntity) {
            return { nodes: [], edges: [] };
        }

        // Add root node
        nodes.push({
            id: `${entityType}:${entityId}`,
            type: entityType,
            data: rootEntity,
            level: 0
        });
        visited.add(`${entityType}:${entityId}`);

        // Traverse relationships
        this._traverseRelationships(entityType, entityId, rootEntity, nodes, edges, visited, 1, depth);

        return { nodes, edges };
    }

    /**
     * Recursively traverse relationships
     * @private
     */
    static _traverseRelationships(entityType, entityId, entity, nodes, edges, visited, currentLevel, maxDepth) {
        if (currentLevel > maxDepth) return;

        const currentNodeId = `${entityType}:${entityId}`;

        // Handle different entity types
        switch (entityType) {
            case 'muscles':
                this._traverseMuscleRelationships(entity, currentNodeId, nodes, edges, visited, currentLevel, maxDepth);
                break;
            case 'pain':
                this._traversePainRelationships(entity, currentNodeId, nodes, edges, visited, currentLevel, maxDepth);
                break;
            // Add more cases as needed
        }
    }

    /**
     * Traverse muscle relationships
     * @private
     */
    static _traverseMuscleRelationships(muscle, currentNodeId, nodes, edges, visited, currentLevel, maxDepth) {
        // Find pain issues affecting this muscle
        const affectingPain = systemBlocks.pain.filter(pain =>
            pain.affectedAreas?.some(area => area.muscleId === muscle.id)
        );

        affectingPain.forEach(pain => {
            const painNodeId = `pain:${pain.id}`;
            if (!visited.has(painNodeId)) {
                nodes.push({
                    id: painNodeId,
                    type: 'pain',
                    data: pain,
                    level: currentLevel
                });
                visited.add(painNodeId);
            }

            edges.push({
                from: painNodeId,
                to: currentNodeId,
                type: 'affects',
                label: 'Affects'
            });

            // Recursively traverse pain relationships
            if (currentLevel < maxDepth) {
                this._traversePainRelationships(pain, painNodeId, nodes, edges, visited, currentLevel + 1, maxDepth);
            }
        });

        // TODO: Add exercise relationships when exerciseData is available
        // TODO: Add goal relationships when goalData is available
    }

    /**
     * Traverse pain relationships
     * @private
     */
    static _traversePainRelationships(pain, currentNodeId, nodes, edges, visited, currentLevel, maxDepth) {
        // Add affected muscles
        if (pain.affectedAreas) {
            pain.affectedAreas.forEach(area => {
                const muscle = muscleData[area.muscleId];
                if (!muscle) return;

                const muscleNodeId = `muscles:${area.muscleId}`;
                if (!visited.has(muscleNodeId)) {
                    nodes.push({
                        id: muscleNodeId,
                        type: 'muscles',
                        data: muscle,
                        level: currentLevel
                    });
                    visited.add(muscleNodeId);
                }

                edges.push({
                    from: currentNodeId,
                    to: muscleNodeId,
                    type: 'affects',
                    label: `${area.intensity} intensity`,
                    intensity: area.intensity
                });
            });
        }

        // TODO: Add exercise relationships (solutions)
        // TODO: Add goal relationships
    }

    /**
     * Get all entities of a specific type
     * @param {string} type - Entity type
     * @returns {Array} Array of entities
     */
    static getAllEntities(type) {
        const dataMap = {
            muscles: muscleData,
            pain: systemBlocks.pain,
            nervous: systemBlocks.nervous,
            respiratory: systemBlocks.respiratory,
            cardiovascular: systemBlocks.cardiovascular,
            gadgets: systemBlocks.gadgets
        };

        const data = dataMap[type];
        if (!data) return [];

        // Convert object to array if needed
        if (Array.isArray(data)) {
            return data;
        }

        return Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));
    }

    /**
     * Search entities by query
     * @param {string} query - Search query
     * @param {Array<string>} types - Entity types to search (default: all)
     * @returns {Array} Search results
     */
    static search(query, types = ['muscles', 'pain', 'nervous', 'respiratory', 'cardiovascular', 'gadgets']) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        types.forEach(type => {
            const entities = this.getAllEntities(type);

            entities.forEach(entity => {
                const score = this._calculateSearchScore(entity, lowerQuery);
                if (score > 0) {
                    results.push({
                        type,
                        entity,
                        score
                    });
                }
            });
        });

        // Sort by score (descending)
        return results.sort((a, b) => b.score - a.score);
    }

    /**
     * Calculate search score for an entity
     * @private
     */
    static _calculateSearchScore(entity, query) {
        let score = 0;

        // Check title/name (highest weight)
        const title = (entity.title || entity.name || '').toLowerCase();
        if (title.includes(query)) {
            score += title.startsWith(query) ? 10 : 5;
        }

        // Check English title
        const titleEn = (entity.titleEn || entity.nameEn || '').toLowerCase();
        if (titleEn.includes(query)) {
            score += 3;
        }

        // Check content/description
        const content = (entity.content || entity.description || '').toLowerCase();
        if (content.includes(query)) {
            score += 2;
        }

        // Check tags
        if (entity.tags && Array.isArray(entity.tags)) {
            if (entity.tags.some(tag => tag.toLowerCase().includes(query))) {
                score += 4;
            }
        }

        return score;
    }

    /**
     * Get related entities
     * @param {string} entityType - Type of entity
     * @param {string} entityId - Entity ID
     * @returns {Object} Related entities grouped by type
     */
    static getRelatedEntities(entityType, entityId) {
        const entity = this.resolveEntity(entityType, entityId);
        if (!entity) return {};

        const related = {
            muscles: [],
            pain: [],
            exercises: [],
            goals: []
        };

        // Get relationships based on entity type
        if (entityType === 'muscles') {
            // Find pain affecting this muscle
            related.pain = systemBlocks.pain.filter(pain =>
                pain.affectedAreas?.some(area => area.muscleId === entityId)
            );
        } else if (entityType === 'pain') {
            // Get affected muscles
            if (entity.affectedAreas) {
                related.muscles = entity.affectedAreas
                    .map(area => muscleData[area.muscleId])
                    .filter(Boolean);
            }
        }

        return related;
    }

    /**
     * Get statistics about the data
     * @returns {Object} Statistics
     */
    static getStatistics() {
        return {
            muscles: Object.keys(muscleData).length,
            pain: systemBlocks.pain.length,
            nervous: systemBlocks.nervous.length,
            respiratory: systemBlocks.respiratory.length,
            cardiovascular: systemBlocks.cardiovascular.length,
            gadgets: systemBlocks.gadgets.length,
            total: Object.keys(muscleData).length +
                   systemBlocks.pain.length +
                   systemBlocks.nervous.length +
                   systemBlocks.respiratory.length +
                   systemBlocks.cardiovascular.length +
                   systemBlocks.gadgets.length
        };
    }
}
