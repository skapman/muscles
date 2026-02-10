
# 🏗️ Архитектура Многослойной Анатомической Системы

## Оглавление
1. [Концепция Слайдера Систем](#1-концепция-слайдера-систем)
2. [Структура Данных для Каждой Системы](#2-структура-данных-для-каждой-системы)
3. [Кросс-Референсы и Связи](#3-кросс-референсы-и-связи)
4. [Навигация и UI](#4-навигация-и-ui)
5. [Страница Фильтрации](#5-страница-фильтрации)
6. [Анимации и Переходы](#6-анимации-и-переходы)
7. [Файловая Структура](#7-файловая-структура)
8. [План Реализации](#8-план-реализации)

---

## 1. Концепция Слайдера Систем

### 1.1 Визуальная Концепция

```
┌─────────────────────────────────────────────────────────┐
│  [☰]  MUSCLE ATLAS                          [🔍] [👤]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────┐                                               │
│  │  💪  │  ◄─── Активный слой                          │
│  │ Мышцы│                                               │
│  └──────┘                                               │
│     │                                                    │
│  ┌──────┐                                               │
│  │  ⚡  │                                               │
│  │Нервы │                                               │
│  └──────┘                                               │
│     │                                                    │
│  ┌──────┐         ┌─────────────────────┐              │
│  │  🫁  │         │                     │              │
│  │Дыхат.│         │   SVG Визуализация  │              │
│  └──────┘         │   (Front/Back)      │              │
│     │             │                     │              │
│  ┌──────┐         │   [Интерактивная    │              │
│  │  ❤️  │         │    анатомия]        │              │
│  │Сердце│         │                     │              │
│  └──────┘         └─────────────────────┘              │
│     │                                                    │
│  ┌──────┐                                               │
│  │  🩹  │                                               │
│  │ Боли │                                               │
│  └──────┘                                               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Конфигурация Слоёв

```javascript
// js/config/systemLayers.js

export const SYSTEM_LAYERS = {
  muscles: {
    id: 'muscles',
    name: 'Мышцы',
    nameEn: 'Muscles',
    icon: '💪',
    order: 1,

    // Визуальная тема
    theme: {
      primary: '#00d4ff',      // Cyan
      secondary: '#667eea',    // Purple
      glow: 'rgba(0, 212, 255, 0.8)',
      gradient: 'linear-gradient(135deg, #00d4ff 0%, #667eea 100%)'
    },

    // SVG файлы
    assets: {
      front: 'body-front.svg',
      back: 'body-back.svg'
    },

    // Метаданные
    description: 'Мышечная система: 35 ключевых мышц и групп',
    dataType: 'muscle',
    dataSource: 'muscleData',

    // Связанные разделы
    relatedSections: ['exercises', 'goals', 'qualities'],

    // Фичи
    features: {
      hover: true,
      click: true,
      search: true,
      filter: true,
      crossHighlight: true
    }
  },

  nervous: {
    id: 'nervous',
    name: 'Нервная система',
    nameEn: 'Nervous System',
    icon: '⚡',
    order: 2,

    theme: {
      primary: '#ffeb3b',
      secondary: '#ffc107',
      glow: 'rgba(255, 235, 59, 0.8)',
      gradient: 'linear-gradient(135deg, #ffeb3b 0%, #ffc107 100%)'
    },

    assets: {
      front: 'nervous-front.svg',
      back: 'nervous-back.svg'
    },

    description: 'ЦНС, периферические нервы, рефлексы',
    dataType: 'nerve',
    dataSource: 'nerveData',

    relatedSections: ['muscles', 'issues'],

    features: {
      hover: true,
      click: true,
      pathAnimation: true,  // Анимация нервных путей
      pulseEffect: true
    }
  },

  respiratory: {
    id: 'respiratory',
    name: 'Дыхательная',
    nameEn: 'Respiratory',
    icon: '🫁',
    order: 3,

    theme: {
      primary: '#4caf50',
      secondary: '#66bb6a',
      glow: 'rgba(76, 175, 80, 0.8)',
      gradient: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
    },

    assets: {
      front: 'respiratory-front.svg',
      back: 'respiratory-back.svg'
    },

    description: 'Лёгкие, диафрагма, дыхательные пути',
    dataType: 'respiratory',
    dataSource: 'respiratoryData',

    relatedSections: ['muscles', 'exercises', 'qualities'],

    features: {
      hover: true,
      click: true,
      breathingAnimation: true,  // Анимация дыхания
      volumeVisualization: true
    }
  },

  cardiovascular: {
    id: 'cardiovascular',
    name: 'Сердечно-сосудистая',
    nameEn: 'Cardiovascular',
    icon: '❤️',
    order: 4,

    theme: {
      primary: '#f44336',
      secondary: '#e57373',
      glow: 'rgba(244, 67, 54, 0.8)',
      gradient: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)'
    },

    assets: {
      front: 'cardio-front.svg',
      back: 'cardio-back.svg'
    },

    description: 'Сердце, артерии, вены, кровообращение',
    dataType: 'cardiovascular',
    dataSource: 'cardiovascularData',

    relatedSections: ['exercises', 'qualities', 'goals'],

    features: {
      hover: true,
      click: true,
      heartbeatAnimation: true,  // Анимация сердцебиения
      bloodFlowAnimation: true,  // Анимация кровотока
      hrZoneCalculator: true
    }
  },

  pain: {
    id: 'pain',
    name: 'Боли и травмы',
    nameEn: 'Pain & Injuries',
    icon: '🩹',
    order: 5,

    theme: {
      primary: '#ff5252',
      secondary: '#ff1744',
      glow: 'rgba(255, 82, 82, 0.8)',
      gradient: 'linear-gradient(135deg, #ff5252 0%, #ff1744 100%)'
    },

    assets: {
      front: 'body-front.svg',  // Те же SVG, но другая подсветка
      back: 'body-back.svg'
    },

    description: 'Распространённые боли, травмы, проблемные зоны',
    dataType: 'issue',
    dataSource: 'issueData',

    relatedSections: ['muscles', 'nerves', 'goals', 'exercises'],

    features: {
      hover: true,
      click: true,
      heatmapVisualization: true,  // Тепловая карта боли
      severityIndicator: true,
      selfDiagnostic: true
    }
  }
};

// Утилиты для работы со слоями
export class LayerManager {
  static currentLayer = 'muscles';

  static getLayer(layerId) {
    return SYSTEM_LAYERS[layerId];
  }

  static getAllLayers() {
    return Object.values(SYSTEM_LAYERS).sort((a, b) => a.order - b.order);
  }

  static switchLayer(layerId) {
    const layer = this.getLayer(layerId);
    if (!layer) return false;

    this.currentLayer = layerId;
    return layer;
  }

  static getTheme(layerId) {
    return this.getLayer(layerId)?.theme;
  }
}
```

---

## 2. Структура Данных для Каждой Системы

### 2.1 Мышцы (Muscles) - Существующая

```javascript
// js/config/muscleData.js

export const muscleData = {
  "pectoralis-major": {
    id: "pectoralis-major",
    name: "Pectoralis Major",
    latinName: "Musculus pectoralis major",

    // Анатомия
    group: "chest",
    region: "upper",
    function: "Shoulder flexion, adduction, internal rotation",
    origin: "Clavicle, sternum, costal cartilages",
    insertion: "Humerus (bicipital groove)",
    description: "Large fan-shaped muscle of the chest...",

    // Связи (только ID)
    exerciseIds: ["bench-press", "push-up", "dumbbell-fly"],
    goalIds: ["build-chest", "improve-push-strength"],
    qualityIds: ["strength", "power"],
    nerveIds: ["medial-pectoral-nerve", "lateral-pectoral-nerve"],
    issueIds: ["pec-strain", "shoulder-impingement"],

    // Теги
    tags: ["chest", "push", "upper-body", "compound"],

    // SEO
    slug: "pectoralis-major",
    keywords: ["chest muscle", "pecs", "push muscles"],

    // Медиа
    videoUrl: "https://youtube.com/embed/...",
    imageUrl: "/images/muscles/pectoralis-major.jpg"
  }
};
```

### 2.2 Нервная Система (Nervous)

```javascript
// js/config/nerveData.js

export const nerveData = {
  "median-nerve": {
    id: "median-nerve",
    name: "Срединный нерв",
    latinName: "Nervus medianus",

    // Классификация
    type: "peripheral", // central, peripheral, autonomic
    division: "upper-limb",

    // Анатомия
    origin: "C5-T1 (brachial plexus)",
    pathway: "Arm → Forearm → Hand",
    branches: [
      "Anterior interosseous nerve",
      "Palmar cutaneous branch",
      "Recurrent motor branch"
    ],

    // Функция
    function: "Wrist flexion, forearm pronation, thumb opposition",
    sensoryArea: "Lateral palm, thumb, index, middle, lateral ring finger",
    motorTargets: ["flexor-carpi-radialis", "pronator-teres", "thenar-muscles"],

    // Связи
    muscleIds: ["flexor-carpi-radialis", "pronator-teres", "thenar-muscles"],
    issueIds: ["carpal-tunnel-syndrome", "pronator-syndrome"],

    // Клинические тесты
    tests: [
      {
        name: "Тест Тинеля",
        description: "Постукивание по запястью вызывает покалывание",
        positive: "Парестезии в зоне иннервации"
      },
      {
        name: "Тест Фалена",
        description: "Максимальное сгибание запястья на 60 секунд",
        positive: "Онемение/покалывание в пальцах"
      }
    ],

    // Визуализация пути (координаты для SVG)
    pathCoordinates: [
      { x: 150, y: 200, label: "Плечевое сплетение" },
      { x: 160, y: 350, label: "Локоть" },
      { x: 165, y: 450, label: "Запястье" },
      { x: 170, y: 500, label: "Кисть" }
    ],

    // Теги
    tags: ["upper-limb", "peripheral", "motor", "sensory"],

    // SEO
    slug: "median-nerve",
    keywords: ["carpal tunnel", "wrist nerve", "hand numbness"]
  },

  "sciatic-nerve": {
    id: "sciatic-nerve",
    name: "Седалищный нерв",
    latinName: "Nervus ischiadicus",

    type: "peripheral",
    division: "lower-limb",

    origin: "L4-S3 (lumbosacral plexus)",
    pathway: "Pelvis → Posterior thigh → Leg → Foot",
    branches: ["Tibial nerve", "Common fibular nerve"],

    function: "Hip extension, knee flexion, ankle/foot movement",
    sensoryArea: "Posterior thigh, entire leg and foot",
    motorTargets: ["hamstrings", "gastrocnemius", "tibialis-anterior"],

    muscleIds: ["biceps-femoris", "semitendinosus", "gastrocnemius"],
    issueIds: ["sciatica", "piriformis-syndrome"],

    tests: [
      {
        name: "Straight Leg Raise",
        description: "Подъём прямой ноги лёжа",
        positive: "Боль по задней поверхности ноги <70°"
      }
    ],

    pathCoordinates: [
      { x: 180, y: 400, label: "Таз" },
      { x: 185, y: 550, label: "Бедро" },
      { x: 190, y: 700, label: "Колено" },
      { x: 195, y: 850, label: "Стопа" }
    ],

    tags: ["lower-limb", "peripheral", "largest-nerve"],
    slug: "sciatic-nerve"
  }
};
```

### 2.3 Дыхательная Система (Respiratory)

```javascript
// js/config/respiratoryData.js

export const respiratoryData = {
  "diaphragm": {
    id: "diaphragm",
    name: "Диафрагма",
    latinName: "Diaphragma",

    type: "primary-muscle", // primary-muscle, accessory-muscle, airway, lung

    // Анатомия
    anatomy: "Dome-shaped muscle separating thoracic and abdominal cavities",
    attachments: {
      origin: "Xiphoid process, lower 6 ribs, L1-L3 vertebrae",
      insertion: "Central tendon"
    },

    // Функция
    function: "Primary breathing muscle, 70% of inspiratory volume",
    mechanism: "Contracts → flattens → increases thoracic volume → air in",

    // Связи
    muscleIds: ["diaphragm"],
    nerveIds: ["phrenic-nerve"],
    cardiovascularIds: ["inferior-vena-cava", "aorta"],

    // Дыхательные паттерны
    breathingPatterns: [
      {
        name: "Диафрагмальное дыхание",
        description: "Живот поднимается на вдохе, опускается на выдохе",
        benefits: ["Снижение стресса", "Улучшение оксигенации", "Массаж органов"],
        technique: "Вдох 4 сек → задержка 4 сек → выдох 6 сек"
      },
      {
        name: "Грудное дыхание",
        description: "Грудная клетка расширяется, живот неподвижен",
        issues: ["Поверхностное", "Стрессовое", "Неэффективное"],
        correction: "Практика диафрагмального дыхания"
      }
    ],

    // Упражнения
    exerciseIds: ["box-breathing", "diaphragmatic-breathing", "4-7-8-breathing"],

    // Проблемы
    issueIds: ["shallow-breathing", "breathing-dysfunction", "diaphragm-weakness"],

    // Теги
    tags: ["breathing", "core", "primary"],
    slug: "diaphragm"
  },

  "lungs": {
    id: "lungs",
    name: "Лёгкие",
    latinName: "Pulmones",

    type: "organ",

    anatomy: {
      lobes: {
        right: ["Upper", "Middle", "Lower"],
        left: ["Upper", "Lower"]
      },
      surfaceArea: "70-100 m² (size of tennis court)"
    },

    // Объёмы
    capacity: {
      total: {
        male: "6000ml",
        female: "4200ml"
      },
      tidal: "500ml (normal breath)",
      vital: "4800ml (max exhale after max inhale)",
      residual: "1200ml (always remains)"
    },

    // Газообмен
    gasExchange: {
      o2Uptake: "250ml/min (rest), 3000ml/min (exercise)",
      co2Output: "200ml/min (rest)",
      alveoli: "300-500 million"
    },

    // Связи с производительностью
    qualityIds: ["endurance", "vo2max", "aerobic-capacity"],
    exerciseIds: ["interval-training", "breathing-exercises", "cardio"],

    // Тесты
    tests: [
      {
        name: "VO2 Max Test",
        description: "Максимальное потребление кислорода",
        units: "ml/kg/min",
        benchmarks: {
          excellent: ">55 (male), >49 (female)",
          good: "45-55 (male), 39-49 (female)",
          average: "35-45 (male), 30-39 (female)"
        }
      }
    ],

    tags: ["breathing", "endurance", "oxygen"],
    slug: "lungs"
  },

  "intercostals": {
    id: "intercostals",
    name: "Межрёберные мышцы",
    latinName: "Musculi intercostales",

    type: "accessory-muscle",

    anatomy: "Muscles between ribs",
    types: ["External (inspiration)", "Internal (expiration)"],

    function: "Assist breathing by moving ribs",

    muscleIds: ["intercostals"],
    nerveIds: ["intercostal-nerves"],

    exerciseIds: ["breathing-exercises", "thoracic-mobility"],
    issueIds: ["rib-pain", "intercostal-strain"],

    tags: ["breathing", "accessory", "ribs"],
    slug: "intercostals"
  }
};
```

### 2.4 Сердечно-сосудистая (Cardiovascular)

```javascript
// js/config/cardiovascularData.js

export const cardiovascularData = {
  "heart": {
    id: "heart",
    name: "Сердце",
    latinName: "Cor",

    type: "organ",

    // Анатомия
    anatomy: {
      chambers: [
        "Right atrium (правое предсердие)",
        "Right ventricle (правый желудочек)",
        "Left atrium (левое предсердие)",
        "Left ventricle (левый желудочек)"
      ],
      valves: [
        "Tricuspid (трикуспидальный)",
        "Pulmonary (лёгочный)",
        "Mitral (митральный)",
        "Aortic (аортальный)"
      ],
      size: "Fist-sized, ~250-350g",
      location: "Mediastinum, slightly left of center"
    },

    // Физиология
    metrics: {
      restingHR: {
        average: "60-100 bpm",
        athlete: "40-60 bpm",
        untrained: "70-80 bpm"
      },
      maxHR: "220 - age (rough estimate)",
      strokeVolume: {
        rest: "70ml",
        exercise: "120ml (trained)"
      },
      cardiacOutput: {
        rest: "5 L/min",
        maxExercise: "20-25 L/min (trained: 30-40 L/min)"
      }
    },

    // Зоны тренировки ЧСС
    trainingZones: [
      {
        zone: 1,
        name: "Восстановление",
        hrPercent: "50-60%",
        description: "Лёгкая активность, восстановление",
        color: "#4caf50",
        benefits: ["Recovery", "Fat burning", "Base building"]
      },
      {
        zone: 2,
        name: "Аэробная",
        hrPercent: "60-70%",
        description: "Комфортный темп, можно говорить",
        color: "#8bc34a",
        benefits: ["Endurance", "Fat burning", "Aerobic capacity"]
      },
      {
        zone: 3,
        name: "Темповая",
        hrPercent: "70-80%",
        description: "Умеренно тяжело, короткие фразы",
        color: "#ffc107",
        benefits: ["Lactate threshold", "Tempo runs"]
      },
      {
        zone: 4,
        name: "Пороговая",
        hrPercent: "80-90%",
        description: "Тяжело, только отдельные слова",
        color: "#ff9800",
        benefits: ["VO2 max", "Speed", "Anaerobic capacity"]
      },
      {
        zone: 5,
        name: "Максимальная",
        hrPercent: "90-100%",
        description: "Максимальное усилие, не можете говорить",
        color: "#f44336",
        benefits: ["Peak power", "Speed", "Short bursts"]
      }
    ],

    // Связи
    respiratoryIds: ["lungs"],
    qualityIds: ["endurance", "vo2max", "cardiovascular-health"],
    exerciseIds: ["running", "cycling", "swimming", "hiit", "rowing"],
    goalIds: ["improve-cardio", "lower-resting-hr", "increase-vo2max"],

    // Тесты
    tests: [
      {
        name: "Resting Heart Rate",
        description: "ЧСС утром после пробуждения",
        procedure: "Измерить пульс 60 секунд",
        interpretation: {
          excellent: "<60 bpm",
          good: "60-70 bpm",
          average: "70-80 bpm",
          poor: ">80 bpm"
        }
      },
      {
        name: "Heart Rate Recovery",
        description: "Снижение ЧСС после нагрузки",
        procedure: "ЧСС сразу после нагрузки - ЧСС через 1 минуту",
        interpretation: {
          excellent: ">25 bpm",
          good: "15-25 bpm",
          poor: "<12 bpm"
        }
      }
    ],

    tags: ["cardio", "endurance", "organ"],
    slug: "heart"
  },

  "aorta": {
    id: "aorta",
    name: "Аорта",
    latinName: "Aorta",

    type: "artery",
    classification: "major-vessel",

    anatomy: {
      diameter: "~3cm",
      length: "~30cm",
      sections: [
        "Ascending aorta",
        "Aortic arch",
        "Descending thoracic aorta",
        "Abdominal aorta"
      ]
    },

    function: "Main artery carrying oxygenated blood from heart to body",

    branches: [
      "Coronary arteries (heart)",
      "Carotid arteries (brain)",
      "Subclavian arteries (arms)",
      "Renal arteries (kidneys)",
      "Iliac arteries (legs)"
    ],

    // Визуализация пути
    pathCoordinates: [
      { x: 180, y: 200, label: "Heart" },
      { x: 180, y: 250, label: "Arch" },
      { x: 180, y: 400, label: "Thoracic" },
      { x: 180, y: 550, label: "Abdominal" }
    ],

    issueIds: ["aortic-aneurysm", "atherosclerosis"],

    tags: ["artery", "major-vessel", "circulation"],
    slug: "aorta"
  },

  "carotid-artery": {
    id: "carotid-artery",
    name: "Сонная артерия",
    latinName: "Arteria carotis",

    type: "artery",
    classification: "major-vessel",

    function: "Blood supply to brain and head",
    branches: ["Internal carotid", "External carotid"],

    // Пальпация
    palpationPoint: {
      location: "Neck, lateral to trachea",
      coordinates: { x: 180, y: 120 },
      technique: "Gentle pressure, never both sides simultaneously"
    },

    tags: ["artery", "brain", "palpation"],
    slug: "carotid-artery"
  }
};
```

### 2.5 Боли и Травмы (Pain & Injuries)

```javascript
// js/config/issueData.js

export const issueData = {
  "lower-back-pain": {
    id: "lower-back-pain",
    name: "Боль в пояснице",
    nameEn: "Lower Back Pain",

    // Классификация
    category: "pain", // pain, injury, syndrome
    severity: "common",
    prevalence: "80% людей испытывают хотя бы раз в жизни",

    // Визуализация (тепловая карта)
    affectedAreas: [
      {
        muscleId: "erector-spinae",
        intensity: "high",
        color: "#ff5252"
      },
      {
        muscleId: "quadratus-lumborum",
        intensity: "high",
        color: "#ff5252"
      },
      {
        muscleId: "multifidus",
        intensity: "medium",
        color: "#ff8a80"
      },
      {
        muscleId: "gluteus-medius",
        intensity: "low",
        color: "#ffcdd2"
      }
    ],

    // Причины
    causes: [
      {
        factor: "Слабые мышцы кора",
        prevalence: "Very common",
        mechanism: "Недостаточная стабилизация позвоночника"
      },
      {
        factor: "Длительное сидение",
        prevalence: "Very common",
        mechanism: "Укорочение сгибателей бедра, ослабление ягодиц"
      },
      {
        factor: "Неправильная техника подъёма",
        prevalence: "Common",
        mechanism: "Чрезмерная нагрузка на поясницу"
      },
      {
        factor: "Мышечный дисбаланс",
        prevalence: "Common",
        mechanism: "Доминирование разгибателей над стабилизаторами"
      }
    ],

    // Симптомы
    symptoms: [
      {
        symptom: "Тупая ноющая боль",
        frequency: "Constant or intermittent",
        location: "Lower back, L4-S1 region"
      },
      {
        symptom: "Скованность по утрам",
        frequency: "Morning",
        duration: "15-30 minutes"
      },
      {
        symptom: "Боль при наклонах",
        frequency: "During movement",
        trigger: "Forward flexion"
      },
      {
        symptom: "Иррадиация в ногу",
        frequency: "Occasional",
        warning: "May indicate nerve involvement"
      }
    ],

    // Самодиагностика
    selfTests: [
      {
        name: "Тест наклона вперёд",
        description: "Попытка коснуться пальцев ног стоя",
        positive: "Острая боль или невозможность наклониться >45°",
        video: "https://youtube.com/..."
      },
      {
        name: "Тест подъёма прямой ноги",
        description: "Лёжа на спине, поднять прямую ногу",
        positive: "Боль в пояснице или по задней поверхности ноги <70°",
        video: "https://youtube.com/..."
      }
    ],

    // Связи с другими системами
    muscle


    muscleIds: ["erector-spinae", "multifidus", "transverse-abdominis", "quadratus-lumborum"],
    nerveIds: ["sciatic-nerve", "lumbar-nerves"],

    // Решение
    goalIds: ["eliminate-lower-back-pain"],
    exerciseIds: ["bird-dog", "dead-bug", "cat-cow", "plank", "glute-bridge"],

    // Профилактика
    prevention: [
      "Укрепление кора 3x в неделю",
      "Растяжка сгибателей бедра ежедневно",
      "Правильная эргономика рабочего места",
      "Регулярные перерывы при сидячей работе (каждые 30 мин)",
      "Правильная техника подъёма тяжестей"
    ],

    // Красные флаги (когда к врачу)
    redFlags: [
      "Боль длится >6 недель без улучшения",
      "Онемение/слабость в ногах",
      "Потеря контроля мочевого пузыря/кишечника",
      "Боль после травмы/падения",
      "Ночная боль, мешающая сну",
      "Необъяснимая потеря веса"
    ],

    // Прогноз восстановления
    recovery: {
      acute: "2-4 weeks with proper care",
      chronic: "4-12 weeks with structured program",
      successRate: "85-90% with exercise-based approach"
    },

    tags: ["back", "pain", "common", "core"],
    slug: "lower-back-pain"
  },

  "shoulder-impingement": {
    id: "shoulder-impingement",
    name: "Импинджмент плеча",
    nameEn: "Shoulder Impingement Syndrome",

    category: "syndrome",
    severity: "moderate",
    prevalence: "Common in overhead athletes and desk workers",

    affectedAreas: [
      { muscleId: "supraspinatus", intensity: "high", color: "#ff5252" },
      { muscleId: "infraspinatus", intensity: "medium", color: "#ff8a80" },
      { muscleId: "deltoid-anterior", intensity: "medium", color: "#ff8a80" }
    ],

    causes: [
      {
        factor: "Слабые мышцы вращательной манжеты",
        prevalence: "Very common",
        mechanism: "Недостаточная стабилизация головки плечевой кости"
      },
      {
        factor: "Чрезмерные жимы над головой",
        prevalence: "Common in athletes",
        mechanism: "Повторяющееся сдавливание сухожилий"
      },
      {
        factor: "Плохая осанка (округлые плечи)",
        prevalence: "Very common",
        mechanism: "Уменьшение субакромиального пространства"
      }
    ],

    symptoms: [
      {
        symptom: "Боль при подъёме руки 60-120°",
        frequency: "During movement",
        location: "Lateral shoulder"
      },
      {
        symptom: "Ночная боль при лежании на плече",
        frequency: "Night",
        impact: "Sleep disruption"
      }
    ],

    selfTests: [
      {
        name: "Neer's Test",
        description: "Пассивный подъём руки вперёд",
        positive: "Боль при подъёме >90°"
      },
      {
        name: "Hawkins-Kennedy Test",
        description: "Внутренняя ротация согнутого плеча",
        positive: "Боль в плече"
      }
    ],

    muscleIds: ["rotator-cuff", "deltoids", "trapezius"],
    nerveIds: ["suprascapular-nerve"],
    goalIds: ["fix-shoulder-pain", "improve-shoulder-mobility"],
    exerciseIds: ["face-pull", "external-rotation", "scapular-retraction", "band-pull-apart"],

    prevention: [
      "Укрепление вращательной манжеты 2-3x в неделю",
      "Растяжка грудных мышц",
      "Правильная техника жимов",
      "Избегать чрезмерного объёма жимов"
    ],

    redFlags: [
      "Полная потеря движения",
      "Острая травма",
      "Отсутствие улучшения за 6 недель"
    ],

    recovery: {
      mild: "2-4 weeks",
      moderate: "6-12 weeks",
      successRate: "80-90% with conservative treatment"
    },

    tags: ["shoulder", "pain", "overhead", "rotator-cuff"],
    slug: "shoulder-impingement"
  }
};
```

---

## 3. Кросс-Референсы и Связи

### 3.1 Унифицированная Модель Данных

```javascript
// js/core/dataModel.js

export const DataModel = {
  // Базовые сущности
  muscles: {},      // muscleData
  exercises: {},    // exerciseData
  goals: {},        // goalData
  qualities: {},    // qualityData

  // Новые системы
  nerves: {},       // nerveData
  respiratory: {},  // respiratoryData
  cardiovascular: {}, // cardiovascularData
  issues: {},       // issueData (боли/травмы)

  // Вспомогательные
  tags: {},         // Теги для фильтрации
  articles: {}      // База знаний
};

// Resolver для получения связанных данных
export class DataResolver {
  /**
   * Получить сущность со всеми связями
   */
  static resolve(entityType, entityId) {
    const entity = DataModel[entityType][entityId];
    if (!entity) return null;

    return {
      ...entity,

      // Resolve relationships
      muscles: entity.muscleIds?.map(id => DataModel.muscles[id]).filter(Boolean),
      exercises: entity.exerciseIds?.map(id => DataModel.exercises[id]).filter(Boolean),
      goals: entity.goalIds?.map(id => DataModel.goals[id]).filter(Boolean),
      qualities: entity.qualityIds?.map(id => DataModel.qualities[id]).filter(Boolean),
      nerves: entity.nerveIds?.map(id => DataModel.nerves[id]).filter(Boolean),
      respiratory: entity.respiratoryIds?.map(id => DataModel.respiratory[id]).filter(Boolean),
      cardiovascular: entity.cardiovascularIds?.map(id => DataModel.cardiovascular[id]).filter(Boolean),
      issues: entity.issueIds?.map(id => DataModel.issues[id]).filter(Boolean)
    };
  }

  /**
   * Найти обратные связи (что ссылается на эту сущность)
   */
  static findRelated(entityType, entityId, relationType) {
    const results = [];
    const refKey = `${entityType}Ids`;

    Object.entries(DataModel[relationType]).forEach(([id, item]) => {
      if (item[refKey]?.includes(entityId)) {
        results.push(item);
      }
    });

    return results;
  }

  /**
   * Получить все связи для сущности
   */
  static getAllRelations(entityType, entityId) {
    const entity = DataModel[entityType][entityId];
    if (!entity) return {};

    return {
      // Прямые связи
      direct: this.resolve(entityType, entityId),

      // Обратные связи
      referencedBy: {
        muscles: this.findRelated(entityType, entityId, 'muscles'),
        exercises: this.findRelated(entityType, entityId, 'exercises'),
        goals: this.findRelated(entityType, entityId, 'goals'),
        issues: this.findRelated(entityType, entityId, 'issues')
      }
    };
  }

  /**
   * Построить граф связей
   */
  static buildRelationshipGraph(entityType, entityId, depth = 2) {
    const visited = new Set();
    const graph = { nodes: [], edges: [] };

    const traverse = (type, id, currentDepth) => {
      if (currentDepth > depth || visited.has(`${type}:${id}`)) return;

      visited.add(`${type}:${id}`);
      const entity = DataModel[type][id];
      if (!entity) return;

      // Add node
      graph.nodes.push({
        id: `${type}:${id}`,
        type,
        data: entity
      });

      // Add edges and traverse
      const relationTypes = ['muscleIds', 'exerciseIds', 'goalIds', 'nerveIds', 'issueIds'];
      relationTypes.forEach(relType => {
        const targetType = relType.replace('Ids', 's');
        entity[relType]?.forEach(targetId => {
          graph.edges.push({
            from: `${type}:${id}`,
            to: `${targetType}:${targetId}`,
            type: relType
          });
          traverse(targetType, targetId, currentDepth + 1);
        });
      });
    };

    traverse(entityType, entityId, 0);
    return graph;
  }
}

// Примеры использования
const muscle = DataResolver.resolve('muscles', 'pectoralis-major');
console.log(muscle.exercises); // Полные объекты упражнений
console.log(muscle.nerves);    // Полные объекты нервов

const relatedGoals = DataResolver.findRelated('muscles', 'pectoralis-major', 'goals');
console.log(relatedGoals); // Все цели, которые включают эту мышцу

const graph = DataResolver.buildRelationshipGraph('muscles', 'pectoralis-major', 2);
console.log(graph); // Граф связей глубиной 2 уровня
```

### 3.2 Система Тегов

```javascript
// js/config/tags.js

export const TAG_CATEGORIES = {
  'muscle-group': 'Группа мышц',
  'exercise-type': 'Тип упражнения',
  'equipment': 'Оборудование',
  'difficulty': 'Сложность',
  'issue-type': 'Тип проблемы',
  'body-region': 'Регион тела',
  'movement-pattern': 'Паттерн движения'
};

export const TAGS = {
  // Muscle groups
  'chest': { name: 'Грудь', color: '#00d4ff', category: 'muscle-group', icon: '💪' },
  'back': { name: 'Спина', color: '#667eea', category: 'muscle-group', icon: '💪' },
  'legs': { name: 'Ноги', color: '#4caf50', category: 'muscle-group', icon: '🦵' },
  'shoulders': { name: 'Плечи', color: '#ff9800', category: 'muscle-group', icon: '💪' },
  'arms': { name: 'Руки', color: '#9c27b0', category: 'muscle-group', icon: '💪' },
  'core': { name: 'Кор', color: '#f44336', category: 'muscle-group', icon: '🔥' },

  // Exercise types
  'compound': { name: 'Базовое', color: '#f44336', category: 'exercise-type', icon: '🏋️' },
  'isolation': { name: 'Изолирующее', color: '#ff9800', category: 'exercise-type', icon: '🎯' },
  'mobility': { name: 'Мобильность', color: '#4caf50', category: 'exercise-type', icon: '🤸' },
  'stability': { name: 'Стабилизация', color: '#2196f3', category: 'exercise-type', icon: '⚖️' },
  'cardio': { name: 'Кардио', color: '#f44336', category: 'exercise-type', icon: '❤️' },

  // Equipment
  'bodyweight': { name: 'Без оборудования', color: '#9c27b0', category: 'equipment', icon: '🧘' },
  'barbell': { name: 'Штанга', color: '#3f51b5', category: 'equipment', icon: '🏋️' },
  'dumbbell': { name: 'Гантели', color: '#00bcd4', category: 'equipment', icon: '🏋️' },
  'bands': { name: 'Резинки', color: '#4caf50', category: 'equipment', icon: '🎗️' },
  'machine': { name: 'Тренажёр', color: '#607d8b', category: 'equipment', icon: '⚙️' },

  // Difficulty
  'beginner': { name: 'Начальный', color: '#4caf50', category: 'difficulty', icon: '🌱' },
  'intermediate': { name: 'Средний', color: '#ff9800', category: 'difficulty', icon: '🔥' },
  'advanced': { name: 'Продвинутый', color: '#f44336', category: 'difficulty', icon: '💪' },

  // Issue types
  'chronic-pain': { name: 'Хроническая боль', color: '#ff5252', category: 'issue-type', icon: '🩹' },
  'acute-injury': { name: 'Острая травма', color: '#ff1744', category: 'issue-type', icon: '⚠️' },
  'overuse': { name: 'Перегрузка', color: '#ff6e40', category: 'issue-type', icon: '🔄' },

  // Body regions
  'upper-body': { name: 'Верх тела', color: '#2196f3', category: 'body-region', icon: '⬆️' },
  'lower-body': { name: 'Низ тела', color: '#4caf50', category: 'body-region', icon: '⬇️' },

  // Movement patterns
  'push': { name: 'Жимы', color: '#f44336', category: 'movement-pattern', icon: '➡️' },
  'pull': { name: 'Тяги', color: '#2196f3', category: 'movement-pattern', icon: '⬅️' },
  'squat': { name: 'Приседания', color: '#4caf50', category: 'movement-pattern', icon: '⬇️' },
  'hinge': { name: 'Наклоны', color: '#ff9800', category: 'movement-pattern', icon: '↩️' },
  'rotation': { name: 'Вращения', color: '#9c27b0', category: 'movement-pattern', icon: '🔄' }
};

// Утилиты для работы с тегами
export class TagManager {
  static getTag(tagId) {
    return TAGS[tagId];
  }

  static getTagsByCategory(category) {
    return Object.entries(TAGS)
      .filter(([_, tag]) => tag.category === category)
      .map(([id, tag]) => ({ id, ...tag }));
  }

  static searchByTags(data, tagIds) {
    return Object.values(data).filter(item =>
      tagIds.some(tagId => item.tags?.includes(tagId))
    );
  }
}
```

---

## 4. Навигация и UI

### 4.1 Бургер-Меню

```javascript
// js/ui/burgerMenu.js

export class BurgerMenu {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createMenu();
    this.attachEventListeners();
  }

  createMenu() {
    const menuHTML = `
      <div class="burger-menu" id="burger-menu">
        <button class="burger-toggle" id="burger-toggle">
          <span class="burger-icon"></span>
        </button>

        <nav class="burger-nav" id="burger-nav">
          <div class="menu-header">
            <h2>Muscle Atlas</h2>
            <button class="menu-close" id="menu-close">×</button>
          </div>

          <ul class="menu-items">
            <li class="menu-item" data-route="/">
              <span class="menu-icon">🏠</span>
              <span class="menu-text">Главная (Атлас)</span>
            </li>

            <li class="menu-item" data-route="/goals">
              <span class="menu-icon">🎯</span>
              <span class="menu-text">Цели</span>
              <span class="menu-badge">10</span>
            </li>

            <li class="menu-item" data-route="/exercises">
              <span class="menu-icon">💪</span>
              <span class="menu-text">Упражнения</span>
              <span class="menu-badge">30</span>
            </li>

            <li class="menu-item" data-route="/qualities">
              <span class="menu-icon">⚡</span>
              <span class="menu-text">Качества</span>
            </li>

            <li class="menu-item" data-route="/knowledge">
              <span class="menu-icon">📚</span>
              <span class="menu-text">База знаний</span>
            </li>

            <li class="menu-divider"></li>

            <li class="menu-item" data-route="/search">
              <span class="menu-icon">🔍</span>
              <span class="menu-text">Поиск</span>
            </li>

            <li class="menu-item" data-route="/profile">
              <span class="menu-icon">👤</span>
              <span class="menu-text">Профиль</span>
              <span class="menu-badge coming-soon">Скоро</span>
            </li>
          </ul>

          <div class="menu-footer">
            <div class="theme-toggle">
              <span>🌙</span>
              <span>Тёмная тема</span>
            </div>
          </div>
        </nav>

        <div class="menu-overlay" id="menu-overlay"></div>
      </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', menuHTML);
  }

  attachEventListeners() {
    const toggle = document.getElementById('burger-toggle');
    const close = document.getElementById('menu-close');
    const overlay = document.getElementById('menu-overlay');
    const menuItems = document.querySelectorAll('.menu-item[data-route]');

    toggle.addEventListener('click', () => this.toggle());
    close.addEventListener('click', () => this.close());
    overlay.addEventListener('click', () => this.close());

    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const route = item.dataset.route;
        this.navigate(route);
        this.close();
      });
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    document.getElementById('burger-nav').classList.add('open');
    document.getElementById('menu-overlay').classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    document.getElementById('burger-nav').classList.remove('open');
    document.getElementById('menu-overlay').classList.remove('visible');
    document.body.style.overflow = '';
  }

  navigate(route) {
    // Будет интегрировано с роутером
    window.dispatchEvent(new CustomEvent('navigate', { detail: { route } }));
  }
}
```

### 4.2 Слайдер Систем (Layer Slider)

```javascript
// js/ui/layerSlider.js

import { SYSTEM_LAYERS, LayerManager } from '../config/systemLayers.js';

export class LayerSlider {
  constructor() {
    this.currentLayer = 'muscles';
    this.init();
  }

  init() {
    this.createSlider();
    this.attachEventListeners();
  }

  createSlider() {
    const layers = LayerManager.getAllLayers();

    const sliderHTML = `
      <div class="layer-slider" id="layer-slider">
        ${layers.map(layer => `
          <button
            class="layer-button ${layer.id === 'muscles' ? 'active' : ''}"
            data-layer="${layer.id}"
            title="${layer.name}"
          >
            <span class="layer-icon">${layer.icon}</span>
            <span class="layer-name">${layer.name}</span>
            <div class="layer-indicator" style="background: ${layer.theme.primary}"></div>
          </button>
        `).join('')}
      </div>
    `;

    document.querySelector('.main-content').insertAdjacentHTML('afterbegin', sliderHTML);
  }

  attachEventListeners() {
    const buttons = document.querySelectorAll('.layer-button');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const layerId = button.dataset.layer;
        this.switchLayer(layerId);
      });
    });
  }

  async switchLayer(layerId) {
    const layer = LayerManager.switchLayer(layerId);
    if (!layer) return;

    // Update UI
    document.querySelectorAll('.layer-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.layer === layerId);
    });

    // Update theme
    this.applyTheme(layer.theme);

    // Load new SVGs
    await this.loadLayerAssets(layer);

    // Trigger animation
    this.animateTransition(this.currentLayer, layerId);

    this.currentLayer = layerId;

    // Dispatch event
    window.dispatchEvent(new CustomEvent('layerChanged', {
      detail: { layer, layerId }
    }));
  }

  applyTheme(theme) {
    document.documentElement.style.setProperty('--layer-primary', theme.primary);
    document.documentElement.style.setProperty('--layer-secondary', theme.secondary);
    document.documentElement.style.setProperty('--layer-glow', theme.glow);
  }

  async loadLayerAssets(layer) {
    // Загрузка SVG для нового слоя
    const frontSvg = await this.loadSVG(layer.assets.front, 'front-svg-wrapper');
    const backSvg = await this.loadSVG(layer.assets.back, 'back-svg-wrapper');

    // Setup interactivity based on layer type
    this.setupLayerInteractivity(layer, frontSvg, backSvg);
  }

  animateTransition(fromLayer, toLayer) {
    const container = document.querySelector('.svg-wrapper');

    // Fade out
    container.style.opacity = '0';
    container.style.transform = 'scale(0.95)';

    setTimeout(() => {
      // Fade in
      container.style.opacity = '1';
      container.style.transform = 'scale(1)';
    }, 300);
  }

  setupLayerInteractivity(layer, frontSvg, backSvg) {
    // Настройка интерактивности в зависимости от типа слоя
    switch(layer.id) {
      case 'muscles':
        this.setupMuscleInteractivity(frontSvg, backSvg);
        break;
      case 'nervous':
        this.setupNerveInteractivity(frontSvg, backSvg);
        break;
      case 'pain':
        this.setupPainInteractivity(frontSvg, backSvg);
        break;
      // ... other layers
    }
  }
}
```

---

## 5. Страница Фильтрации

### 5.1 UI Компонент

```javascript
// js/ui/filterPage.js

import { DataModel, DataResolver } from '../core/dataModel.js';
import { TAGS, TagManager } from '../config/tags.js';

export class FilterPage {
  constructor() {
    this.filters = {
      system: 'all',
      tags: [],
      difficulty: [1, 3],
      search: ''
    };
    this.results = [];
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
    this.applyFilters();
  }

  render() {
    const html = `
      <div class="filter-page">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <div class="filter-group">
            <label>Система</label>
            <select id="system-filter">
              <option value="all">Все</option>
              <option value="muscles">Мышцы</option>
              <option value="nervous">Нервная</option>
              <option value="respiratory">Дыхательная</option>
              <option value="cardiovascular">Сердечно-сосудистая</option>
              <option value="pain">Боли</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Теги</label>
            <div class="tag-pills" id="tag-filter">
              ${this.renderTagPills()}
            </div>
          </div>

          <div class="filter-group">
            <label>Сложность</label>
            <div class="difficulty-slider">
              <input
                type="range"
                id="difficulty-filter"
                min="1"
                max="3"
                value="3"
              />
              <div class="difficulty-labels">
                <span>Начальный</span>
                <span>Средний</span>
                <span>Продвинутый</span>
              </div>
            </div>
          </div>

          <div class="search-box">
            <input
              type="text"
              id="search-input"
              placeholder="Свободный поиск..."
            />
            <button class="search-btn">🔍</button>
          </div>

          <button class="reset-filters" id="reset-filters">
            Сбросить фильтры
          </button>
        </div>

        <!-- Results Grid -->
        <div class="results-container">
          <div class="results-header">
            <h2>Результаты: <span id="results-count">0</span></h2>
            <div class="view-toggle">
              <button class="view-btn active" data-view="grid">⊞</button>
              <button class="view-btn" data-view="list">☰</button>
            </div>
          </div>

          <div class="results-grid" id="results-grid">
            <!-- Results will be inserted here -->
          </div>
        </div>
      </div>
    `;

    document.getElementById('app').innerHTML = html;
  }

  renderTagPills() {
    const popularTags = ['chest', 'back', 'legs', 'compound', 'bodyweight', 'beginner'];

    return popularTags.map(tagId => {
      const tag = TAGS[tagId];
      return `
        <span
          class="tag-pill"
          data-tag="${tagId}"
          style="border-color: ${tag.color}"
        >
          ${tag.icon} ${tag.name}
        </span>
      `;
    }).join('');
  }

  attachEventListeners() {
    // System filter
    document.getElementById('system-filter').addEventListener('change', (e) => {
      this.filters.system = e.target.value;
      this.applyFilters();
    });

    // Tag pills
    document.querySelectorAll('.tag-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const tagId = pill.dataset.tag;
        pill.classList.toggle('active');

        if (pill.classList.contains('active')) {
          this.filters.tags.push(tagId);
        } else {
          this.filters.tags = this.filters.tags.filter(t => t !== tagId);
        }

        this.applyFilters();
      });
    });

    // Difficulty slider
    document.getElementById('difficulty-filter').addEventListener('input', (e) => {
      this.filters.difficulty = [1, parseInt(e.target.value)];
      this.applyFilters();
    });

    // Search
    const searchInput = document.getElementById('search-input');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.filters.search = e.target.value;
        this.applyFilters();
      }, 300);
    });

    // Reset
    document.getElementById('reset-filters').addEventListener('click', () => {
      this.resetFilters();
    });
  }

  applyFilters() {
    let results = [];

    // Collect all data
    if (this.filters.system === 'all') {
      results = [
        ...Object.values(DataModel.muscles),
        ...Object.values(DataModel.exercises),
        ...Object.values(DataModel.goals),
        ...Object.values(DataModel.nerves),
        ...Object.values(DataModel.issues)
      ];
    } else {
      results = Object.values(DataModel[this.filters.system]);
    }

    // Filter by tags
    if (this.filters.tags.length > 0) {
      results = results.filter(item =>
        this.filters.tags.some(tag => item.tags?.includes(tag))
      );
    }

    // Filter by difficulty
    results = results.filter(item => {
      if (!item.difficulty)
