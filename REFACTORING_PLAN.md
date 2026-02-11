# 🔧 План Рефакторинга Кодовой Базы

## Цель
Улучшить структуру кода для более эффективной работы с LLM и упростить добавление новых слоёв.

---

## 📋 Этап 1: Базовый Класс для Слоёв

### Создать `js/core/BaseLayerRenderer.js`

**Общие методы для всех слоёв:**
- `waitForSVG()` - ожидание загрузки SVG
- `positionContainerOverSVG(svg)` - позиционирование контейнера
- `ensureContainer()` - создание контейнера
- `clear()` - очистка
- `hide()` / `show()` - скрытие/показ
- `destroy()` - удаление

**Абстрактные методы (переопределяются в наследниках):**
- `render()` - отрисовка элементов слоя
- `createItem(data)` - создание отдельного элемента
- `getData()` - получение данных для слоя

**Структура класса:**
```javascript
export class BaseLayerRenderer {
    constructor(layerName, containerClass) {
        this.layerName = layerName;
        this.containerClass = containerClass;
        this.container = null;
        this.items = [];
    }

    // Общие методы (полная реализация)
    waitForSVG() { /* Promise-based ожидание */ }
    positionContainerOverSVG(svg) { /* getBoundingClientRect */ }
    ensureContainer() { /* создание + append */ }
    clear() { /* очистка items */ }
    hide() { /* display: none */ }
    show() { /* display: block */ }
    destroy() { /* remove container */ }

    // Абстрактные методы
    render() { throw new Error('Must implement render()'); }
    createItem(data) { throw new Error('Must implement createItem()'); }
    getData() { throw new Error('Must implement getData()'); }
}
```

---

## 📋 Этап 2: Утилиты

### Создать `js/utils/dom.js`

**Функции:**
```javascript
// Ожидание элемента в DOM
export function waitForElement(selector, timeout = 5000) { /* ... */ }

// Создание элемента с классами и контентом
export function createElement(tag, options = {}) {
    // options: { className, id, innerHTML, attributes, styles }
}

// Добавление/удаление классов
export function toggleClass(element, className, force) { /* ... */ }

// Проверка видимости элемента
export function isVisible(element) { /* ... */ }
```

### Создать `js/utils/positioning.js`

**Функции:**
```javascript
// Получение границ элемента
export function getElementBounds(element) {
    return element.getBoundingClientRect();
}

// Позиционирование одного элемента поверх другого
export function positionOverElement(container, target, offset = {x: 0, y: 0}) {
    const targetRect = getElementBounds(target);
    const parentRect = getElementBounds(container.parentElement);

    container.style.left = `${targetRect.left - parentRect.left + offset.x}px`;
    container.style.top = `${targetRect.top - parentRect.top + offset.y}px`;
    container.style.width = `${targetRect.width}px`;
    container.style.height = `${targetRect.height}px`;
}

// Конвертация процентов в пиксели
export function percentToPixels(percent, containerSize) {
    return (percent / 100) * containerSize;
}
```

---

## 📋 Этап 3: Универсальный DetailView

### Создать `js/ui/DetailView.js`

**Универсальный компонент для всех слоёв:**

```javascript
export class DetailView {
    constructor() {
        this.container = null;
        this.currentData = null;
    }

    /**
     * Показать detail view
     * @param {Object} data - { title, subtitle, content, onClose }
     */
    show(data) {
        this.currentData = data;
        this.ensureContainer();
        this.render();
        this.container.classList.add('visible');
    }

    hide() {
        if (this.container) {
            this.container.classList.remove('visible');
            if (this.currentData?.onClose) {
                this.currentData.onClose();
            }
        }
    }

    ensureContainer() { /* создание если нет */ }

    render() {
        // Универсальная структура:
        // - Header (back button + title)
        // - Subtitle (опционально)
        // - Content (HTML из data.content)
    }
}
```

**Использование:**
```javascript
// В любом слое
import { DetailView } from './ui/DetailView.js';

const detailView = new DetailView();
detailView.show({
    title: 'Что такое боль?',
    subtitle: 'Физиология боли',
    content: '<p>Контент...</p>',
    onClose: () => console.log('Closed')
});
```

---

## 📋 Этап 4: Рефакторинг painPoints.js

### Обновить `js/ui/painPoints.js`

**Использовать BaseLayerRenderer:**

```javascript
import { BaseLayerRenderer } from '../core/BaseLayerRenderer.js';
import { getPainPoints } from '../config/painPointsData.js';
import { DetailView } from './DetailView.js';

export class PainPoints extends BaseLayerRenderer {
    constructor() {
        super('pain', 'pain-points-container');
        this.detailView = new DetailView();
    }

    // Переопределяем абстрактные методы
    getData() {
        return getPainPoints();
    }

    render() {
        this.clear();
        const points = this.getData();

        this.waitForSVG().then(svg => {
            this.ensureContainer();
            this.positionContainerOverSVG(svg);

            points.forEach(point => {
                const element = this.createItem(point);
                this.container.appendChild(element);
                this.items.push({ data: point, element });
            });

            this.container.classList.add('fade-in');
        });
    }

    createItem(pointData) {
        // Только специфичная логика создания точки
        const point = document.createElement('div');
        point.className = 'pain-point';
        // ... остальное

        point.addEventListener('click', () => {
            this.detailView.show({
                title: pointData.title,
                content: pointData.content
            });
        });

        return point;
    }
}
```

**Результат:** Файл сократится с ~145 строк до ~80 строк

---

## 📋 Этап 5: Разбить styles.css

### Создать структуру:

