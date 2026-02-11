# 🚀 График Связей - План Дальнейшего Развития

## 📊 Текущее Состояние (Checkpoint)

### ✅ Что Работает:
- **Базовая визуализация** - D3.js force-directed граф на Canvas
- **Mobile-first** - touch gestures (pinch zoom, pan, drag узлов)
- **Threshold slider** - фильтрация по количеству связей (0-10+)
- **Фильтры типов** - цели/упражнения/мышцы/боли
- **Bottom sheet** - детали узла на мобильных
- **Auto-zoom** - автоматическое масштабирование после 50 тиков
- **Drag узлов** - работает на touch и mouse
- **Кнопка "Все цели"** - показывает все цели одновременно
- **CSS переменные** - визуальные параметры вынесены в CSS
- **Вертикальный layout** - узлы распределяются по высоте (для узких экранов)

### 📁 Файлы:
- [`js/ui/RelationshipGraph.js`](js/ui/RelationshipGraph.js:1) - основной компонент
- [`js/config/goalData.js`](js/config/goalData.js:1) - данные целей
- [`js/config/exerciseData.js`](js/config/exerciseData.js:1) - данные упражнений
- [`js/core/dataResolver.js`](js/core/dataResolver.js:1) - построение графов
- [`styles/components/graph.css`](styles/components/graph.css:1) - стили графа
- [`graph-demo.html`](graph-demo.html:1) - демо страница
- [`GRAPH_PHYSICS_TUNING.md`](GRAPH_PHYSICS_TUNING.md:1) - документация по настройке физики

### ⚙️ Текущие Параметры Физики:

```javascript
// Для многих узлов (>20):
linkDistance: 35px          // Расстояние между связанными узлами
chargeStrength: -100        // Сила отталкивания
maxRepulsionDistance: 70px  // Максимальная дистанция отталкивания
forceX strength: 0.05       // Слабое горизонтальное притяжение
forceY strength: 0.15       // Сильное вертикальное притяжение
collisionRadius: 25px       // Радиус коллизии

// Для малого количества (<20):
linkDistance: 60px
chargeStrength: -200
maxRepulsionDistance: 120px
```

---

## 🎯 Приоритетные Задачи

### 1. **Улучшение Компоновки Графа** 🎨

#### Проблема:
- Узлы без связей разлетаются слишком далеко
- Несвязанные цели располагаются на расстоянии ~3 ширины экрана
- Нужна более плотная группировка

#### Решения для Тестирования:

**A. Кластеризация по типам**
```javascript
// Добавить силу притяжения узлов одного типа
.force('cluster', d3.forceCluster()
    .centers(clusterCenters)  // Центры для каждого типа
    .strength(0.2))
```

**B. Ограничение области**
```javascript
// Ограничить движение узлов прямоугольником
.force('box', () => {
    nodes.forEach(node => {
        node.x = Math.max(minX, Math.min(maxX, node.x));
        node.y = Math.max(minY, Math.min(maxY, node.y));
    });
})
```

**C. Более агрессивное центрирование**
```javascript
// Увеличить силу притяжения к центру
.force('x', d3.forceX(width / 2).strength(0.15))  // Было 0.05
.force('y', d3.forceY(height / 2).strength(0.25))  // Было 0.15
```

**D. Уменьшить linkDistance еще больше**
```javascript
const linkDistance = nodeCount > 20 ? 25 : 50;  // Было 35/60
```

#### Файлы для Изменения:
- [`js/ui/RelationshipGraph.js`](js/ui/RelationshipGraph.js:899) - метод `renderCanvasGraph()`

---

### 2. **Оптимизация Auto-Zoom** ⚡

#### Проблема:
- Auto-zoom срабатывает после 50 тиков (~0.5-1 сек)
- Можно сделать более плавным и адаптивным

#### Решения:

**A. Прогрессивный zoom**
```javascript
// Постепенно приближать на каждом тике
if (tickCount > 20 && tickCount < 100) {
    const targetScale = calculateOptimalScale();
    const currentScale = this.touchState.scale;
    this.touchState.scale += (targetScale - currentScale) * 0.1;
}
```

