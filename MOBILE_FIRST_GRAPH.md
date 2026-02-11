# 📱 Mobile-First Граф Связей

## 🎯 Приоритет: Мобильная Версия

**Важно:** Фокус на мобильной версии, десктоп - потом.

---

## 📱 Мобильная Версия Графа

### Интерфейс для мобильных:

```
┌─────────────────────────────┐
│ ← Граф связей          [⋮]  │ ← Компактный header
├─────────────────────────────┤
│                             │
│  [━━━━━●━━━━] 2 уровня     │ ← Ползунок детализации
│                             │
│  [🎯] [💪] [🏋️] [⚠️]       │ ← Фильтры (иконки)
│                             │
│ ┌───────────────────────┐   │
│ │                       │   │
│ │   [Граф на Canvas]    │   │ ← Полноэкранная визуализация
│ │                       │   │
│ │   • Touch zoom/pan    │   │
│ │   • Tap на узел       │   │
│ │                       │   │
│ └───────────────────────┘   │
│                             │
│ [Выбран: Жать 100кг]        │ ← Текущий узел
└─────────────────────────────┘
```

### Особенности мобильной версии:

#### 1. **Touch-friendly контролы**
```javascript
// Ползунок детализации - большой для пальцев
.depth-slider {
  height: 44px;           // Минимум для touch
  -webkit-appearance: none;
  width: 100%;
  margin: 16px 0;
}

.depth-slider::-webkit-slider-thumb {
  width: 32px;            // Большой thumb
  height: 32px;
  border-radius: 50%;
  background: var(--accent-primary);
  cursor: pointer;
}
```

#### 2. **Фильтры - иконки вместо текста**
```javascript
// Компактные toggle buttons
<div class="filter-buttons">
  <button class="filter-btn active" data-type="goals">
    🎯
    <span class="filter-count">5</span>
  </button>
  <button class="filter-btn active" data-type="exercises">
    🏋️
    <span class="filter-count">12</span>
  </button>
  <button class="filter-btn active" data-type="muscles">
    💪
    <span class="filter-count">8</span>
  </button>
  <button class="filter-btn" data-type="pain">
    ⚠️
    <span class="filter-count">3</span>
  </button>
</div>
```

#### 3. **Полноэкранный граф**
```javascript
// Canvas занимает всю доступную высоту
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - headerHeight - controlsHeight;
```

#### 4. **Touch жесты**
```javascript
// Pinch to zoom
let initialDistance = 0;

canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    initialDistance = getDistance(e.touches[0], e.touches[1]);
  }
});

canvas.addEventListener('touchmove', (e) => {
  if (e.touches.length === 2) {
    const currentDistance = getDistance(e.touches[0], e.touches[1]);
    const scale = currentDistance / initialDistance;
    zoom(scale);
  }
});

// Pan with one finger
canvas.addEventListener('touchmove', (e) => {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    pan(touch.clientX, touch.clientY);
  }
});
```

#### 5. **Bottom Sheet для деталей узла**
```javascript
// При тапе на узел - показать bottom sheet
canvas.addEventListener('touchend', (e) => {
  const touch = e.changedTouches[0];
  const node = findNodeAtPosition(touch.clientX, touch.clientY);

  if (node) {
    showBottomSheet(node);
  }
});

function showBottomSheet(node) {
  const sheet = document.getElementById('node-details-sheet');
  sheet.innerHTML = `
    <div class="sheet-header">
      <h3>${node.data.title}</h3>
      <button class="sheet-close">×</button>
    </div>
    <div class="sheet-content">
      <p>${node.data.description}</p>
      <button class="btn-focus">Фокус на этом узле</button>
    </div>
  `;
  sheet.classList.add('active');
}
```

---

## 🎨 Адаптация D3.js для мобильных

### Проблемы D3.js на мобильных:
- ❌ Drag & drop плохо работает с touch
- ❌ Hover не работает на touch устройствах
- ❌ Force simulation может быть медленным

### Решения:

#### 1. **Отключить drag на мобильных**
```javascript
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (!isMobile) {
  // Drag только на десктопе
  node.call(d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended));
}
```

#### 2. **Tap вместо hover**
```javascript
// На мобильных - tap для highlight
node.on('touchstart', function(event, d) {
  highlightConnectedNodes(d);
});

// На десктопе - hover
if (!isMobile) {
  node.on('mouseenter', function(event, d) {
    highlightConnectedNodes(d);
  });
}
```

#### 3. **Оптимизация force simulation**
```javascript
// Меньше итераций на мобильных
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(edges).distance(100))
  .force('charge', d3.forceManyBody().strength(-300))
  .force('center', d3.forceCenter(width/2, height/2))
  .alphaDecay(isMobile ? 0.05 : 0.02); // Быстрее на мобильных

// Остановить симуляцию после стабилизации
simulation.on('end', () => {
  console.log('Simulation stabilized');
});
```

---

## 🎯 Мобильный UX Flow

### Сценарий 1: Исследование графа

```
1. Пользователь открывает страницу графа
   ↓
2. Видит граф с дефолтной глубиной (2 уровня)
   ↓
3. Двигает ползунок → граф обновляется
   ↓
4. Тапает на узел → bottom sheet с деталями
   ↓
5. Кнопка "Фокус на этом узле" → граф перестраивается
```

