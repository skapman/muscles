# 🎯 Уточнённый План Реализации

## Корректировки на Основе Фидбека

### ✅ Принято к Сведению

1. **Упрощённые системы (кроме мышечной)**
   - Нервная, дыхательная, сердечно-сосудистая = **тематические блоки поверх SVG**
   - НЕ разбиваем на отдельные узлы/части
   - Данные типа `nerveData` - избыточны для MVP

2. **Приоритеты**
   - Связи с мышцами/упражнениями - **оставить на потом**
   - Анимации (сердцебиение, дыхание) - **отложить**
   - Фокус на **базовой функциональности**

3. **Новые идеи**
   - ✨ **Блок "Гаджеты и технологии"** (фитнес-трекеры, пульсометры и т.д.)
   - ✨ **Визуализация графа связей** (красивая интерактивная диаграмма)
   - ✨ **Тоггл тёмной/светлой темы**

4. **Стили**
   - Единая система стилей (CSS Variables)
   - Легко менять темы
   - Поддержка dark/light mode

---

## 📊 Упрощённая Структура Данных

### Мышечная Система (детальная)

```javascript
// js/config/muscleData.js
export const muscleData = {
  "pectoralis-major": {
    id: "pectoralis-major",
    name: "Большая грудная мышца",
    latinName: "Musculus pectoralis major",

    // Анатомия
    group: "chest",
    region: "upper",
    function: "Сгибание, приведение и внутренняя ротация плеча",
    origin: "Ключица, грудина, рёберные хрящи",
    insertion: "Плечевая кость (межбугорковая борозда)",
    description: "Крупная веерообразная мышца груди...",

    // Связи (только ID)
    exerciseIds: ["bench-press", "push-up", "dumbbell-fly"],
    goalIds: ["build-chest", "improve-push-strength"],
    issueIds: ["pec-strain"],

    // Теги
    tags: ["chest", "push", "upper-body", "compound"],

    // SEO
    slug: "pectoralis-major"
  }
};
```

### Остальные Системы (упрощённые блоки)