**B. Zoom на основе alpha**
```javascript
// Zoom когда симуляция достаточно остыла
this.simulation.on('tick', () => {
    if (this.simulation.alpha() < 0.3 && !hasAutoZoomed) {
        this.autoZoomToFit();
        hasAutoZoomed = true;
    }
});
```

**C. Адаптивный padding**
```javascript
// Padding зависит от количества узлов
const padding = nodeCount > 50 ? 50 : 100;
```

#### Файлы для Изменения:
- [`js/ui/RelationshipGraph.js`](js/ui/RelationshipGraph.js:935) - метод `renderCanvasGraph()` (tick handler)
- [`js/ui/RelationshipGraph.js`](js/ui/RelationshipGraph.js:945) - метод `autoZoomToFit()`

---

### 3. **Улучшение Визуализации** 🎨

#### A. Типы Связей (Edge Types)

**Текущее состояние:** Все связи одинаковые (белые, 2px)

**Предложение:** Разные стили для разных типов связей

```javascript
// В методе render()
const edgeStyles = {
    'requires': { color: 'rgba(33, 150, 243, 0.3)', width: 2, dash: [] },
    'targets': { color: 'rgba(255, 152, 0, 0.3)', width: 2, dash: [] },
    'includes': { color: 'rgba(76, 175, 80, 0.2)', width: 1, dash: [5, 5] },
    'variation': { color: 'rgba(156, 39, 176, 0.2)', width: 1, dash: [2, 2] }
};

const style = edgeStyles[edge.type] || edgeStyles.default;
ctx.strokeStyle = style.color;
ctx.lineWidth = style.width;
ctx.setLineDash(style.dash);
```

**CSS переменные:**
```css
:root {
    --graph-edge-requires: 33, 150, 243;
    --graph-edge-targets: 255, 152, 0;
    --graph-edge-includes: 76, 175, 80;
    --graph-edge-variation: 156, 39, 176;
}
```

#### B. Анимированные Связи

```javascript
// Пульсирующие связи для активных узлов
if (isHighlighted) {
    const pulse = Math.sin(Date.now() / 500) * 0.5 + 0.5;
    ctx.globalAlpha = 0.3 + pulse * 0.4;
}
```

#### C. Иконки на Узлах

```javascript
// Рисовать emoji иконки на узлах
const icons = {
    goals: '🎯',
    exercises: '🏋️',
    muscles: '💪',
    pain: '⚠️'
};

ctx.font = '16px Arial';
ctx.fillText(icons[node.type], node.x - 8, node.y + 5);
```

#### Файлы для Изменения:
- [`js/ui/RelationshipGraph.js`](js/ui/RelationshipGraph.js:1022) - метод `render()`
- [`styles/components/graph.css`](styles/components/graph.css:7) - CSS переменные

---

### 4. **Режимы Визуализации** 🔄

#### Предложение: Добавить переключатель режимов

**A. Force-Directed (текущий)**
- Физическая симуляция
- Динамическое расположение

**B. Hierarchical (иерархический)**
- Цели сверху
- Упражнения в середине
- Мышцы снизу

```javascript
// Использовать d3.forceY с разными центрами
const yPositions = {
    goals: height * 0.2,
    exercises: height * 0.5,
    muscles: height * 0.8
};

.force('y', d3.forceY(d => yPositions[d.type]).strength(0.3))
```

**C. Radial (радиальный)**
- Выбранная цель в центре
- Упражнения по кругу
- Мышцы на внешнем круге

```javascript
.force('r', d3.forceRadial(d => {
    if (d.type === 'goals') return 0;
    if (d.type === 'exercises') return 150;
    return 250;
}, width / 2, height / 2).strength(0.8))
```

#### UI:
```html
<div class="graph-mode-selector">
    <button data-mode="force">🌀 Force</button>
    <button data-mode="hierarchical">📊 Hierarchy</button>
    <button data-mode="radial">⭕ Radial</button>
</div>
```

#### Файлы для Создания:
- Новый метод `setLayoutMode(mode)` в [`js/ui/RelationshipGraph.js`](js/ui/RelationshipGraph.js:1)
- Обновить [`styles/components/graph.css`](styles/components/graph.css:1) для кнопок режимов

---

