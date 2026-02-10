# Многослойная Архитектура - Часть 2

## 5. Страница Фильтрации (продолжение)

### 5.2 Алгоритм Фильтрации (продолжение)

```javascript
    // Filter by difficulty (продолжение)
    results = results.filter(item => {
      if (!item.difficulty) return true; // Include if no difficulty specified

      const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3 };
      const itemDiff = difficultyMap[item.difficulty] || 2;

      return itemDiff >= this.filters.difficulty[0] &&
             itemDiff <= this.filters.difficulty[1];
    });

    // Free text search
    if (this.filters.search) {
      const query = this.filters.search.toLowerCase();
      results = results.filter(item =>
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.function?.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.includes(query))
      );
    }

    this.results = results;
    this.renderResults();
  }

  renderResults() {
    const grid = document.getElementById('results-grid');
    const count = document.getElementById('results-count');

    count.textContent = this.results.length;

    if (this.results.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <span class="no-results-icon">🔍</span>
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить фильтры</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.results.map(item => this.renderCard(item)).join('');
  }

  renderCard(item) {
    const typeIcons = {
      muscle: '💪',
      exercise: '🏋️',
      goal: '🎯',
      nerve: '⚡',
      issue: '🩹'
    };

    const icon = typeIcons[item.dataType] || '📄';
    const tags = item.tags?.slice(0, 3).map(tagId => {
      const tag = TAGS[tagId];
      return tag ? `<span class="card-tag" style="color: ${tag.color}">${tag.name}</span>` : '';
    }).join('');

    return `
      <div class="result-card" data-type="${item.dataType}" data-id="${item.id}">
        <div class="card-icon">${icon}</div>
        <h3>${item.name}</h3>
        <p class="card-description">${item.description || item.function || ''}</p>
        <div class="card-tags">${tags}</div>
        <button class="card-action">Подробнее →</button>
      </div>
    `;
  }

  resetFilters() {
    this.filters = {
      system: 'all',
      tags: [],
      difficulty: [1, 3],
      search: ''
    };

    // Reset UI
    document.getElementById('system-filter').value = 'all';
    document.getElementById('difficulty-filter').value = 3;
    document.getElementById('search-input').value = '';
    document.querySelectorAll('.tag-pill').forEach(pill => {
      pill.classList.remove('active');
    });

    this.applyFilters();
  }
}
```

---

## 6. Анимации и Переходы

### 6.1 Переходы Между Слоями

