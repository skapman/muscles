/**
 * System Blocks Data
 * Contains information blocks for simplified systems (pain, nervous, respiratory, cardiovascular, gadgets)
 */

export const systemBlocks = {
    // ============================================
    // PAIN & INJURIES LAYER
    // ============================================
    pain: [
        {
            id: 'lower-back-pain',
            title: 'Боль в пояснице',
            titleEn: 'Lower Back Pain',
            type: 'issue',
            severity: 'common',

            // Heatmap: affected muscle areas
            affectedAreas: [
                { muscleId: 'erector-spinae', intensity: 'high' },
                { muscleId: 'quadratus-lumborum', intensity: 'high' },
                { muscleId: 'gluteus-maximus', intensity: 'medium' }
            ],

            // Information
            causes: [
                'Слабый кор',
                'Долгое сидение',
                'Плохая техника при подъёме тяжестей',
                'Недостаточная растяжка'
            ],
            symptoms: [
                'Тупая боль в пояснице',
                'Скованность по утрам',
                'Боль при наклонах вперёд',
                'Дискомфорт при длительном сидении'
            ],

            // Solutions (links to other entities)
            goalIds: ['eliminate-lower-back-pain', 'strengthen-core'],
            exerciseIds: ['bird-dog', 'dead-bug', 'plank', 'cat-cow'],

            // Block position on SVG (for overlay)
            position: { x: 180, y: 400 },

            description: 'Одна из самых распространённых проблем. Часто связана со слабостью глубоких мышц кора и неправильной осанкой.'
        },

        {
            id: 'shoulder-impingement',
            title: 'Импинджмент плеча',
            titleEn: 'Shoulder Impingement',
            type: 'issue',
            severity: 'moderate',

            affectedAreas: [
                { muscleId: 'supraspinatus', intensity: 'high' },
                { muscleId: 'deltoid-anterior', intensity: 'medium' },
                { muscleId: 'infraspinatus', intensity: 'medium' }
            ],

            causes: [
                'Слабая вращательная манжета',
                'Чрезмерные жимовые движения',
                'Недостаточная работа над задними дельтами',
                'Плохая подвижность плечевого сустава'
            ],
            symptoms: [
                'Боль при подъёме руки 60-120°',
                'Ночная боль при лежании на плече',
                'Слабость при подъёме руки',
                'Щелчки в плече'
            ],

            goalIds: ['fix-shoulder-pain', 'improve-shoulder-mobility'],
            exerciseIds: ['face-pull', 'external-rotation', 'band-pull-apart'],

            position: { x: 120, y: 200 },

            description: 'Защемление сухожилий вращательной манжеты. Требует коррекции баланса мышц плеча.'
        },

        {
            id: 'knee-pain',
            title: 'Боль в колене',
            titleEn: 'Knee Pain',
            type: 'issue',
            severity: 'common',

            affectedAreas: [
                { muscleId: 'quadriceps', intensity: 'high' },
                { muscleId: 'hamstrings', intensity: 'medium' },
                { muscleId: 'gastrocnemius', intensity: 'medium' }
            ],

            causes: [
                'Слабые квадрицепсы',
                'Дисбаланс квадрицепсы/бицепс бедра',
                'Плохая техника приседаний',
                'Перегрузка при беге'
            ],
            symptoms: [
                'Боль при приседаниях',
                'Дискомфорт при спуске по лестнице',
                'Хруст в колене',
                'Отёк после нагрузки'
            ],

            goalIds: ['strengthen-legs', 'improve-knee-stability'],
            exerciseIds: ['leg-extension', 'leg-curl', 'step-up'],

            position: { x: 180, y: 550 },

            description: 'Часто связана с мышечным дисбалансом и неправильной техникой упражнений.'
        },

        {
            id: 'neck-pain',
            title: 'Боль в шее',
            titleEn: 'Neck Pain',
            type: 'issue',
            severity: 'common',

            affectedAreas: [
                { muscleId: 'trapezius-upper', intensity: 'high' },
                { muscleId: 'levator-scapulae', intensity: 'high' },
                { muscleId: 'sternocleidomastoid', intensity: 'medium' }
            ],

            causes: [
                'Длительная работа за компьютером',
                'Неправильная осанка',
                'Стресс и напряжение',
                'Слабые глубокие сгибатели шеи'
            ],
            symptoms: [
                'Тупая боль в шее',
                'Ограничение подвижности',
                'Головные боли',
                'Напряжение в трапециях'
            ],

            goalIds: ['improve-posture', 'reduce-neck-tension'],
            exerciseIds: ['chin-tuck', 'neck-stretch', 'shoulder-shrug'],

            position: { x: 180, y: 100 },

            description: 'Типичная проблема офисных работников. Требует работы над осанкой и растяжки.'
        },

        {
            id: 'plantar-fasciitis',
            title: 'Подошвенный фасциит',
            titleEn: 'Plantar Fasciitis',
            type: 'issue',
            severity: 'moderate',

            affectedAreas: [
                { muscleId: 'gastrocnemius', intensity: 'medium' },
                { muscleId: 'soleus', intensity: 'medium' },
                { muscleId: 'tibialis-anterior', intensity: 'low' }
            ],

            causes: [
                'Перегрузка при беге',
                'Плоскостопие',
                'Тугие икроножные мышцы',
                'Неподходящая обувь'
            ],
            symptoms: [
                'Острая боль в пятке по утрам',
                'Боль после длительного стояния',
                'Дискомфорт при первых шагах',
                'Улучшение после разминки'
            ],

            goalIds: ['improve-foot-mobility', 'strengthen-calves'],
            exerciseIds: ['calf-raise', 'toe-curl', 'foot-roll'],

            position: { x: 180, y: 650 },

            description: 'Воспаление подошвенной фасции. Требует растяжки икр и укрепления стопы.'
        }
    ],

    // ============================================
    // NERVOUS SYSTEM LAYER
    // ============================================
    nervous: [
        {
            id: 'nervous-intro',
            title: 'Нервная система',
            titleEn: 'Nervous System',
            type: 'intro',

            content: 'Центральная и периферическая нервная система управляет всеми движениями, координацией и мышечными сокращениями. Понимание её работы критично для эффективных тренировок.',

            position: { x: 100, y: 100 }
        },

        {
            id: 'cns-block',
            title: 'ЦНС (Центральная нервная система)',
            titleEn: 'CNS (Central Nervous System)',
            type: 'info',

            content: 'Головной и спинной мозг - центр управления всеми движениями. Отправляет сигналы к мышцам через моторные нейроны.',

            links: [
                'Моторная кора → произвольные движения',
                'Мозжечок → координация и баланс',
                'Спинной мозг → рефлексы'
            ],

            relatedMuscles: ['all'], // Связана со всеми мышцами

            position: { x: 150, y: 200 }
        },

        {
            id: 'peripheral-block',
            title: 'Периферическая НС',
            titleEn: 'Peripheral Nervous System',
            type: 'info',

            content: 'Нервы, идущие от спинного мозга к мышцам. Передают команды на сокращение и информацию о положении тела (проприоцепция).',

            links: [
                'Моторные нейроны → сокращение мышц',
                'Сенсорные нейроны → обратная связь',
                'Проприоцепция → осознание положения тела'
            ],

            relatedMuscles: ['all'],

            position: { x: 150, y: 350 }
        },

        {
            id: 'motor-units',
            title: 'Моторные единицы',
            titleEn: 'Motor Units',
            type: 'info',

            content: 'Один моторный нейрон + все мышечные волокна, которые он иннервирует. Тренировки улучшают рекрутирование моторных единиц.',

            tips: [
                'Малые единицы: точные движения (пальцы)',
                'Большие единицы: силовые движения (ноги)',
                'Тренировка улучшает нейромышечную связь'
            ],

            position: { x: 100, y: 500 }
        }
    ],

    // ============================================
    // RESPIRATORY SYSTEM LAYER
    // ============================================
    respiratory: [
        {
            id: 'respiratory-intro',
            title: 'Дыхательная система',
            titleEn: 'Respiratory System',
            type: 'intro',

            content: 'Обеспечивает газообмен и снабжение мышц кислородом. Правильное дыхание критично для выносливости и восстановления.',

            position: { x: 100, y: 100 }
        },

        {
            id: 'lungs-block',
            title: 'Лёгкие',
            titleEn: 'Lungs',
            type: 'info',

            content: 'Объём лёгких: ~6000ml (муж), ~4200ml (жен). VO2 max - показатель аэробной выносливости, зависит от тренированности.',

            metrics: {
                capacity: '6000ml (муж) / 4200ml (жен)',
                vo2max: 'Зависит от тренированности',
                respiratoryRate: '12-20 вдохов/мин в покое'
            },

            position: { x: 180, y: 250 }
        },

        {
            id: 'diaphragm-block',
            title: 'Диафрагма',
            titleEn: 'Diaphragm',
            type: 'info',

            content: 'Основная дыхательная мышца, обеспечивает 70% объёма вдоха. Тренировка диафрагмального дыхания улучшает выносливость.',

            relatedMuscles: ['diaphragm'],
            exerciseIds: ['diaphragmatic-breathing', 'box-breathing'],

            tips: [
                'Диафрагмальное дыхание: живот поднимается на вдохе',
                'Грудное дыхание: неэффективно, стрессовое',
                'Практика: 5-10 минут в день'
            ],

            position: { x: 180, y: 400 }
        },

        {
            id: 'breathing-patterns',
            title: 'Паттерны дыхания',
            titleEn: 'Breathing Patterns',
            type: 'tips',

            content: 'Разные типы дыхания для разных целей: диафрагмальное для восстановления, грудное при интенсивной нагрузке.',

            tips: [
                'Диафрагмальное: восстановление, снижение стресса',
                'Грудное: высокоинтенсивные нагрузки',
                'Box breathing: 4-4-4-4 (вдох-задержка-выдох-задержка)',
                'Wim Hof: 30 глубоких вдохов + задержка'
            ],

            position: { x: 100, y: 550 }
        }
    ],

    // ============================================
    // CARDIOVASCULAR SYSTEM LAYER
    // ============================================
    cardiovascular: [
        {
            id: 'cardio-intro',
            title: 'Сердечно-сосудистая система',
            titleEn: 'Cardiovascular System',
            type: 'intro',

            content: 'Транспортирует кислород и питательные вещества к мышцам, выводит продукты метаболизма. Тренировка улучшает эффективность сердца.',

            position: { x: 100, y: 100 }
        },

        {
            id: 'heart-block',
            title: 'Сердце',
            titleEn: 'Heart',
            type: 'info',

            content: 'Насос организма. ЧСС покоя: 60-100 уд/мин (у тренированных: 40-60). Тренировки снижают ЧСС покоя и повышают эффективность.',

            metrics: {
                restingHR: '60-100 bpm (норма), 40-60 bpm (спортсмены)',
                maxHR: '220 - возраст',
                strokeVolume: 'Увеличивается с тренировками'
            },

            position: { x: 180, y: 250 }
        },

        {
            id: 'hr-zones',
            title: 'Зоны ЧСС',
            titleEn: 'Heart Rate Zones',
            type: 'calculator',

            content: 'Рассчитайте свои тренировочные зоны на основе максимальной ЧСС (220 - возраст).',

            zones: [
                {
                    name: 'Восстановление',
                    nameEn: 'Recovery',
                    percent: '50-60%',
                    color: '#4caf50',
                    description: 'Лёгкая активность, восстановление'
                },
                {
                    name: 'Аэробная',
                    nameEn: 'Aerobic',
                    percent: '60-70%',
                    color: '#8bc34a',
                    description: 'Жиросжигание, базовая выносливость'
                },
                {
                    name: 'Темповая',
                    nameEn: 'Tempo',
                    percent: '70-80%',
                    color: '#ffc107',
                    description: 'Улучшение аэробной мощности'
                },
                {
                    name: 'Пороговая',
                    nameEn: 'Threshold',
                    percent: '80-90%',
                    color: '#ff9800',
                    description: 'Анаэробный порог, лактатная толерантность'
                },
                {
                    name: 'Максимальная',
                    nameEn: 'Maximum',
                    percent: '90-100%',
                    color: '#f44336',
                    description: 'Максимальная интенсивность, короткие интервалы'
                }
            ],

            hasCalculator: true,

            position: { x: 100, y: 400 }
        },

        {
            id: 'hrv-block',
            title: 'HRV (Вариабельность ЧСС)',
            titleEn: 'HRV (Heart Rate Variability)',
            type: 'info',

            content: 'Показатель восстановления и готовности к тренировкам. Высокая HRV = хорошее восстановление, низкая = нужен отдых.',

            tips: [
                'Измеряйте утром после пробуждения',
                'Используйте для планирования нагрузки',
                'Низкая HRV → лёгкая тренировка или отдых',
                'Высокая HRV → можно интенсивную тренировку'
            ],

            position: { x: 100, y: 600 }
        }
    ],

    // ============================================
    // GADGETS & TECHNOLOGY LAYER
    // ============================================
    gadgets: [
        {
            id: 'gadgets-intro',
            title: 'Гаджеты и технологии',
            titleEn: 'Gadgets & Technology',
            type: 'intro',

            content: 'Современные устройства для отслеживания здоровья, тренировок и восстановления. Помогают оптимизировать нагрузку и прогресс.',

            position: { x: 100, y: 100 }
        },

        {
            id: 'fitness-trackers',
            title: 'Фитнес-трекеры',
            titleEn: 'Fitness Trackers',
            type: 'category',

            devices: [
                {
                    name: 'Apple Watch',
                    features: ['ЧСС', 'VO2 max', 'ЭКГ', 'Сон', 'Активность'],
                    useCase: 'Универсальный трекер для повседневной активности',
                    pros: ['Точный ЧСС', 'Экосистема Apple', 'Много функций'],
                    cons: ['Дорого', 'Батарея 1-2 дня']
                },
                {
                    name: 'Garmin (Forerunner, Fenix)',
                    features: ['GPS', 'Тренировочная нагрузка', 'Восстановление', 'VO2 max'],
                    useCase: 'Для серьёзных спортсменов и бегунов',
                    pros: ['Долгая батарея', 'Детальная аналитика', 'GPS'],
                    cons: ['Дорого', 'Сложный интерфейс']
                },
                {
                    name: 'Whoop',
                    features: ['HRV', 'Strain', 'Recovery', 'Сон'],
                    useCase: 'Оптимизация восстановления и нагрузки',
                    pros: ['Фокус на восстановлении', 'Детальная HRV'],
                    cons: ['Подписка', 'Нет экрана']
                },
                {
                    name: 'Xiaomi Mi Band',
                    features: ['ЧСС', 'Сон', 'Шаги', 'Базовая активность'],
                    useCase: 'Бюджетный вариант для начинающих',
                    pros: ['Дёшево', 'Долгая батарея'],
                    cons: ['Низкая точность', 'Мало функций']
                }
            ],

            position: { x: 100, y: 200 }
        },

        {
            id: 'heart-rate-monitors',
            title: 'Пульсометры',
            titleEn: 'Heart Rate Monitors',
            type: 'category',

            content: 'Нагрудные ремни vs оптические датчики: точность vs удобство.',

            comparison: {
                chest: {
                    name: 'Нагрудные ремни (Polar H10, Garmin HRM)',
                    accuracy: 'Очень высокая (~99%)',
                    pros: ['Максимальная точность', 'Стабильный сигнал', 'Работают с любыми устройствами'],
                    cons: ['Неудобно носить', 'Нужно смачивать', 'Дополнительное устройство'],
                    useCase: 'Интенсивные тренировки, интервалы, точные зоны ЧСС'
                },
                optical: {
                    name: 'Оптические датчики (в часах)',
                    accuracy: 'Средняя (~90-95%)',
                    pros: ['Удобно', 'Всегда на руке', 'Не нужна подготовка'],
                    cons: ['Ошибки при интенсивных нагрузках', 'Зависит от плотности прилегания', 'Хуже на интервалах'],
                    useCase: 'Повседневная активность, лёгкие тренировки'
                }
            },

            position: { x: 100, y: 400 }
        },

        {
            id: 'smart-scales',
            title: 'Умные весы',
            titleEn: 'Smart Scales',
            type: 'category',

            content: 'Биоимпедансный анализ: вес, % жира, мышечная масса, вода, костная масса.',

            metrics: ['Вес', '% жира', 'Мышечная масса', 'Вода', 'Костная масса', 'Висцеральный жир'],

            note: '⚠️ Точность биоимпеданса ограничена. Используйте для отслеживания трендов, а не абсолютных значений.',

            tips: [
                'Взвешивайтесь в одно время (утром, натощак)',
                'Следите за трендами, а не разовыми значениями',
                'Сравнивайте с другими методами (калипер, DEXA)',
                'Гидратация влияет на показания'
            ],

            devices: [
                { name: 'Withings Body+', price: '~$100', features: ['Wi-Fi', 'Приложение', 'Несколько пользователей'] },
                { name: 'Xiaomi Mi Body Composition Scale', price: '~$30', features: ['Bluetooth', 'Базовые метрики'] }
            ],

            position: { x: 100, y: 600 }
        }
    ]
};

