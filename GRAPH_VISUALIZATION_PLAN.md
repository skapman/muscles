# 🎯 План Визуализации Графа Связей

## 📊 Анализ Текущей Модели Данных

### Что У Нас Есть Сейчас

**Текущая иерархия (из [`dataResolver.js`](js/core/dataResolver.js:1)):**

```
Pain (Боль в пояснице)
├─ affectedAreas → Muscles (3 мышцы)
├─ goalIds → Goals (2 цели) [TODO: нет данных]
└─ exerciseIds → Exercises (4 упражнения) [TODO: нет данных]
```

**Проблема:** Это НЕ иерархия, а **граф** (сеть связей):
- Боль → Мышцы
- Боль → Упражнения → Мышцы (циклическая связь)
- Боль → Цели → Упражнения → Мышцы

---

## 💡 Ваше Видение: Цели как Центральные Сущности

### Типы Целей (Предложение)

```javascript
// js/config/goalData.js (НОВЫЙ ФАЙЛ)

export const goalTypes = {
  ATHLETIC: 'athletic',        // Спортивная
  THERAPEUTIC: 'therapeutic',  // Оздоровительная
  RESEARCH: 'research',        // Исследовательская
  AESTHETIC: 'aesthetic',      // Эстетическая
  FUNCTIONAL: 'functional'     // Функциональная
};

export const goalData = {
  // ОЗДОРОВИТЕЛЬНАЯ ЦЕЛЬ
  "eliminate-lower-back-pain": {
    id: "eliminate-lower-back-pain",
    type: goalTypes.THERAPEUTIC,
    title: "Устранить боль в пояснице",
    titleEn: "Eliminate Lower Back Pain",

    // Структура для терапевтической цели
    problem: {
      painId: "lower-back-pain",
      severity: "common",
      affectedMuscles: ["erector-spinae", "quadratus-lumborum"]
    },

    solution: {
      primaryExercises: ["bird-dog", "dead-bug", "plank"],
      supportiveExercises: ["cat-cow", "child-pose"],
      avoidExercises: ["heavy-deadlift", "sit-ups"]
    },

    timeline: {
      phase1: { duration: "2 weeks", focus: "Mobility & Pain Relief" },
      phase2: { duration: "4 weeks", focus: "Stability & Strength" },
      phase3: { duration: "ongoing", focus: "Maintenance" }
    },

    metrics: {
      painLevel: { initial: 7, target: 2, unit: "0-10 scale" },
      mobility: { test: "Toe touch", target: "Full range" }
    }
  },

  // СПОРТИВНАЯ ЦЕЛЬ
  "build-chest": {
    id: "build-chest",
    type: goalTypes.ATHLETIC,
    title: "Набрать массу груди",
    titleEn: "Build Chest Mass",

    // Структура для спортивной цели
    targetMuscles: {
      primary: ["pectoralis-major"],
      secondary: ["deltoid-anterior", "triceps"]
    },

    program: {
      exercises: [
        { id: "bench-press", sets: "4x8-12", priority: "primary" },
        { id: "incline-press", sets: "3x10-12", priority: "primary" },
        { id: "dumbbell-fly", sets: "3x12-15", priority: "accessory" }
      ],
      frequency: "2x per week",
      progression: "Add 2.5kg when hitting 12 reps"
    },

    metrics: {
      strength: { exercise: "bench-press", initial: "60kg", target: "80kg" },
      size: { measurement: "chest-circumference", initial: "95cm", target: "102cm" }
    }
  },

  // ИССЛЕДОВАТЕЛЬСКАЯ ЦЕЛЬ
  "understand-shoulder-mechanics": {
    id: "understand-shoulder-mechanics",
    type: goalTypes.RESEARCH,
    title: "Понять механику плеча",
    titleEn: "Understand Shoulder Mechanics",

    // Структура для исследовательской цели
    topics: [
      {
        title: "Анатомия плечевого сустава",
        subtopics: ["Вращательная манжета", "Дельтовидные мышцы", "Лопатка"]
      },
      {
        title: "Биомеханика движений",
        subtopics: ["Отведение", "Ротация", "Стабилизация"]
      }
    ],

    relatedMuscles: ["deltoid-anterior", "deltoid-medial-lateral", "deltoid-posterior",
                     "supraspinatus", "infraspinatus", "teres-minor", "subscapularis"],

    resources: [
      { type: "article", title: "Shoulder Anatomy 101" },
      { type: "video", title: "Rotator Cuff Exercises" }
    ]
  }
};
```