```javascript
// js/animations/layerTransitions.js

export class LayerTransitions {
  /**
   * Анимация перехода между слоями
   */
  static async transition(fromLayer, toLayer, svgContainer) {
    const duration = 600;

    // Определить тип анимации на основе слоёв
    const animationType = this.getAnimationType(fromLayer, toLayer);

    switch(animationType) {
      case 'fade':
        await this.fadeTransition(svgContainer, duration);
        break;
      case 'morph':
        await this.morphTransition(svgContainer, duration);
        break;
      case 'slide':
        await this.slideTransition(svgContainer, duration);
        break;
      default:
        await this.fadeTransition(svgContainer, duration);
    }
  }

  static getAnimationType(from, to) {
    // Muscles ↔ Pain: Fade (те же SVG, разная подсветка)
    if ((from === 'muscles' && to === 'pain') || (from === 'pain' && to === 'muscles')) {
      return 'fade';
    }

    // Nervous ↔ Muscles: Morph (связанные системы)
    if ((from === 'muscles' && to === 'nervous') || (from === 'nervous' && to === 'muscles')) {
      return 'morph';
    }

    // Default: Slide
    return 'slide';
  }

  /**
   * Fade transition
   */
  static fadeTransition(container, duration) {
    return new Promise(resolve => {
      container.style.transition = `opacity ${duration/2}ms ease-out`;
      container.style.opacity = '0';

      setTimeout(() => {
        container.style.opacity = '1';
        setTimeout(resolve, duration/2);
      }, duration/2);
    });
  }

  /**
   * Morph transition (для связанных систем)
   */
  static morphTransition(container, duration) {
    return new Promise(resolve => {
      container.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      container.style.transform = 'scale(0.9) rotateY(10deg)';
      container.style.opacity = '0.3';

      setTimeout(() => {
        container.style.transform = 'scale(1) rotateY(0deg)';
        container.style.opacity = '1';
        setTimeout(resolve, duration);
      }, 50);
    });
  }

  /**
   * Slide transition
   */
  static slideTransition(container, duration) {
    return new Promise(resolve => {
      container.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
      container.style.transform = 'translateX(-100px)';
      container.style.opacity = '0';

      setTimeout(() => {
        container.style.transform = 'translateX(0)';
        container.style.opacity = '1';
        setTimeout(resolve, duration);
      }, 50);
    });
  }

  /**
   * Анимация подсветки нервного пути
   */
  static animateNervePath(pathElement, duration = 2000) {
    const length = pathElement.getTotalLength();

    pathElement.style.strokeDasharray = length;
    pathElement.style.strokeDashoffset = length;
    pathElement.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;

    setTimeout(() => {
      pathElement.style.strokeDashoffset = '0';
    }, 50);
  }

  /**
   * Анимация дыхания (для respiratory layer)
   */
  static breathingAnimation(lungElements) {
    const breathe = () => {
      lungElements.forEach(lung => {
        lung.style.transition = 'transform 3s ease-in-out';
        lung.style.transform = 'scale(1.05)';

        setTimeout(() => {
          lung.style.transform = 'scale(1)';
        }, 1500);
      });
    };

    breathe();
    return setInterval(breathe, 3000);
  }

  /**
   * Анимация сердцебиения (для cardiovascular layer)
   */
  static heartbeatAnimation(heartElement) {
    const beat = () => {
      heartElement.style.transition = 'transform 0.1s ease-out';
      heartElement.style.transform = 'scale(1.1)';

      setTimeout(() => {
        heartElement.style.transform = 'scale(1)';

        setTimeout(() => {
          heartElement.style.transform = 'scale(1.08)';

          setTimeout(() => {
            heartElement.style.transform = 'scale(1)';
          }, 100);
        }, 150);
      }, 100);
    };

    beat();
    return setInterval(beat, 1000); // 60 BPM
  }

  /**
   * Анимация кровотока (пульсация артерий)
   */
  static bloodFlowAnimation(vesselElements) {
    vesselElements.forEach((vessel, index) => {
      const pulse = () => {
        vessel.style.transition = 'filter 0.3s ease-in-out';
        vessel.style.filter = 'brightness(1.5) drop-shadow(0 0 8px rgba(244, 67, 54, 0.8))';

        setTimeout(() => {
          vessel.style.filter = 'brightness(1)';
        }, 300);
      };

      // Stagger the pulses
      setInterval(pulse, 1000);
      setTimeout(pulse, index * 100);
    });
  }

  /**
   * Тепловая карта боли (для pain layer)
   */
  static heatmapAnimation(affectedAreas) {
    affectedAreas.forEach(area => {
      const element = document.getElementById(area.muscleId);
      if (!element) return;

      const intensity = area.intensity === 'high' ? 1 : area.intensity === 'medium' ? 0.6 : 0.3;

      element.style.fill = area.color;
      element.style.filter = `brightness(${1 + intensity}) drop-shadow(0 0 ${10 * intensity}px ${area.color})`;
      element.style.animation = `pain-pulse ${2 / intensity}s ease-in-out infinite`;
    });
  }
}

// CSS для анимаций (добавить в styles.css)
const animationCSS = `
@keyframes pain-pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

@keyframes nerve-pulse {
  0%, 100% {
    filter: brightness(1) drop-shadow(0 0 4px rgba(255, 235, 59, 0.6));
  }
  50% {
    filter: brightness(1.5) drop-shadow(0 0 12px rgba(255, 235, 59, 1));
  }
}
`;
```

---

## 7. Роутинг и SPA-Навигация

### 7.1 Простой Роутер

