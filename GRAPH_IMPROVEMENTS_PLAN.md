# 🎯 План Улучшений Графа

## 📋 Требования

### ✅ Что Делаем:
1. **Цвета из существующей палитры** - использовать CSS переменные
2. **Текст под узлами** с эффектами для читаемости
3. **Динамические размеры узлов** по количеству связей
4. **Слайдер "Порог"** вместо слайдера детализации
5. **Полупрозрачные связи** - тонкие линии с opacity
6. **Hover эффект** - увеличение + подсветка связанных
7. **Затемнение несвязанных** узлов (opacity 0.3)
8. **Плавные анимации** - smooth transitions

### ❌ Что НЕ Делаем:
- ❌ Темная тема (уже есть)
- ❌ Tooltip рядом с узлом
- ❌ Изменение легенды
- ❌ Поиск узлов

### ⏳ Отдельно Потом:
- 🔄 Drag & drop узлов (сложная фича)

---

## 🎨 Цветовая Схема

### Маппинг Типов → Цвета:
```javascript
const graphColors = {
  goals: 'var(--layer-respiratory)',      // #4caf50 (зеленый)
  exercises: 'var(--layer-muscles)',      // #00d4ff (голубой)
  muscles: 'var(--layer-pain)',           // #ff5252 (красный)
  pain: 'var(--layer-cardiovascular)'     // #f44336 (темно-красный)
};
```

### Почему Такой Маппинг:
- **Goals** → Зеленый (рост, достижение)
- **Exercises** → Голубой (действие, движение)
- **Muscles** → Красный (анатомия, тело)
- **Pain** → Темно-красный (проблема, внимание)

---

## 📐 Реализация по Шагам

### Шаг 1: Цвета из CSS Переменных
**Файл:** `js/ui/RelationshipGraph.js`

```javascript
getNodeColor(type) {
  const colors = {
    goals: '#4caf50',      // var(--layer-respiratory)
    exercises: '#00d4ff',  // var(--layer-muscles)
    muscles: '#ff5252',    // var(--layer-pain)
    pain: '#f44336'        // var(--layer-cardiovascular)
  };
  return colors[type] || '#999';
}
```

**Изменения:**
- Заменить текущие цвета на новые
- Использовать hex значения из CSS переменных

---

### Шаг 2: Динамический Размер Узлов
**Файл:** `js/ui/RelationshipGraph.js`

**Добавить метод:**
```javascript
getNodeRadius(node) {
  // Подсчет связей
  const connections = this.graphData.edges.filter(edge =>
    (edge.source === node || edge.source?.id === node.id) ||
    (edge.target === node || edge.target?.id === node.id)
  ).length;

  // Формула размера
  const baseSize = 15;
  const connectionBonus = connections * 3;
  const maxSize = 50;

  return Math.min(baseSize + connectionBonus, maxSize);
}
```

**Использовать в render():**
```javascript
// Вместо:
const radius = 20;

// Использовать:
const radius = this.getNodeRadius(node);
```

---

### Шаг 3: Улучшенный Текст под Узлами
**Файл:** `js/ui/RelationshipGraph.js` → `render()`

**Текущий код:**
```javascript
ctx.fillStyle = '#333';
ctx.font = '12px Inter, sans-serif';
ctx.textAlign = 'center';
ctx.fillText(label, node.x, node.y + radius + 15);
```

**Новый код:**
```javascript
// Текст с тенью для читаемости
ctx.fillStyle = '#ffffff';
ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
ctx.shadowBlur = 6;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 2;
ctx.font = 'bold 12px Inter, sans-serif';
ctx.textAlign = 'center';
ctx.fillText(label, node.x, node.y + radius + 18);

// Сброс тени
ctx.shadowBlur = 0;
ctx.shadowOffsetY = 0;
```

---

### Шаг 4: Полупрозрачные Связи
**Файл:** `js/ui/RelationshipGraph.js` → `render()`

**Текущий код:**
```javascript
ctx.strokeStyle = '#999';
ctx.lineWidth = 1;
```

**Новый код:**
```javascript
ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
ctx.lineWidth = 1;
```

---

### Шаг 5: Слайдер "Порог" (Threshold)
**Файл:** `js/ui/RelationshipGraph.js`

#### 5.1 Заменить createDepthSlider()
```javascript
createThresholdSlider() {
  const container = document.createElement('div');
  container.className = 'threshold-slider-container';

  const label = document.createElement('label');
  label.textContent = 'Порог связей: ';
  label.className = 'threshold-label';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = '10';
  slider.value = '0';
  slider.className = 'threshold-slider';
  slider.id = 'threshold-slider';

  const valueDisplay = document.createElement('span');
  valueDisplay.className = 'threshold-value';
  valueDisplay.id = 'threshold-value';
  valueDisplay.textContent = '0+ связей';

  // Throttled update
  let updateTimeout;
  slider.addEventListener('input', (e) => {
    const threshold = parseInt(e.target.value);
    valueDisplay.textContent = `${threshold}+ связей`;

    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      this.filterByThreshold(threshold);
    }, 300);
  });

  container.appendChild(label);
  container.appendChild(slider);
  container.appendChild(valueDisplay);

  return container;
}
```