```javascript
// js/config/systemBlocks.js

export const systemBlocks = {
  // Нервная система - тематические блоки
  nervous: [
    {
      id: "nervous-intro",
      title: "Нервная система",
      type: "intro",
      content: "Центральная и периферическая нервная система управляет всеми движениями...",
      position: { x: 100, y: 100 } // Позиция блока на SVG
    },
    {
      id: "cns-block",
      title: "ЦНС",
      type: "info",
      content: "Головной и спинной мозг...",
      links: ["Связь с мышцами", "Рефлексы"],
      position: { x: 150, y: 200 }
    },
    {
      id: "peripheral-block",
      title: "Периферическая НС",
      type: "info",
      content: "Нервы, идущие к мышцам...",
      relatedMuscles: ["all"], // Связь со всеми мышцами
      position: { x: 150, y: 350 }
    }
  ],

  // Дыхательная система
  respiratory: [
    {
      id: "respiratory-intro",
      title: "Дыхательная система",
      type: "intro",
      content: "Обеспечивает газообмен и снабжение кислородом...",
      position: { x: 100, y: 100 }
    },
    {
      id: "lungs-block",
      title: "Лёгкие",
      type: "info",
      content: "Объём: 6000ml (муж), 4200ml (жен). VO2 max...",
      metrics: {
        capacity: "6000ml",
        vo2max: "Зависит от тренированности"
      },
      position: { x: 180, y: 250 }
    },
    {
      id: "diaphragm-block",
      title: "Диафрагма",
      type: "info",
      content: "Основная дыхательная мышца, 70% объёма вдоха",
      relatedMuscles: ["diaphragm"],
      exerciseIds: ["diaphragmatic-breathing"],
      position: { x: 180, y: 400 }
    },
    {
      id: "breathing-patterns",
      title: "Паттерны дыхания",
      type: "tips",
      content: "Диафрагмальное vs грудное дыхание",
      tips: [
        "Диафрагмальное: живот поднимается на вдохе",
        "Грудное: неэффективно, стрессовое"
      ],
      position: { x: 100, y: 550 }
    }
  ],

  // Сердечно-сосудистая система
  cardiovascular: [
    {
      id: "cardio-intro",
      title: "Сердечно-сосудистая система",
      type: "intro",
      content: "Транспортирует кислород и питательные вещества...",
      position: { x: 100, y: 100 }
    },
    {
      id: "heart-block",
      title: "Сердце",
      type: "info",
      content: "Насос организма. ЧСС покоя: 60-100 уд/мин",
      metrics: {
        restingHR: "60-100 bpm",
        maxHR: "220 - возраст"
      },
      position: { x: 180, y: 250 }
    },
    {
      id: "hr-zones",
      title: "Зоны ЧСС",
      type: "calculator",
      content: "Рассчитайте свои тренировочные зоны",
      zones: [
        { name: "Восстановление", percent: "50-60%", color: "#4caf50" },
        { name: "Аэробная", percent: "60-70%", color: "#8bc34a" },
        { name: "Темповая", percent: "70-80%", color: "#ffc107" },
        { name: "Пороговая", percent: "80-90%", color: "#ff9800" },
        { name: "Максимальная", percent: "90-100%", color: "#f44336" }
      ],
      position: { x: 100, y: 400 }
    }
  ],

  // Боли/Травмы - детальные карточки
  pain: [
    {
      id: "lower-back-pain",
      title: "Боль в пояснице",
      type: "issue",
      severity: "common",

      // Тепловая карта
      affectedAreas: [
        { muscleId: "erector-spinae", intensity: "high" },
        { muscleId: "quadratus-lumborum", intensity: "high" }
      ],

      // Краткая информация
      causes: ["Слабый кор", "Долгое сидение", "Плохая техника"],
      symptoms: ["Тупая боль", "Скованность утром", "Боль при наклонах"],

      // Решение
      goalIds: ["eliminate-lower-back-pain"],
      exerciseIds: ["bird-dog", "dead-bug", "plank"],

      position: { x: 180, y: 400 }
    },
    {
      id: "shoulder-impingement",
      title: "Импинджмент плеча",
      type: "issue",
      severity: "moderate",

      affectedAreas: [
        { muscleId: "supraspinatus", intensity: "high" },
        { muscleId: "deltoid-anterior", intensity: "medium" }
      ],

      causes: ["Слабая вращательная манжета", "Чрезмерные жимы"],
      symptoms: ["Боль при подъёме руки 60-120°", "Ночная боль"],

      goalIds: ["fix-shoulder-pain"],
      exerciseIds: ["face-pull", "external-rotation"],

      position: { x: 180, y: 600 }
    }
  ],

  // НОВОЕ: Гаджеты и технологии
  gadgets: [
    {
      id: "gadgets-intro",
      title: "Гаджеты и технологии",
      type: "intro",
      content: "Современные устройства для отслеживания здоровья и тренировок",
      position: { x: 100, y: 100 }
    },
    {
      id: "fitness-trackers",
      title: "Фитнес-трекеры",
      type: "category",
      devices: [
        {
          name: "Apple Watch",
          features: ["ЧСС", "VO2 max", "ЭКГ", "Сон"],
          useCase: "Универсальный трекер"
        },
        {
          name: "Garmin",
          features: ["GPS", "Тренировочная нагрузка", "Восстановление"],
          useCase: "Для серьёзных спортсменов"
        },
        {
          name: "Whoop",
          features: ["HRV", "Strain", "Recovery", "Сон"],
          useCase: "Оптимизация восстановления"
        }
      ],
      position: { x: 100, y: 200 }
    },
    {
      id: "heart-rate-monitors",
      title: "Пульсометры",
      type: "category",
      content: "Нагрудные ремни vs оптические датчики",
      comparison: {
        chest: "Точнее, но менее удобно",
        optical: "Удобнее, но может ошибаться при интенсивных нагрузках"
      },
      position: { x: 100, y: 350 }
    },
    {
      id: "smart-scales",
      title: "Умные весы",
      type: "category",
      metrics: ["Вес", "% жира", "Мышечная масса", "Вода", "Костная масса"],
      note: "Точность биоимпеданса ограничена, используйте для трендов",
      position: { x: 100, y: 500 }
    }
  ]
};
```

---

## 🎨 Система Стилей (CSS Variables)

### Базовая Тема