```javascript
// js/core/router.js

export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.init();
  }

  init() {
    // Listen for navigation events
    window.addEventListener('navigate', (e) => {
      this.navigate(e.detail.route);
    });

    // Listen for browser back/forward
    window.addEventListener('popstate', (e) => {
      this.handlePopState(e);
    });

    // Handle initial route
    this.handleInitialRoute();
  }

  /**
   * Register a route
   */
  register(path, handler) {
    this.routes[path] = handler;
  }

  /**
   * Navigate to a route
   */
  navigate(path, pushState = true) {
    const route = this.routes[path];

    if (!route) {
      console.warn(`Route not found: ${path}`);
      return;
    }

    // Update browser history
    if (pushState) {
      window.history.pushState({ path }, '', path);
    }

    // Execute route handler
    this.currentRoute = path;
    route();

    // Dispatch event
    window.dispatchEvent(new CustomEvent('routeChanged', {
      detail: { path }
    }));
  }

  /**
   * Handle browser back/forward
   */
  handlePopState(e) {
    const path = e.state?.path || '/';
    this.navigate(path, false);
  }

  /**
   * Handle initial route on page load
   */
  handleInitialRoute() {
    const path = window.location.pathname;
    this.navigate(path, false);
  }
}

// Инициализация роутов
export function setupRoutes(router) {
  // Home (Atlas)
  router.register('/', () => {
    showAtlasPage();
  });

  // Goals
  router.register('/goals', () => {
    showGoalsPage();
  });

  // Exercises
  router.register('/exercises', () => {
    showExercisesPage();
  });

  // Qualities
  router.register('/qualities', () => {
    showQualitiesPage();
  });

  // Knowledge Base
  router.register('/knowledge', () => {
    showKnowledgePage();
  });

  // Search
  router.register('/search', () => {
    showSearchPage();
  });

  // Profile
  router.register('/profile', () => {
    showProfilePage();
  });

  // Dynamic routes (with parameters)
  router.register('/muscle/:id', (params) => {
    showMusclePage(params.id);
  });

  router.register('/exercise/:id', (params) => {
    showExercisePage(params.id);
  });

  router.register('/goal/:id', (params) => {
    showGoalPage(params.id);
  });
}

// Page handlers
function showAtlasPage() {
  document.getElementById('app').innerHTML = `
    <div class="atlas-page">
      <!-- Layer slider + SVG visualization -->
    </div>
  `;
}

function showGoalsPage() {
  document.getElementById('app').innerHTML = `
    <div class="goals-page">
      <!-- Goals hub -->
    </div>
  `;
}

// ... other page handlers
```

---

## 8. Файловая Структура Проекта

### 8.1 Полная Структура

```
muscles/
├── index.html                    # Главная страница
├── styles.css                    # Глобальные стили
├── manifest.json                 # PWA manifest (будущее)
├── service-worker.js             # Service worker (будущее)
│
├── assets/
│   ├── svg/
│   │   ├── body-front.svg        # Мышцы (вид спереди)
│   │   ├── body-back.svg         # Мышцы (вид сзади)
│   │   ├── nervous-front.svg     # Нервная система (спереди)
│   │   ├── nervous-back.svg      # Нервная система (сзади)
│   │   ├── respiratory-front.svg # Дыхательная (спереди)
│   │   ├── respiratory-back.svg  # Дыхательная (сзади)
│   │   ├── cardio-front.svg      # Сердечно-сосудистая (спереди)
│   │   └── cardio-back.svg       # Сердечно-сосудистая (сзади)
│   │
│   ├── images/
│   │   ├── muscles/              # Изображения мышц
│   │   ├── exercises/            # GIF упражнений
│   │   └── icons/                # Иконки
│   │
│   └── videos/                   # Локальные видео (опционально)
│
├── js/
│   ├── main.js                   # Точка входа
│   │
│   ├── config/
│   │   ├── systemLayers.js       # Конфигурация 5 слоёв
│   │   ├── muscleData.js         # Данные мышц
│   │   ├── muscleIdMap.js        # Маппинг SVG → мышцы
│   │   ├── nerveData.js          # Данные нервной системы
│   │   ├── respiratoryData.js    # Данные дыхательной системы
│   │   ├── cardiovascularData.js # Данные сердечно-сосудистой
│   │   ├── issueData.js          # Данные болей/травм
│   │   ├── exerciseData.js       # Данные упражнений
│   │   ├── goalData.js           # Данные целей
│   │   ├── qualityData.js        # Данные качеств
│   │   ├── tags.js               # Система тегов
│   │   └── dataModel.js          # Унифицированная модель
│   │
│   ├── core/
│   │   ├── svgLoader.js          # Загрузка SVG
│   │   ├── interactivity.js      # Интерактивность (hover/click)
│   │   ├── zoom.js               # Зум и панорамирование
│   │   ├── mobile.js             # Мобильная версия
│   │   ├── systemSwitcher.js     # Переключение слоёв
│   │   ├── dataResolver.js       # Резолвер связей
│   │   ├── search.js             # Глобальный поиск
│   │   └── router.js             # SPA роутинг
│   │
│   ├── ui/
│   │   ├── sidebar.js            # Боковая панель (desktop)
│   │   ├── tooltip.js            # Всплывающие подсказки
│   │   ├── layerSlider.js        # Слайдер систем
│   │   ├── burgerMenu.js         # Главное меню
│   │   ├── goalHub.js            # Страница целей
│   │   ├── exerciseLibrary.js    # Библиотека упражнений
│   │   ├── filterPage.js         # Страница фильтрации
│   │   ├── knowledgeBase.js      # База знаний
│   │   └── bottomSheet.js        # Bottom sheet (mobile)
│   │
│   ├── animations/
│   │   └── layerTransitions.js   # Анимации переходов
│   │
│   └── utils/
│       ├── helpers.js            # Вспомогательные функции
│       └── analytics.js          # Аналитика (Plausible)
│
├── docs/
│   ├── ARCHITECTURE.md           # Текущая архитектура
│   ├── MULTILAYER_ARCHITECTURE.md # Новая архитектура
│   ├── CONTEXT.md                # Контекст для LLM
│   └── API.md                    # API документация (будущее)
│
├── tools/
│   ├── muscle-mapper.html        # Инструмент маппинга
│   └── muscle-mapper.js
│
└── archive/
    └── script.js                 # Старый монолитный код
```

