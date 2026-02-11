# 📝 Руководство по Конвертации JS → JSON

## Статус Рефакторинга

✅ **Сессия 1:** BaseLayerRenderer, утилиты, DetailView - ЗАВЕРШЕНО
✅ **Сессия 2:** Структура styles/ - ЗАВЕРШЕНО (руководство создано)
✅ **Сессия 3:** JSDoc типы - ЗАВЕРШЕНО
🔄 **Сессия 4:** JSON конфиги - В ПРОЦЕССЕ

## Почему JSON?

- ✅ Меньше токенов (~15% экономия)
- ✅ Легче редактировать контент
- ✅ Можно использовать в CMS
- ✅ Стандартный формат данных

## План Конвертации

### 1. systemLayers.js → layers.json

**Текущий файл:** 159 строк JS
**Целевой файл:** ~120 строк JSON

**Что делать:**
1. Скопировать объект `systemLayers` из JS
2. Удалить `export const systemLayers = `
3. Удалить все комментарии
4. Заменить одинарные кавычки на двойные
5. Сохранить как `js/config/layers.json`

**Пример конвертации:**
```javascript
// БЫЛО (JS):
export const systemLayers = {
    muscles: {
        id: 'muscles',
        name: 'Мышечная система',
        // ...
    }
};
```

```json
// СТАЛО (JSON):
{
  "muscles": {
    "id": "muscles",
    "name": "Мышечная система"
  }
}
```

**Обновить systemLayers.js:**
```javascript
// js/config/systemLayers.js
import layersData from './layers.json' assert { type: 'json' };

export const systemLayers = layersData;

export function getLayer(layerId) {
    return systemLayers[layerId] || null;
}

export function getLayerIds() {
    return Object.keys(systemLayers);
}

export function getLayerColor(layerId) {
    return systemLayers[layerId]?.color || '#00d4ff';
}

export function isInteractiveLayer(layerId) {
    return systemLayers[layerId]?.hasInteractivity || false;
}
```

### 2. painPointsData.js → painPoints.json

**Текущий файл:** 82 строки JS
**Целевой файл:** ~60 строк JSON

**Что делать:**
1. Скопировать массив `painPoints`
2. Удалить `export const painPoints = `
3. Удалить комментарии
4. Заменить template literals на обычные строки
5. Экранировать HTML (или оставить как есть)
6. Сохранить как `js/config/painPoints.json`

**Пример:**
```javascript
// БЫЛО:
export const painPoints = [
    {
        id: "what-is-pain",
        title: "Что такое боль?",
        position: { x: 50, y: 1.5 },
        content: `
            <h3>Физиология боли</h3>
            <p>TODO: Добавить контент...</p>
        `
    }
];
```

```json
// СТАЛО:
[
  {
    "id": "what-is-pain",
    "title": "Что такое боль?",
    "position": { "x": 50, "y": 1.5 },
    "content": "<h3>Физиология боли</h3><p>TODO: Добавить контент...</p>"
  }
]
```

**Обновить painPointsData.js:**
```javascript
// js/config/painPointsData.js
import data from './painPoints.json' assert { type: 'json' };

export const painPoints = data;

export function getPainPoints() {
    return painPoints;
}
```

### 3. systemBlocks.js → blocks.json

**Текущий файл:** ~500 строк JS
**Целевой файл:** ~400 строк JSON

**Что делать:**
1. Скопировать объект `systemBlocks`
2. Удалить `export const systemBlocks = `
3. Удалить комментарии
4. Заменить template literals на строки
5. Сохранить как `js/config/blocks.json`

**Обновить systemBlocks.js:**
```javascript
// js/config/systemBlocks.js
import blocksData from './blocks.json' assert { type: 'json' };

export const systemBlocks = blocksData;

export function getBlocksForLayer(layerId) {
    return systemBlocks[layerId] || [];
}
```

## Автоматизация (Опционально)

Можно использовать Node.js скрипт для конвертации:

```javascript
// convert-to-json.js
const fs = require('fs');

// Читаем JS файл
const jsContent = fs.readFileSync('js/config/systemLayers.js', 'utf8');

// Извлекаем объект (простой способ - eval, но небезопасно)
// Лучше использовать regex или парсер

// Записываем JSON
fs.writeFileSync('js/config/layers.json', JSON.stringify(data, null, 2));
```

## Проверка После Конвертации

1. **Проверить синтаксис JSON:**
   - Используй онлайн валидатор (jsonlint.com)
   - Или VSCode (автоматически подсвечивает ошибки)

2. **Проверить импорты:**
   ```javascript
   // Должно работать:
   import data from './layers.json' assert { type: 'json' };
   console.log(data);
   ```

3. **Проверить в браузере:**
   - Открыть сайт
   - Проверить консоль на ошибки
   - Убедиться что всё работает

## Совместимость Браузеров

**JSON import** поддерживается в:
- ✅ Chrome 91+
- ✅ Firefox 89+
- ✅ Safari 15+
- ✅ Edge 91+

**Для старых браузеров:**
Используй fetch:
```javascript
// js/config/systemLayers.js
let systemLayers = null;

export async function loadLayers() {
    const response = await fetch('./config/layers.json');
    systemLayers = await response.json();
    return systemLayers;
}

export function getLayer(layerId) {
    return systemLayers?.[layerId] || null;
}
```

## Приоритет Конвертации

1. **Высокий:** `painPointsData.js` (часто меняется)
2. **Средний:** `systemBlocks.js` (много контента)
3. **Низкий:** `systemLayers.js` (редко меняется)

## Рекомендация

**Сделать позже**, когда:
- ✅ Весь контент стабилизируется
- ✅ Не планируется частых изменений структуры
- ✅ Есть время на тестирование

**Сейчас приоритетнее:**
- Реализовать остальные слои (Nervous, Respiratory, и т.д.)
- Использовать созданные BaseLayerRenderer и DetailView
- Добавить контент

## Итого

**Выгода от конвертации:**
- Экономия ~15% токенов
- Легче редактировать
- Готовность к CMS

**Затраты:**
- 1-2 часа на конвертацию
- Тестирование
- Обновление импортов

**Вердикт:** Полезно, но не критично. Можно отложить.