/**
 * Get blocks for a specific layer
 * @param {string} layerId - Layer identifier
 * @returns {Array} Array of blocks or empty array
 */
export function getBlocksForLayer(layerId) {
    return systemBlocks[layerId] || [];
}

/**
 * Get specific block by ID
 * @param {string} layerId - Layer identifier
 * @param {string} blockId - Block identifier
 * @returns {Object|null} Block data or null
 */
export function getBlock(layerId, blockId) {
    const blocks = systemBlocks[layerId] || [];
    return blocks.find(block => block.id === blockId) || null;
}

/**
 * Get all pain issues
 * @returns {Array} Array of pain/injury blocks
 */
export function getPainIssues() {
    return systemBlocks.pain || [];
}

/**
 * Find blocks affecting a specific muscle
 * @param {string} muscleId - Muscle identifier
 * @returns {Array} Array of blocks affecting this muscle
 */
export function getBlocksAffectingMuscle(muscleId) {
    const painBlocks = systemBlocks.pain || [];
    return painBlocks.filter(block =>
        block.affectedAreas?.some(area => area.muscleId === muscleId)
    );

/**
 * Pain Points - Educational Topics
 * These are displayed as pulsating red circles on the body map
 */
const painPoints = [
    {
        id: "what-is-pain",
        title: "Что такое боль?",
        position: { x: 50, y: 8 }, // Head/neck area (% of SVG)
        content: `
            <h3>Физиология боли</h3>
            <p>TODO: Добавить контент о том, как работает болевая система организма, роль нервных окончаний и сигналов.</p>
        `,
        isHighPriority: false
    },
    {
        id: "types-of-pain",
        title: "Типы боли",
        position: { x: 50, y: 25 }, // Chest area
        content: `
            <h3>Классификация боли</h3>
            <p>TODO: Острая vs хроническая, мышечная vs суставная, воспалительная vs нейропатическая.</p>
        `,
        isHighPriority: false
    },
    {
        id: "training-and-pain",
        title: "Тренировки и боль",
        position: { x: 25, y: 20 }, // Shoulder area
        content: `
            <h3>Когда можно тренироваться</h3>
            <p>TODO: DOMS (крепатура) vs травма, правило "хорошей" и "плохой" боли, когда остановиться.</p>
        `,
        isHighPriority: false
    },
    {
        id: "pain-relief",
        title: "Методы облегчения",
        position: { x: 70, y: 35 }, // Arm area
        content: `
            <h3>Способы справиться с болью</h3>
            <p>TODO: Растяжка, массаж, холод/тепло, отдых, противовоспалительные, физиотерапия.</p>
        `,
        isHighPriority: false
    },
    {
        id: "lower-back-pain-topic",
        title: "Боль в пояснице",
        position: { x: 50, y: 50 }, // Lower back - центральная позиция
        content: `
            <h3>Самая распространённая проблема</h3>
            <p>TODO: Причины боли в пояснице, профилактика, упражнения для укрепления кора.</p>
        `,
        isHighPriority: true // Выделяем как важную тему
    },
    {
        id: "pain-localization",
        title: "Локализация боли",
        position: { x: 40, y: 75 }, // Knee area
        content: `
            <h3>Как определить источник</h3>
            <p>TODO: Отражённая боль, триггерные точки, как правильно описать боль врачу.</p>
        `,
        isHighPriority: false
    },
    {
        id: "red-flags",
        title: "Красные флаги",
        position: { x: 50, y: 40 }, // Center torso
        content: `
            <h3>⚠️ Когда срочно к врачу</h3>
            <p>TODO: Опасные симптомы, которые требуют немедленной медицинской помощи.</p>
        `,
        isHighPriority: true // Критически важная информация
    }
];

}

/**
 * Get pain points (educational topics)
 * @returns {Array} Array of pain point objects
 */
export function getPainPoints() {
    return painPoints;
}