#### 5.2 Добавить метод фильтрации
```javascript
filterByThreshold(minConnections) {
  this.graphData.nodes.forEach(node => {
    const connections = this.graphData.edges.filter(edge =>
      (edge.source === node || edge.source?.id === node.id) ||
      (edge.target === node || edge.target?.id === node.id)
    ).length;

    node.visible = connections >= minConnections;
  });

  this.applyFilters();
}
```

#### 5.3 Обновить createControls()
```javascript
createControls() {
  const controls = document.createElement('div');
  controls.className = 'graph-controls';

  // Threshold slider (вместо depth slider)
  const sliderContainer = this.createThresholdSlider();
  controls.appendChild(sliderContainer);

  // Filter buttons
  const filterContainer = this.createFilterButtons();
  controls.appendChild(filterContainer);

  this.container.appendChild(controls);
}
```

---

### Шаг 6: Hover Эффект
**Файл:** `js/ui/RelationshipGraph.js`

#### 6.1 Добавить состояние hover
```javascript
constructor() {
  // ... existing code
  this.hoveredNode = null;
  this.highlightedNodes = new Set();
}
```

#### 6.2 Добавить обработчик mousemove
```javascript
setupTouchGestures() {
  // ... existing touch code

  // Mouse hover for desktop
  this.canvas.addEventListener('mousemove', (e) => {
    if (!this.isMobile) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const node = this.findNodeAtPosition(x, y);

      if (node !== this.hoveredNode) {
        this.hoveredNode = node;
        if (node) {
          this.highlightConnectedNodes(node);
        } else {
          this.clearHighlight();
        }
        this.render();
      }
    }
  });
}
```

#### 6.3 Добавить методы подсветки
```javascript
highlightConnectedNodes(selectedNode) {
  this.highlightedNodes.clear();
  this.highlightedNodes.add(selectedNode.id);

  this.graphData.edges.forEach(edge => {
    const sourceId = edge.source?.id || edge.source;
    const targetId = edge.target?.id || edge.target;

    if (sourceId === selectedNode.id) {
      this.highlightedNodes.add(targetId);
    }
    if (targetId === selectedNode.id) {
      this.highlightedNodes.add(sourceId);
    }
  });
}

clearHighlight() {
  this.highlightedNodes.clear();
  this.hoveredNode = null;
}
```

#### 6.4 Обновить render() для подсветки
```javascript
render() {
  // ... existing code

  // Draw nodes
  this.graphData.nodes.forEach(node => {
    if (!node.visible || !node.x || !node.y) return;

    const isHighlighted = this.highlightedNodes.has(node.id);
    const isHovered = this.hoveredNode === node;
    const isDimmed = this.hoveredNode && !isHighlighted;

    const color = this.getNodeColor(node.type);
    let radius = this.getNodeRadius(node);

    // Увеличение при hover
    if (isHovered) {
      radius *= 1.2;
    }

    // Затемнение несвязанных
    const opacity = isDimmed ? 0.3 : 1.0;

    // Node circle
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    // Подсветка границы для hovered/highlighted
    if (isHighlighted) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = isHovered ? 4 : 2;
      ctx.stroke();
    } else {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.globalAlpha = 1.0;

    // ... text rendering
  });
}
```

---

### Шаг 7: Плавные Анимации
**Файл:** `styles/components/graph.css`

```css
/* Smooth transitions для всех элементов */
.graph-canvas {
  transition: all 0.3s ease;
}

.filter-btn {
  transition: all 0.2s ease;
}

.threshold-slider::-webkit-slider-thumb {
  transition: transform 0.2s ease;
}

/* Анимация появления */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.graph-canvas-container {
  animation: fadeIn 0.3s ease;
}
```

---

## 📊 Порядок Реализации

### Фаза 1: Визуальные Улучшения (30 мин)
1. ✅ Цвета из CSS переменных
2. ✅ Динамический размер узлов
3. ✅ Улучшенный текст с тенью
4. ✅ Полупрозрачные связи

### Фаза 2: Слайдер Порога (20 мин)
5. ✅ Заменить depth slider на threshold slider
6. ✅ Реализовать фильтрацию по связям
7. ✅ Обновить CSS стили

### Фаза 3: Интерактивность (30 мин)
8. ✅ Hover эффект
9. ✅ Подсветка связанных узлов
10. ✅ Затемнение несвязанных
11. ✅ Плавные анимации

### Фаза 4: Drag & Drop (Отдельно, 1-2 часа)
12. ⏳ Реализация перетаскивания узлов
13. ⏳ Обновление позиций в D3 simulation
14. ⏳ Touch support для мобильных

---

## 🎯 Ожидаемый Результат

После реализации граф будет:
- 🎨 Использовать существующую цветовую палитру
- 📊 Размер узлов отражает количество связей
- 🔍 Текст читаемый с тенью
- 🌫️ Связи полупрозрачные и ненавязчивые
- 🎚️ Слайдер порога для фильтрации
- 🖱️ Hover подсвечивает связанные узлы
- ✨ Плавные анимации всех изменений

---

## 📝 Изменяемые Файлы

1. **js/ui/RelationshipGraph.js** - основная логика
2. **styles/components/graph.css** - стили
3. **graph-demo.html** - возможно небольшие правки

---

**Готов начинать реализацию! Начнем с Фазы 1?**
