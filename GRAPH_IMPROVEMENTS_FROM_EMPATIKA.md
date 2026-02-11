# 🎨 Улучшения Графа на Основе Empatika.com

## 📊 Анализ Паттернов Empatika.com

### Визуальные Паттерны:

#### 1. **Темная Тема**
- ✅ Черный/темно-серый фон (#0a0a0a, #1a1a1a)
- ✅ Контрастные цвета узлов
- ✅ Полупрозрачные связи (#ffffff с opacity 0.1-0.2)
- ✅ Текст белый/светло-серый

#### 2. **Размеры Узлов**
- ✅ Динамический размер на основе важности/связей
- ✅ Диапазон: 20px - 80px радиус
- ✅ Формула: `radius = 20 + (connections * 2)`

#### 3. **Текст на Узлах**
- ✅ Название прямо на кружке (не под ним)
- ✅ Белый текст с тенью для читаемости
- ✅ Размер шрифта зависит от размера узла
- ✅ Перенос текста для длинных названий

#### 4. **Цветовая Схема**
```javascript
const empatikColors = {
  'AI и автоматизация': '#ff6b9d',      // Розовый
  'Продукт и рост': '#4ecdc4',          // Бирюзовый
  'Системы и ограничения': '#a78bfa',   // Фиолетовый
  'Стартапы': '#ffd93d',                // Желтый
  'Лидерство и команда': '#95e1d3',     // Мятный
  'Знания и обучение': '#38b6ff'        // Голубой
};
```

### Интерактивные Паттерны:

#### 1. **Hover Эффект**
- ✅ Увеличение узла на 10-20%
- ✅ Подсветка связанных узлов
- ✅ Затемнение несвязанных узлов (opacity 0.3)
- ✅ Утолщение связей к выбранному узлу

#### 2. **Клик на Узел**
- ✅ Tooltip рядом с узлом (не bottom sheet)
- ✅ Показать количество связей
- ✅ Список связанных узлов
- ✅ Боковая панель с деталями (на десктопе)

#### 3. **Анимации**
- ✅ Плавное появление узлов (fade-in)
- ✅ Пульсация при hover
- ✅ Smooth transitions для всех изменений
- ✅ Easing: cubic-bezier(0.4, 0, 0.2, 1)

### UI Элементы:

#### 1. **Ползунок "Порог"**
- ✅ Фильтрация по количеству связей
- ✅ Показывать только узлы с N+ связями
- ✅ Динамическое обновление графа

#### 2. **Легенда**
- ✅ Справа вверху
- ✅ Цветные точки + названия категорий
- ✅ Кликабельная (фильтр по категории)
- ✅ Компактная на мобильных

#### 3. **Поиск**
- ✅ Поле поиска вверху слева
- ✅ Подсветка найденных узлов
- ✅ Автофокус на найденном узле

---

## 🚀 План Реализации

### Фаза 1: Визуальные Улучшения (Приоритет)

#### 1.1 Темная Тема
```css
.relationship-graph-container {
  background: #0a0a0a;
}

.graph-canvas {
  background: #0a0a0a;
}
```

#### 1.2 Динамические Размеры Узлов
```javascript
getNodeRadius(node) {
  const connections = this.graphData.edges.filter(
    e => e.source === node || e.target === node
  ).length;
  return Math.min(20 + connections * 2, 60); // Max 60px
}
```

#### 1.3 Текст на Узлах
```javascript
// Вместо текста под узлом
ctx.fillText(label, node.x, node.y + radius + 15);

// Текст НА узле
ctx.fillStyle = '#ffffff';
ctx.font = `${radius / 3}px Inter, sans-serif`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(label, node.x, node.y);
```

#### 1.4 Улучшенные Цвета
```javascript
const improvedColors = {
  goals: '#4ecdc4',      // Бирюзовый (вместо зеленого)
  exercises: '#38b6ff',  // Голубой (вместо синего)
  muscles: '#ffd93d',    // Желтый (вместо оранжевого)
  pain: '#ff6b9d'        // Розовый (вместо красного)
};
```

### Фаза 2: Интерактивность

#### 2.1 Hover Эффект
```javascript
canvas.addEventListener('mousemove', (e) => {
  const node = findNodeAtPosition(e.x, e.y);
  if (node) {
    // Highlight connected nodes
    highlightConnectedNodes(node);
    // Show tooltip
    showTooltip(node, e.x, e.y);
  } else {
    clearHighlight();
    hideTooltip();
  }
});
```

#### 2.2 Tooltip Рядом с Узлом
```javascript
showTooltip(node, x, y) {
  const tooltip = document.getElementById('graph-tooltip');
  tooltip.innerHTML = `
    <div class="tooltip-title">${node.data.title}</div>
    <div class="tooltip-connections">${connections} связей</div>
    <div class="tooltip-related">
      ${relatedNodes.map(n => `<div>${n.title}</div>`).join('')}
    </div>
  `;
  tooltip.style.left = `${x + 20}px`;
  tooltip.style.top = `${y}px`;
  tooltip.classList.add('visible');
}
```

#### 2.3 Подсветка Связанных Узлов
```javascript
highlightConnectedNodes(selectedNode) {
  const connectedIds = new Set();

  this.graphData.edges.forEach(edge => {
    if (edge.source === selectedNode) connectedIds.add(edge.target.id);
    if (edge.target === selectedNode) connectedIds.add(edge.source.id);
  });

  this.graphData.nodes.forEach(node => {
    node.highlighted = node === selectedNode || connectedIds.has(node.id);
    node.dimmed = !node.highlighted;
  });

  this.render();
}
```

### Фаза 3: Дополнительные Фичи

#### 3.1 Ползунок Порога
```javascript
createThresholdSlider() {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = '10';
  slider.value = '0';

  slider.addEventListener('input', (e) => {
    const threshold = parseInt(e.target.value);
    this.filterByConnections(threshold);
  });
}

filterByConnections(minConnections) {
  this.graphData.nodes.forEach(node => {
    const connections = this.graphData.edges.filter(
      e => e.source === node || e.target === node
    ).length;
    node.visible = connections >= minConnections;
  });
  this.render();
}
```

#### 3.2 Поиск Узлов
```javascript
searchNodes(query) {
  const lowerQuery = query.toLowerCase();
  const found = this.graphData.nodes.filter(node =>
    (node.data.title || '').toLowerCase().includes(lowerQuery)
  );

  if (found.length > 0) {
    this.focusOnNode(found[0]);
    this.highlightConnectedNodes(found[0]);
  }
}
```

---

## 📐 Конкретные Изменения

### 1. Темная Тема (styles/components/graph.css)
```css
.relationship-graph-container {
  background: #0a0a0a;
}

.graph-canvas {
  background: #0a0a0a;
}

.graph-controls {
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
}

.graph-legend {
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  color: #e0e0e0;
}

.depth-label,
.depth-value {
  color: #e0e0e0;
}
```

### 2. Улучшенные Цвета (RelationshipGraph.js)
```javascript
getNodeColor(type) {
  const colors = {
    goals: '#4ecdc4',      // Бирюзовый
    exercises: '#38b6ff',  // Голубой
    muscles: '#ffd93d',    // Желтый
    pain: '#ff6b9d'        // Розовый
  };
  return colors[type] || '#999';
}
```

### 3. Текст на Узлах (render method)
```javascript
// Node label ON the node
ctx.fillStyle = '#ffffff';
ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
ctx.shadowBlur = 4;
ctx.font = `${Math.max(10, radius / 3)}px Inter, sans-serif`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Wrap text if too long
const maxWidth = radius * 1.8;
const words = label.split(' ');
let line = '';
let y = node.y;

words.forEach(word => {
  const testLine = line + word + ' ';
  const metrics = ctx.measureText(testLine);
  if (metrics.width > maxWidth && line !== '') {
    ctx.fillText(line, node.x, y);
    line = word + ' ';
    y += radius / 3;
  } else {
    line = testLine;
  }
});
ctx.fillText(line, node.x, y);
ctx.shadowBlur = 0;
```

### 4. Динамический Размер Узлов
```javascript
getNodeRadius(node) {
  // Count connections
  const connections = this.graphData.edges.filter(edge =>
    edge.source === node || edge.target === node ||
    edge.source.id === node.id || edge.target.id === node.id
  ).length;

  // Base size + connections bonus
  const baseSize = 15;
  const connectionBonus = connections * 2;
  const maxSize = 50;

  return Math.min(baseSize + connectionBonus, maxSize);
}
```

---

## ✅ Приоритетный Список

### Сделать Сейчас:
1. ✅ Темная тема (фон, контролы, легенда)
2. ✅ Улучшенные цвета (empatika palette)
3. ✅ Текст НА узлах (не под ними)
4. ✅ Динамический размер узлов

### Сделать Потом:
5. ⏳ Hover эффект с подсветкой
6. ⏳ Tooltip рядом с узлом
7. ⏳ Ползунок порога связей
8. ⏳ Поиск узлов

---

## 🎯 Ожидаемый Результат

После применения этих паттернов граф будет:
- ✨ Визуально похож на empatika.com
- 🎨 Темная тема с контрастными цветами
- 📊 Размер узлов отражает важность
- 🔍 Легко читаемый текст на узлах
- 🖱️ Интерактивный с подсветкой связей
- 📱 Адаптивный для мобильных

**Начнем с визуальных улучшений (темная тема + цвета + текст на узлах)?**