---

## 🎨 Визуализация Графа: С D3.js vs Без

### Вариант A: С D3.js (Force-Directed)

**Как выглядит:**
```
     Упр-1
       ↗ ↘
  [ЦЕЛЬ] ← Боль-1
       ↘ ↗
     Мышца-1
```

**Код (упрощённо):**
```javascript
// js/ui/relationshipGraph.js

import * as d3 from 'd3'; // ~250KB

export class RelationshipGraphD3 {
  render(graphData) {
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.edges).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width/2, height/2));

    // Автоматическое расположение узлов
    simulation.on('tick', () => {
      // Обновление позиций
    });
  }
}
```

**Плюсы:**
- ✅ Красиво и органично (как на empatika.com)
- ✅ Автоматическое расположение узлов
- ✅ Интерактивность из коробки (drag, zoom)
- ✅ Много примеров и документации

**Минусы:**
- ❌ +250KB к размеру проекта
- ❌ Требует изучения D3 API
- ❌ Может быть избыточно для простых графов

---

### Вариант B: Без D3.js (Custom Canvas)

**Как выглядит:**
```
Слой 1: [ЦЕЛЬ] (центр)
         ↙  ↓  ↘
Слой 2: Боль  Упр-1  Упр-2
         ↓     ↓      ↓
Слой 3: Мышца-1  Мышца-2
```

**Код (упрощённо):**
```javascript
// js/ui/relationshipGraph.js

export class RelationshipGraphCustom {
  render(graphData) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Ручное расположение узлов по слоям
    const layers = this.groupNodesByLevel(graphData.nodes);
    const positions = this.calculatePositions(layers);

    // Отрисовка
    this.drawEdges(ctx, graphData.edges, positions);
    this.drawNodes(ctx, positions);

    // Интерактивность (вручную)
    canvas.addEventListener('click', (e) => {
      const clicked = this.findNodeAtPosition(e.x, e.y, positions);
      if (clicked) this.onNodeClick(clicked);
    });
  }

  calculatePositions(layers) {
    // Простой layered layout
    const positions = [];
    const layerHeight = 150;

    layers.forEach((layer, layerIndex) => {
      const y = layerIndex * layerHeight + 50;
      const spacing = 800 / (layer.length + 1);

      layer.forEach((node, nodeIndex) => {
        positions.push({
          ...node,
          x: (nodeIndex + 1) * spacing,
          y: y
        });
      });
    });

    return positions;
  }
}
```

**Плюсы:**
- ✅ Легковесно (0KB зависимостей)
- ✅ Полный контроль над визуализацией
- ✅ Быстрее для простых графов
- ✅ Проще понять и модифицировать

**Минусы:**
- ❌ Нужно писать всю логику вручную
- ❌ Менее органичное расположение узлов
- ❌ Больше кода для интерактивности

---

## 🎯 Моя Рекомендация

### Фаза 1: Без D3.js (Layered Layout)

**Почему:**
1. **Быстрый старт** - можно реализовать за 1-2 дня
2. **Достаточно для MVP** - покрывает основные use cases
3. **Легковесно** - не раздуваем проект
4. **Понятно** - структурированное расположение по типам

**Как будет выглядеть:**

```
┌─────────────────────────────────────────────┐
│  Граф связей: "Устранить боль в пояснице"  │
├─────────────────────────────────────────────┤
│                                             │
│         [ЦЕЛЬ: Устранить боль]              │
│                    ↓                        │
│    ┌───────────────┼───────────────┐        │
│    ↓               ↓               ↓        │
│ [Боль-1]      [Упр-1]         [Упр-2]       │
│    ↓               ↓               ↓        │
│ [Мышца-1]     [Мышца-2]      [Мышца-3]      │
│                                             │
│ Легенда:                                    │
│ 🎯 Цели  💪 Мышцы  🏋️ Упражнения  ⚠️ Боли   │
└─────────────────────────────────────────────┘
```