### 8.2 Порядок Загрузки Модулей

```javascript
// js/main.js

import { isMobile } from './core/mobile.js';
import { Router, setupRoutes } from './core/router.js';
import { LayerSlider } from './ui/layerSlider.js';
import { BurgerMenu } from './ui/burgerMenu.js';
import { DataModel } from './config/dataModel.js';

// Import data
import { muscleData } from './config/muscleData.js';
import { nerveData } from './config/nerveData.js';
import { respiratoryData } from './config/respiratoryData.js';
import { cardiovascularData } from './config/cardiovascularData.js';
import { issueData } from './config/issueData.js';
import { exerciseData } from './config/exerciseData.js';
import { goalData } from './config/goalData.js';

async function init() {
  // Populate DataModel
  DataModel.muscles = muscleData;
  DataModel.nerves = nerveData;
  DataModel.respiratory = respiratoryData;
  DataModel.cardiovascular = cardiovascularData;
  DataModel.issues = issueData;
  DataModel.exercises = exerciseData;
  DataModel.goals = goalData;

  // Initialize router
  const router = new Router();
  setupRoutes(router);

  // Initialize UI components
  new BurgerMenu();
  new LayerSlider();

  // Mobile-specific setup
  if (isMobile()) {
    await import('./core/mobile.js').then(module => {
      module.setupMobile();
    });
  }

  console.log('✅ Muscle Atlas initialized');
}

// Start when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

---

## 9. План Реализации (Поэтапный)

### Фаза 1: Подготовка Инфраструктуры (1-2 недели)

**Задачи:**
1. ✅ Создать структуру файлов
2. ✅ Настроить конфигурацию слоёв (`systemLayers.js`)
3. ✅ Создать базовые модели данных
4. ✅ Реализовать `DataResolver` для кросс-ссылок
5. ✅ Настроить систему тегов

**Результат:** Готовая архитектурная основа

---

### Фаза 2: Слайдер Систем (1 неделя)

**Задачи:**
1. Создать UI компонент `LayerSlider`
2. Реализовать переключение между слоями
3. Добавить анимации переходов
4. Интегрировать с существующим атласом мышц

**Результат:** Работающий переключатель между 5 системами

---

### Фаза 3: Наполнение Данных (2-3 недели)

**Приоритет 1: Мышцы** (уже есть)
- Дополнить существующие 8-12 мышц полными данными
- Добавить связи с нервами и проблемами

**Приоритет 2: Боли/Травмы**
- 5-10 распространённых проблем
- Тепловые карты
- Связи с мышцами и упражнениями

**Приоритет 3: Нервная Система**
- 10-15 ключевых нервов
- Визуализация путей
- Клинические тесты

**Приоритет 4: Дыхательная**
- Диафрагма, лёгкие, межрёберные
- Дыхательные паттерны
- Упражнения

**Приоритет 5: Сердечно-сосудистая**
- Сердце, основные сосуды
- Зоны ЧСС
- Тесты

**Результат:** Минимальный контент для всех 5 слоёв

---

### Фаза 4: Навигация и Поиск (1 неделя)

**Задачи:**
1. Реализовать бургер-меню
2. Создать роутер для SPA
3. Реализовать глобальный поиск
4. Создать страницу фильтрации

**Результат:** Полноценная навигация по сервису

---

### Фаза 5: Специальные Анимации (1 неделя)

**Задачи:**
1. Анимация нервных путей (пульсация)
2. Анимация дыхания (расширение лёгких)
3. Анимация сердцебиения
4. Тепловая карта боли

**Результат:** Уникальные визуализации для каждой системы

---

### Фаза 6: Дополнительные Страницы (2 недели)

**Задачи:**
1. Страница "Цели" (Goals Hub)
2. Библиотека упражнений
3. База знаний
4. Страницы деталей (muscle/:id, goal/:id и т.д.)

**Результат:** Полный набор страниц

---

### Фаза 7: Полировка и Тестирование (1-2 недели)

**Задачи:**
1. Адаптивность (desktop + mobile)
2. Производительность
3. Accessibility
4. SEO оптимизация
5. Аналитика (Plausible)

**Результат:** Production-ready MVP

---

### Фаза 8: PWA и Расширенные Фичи (опционально)

**Задачи:**
1. Service Worker
2. Offline mode
3. Install prompt
4. Push notifications

**Результат:** Полноценное PWA

---

## 10. Ключевые Решения и Рекомендации

### 10.1 Технические Решения

✅ **Vanilla JS без фреймворков**
- Быстрее для MVP
- Меньше размер
- Проще деплой

✅ **Статические JSON данные**
- Нет бэкенда на старте
- Быстрая итерация
- Легко версионировать

✅ **Модульная архитектура**
- ES6 modules
- Чёткое разделение ответственности
- Легко расширять

✅ **Прогрессивное улучшение**
- Базовая функциональность работает везде
- Продвинутые фичи для современных браузеров

### 10.2 UX Решения

✅ **Слайдер систем слева**
- Интуитивно понятно
- Не загромождает интерфейс
- Легко переключаться

✅ **Единая цветовая схема для каждой системы**
- Мышцы: Cyan (#00d4ff)
- Нервы: Yellow (#ffeb3b)
- Дыхательная: Green (#4caf50)
- Сердечно-сосудистая: Red (#f44336)
- Боли: Bright Red (#ff5252)

✅ **Кросс-ссылки везде**
- Из мышцы → к нервам, упражнениям, проблемам
- Из проблемы → к мышцам, упражнениям, целям
- Естественные переходы между слоями

### 10.3 Контентная Стратегия

✅ **Качество > Количество**
- Лучше 10 хорошо проработанных мышц, чем 35 поверхностных
- Фокус на практическую пользу

✅ **Использование чужого контента**
- YouTube embeds для видео
- Корректная атрибуция
- Юридическая защита (copyright notice)

✅ **Итеративное наполнение**
- Запуск с минимальным контентом
- Постепенное расширение на основе обратной связи

---

## 11. Метрики Успеха

### MVP (4-6 недель)

- ✅ 5 систем с переключением
- ✅ 8-12 мышц с полными данными
- ✅ 5-10 проблем (боли/травмы)
- ✅ 10-15 нервов
- ✅ Базовая дыхательная и сердечно-сосудистая
- ✅ 20-30 упражнений
- ✅ 5-10 целей
- ✅ Глобальный поиск
- ✅ Фильтрация
- ✅ Mobile-responsive

### Метрики Запуска

- 50-100 beta пользователей
- 60%+ mobile usage
- <3s page load
- 3-5 user testimonials

---

## 12. Следующие Шаги

1. **Утвердить архитектуру** с пользователем
2. **Создать SVG для новых систем** (нервная, дыхательная, сердечно-сосудистая)
3. **Начать с Фазы 1**: Подготовка инфраструктуры
4. **Параллельно**: Наполнение данных для слоя "Боли"

---

**Документ создан:** 2026-02-10
**Версия:** 1.0
**Статус:** Draft для обсуждения