### Сценарий 2: Фильтрация

```
1. Пользователь видит все типы узлов
   ↓
2. Тапает на иконку 🎯 (цели) → скрывает цели
   ↓
3. Граф обновляется, показывая только упражнения и мышцы
   ↓
4. Тапает снова → цели возвращаются
```

### Сценарий 3: Zoom/Pan

```
1. Pinch to zoom → увеличить/уменьшить граф
   ↓
2. Pan одним пальцем → двигать граф
   ↓
3. Double tap → reset zoom
```

---

## 📐 Размеры и отступы для мобильных

```css
/* Mobile-first стили */
.graph-container {
  width: 100vw;
  height: calc(100vh - 60px); /* Header */
  overflow: hidden;
}

.depth-slider-container {
  padding: 16px;
  background: var(--bg-secondary);
}

.depth-slider {
  width: 100%;
  height: 44px; /* Touch-friendly */
  margin: 8px 0;
}

.filter-buttons {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.filter-btn {
  min-width: 60px;
  height: 60px;
  border-radius: 12px;
  font-size: 24px;
  position: relative;
  flex-shrink: 0;
}

.filter-count {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--accent-primary);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
}

/* Bottom sheet для деталей */
.node-details-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-radius: 20px 20px 0 0;
  padding: 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
}

.node-details-sheet.active {
  transform: translateY(0);
}

/* Узлы графа - больше для touch */
.graph-node {
  min-width: 50px;
  min-height: 50px;
  font-size: 12px;
}

/* Легенда - компактная */
.graph-legend {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-secondary);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  gap: 12px;
  font-size: 14px;
}
```

---

## 🚀 План Реализации (Mobile-First)

### Фаза 1: Базовый мобильный граф (MVP)
1. ✅ Canvas граф с D3.js force-directed
2. ✅ Touch zoom/pan
3. ✅ Tap на узел → bottom sheet
4. ✅ Ползунок детализации (1-3 уровня)
5. ✅ Фильтры по типам (иконки)

### Фаза 2: Улучшения UX
1. ✅ Плавные анимации при изменении глубины
2. ✅ Кэширование графов
3. ✅ Оптимизация производительности
4. ✅ Индикатор загрузки

### Фаза 3: Десктопная версия (потом)
1. ⏳ Hover эффекты
2. ⏳ Drag & drop узлов
3. ⏳ Боковая панель вместо bottom sheet
4. ⏳ Расширенные фильтры

---

## 📊 Производительность на мобильных

### Оптимизации:

#### 1. **Ограничение количества узлов**
```javascript
// На мобильных - максимум 50 узлов
const MAX_NODES_MOBILE = 50;
const MAX_NODES_DESKTOP = 200;

const maxNodes = isMobile ? MAX_NODES_MOBILE : MAX_NODES_DESKTOP;

if (nodes.length > maxNodes) {
  // Показать предупреждение
  showWarning(`Слишком много узлов (${nodes.length}). Уменьшите глубину или используйте фильтры.`);
}
```

#### 2. **Throttle для ползунка**
```javascript
// Обновлять граф не чаще раза в 300ms
const throttledUpdate = throttle((depth) => {
  updateGraph(currentNode.type, currentNode.id, depth);
}, 300);

slider.addEventListener('input', (e) => {
  const depth = parseInt(e.target.value);
  valueDisplay.textContent = `${depth} уровня`;
  throttledUpdate(depth);
});
```

#### 3. **Lazy loading D3.js**
```javascript
// Загружать D3.js только при открытии страницы графа
async function loadD3() {
  if (!window.d3) {
    const script = document.createElement('script');
    script.src = 'https://d3js.org/d3.v7.min.js';
    document.head.appendChild(script);

    await new Promise((resolve) => {
      script.onload = resolve;
    });
  }
}

// При открытии страницы графа
async function initGraphPage() {
  showLoadingSpinner();
  await loadD3();
  hideLoadingSpinner();
  renderGraph();
}
```

#### 4. **Canvas вместо SVG для больших графов**
```javascript
// SVG для малых графов (<30 узлов)
// Canvas для больших графов (>30 узлов)

if (nodes.length < 30) {
  renderSVGGraph(nodes, edges);
} else {
  renderCanvasGraph(nodes, edges); // Быстрее на мобильных
}
```

---

## ✅ Чеклист для мобильной версии

### Обязательно:
- [x] Touch zoom/pan
- [x] Ползунок детализации (большой, touch-friendly)
- [x] Фильтры (иконки, компактные)
- [x] Bottom sheet для деталей узла
- [x] Оптимизация производительности
- [x] Индикатор загрузки

### Желательно:
- [ ] Haptic feedback при тапе на узел
- [ ] Swipe для закрытия bottom sheet
- [ ] Сохранение состояния графа (zoom, pan, фильтры)
- [ ] Offline режим (кэширование данных)

### Десктоп (потом):
- [ ] Hover эффекты
- [ ] Drag & drop
- [ ] Боковая панель
- [ ] Keyboard shortcuts

---

**Фокус на мобильной версии! Десктоп - в конце проекта.** 📱✨
