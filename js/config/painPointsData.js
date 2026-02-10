/**
 * Pain Points Data
 * Educational topics about pain displayed as pulsating circles on the body map
 */

/**
 * Pain Points - Educational Topics
 */
export const painPoints = [
    {
        id: "what-is-pain",
        title: "Что такое боль?",
        position: { x: 50, y: 1.5 }, // Head - поднято на 1 диаметр (4.5% вверх)
        calloutTop: true, // Callout сверху, справа от точки
        content: `
            <h3>Физиология боли</h3>
            <p>TODO: Добавить контент о том, как работает болевая система организма, роль нервных окончаний и сигналов.</p>
        `
    },
    {
        id: "types-of-pain",
        title: "Типы боли",
        position: { x: 67, y: 25 }, // Chest area - сдвинуто на 2 диаметра вправо (17% вправо)
        content: `
            <h3>Классификация боли</h3>
            <p>TODO: Острая vs хроническая, мышечная vs суставная, воспалительная vs нейропатическая.</p>
        `
    },
    {
        id: "training-and-pain",
        title: "Тренировки и боль",
        position: { x: 28, y: 20 }, // Shoulder - без изменений
        content: `
            <h3>Когда можно тренироваться</h3>
            <p>TODO: DOMS (крепатура) vs травма, правило "хорошей" и "плохой" боли, когда остановиться.</p>
        `
    },
    {
        id: "pain-relief",
        title: "Методы облегчения",
        position: { x: 84.5, y: 35 }, // Arm - сдвинуто на 1 диаметр вправо (8.5% вправо)
        content: `
            <h3>Способы справиться с болью</h3>
            <p>TODO: Растяжка, массаж, холод/тепло, отдых, противовоспалительные, физиотерапия.</p>
        `
    },
    {
        id: "lower-back-pain-topic",
        title: "Боль в пояснице",
        position: { x: 44, y: 41 }, // Lower back - без изменений
        content: `
            <h3>Самая распространённая проблема</h3>
            <p>TODO: Причины боли в пояснице, профилактика, упражнения для укрепления кора.</p>
        `
    },
    {
        id: "pain-localization",
        title: "Локализация боли",
        position: { x: 40, y: 84 }, // Left knee - опущено на 2 диаметра (9% вниз)
        content: `
            <h3>Как определить источник</h3>
            <p>TODO: Отражённая боль, триггерные точки, как правильно описать боль врачу.</p>
        `
    },
    {
        id: "red-flags",
        title: "Красные флаги",
        position: { x: 60, y: 69 }, // Right knee
        content: `
            <h3>⚠️ Когда срочно к врачу</h3>
            <p>TODO: Опасные симптомы, которые требуют немедленной медицинской помощи.</p>
        `
    }
];

/**
 * Get pain points (educational topics)
 * @returns {Array} Array of pain point objects
 */
export function getPainPoints() {
    return painPoints;
}