### 5. **Производительность** ⚡

#### A. Виртуализация для Больших Графов

```javascript
// Рендерить только видимые узлы
render() {
    const visibleNodes = this.graphData.nodes.filter(node => {
        return node.x > -100 && node.x < width + 100 &&
               node.y > -100 && node.y < height + 100;
    });

    // Рендерить только visibleNodes
}
```

#### B. Throttle для Render

```javascript
// Ограничить FPS до 30
let lastRenderTime = 0;
this.simulation.on('tick', () => {
    const now = Date.now();
    if (now - lastRenderTime > 33) {  // ~30 FPS
        this.render();
        lastRenderTime = now;
    }
});
```

#### C. WebWorker для Симуляции

```javascript
// Вынести D3 симуляцию в Web Worker
const worker = new Worker('graph-worker.js');
worker.postMessage({ nodes, edges });
worker.onmessage = (e) => {
    this.graphData.nodes = e.data.nodes;
    this.render();
};
```

#### Файлы для Изменения:
- [`js/ui/RelationshipGraph.js`](js/ui/RelationshipGraph.js:1003) - метод `render()`
- Создать `js/workers/graph-worker.js` для WebWorker

---

### 6. **Интеграция с Основным Приложением** 🔗

#### A. Добавить Граф в Главное Приложение

**Текущее состояние:** Граф работает только в [`graph-demo.html`](graph-demo.html:1)

**План:**
1. Добавить кнопку "Граф связей" в [`index.html`](index.html:1)
2. Открывать граф в модальном окне или отдельной вкладке
3. Передавать текущую выбранную мышцу/боль как начальный узел

```javascript
// В index.html
<button id="show-graph-btn">📊 Граф связей</button>

// В main.js
document.getElementById('show-graph-btn').addEventListener('click', () => {
    const currentMuscle = getCurrentSelectedMuscle();
    showGraphModal('muscles', currentMuscle.id);
});
```

#### B. Двусторонняя Связь

```javascript
// При клике на узел в графе - подсветить в основном приложении
graph.on('nodeClick', (node) => {
    if (node.type === 'muscles') {
        highlightMuscleInMainApp(node.data.id);
    }
});
```

#### Файлы для Изменения:
- [`index.html`](index.html:1) - добавить кнопку
- [`js/main.js`](js/main.js:1) - добавить обработчик
- [`js/ui/RelationshipGraph.js`](js/ui/RelationshipGraph.js:1) - добавить события

---

### 7. **Дополнительные Фичи** ✨

#### A. Поиск Узлов

```html
<input type="text" id="graph-search" placeholder="Поиск узла...">
```

```javascript
searchNodes(query) {
    const matches = this.graphData.nodes.filter(node =>
        node.data.title.toLowerCase().includes(query.toLowerCase())
    );

    // Подсветить найденные узлы
    this.highlightedNodes = new Set(matches.map(n => n.id));
    this.render();
}
```

#### B. Экспорт Графа

```javascript
exportGraph() {
    // PNG
    const dataUrl = this.canvas.toDataURL('image/png');
    downloadFile(dataUrl, 'graph.png');

    // JSON
    const json = JSON.stringify(this.graphData, null, 2);
    downloadFile(json, 'graph.json');
}
```

#### C. История Навигации

```javascript
// Стек посещенных узлов
this.history = [];

show(entityType, entityId) {
    this.history.push({ type: entityType, id: entityId });
    // ... render
}

goBack() {
    if (this.history.length > 1) {
        this.history.pop();
        const prev = this.history[this.history.length - 1];
        this.show(prev.type, prev.id);
    }
}
```

#### D. Сохранение Позиций Узлов

```javascript
// Сохранить позиции в localStorage
saveLayout() {
    const positions = {};
    this.graphData.nodes.forEach(node => {
        positions[node.id] = { x: node.x, y: node.y };
    });
    localStorage.setItem('graph-layout', JSON.stringify(positions));
}

// Восстановить позиции
loadLayout() {
    const positions = JSON.parse(localStorage.getItem('graph-layout'));
    if (positions) {
        this.graphData.nodes.forEach(node => {
            if (positions[node.id]) {
                node.x = positions[node.id].x;
                node.y = positions[node.id].y;
            }
        });
    }
}
```