### Фаза 2: Добавить D3.js (Опционально)

**Когда:**
- После MVP
- Если пользователи запросят более сложную визуализацию
- Для "продвинутого режима"

**Как:**
- Кнопка "🔀 Переключить на force-directed layout"
- Lazy loading D3.js (загружается только при клике)
- Сохраняем оба варианта

---

## 🏗️ Архитектура Решения

### 1. Расширить Модель Данных

**Добавить файлы:**
```
js/config/
├─ goalData.js      # НОВЫЙ: данные целей
├─ exerciseData.js  # НОВЫЙ: данные упражнений
└─ blocks.json      # УЖЕ ЕСТЬ: боли, системы
```

### 2. Обновить DataResolver

```javascript
// js/core/dataResolver.js

import { goalData } from '../config/goalData.js';
import { exerciseData } from '../config/exerciseData.js';

export class DataResolver {
  static resolveEntity(type, id) {
    const dataMap = {
      muscles: muscleData,
      pain: systemBlocks.pain,
      goals: goalData,        // НОВОЕ
      exercises: exerciseData // НОВОЕ
    };
    // ...
  }

  // Новый метод для построения графа от цели
  static buildGoalGraph(goalId) {
    const goal = goalData[goalId];
    const nodes = [];
    const edges = [];

    // Центральный узел - цель
    nodes.push({ id: `goal:${goalId}`, type: 'goal', data: goal, level: 0 });

    // В зависимости от типа цели - разная структура
    if (goal.type === 'therapeutic') {
      // Боль → Упражнения → Мышцы
      this._buildTherapeuticGraph(goal, nodes, edges);
    } else if (goal.type === 'athletic') {
      // Упражнения → Мышцы
      this._buildAthleticGraph(goal, nodes, edges);
    }

    return { nodes, edges };
  }
}
```

### 3. Создать Компонент Графа

```javascript
// js/ui/relationshipGraph.js

export class RelationshipGraph {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.layout = options.layout || 'layered'; // 'layered' or 'force'
  }

  show(entityType, entityId) {
    const graph = DataResolver.buildRelationshipGraph(entityType, entityId);

    if (this.layout === 'layered') {
      this.renderLayered(graph);
    } else {
      this.renderForceDirected(graph); // Требует D3.js
    }
  }

  renderLayered(graph) {
    // Простой canvas layout без библиотек
    // ...
  }
}
```

---

## 🚀 План Действий

### Шаг 1: Создать Данные (1-2 дня)
- [ ] `goalData.js` - 5-10 целей разных типов
- [ ] `exerciseData.js` - 10-15 упражнений
- [ ] Связать с существующими мышцами и болями

### Шаг 2: Обновить DataResolver (1 день)
- [ ] Добавить поддержку goals и exercises
- [ ] Реализовать `buildGoalGraph()`
- [ ] Добавить логику для разных типов целей

### Шаг 3: Реализовать Граф (2-3 дня)
- [ ] Создать `RelationshipGraph` с layered layout
- [ ] Canvas отрисовка узлов и связей
- [ ] Интерактивность (клик, hover)
- [ ] Интеграция в DetailView

### Шаг 4: Тестирование (1 день)
- [ ] Проверить на разных типах целей
- [ ] Адаптивность
- [ ] Производительность

**Итого: 5-7 дней до рабочего прототипа**

---

## ❓ Вопросы для Обсуждения

1. **Типы целей:** Согласны с предложенными (athletic, therapeutic, research, aesthetic, functional)?

2. **Структура данных:** Нужны ли разные поля для разных типов целей?

3. **Визуализация:** Начинаем с layered layout без D3.js?

4. **Приоритет:** Какой тип цели реализовать первым? (рекомендую therapeutic - "Устранить боль в пояснице")

5. **Интеграция:** Где показывать граф?
   - В DetailView как вкладка
   - В модальном окне по кнопке
   - На отдельной странице

---

**Готов к обсуждению и уточнению деталей!** 🚀
