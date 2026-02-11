# 📝 Руководство по Разбиению styles.css

## Текущее Состояние
- **Файл:** `styles.css` (1362 строки)
- **Проблема:** Всё в одном файле → сложно найти нужные стили
- **Решение:** Модульная структура

## 🎯 Целевая Структура

```
styles/
├── index.css          # Главный файл (импорты)
├── base.css           # CSS Variables, reset, body
├── themes.css         # Light/dark themes, data-layer
├── layout.css         # Sidebar, main-content, dual-view
├── mobile.css         # Mobile adaptations
├── components/
│   ├── buttons.css    # Zoom, toggle, layer buttons
│   ├── blocks.css     # System blocks, pain points
│   ├── detail.css     # Detail view (universal)
│   └── tooltip.css    # Tooltips
└── layers/
    ├── muscles.css    # Muscle-specific styles
    └── pain.css       # Pain-specific styles
```

## 📋 План Разбиения

### Шаг 1: Создать base.css
**Строки из styles.css:** 1-100 (примерно)

**Содержимое:**
- `:root` с CSS Variables
- `*` reset
- `body`, `html`
- Базовые шрифты

**Пример:**
```css
:root {
  /* Цвета слоёв */
  --layer-muscles: #00d4ff;
  --layer-nervous: #ffeb3b;
  /* ... */

  /* Основные цвета */
  --bg-primary: #0f0f23;
  /* ... */
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, sans-serif;
  /* ... */
}
```

### Шаг 2: Создать themes.css
**Строки из styles.css:** 101-200 (примерно)

**Содержимое:**
- `[data-theme="light"]`
- `[data-layer="muscles"]`
- `[data-layer="pain"]`
- И т.д. для всех слоёв

**Пример:**
```css
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  /* ... */
}

[data-layer="pain"] {
  --accent-primary: var(--layer-pain);
  --glow-color: rgba(255, 82, 82, 0.8);
}

/* Hide view indicators for single-SVG layers */
[data-layer="pain"] .view-indicators,
[data-layer="nervous"] .view-indicators {
  display: none !important;
}
```

### Шаг 3: Создать layout.css
**Строки из styles.css:** 201-400 (примерно)

**Содержимое:**
- `.sidebar`
- `.main-content`
- `.dual-view`, `.view-panel`
- `.svg-wrapper`

**Пример:**
```css
.sidebar {
  width: 300px;
  background: var(--bg-secondary);
  /* ... */
}

.main-content {
  flex: 1;
  position: relative;
  /* ... */
}

.dual-view {
  display: flex;
  gap: 20px;
  /* ... */
}
```

### Шаг 4: Создать components/buttons.css
**Строки из styles.css:** Найти все кнопки

**Содержимое:**
- `.zoom-controls`
- `.zoom-btn`
- `.sidebar-toggle`
- `.theme-toggle`
- `.layer-slider` кнопки

**Пример:**
```css
.zoom-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  /* ... */
}

.zoom-btn {
  width: 40px;
  height: 40px;
  /* ... */
}
```

### Шаг 5: Создать components/blocks.css
**Строки из styles.css:** Найти блоки и точки

**Содержимое:**
- `.system-block`
- `.pain-points-container`
- `.pain-point`, `.pain-circle`, `.pain-callout`
- `.block-header`, `.block-content`

**Пример:**
```css
.system-block {
  position: absolute;
  background: var(--bg-secondary);
  /* ... */
}

.pain-point {
  position: absolute;
  transform: translate(-50%, -50%);
  /* ... */
}

.pain-circle {
  width: 30px;
  height: 30px;
  background: var(--layer-pain);
  animation: pulse 2s infinite;
}
```

### Шаг 6: Создать components/detail.css
**Строки из styles.css:** Найти detail view

**Содержимое:**
- `.detail-view`
- `.detail-header`, `.detail-back`, `.detail-title`
- `.detail-content`
- Анимации (fade-in, slide-up)

**Пример:**
```css
.detail-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.detail-view.visible {
  opacity: 1;
  visibility: visible;
}
```

### Шаг 7: Создать components/tooltip.css
**Строки из styles.css:** Найти tooltip

**Содержимое:**
- `.tooltip`
- `.tooltip-content`
- Позиционирование

### Шаг 8: Создать layers/muscles.css
**Строки из styles.css:** Найти muscle-specific

**Содержимое:**
- `.muscle` hover/selected
- `.muscle-info`
- Muscle groups

**Пример:**
```css
.muscle {
  cursor: pointer;
  transition: fill 0.2s ease;
}

.muscle:hover:not(.selected) {
  fill: var(--accent-primary);
  opacity: 0.7;
}

.muscle.selected {
  fill: var(--accent-primary) !important;
  opacity: 1 !important;
}
```

### Шаг 9: Создать layers/pain.css
**Строки из styles.css:** Найти pain-specific

**Содержимое:**
- Pain animations
- Callout positioning
- Pain-specific colors

**Пример:**
```css
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

.pain-callout.callout-top {
  bottom: 100%;
  margin-bottom: 10px;
}
```

### Шаг 10: Создать mobile.css
**Строки из styles.css:** Найти @media queries

**Содержимое:**
- Все `@media (max-width: 768px)`
- Mobile-specific layouts
- Bottom sheet

**Пример:**
```css
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .main-content {
    padding: 10px;
  }

  .dual-view {
    flex-direction: column;
  }
}
```

## 🔧 Как Выполнить

### Автоматический Способ (Рекомендуется)

1. Открыть `styles.css`
2. Для каждого модуля:
   - Найти соответствующие селекторы (Ctrl+F)
   - Скопировать в новый файл
   - Удалить из `styles.css`
3. Проверить что `styles.css` пустой
4. Удалить `styles.css`

### Ручной Способ

1. Создать все файлы из структуры
2. Копировать стили по категориям
3. Тестировать после каждого модуля

## ✅ Проверка После Разбиения

1. Обновить `index.html`:
```html
<!-- Было -->
<link rel="stylesheet" href="styles.css">

<!-- Стало -->
<link rel="stylesheet" href="styles/index.css">
```

2. Открыть сайт в браузере
3. Проверить что всё работает:
   - Стили применяются
   - Темы переключаются
   - Слои работают
   - Мобильная версия OK

## 📊 Ожидаемый Результат

**Было:**
- 1 файл × 1362 строки = сложно найти

**Стало:**
- 11 файлов × ~120 строк = легко найти
- Логическая группировка
- Легче поддерживать

## 🎯 Приоритет

**Критично:**
- base.css
- themes.css
- layout.css
- components/detail.css (для DetailView)

**Важно:**
- components/blocks.css
- layers/pain.css

**Можно позже:**
- components/tooltip.css
- layers/muscles.css
- mobile.css (если всё работает)

## 💡 Совет

Разбивайте постепенно, тестируя после каждого модуля. Не удаляйте `styles.css` пока не убедитесь что всё работает с новой структурой.