---

## 📝 Рекомендации по Приоритетам

### Высокий Приоритет (Сделать Сначала):
1. ✅ **Улучшение компоновки графа** - критично для UX
2. ✅ **Оптимизация auto-zoom** - улучшит первое впечатление
3. ✅ **Типы связей** - улучшит читаемость

### Средний Приоритет:
4. **Режимы визуализации** - добавит гибкости
5. **Интеграция с основным приложением** - сделает граф полезным
6. **Производительность** - важно для больших графов

### Низкий Приоритет (Nice to Have):
7. **Дополнительные фичи** - поиск, экспорт, история

---

## 🔧 Технические Детали

### Параметры для Экспериментов:

```javascript
// Попробовать разные комбинации:

// Очень плотный граф
linkDistance: 25
chargeStrength: -80
maxRepulsionDistance: 50
forceY strength: 0.3

// Сбалансированный
linkDistance: 40
chargeStrength: -120
maxRepulsionDistance: 80
forceY strength: 0.2

// Свободный
linkDistance: 60
chargeStrength: -200
maxRepulsionDistance: 120
forceY strength: 0.1
```

### Полезные D3 Силы:

```javascript
// Притяжение к точке
d3.forceX(x).strength(s)
d3.forceY(y).strength(s)

// Радиальное притяжение
d3.forceRadial(radius, x, y).strength(s)

// Отталкивание
d3.forceManyBody().strength(s).distanceMax(d)

// Связи
d3.forceLink(edges).distance(d).strength(s)

// Коллизии
d3.forceCollide(radius).strength(s)

// Центрирование (deprecated, use forceX/Y)
d3.forceCenter(x, y)
```

---

## 📚 Полезные Ресурсы

### D3.js Документация:
- [D3 Force Simulation](https://github.com/d3/d3-force)
- [D3 Force Examples](https://observablehq.com/@d3/force-directed-graph)
- [D3 Force Layout Parameters](https://github.com/d3/d3-force#simulation_force)

### Примеры Графов:
- [Empatika.com](https://empatika.com) - референс для "волшебного эффекта"
- [Observable D3 Gallery](https://observablehq.com/@d3/gallery)

### Оптимизация Canvas:
- [Canvas Performance Tips](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [Offscreen Canvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)

---

## 🎯 Следующая Сессия - Быстрый Старт

### Для Начала Работы:

1. **Прочитать этот файл** [`GRAPH_NEXT_STEPS.md`](GRAPH_NEXT_STEPS.md:1)
2. **Открыть** [`graph-demo.html`](graph-demo.html:1) в браузере
3. **Проверить** текущее состояние
4. **Выбрать задачу** из списка приоритетов
5. **Начать с** [`js/ui/RelationshipGraph.js`](js/ui/RelationshipGraph.js:1)

### Команды для Тестирования:

```bash
# Открыть demo
open graph-demo.html

# Или запустить локальный сервер
python -m http.server 8000
# Затем открыть http://localhost:8000/graph-demo.html
```

### Быстрые Тесты:

```javascript
// В консоли браузера:

// Изменить параметры физики
graph.simulation.force('charge').strength(-50);
graph.simulation.alpha(1).restart();

// Изменить zoom
graph.touchState.scale = 0.5;
graph.render();

// Показать все узлы
graph.graphData.nodes.forEach(n => n.visible = true);
graph.render();
```

---

## ✅ Чеклист для Следующей Сессии

- [ ] Прочитать [`GRAPH_NEXT_STEPS.md`](GRAPH_NEXT_STEPS.md:1)
- [ ] Открыть [`graph-demo.html`](graph-demo.html:1) и протестировать
- [ ] Выбрать 1-2 задачи из приоритетного списка
- [ ] Прочитать [`GRAPH_PHYSICS_TUNING.md`](GRAPH_PHYSICS_TUNING.md:1) для понимания параметров
- [ ] Начать с улучшения компоновки графа
- [ ] Тестировать на мобильном устройстве

---

**Создано:** 2026-02-11
**Статус:** Готово к продолжению
**Приоритет:** Высокий - улучшение компоновки графа