```css
/* styles.css */

:root {
  /* Цвета слоёв */
  --layer-muscles: #00d4ff;
  --layer-nervous: #ffeb3b;
  --layer-respiratory: #4caf50;
  --layer-cardiovascular: #f44336;
  --layer-pain: #ff5252;
  --layer-gadgets: #9c27b0;

  /* Основные цвета */
  --bg-primary: #0f0f23;
  --bg-secondary: #1a1a2e;
  --bg-tertiary: #16213e;
  --text-primary: #e4e4e7;
  --text-secondary: #a1a1aa;
  --accent-primary: var(--layer-muscles);
  --accent-secondary: #667eea;
  --border-color: rgba(255, 255, 255, 0.1);

  /* Эффекты */
  --glow-color: var(--accent-primary);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);

  /* Анимации */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}

/* Светлая тема */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #e0e0e0;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --border-color: rgba(0, 0, 0, 0.1);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Динамическая смена акцентного цвета при переключении слоёв */
[data-layer="muscles"] {
  --accent-primary: var(--layer-muscles);
  --glow-color: rgba(0, 212, 255, 0.8);
}

[data-layer="nervous"] {
  --accent-primary: var(--layer-nervous);
  --glow-color: rgba(255, 235, 59, 0.8);
}

[data-layer="respiratory"] {
  --accent-primary: var(--layer-respiratory);
  --glow-color: rgba(76, 175, 80, 0.8);
}

[data-layer="cardiovascular"] {
  --accent-primary: var(--layer-cardiovascular);
  --glow-color: rgba(244, 67, 54, 0.8);
}

[data-layer="pain"] {
  --accent-primary: var(--layer-pain);
  --glow-color: rgba(255, 82, 82, 0.8);
}

[data-layer="gadgets"] {
  --accent-primary: var(--layer-gadgets);
  --glow-color: rgba(156, 39, 176, 0.8);
}
```

### Тоггл Темы

```javascript
// js/ui/themeToggle.js

export class ThemeToggle {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.createToggle();
  }

  createToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
    toggle.title = 'Переключить тему';

    toggle.addEventListener('click', () => this.toggle());

    document.body.appendChild(toggle);
  }

  toggle() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);

    // Update button icon
    const button = document.querySelector('.theme-toggle');
    button.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
```

---

## 📊 Визуализация Графа Связей

### Концепция

```javascript
// js/ui/relationshipGraph.js

import { DataResolver } from '../core/dataResolver.js';

export class RelationshipGraph {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.graph = null;
  }

  /**
   * Показать граф для сущности
   */
  show(entityType, entityId) {
    const graph = DataResolver.buildRelationshipGraph(entityType, entityId, 2);
    this.render(graph);
  }

  /**
   * Отрисовать граф
   */
  render(graph) {
    // Используем простую визуализацию на Canvas или SVG
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    this.container.innerHTML = '';
    this.container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Простая force-directed layout
    const nodes = this.layoutNodes(graph.nodes);
    const edges = graph.edges;

    // Отрисовка
    this.drawEdges(ctx, edges, nodes);
    this.drawNodes(ctx, nodes);

    // Интерактивность
    this.addInteractivity(canvas, nodes);
  }

  layoutNodes(nodes) {
    // Простой круговой layout
    const centerX = 400;
    const centerY = 300;
    const radius = 200;

    return nodes.map((node, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI;
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        radius: 30
      };
    });
  }

  drawNodes(ctx, nodes) {
    nodes.forEach(node => {
      // Цвет по типу
      const colors = {
        muscles: '#00d4ff',
        exercises: '#4caf50',
        goals: '#ff9800',
        issues: '#ff5252'
      };

      ctx.fillStyle = colors[node.type] || '#666';
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      ctx.fill();

      // Название
      ctx.fillStyle = '#fff';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(node.data.name, node.x, node.y + node.radius + 15);
    });
  }

  drawEdges(ctx, edges, nodes) {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    edges.forEach(edge => {
      const from = nodeMap.get(edge.from);
      const to = nodeMap.get(edge.to);

      if (!from || !to) return;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    });
  }

  addInteractivity(canvas, nodes) {
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Найти кликнутый узел
      const clicked = nodes.find(node => {
        const dx = x - node.x;
        const dy = y - node.y;
        return Math.sqrt(dx*dx + dy*dy) < node.radius;
      });

      if (clicked) {
        // Показать детали или перейти к сущности
        this.onNodeClick(clicked);
      }
    });
  }

  onNodeClick(node) {
    // Навигация к сущности
    window.dispatchEvent(new CustomEvent('navigate', {
      detail: { route: `/${node.type}/${node.data.id}` }
    }));
  }
}
```

### Использование

```javascript
// В карточке мышцы
const graphBtn = document.createElement('button');
graphBtn.textContent = '🔗 Показать связи';
graphBtn.addEventListener('click', () => {
  const graph = new RelationshipGraph('graph-container');
  graph.show('muscles', 'pectoralis-major');
});
```

---

## 🗂️ Упрощённая Файловая Структура