```
styles/
├── base.css          # Переменные, reset, body
├── themes.css        # Light/dark themes, data-layer colors
├── layout.css        # Sidebar, main-content, dual-view
├── components/
│   ├── buttons.css   # Zoom, toggle, layer buttons
│   ├── blocks.css    # System blocks, pain points
│   ├── detail.css    # Detail view (universal)
│   └── tooltip.css   # Tooltips
├── layers/
│   ├── muscles.css   # Muscle-specific styles
│   ├── pain.css      # Pain-specific styles
│   └── ...
└── mobile.css        # Mobile adaptations
```

### Создать `styles/index.css` (главный файл):

```css
/* Import all modules */
@import './base.css';
@import './themes.css';
@import './layout.css';
@import './components/buttons.css';
@import './components/blocks.css';
@import './components/detail.css';
@import './components/tooltip.css';
@import './layers/muscles.css';
@import './layers/pain.css';
@import './mobile.css';
```

### Обновить `index.html`:

```html
<!-- Было -->
<link rel="stylesheet" href="styles.css">

<!-- Стало -->
<link rel="stylesheet" href="styles/index.css">
```

---

## 📋 Этап 6: JSDoc Типы

### Создать `js/types.js`

**Определения типов для всего проекта:**

```javascript
/**
 * @typedef {Object} Position
 * @property {number} x - X coordinate in %
 * @property {number} y - Y coordinate in %
 */

/**
 * @typedef {Object} PainPoint
 * @property {string} id
 * @property {string} title
 * @property {Position} position
 * @property {string} content
 * @property {boolean} [calloutTop]
 */

/**
 * @typedef {Object} SystemBlock
 * @property {string} id
 * @property {string} title
 * @property {string} type - 'intro' | 'info' | 'tips' | 'calculator'
 * @property {string} content
 * @property {Position} position
 * @property {Array<string>} [relatedMuscles]
 * @property {Array<string>} [exerciseIds]
 */

/**
 * @typedef {Object} Layer
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {string} color
 * @property {string} svgPath
 * @property {boolean} dualView
 */

// ... и т.д. для всех типов данных
```

### Использовать в коде:

```javascript
/**
 * @param {PainPoint} pointData
 * @returns {HTMLElement}
 */
createItem(pointData) { /* ... */ }

/**
 * @param {Layer} layer
 * @returns {Promise<void>}
 */
async switchToLayer(layer) { /* ... */ }
```

---

## 📋 Этап 7: JSON Конфиги

### Создать JSON файлы:

**`js/config/layers.json`:**
```json
{
  "muscles": {
    "id": "muscles",
    "name": "Мышцы",
    "icon": "💪",
    "color": "#00d4ff",
    "svgPath": "img/body-{view}.svg",
    "dualView": true
  },
  "pain": {
    "id": "pain",
    "name": "Боли и травмы",
    "icon": "🩹",
    "color": "#ff5252",
    "svgPath": "img/body-front.svg",
    "dualView": false
  }
}
```

**`js/config/blocks.json`:**
```json
{
  "pain": [
    {
      "id": "what-is-pain",
      "title": "Что такое боль?",
      "position": { "x": 50, "y": 1.5 },
      "content": "<h3>Физиология боли</h3><p>...</p>"
    }
  ],
  "nervous": [ /* ... */ ]
}
```

### Создать загрузчики:

**`js/config/systemLayers.js`:**
```javascript
import layersData from './layers.json' assert { type: 'json' };

export const systemLayers = layersData;
export function getLayer(id) {
    return systemLayers[id];
}
```

**`js/config/systemBlocks.js`:**
```javascript
import blocksData from './blocks.json' assert { type: 'json' };

export const systemBlocks = blocksData;
export function getBlocksForLayer(layerId) {
    return systemBlocks[layerId] || [];
}
```

---

## 📊 Порядок Выполнения

### Сессия 1 (2-3 часа):
1. ✅ Создать `BaseLayerRenderer.js`
2. ✅ Создать утилиты (`dom.js`, `positioning.js`)
3. ✅ Создать универсальный `DetailView.js`
4. ✅ Рефакторить `painPoints.js`
5. ✅ Тестирование Pain Layer

### Сессия 2 (1-2 часа):
6. ✅ Разбить `styles.css` на модули
7. ✅ Обновить импорты в `index.html`
8. ✅ Тестирование стилей

### Сессия 3 (1 час):
9. ✅ Добавить JSDoc типы в `types.js`
10. ✅ Добавить JSDoc комментарии в существующие файлы

### Сессия 4 (1 час):
11. ✅ Конвертировать конфиги в JSON
12. ✅ Обновить импорты
13. ✅ Финальное тестирование

---

## ✅ Чеклист Проверки

После рефакторинга убедиться что:
- [ ] Pain Layer работает как раньше
- [ ] Все стили применяются корректно
- [ ] Светлая/тёмная тема работает
- [ ] Мобильная версия работает
- [ ] Нет ошибок в консоли
- [ ] Все импорты корректны

---

## 💰 Ожидаемая Выгода

**До рефакторинга:**
- `painPoints.js`: 145 строк
- `nervousBlocks.js`: ~145 строк (дубликат)
- `respiratoryBlocks.js`: ~145 строк (дубликат)
- **Итого для 5 слоёв:** ~725 строк

**После рефакторинга:**
- `BaseLayerRenderer.js`: 100 строк (один раз)
- `painPoints.js`: 80 строк (специфичная логика)
- `nervousBlocks.js`: 60 строк (меньше дублирования)
- **Итого для 5 слоёв:** ~400 строк

**Экономия:** ~45% кода + лучшая структура

---

## 🎯 Следующий Шаг

Переключиться в **Code mode** и выполнить Сессию 1 (пункты 1-5).