```
muscles/
├── index.html
├── styles.css                    # Единая система стилей с CSS Variables
│
├── assets/
│   └── svg/
│       ├── body-front.svg        # Мышцы
│       ├── body-back.svg
│       └── (остальные SVG по мере необходимости)
│
├── js/
│   ├── main.js
│   │
│   ├── config/
│   │   ├── systemLayers.js       # Конфигурация 6 слоёв (+ gadgets)
│   │   ├── muscleData.js         # Детальные данные мышц
│   │   ├── muscleIdMap.js        # Маппинг SVG → мышцы
│   │   ├── systemBlocks.js       # Упрощённые блоки для остальных систем
│   │   ├── exerciseData.js
│   │   ├── goalData.js
│   │   └── tags.js
│   │
│   ├── core/
│   │   ├── svgLoader.js
│   │   ├── interactivity.js      # Только для мышц
│   │   ├── systemSwitcher.js
│   │   ├── dataResolver.js       # Граф связей
│   │   ├── search.js
│   │   └── router.js
│   │
│   ├── ui/
│   │   ├── layerSlider.js
│   │   ├── burgerMenu.js
│   │   ├── themeToggle.js        # НОВОЕ: переключатель темы
│   │   ├── relationshipGraph.js  # НОВОЕ: визуализация графа
│   │   ├── systemBlocks.js       # Отрисовка блоков поверх SVG
│   │   ├── sidebar.js
│   │   └── filterPage.js
│   │
│   └── utils/
│       └── helpers.js
│
└── docs/
    ├── MULTILAYER_ARCHITECTURE.md
    ├── MULTILAYER_ARCHITECTURE_PART2.md
    ├── IMPLEMENTATION_ROADMAP.md
    └── REVISED_PLAN.md (этот файл)
```

---

## 🚀 Обновлённый План Реализации

### Фаза 1: Инфраструктура (1-2 недели)

- [x] Создать файловую структуру
- [ ] Настроить CSS Variables для тем
- [ ] Реализовать `ThemeToggle`
- [ ] Настроить `systemLayers.js` (6 слоёв)
- [ ] Создать `systemBlocks.js` (упрощённые блоки)
- [ ] Реализовать `DataResolver` с графом связей

### Фаза 2: Слайдер + Блоки (1 неделя)

- [ ] UI компонент `LayerSlider` (6 слоёв)
- [ ] Компонент `SystemBlocks` для отрисовки блоков поверх SVG
- [ ] Переключение между слоями
- [ ] Базовые переходы (fade)

### Фаза 3: Контент (2 недели)

**Приоритет 1: Мышцы** (уже есть)
- [ ] Дополнить 8-12 мышц

**Приоритет 2: Боли** (1 неделя)
- [ ] 3-5 проблем с тепловыми картами
- [ ] Связи с мышцами и упражнениями

**Приоритет 3: Остальные системы** (1 неделя)
- [ ] 3-5 блоков для нервной системы
- [ ] 3-5 блоков для дыхательной
- [ ] 3-5 блоков для сердечно-сосудистой
- [ ] 3-5 блоков для гаджетов

### Фаза 4: Граф Связей (1 неделя)

- [ ] Реализовать `RelationshipGraph`
- [ ] Интеграция в карточки мышц/упражнений
- [ ] Интерактивность (клик на узел)

### Фаза 5: Навигация (1 неделя)

- [ ] Бургер-меню
- [ ] Роутер
- [ ] Поиск
- [ ] Фильтрация

### Фаза 6: Полировка (1-2 недели)

- [ ] Адаптивность
- [ ] Производительность
- [ ] SEO
- [ ] Тестирование

**Итого: 7-9 недель до MVP**

---

## ✅ Что Откладываем на Потом

1. ❌ Детальные данные для нервов (типа `nerveData`)
2. ❌ Анимации сердцебиения, дыхания
3. ❌ Связи respiratory/cardiovascular с упражнениями (пока)
4. ❌ Сложные анимации переходов между слоями
5. ❌ PWA функционал
6. ❌ Бэкенд

---

## 🎯 Готовы к Старту

**Следующий шаг:** Переключиться в Code mode и начать Фазу 1

**Вопросы перед стартом:**
1. Есть ли SVG для остальных систем или создавать заглушки?
2. Начинаем с настройки CSS Variables и ThemeToggle?
3. Какой слой после "Мышц" реализовать первым? (рекомендую "Боли")

---

**Документ создан:** 2026-02-10
**Версия:** 2.0 (Revised)
**Статус:** Ready to Code
**Следующий шаг:** Начать Фазу 1 в Code mode
