# 🎯 Уточнённая Классификация Целей

## Анализ и Предложения

### Проблема с "Эстетическими" и "Функциональными"

Вы правы! Давайте разберём:

**Эстетические цели** (изначально):
- "Накачать пресс для кубиков"
- "Увеличить объём бицепсов"
- "Сделать V-образную спину"

**Функциональные цели** (изначально):
- "Улучшить баланс и координацию"
- "Увеличить гибкость"
- "Повысить выносливость в повседневной жизни"

**Проблема:** Эстетические = спортивные (трансформация тела), а функциональные = тоже спортивные или терапевтические.

---

## 🎯 Пересмотренная Классификация

### 1. **ATHLETIC** (Спортивные/Трансформация тела)
**Цель:** Изменить тело (сила, масса, рельеф, выносливость)

**Подкатегории:**
- **Strength** (Сила): "Жать 100кг", "Подтянуться 20 раз"
- **Hypertrophy** (Масса): "Набрать 5кг мышц", "Увеличить грудь на 5см"
- **Aesthetics** (Рельеф): "Кубики пресса", "V-образная спина"
- **Endurance** (Выносливость): "Пробежать 10км", "Улучшить VO2 max"

**Примеры:**
```javascript
{
  id: "bench-100kg",
  type: "athletic",
  subtype: "strength",
  title: "Жать 100кг лёжа",
  current: "70kg",
  target: "100kg",
  timeline: "6 months"
}

{
  id: "build-chest",
  type: "athletic",
  subtype: "hypertrophy",
  title: "Набрать массу груди",
  current: "95cm",
  target: "102cm",
  timeline: "4 months"
}

{
  id: "six-pack-abs",
  type: "athletic",
  subtype: "aesthetics",
  title: "Кубики пресса",
  current: "18% body fat",
  target: "12% body fat + visible abs",
  timeline: "3 months"
}
```

---

### 2. **THERAPEUTIC** (Терапевтические/Оздоровительные)
**Цель:** Устранить боль, восстановиться, улучшить здоровье

**Подкатегории:**
- **Pain Relief** (Устранение боли): "Убрать боль в пояснице"
- **Rehabilitation** (Реабилитация): "Восстановить плечо после травмы"
- **Prevention** (Профилактика): "Предотвратить боли в шее"
- **Posture** (Осанка): "Исправить сутулость"

**Примеры:**
```javascript
{
  id: "eliminate-lower-back-pain",
  type: "therapeutic",
  subtype: "pain-relief",
  title: "Устранить боль в пояснице",
  painLevel: { current: 7, target: 2 },
  timeline: "6 weeks"
}

{
  id: "fix-forward-head",
  type: "therapeutic",
  subtype: "posture",
  title: "Исправить выдвинутую голову",
  current: "Forward head posture",
  target: "Neutral alignment",
  timeline: "8 weeks"
}
```

---

### 3. **FUNCTIONAL** (Функциональные/Повседневная жизнь)
**Цель:** Улучшить качество жизни, движение в быту

**Подкатегории:**
- **Daily Activities** (Бытовые задачи): "Легко поднимать ребёнка", "Носить покупки без усталости"
- **Mobility** (Подвижность): "Сесть на шпагат", "Дотянуться до пальцев ног"
- **Balance** (Баланс): "Стоять на одной ноге 60 сек"
- **Aging Well** (Активное старение): "Сохранить мобильность после 60"

**Примеры:**
```javascript
{
  id: "carry-groceries-easily",
  type: "functional",
  subtype: "daily-activities",
  title: "Легко носить покупки",
  current: "Устаю после 5 минут",
  target: "Носить 10кг без усталости 15 минут",
  timeline: "4 weeks"
}

{
  id: "touch-toes",
  type: "functional",
  subtype: "mobility",
  title: "Дотянуться до пальцев ног",
  current: "15cm от пола",
  target: "Касание пальцев",
  timeline: "6 weeks"
}

{
  id: "play-with-kids",
  type: "functional",
  subtype: "daily-activities",
  title: "Играть с детьми без усталости",
  current: "Устаю через 10 минут",
  target: "Активная игра 30+ минут",
  timeline: "8 weeks"
}
```

---

### 4. **RESEARCH** (Исследовательские/Образовательные)
**Цель:** Понять, изучить, разобраться

**Примеры:**
```javascript
{
  id: "understand-shoulder-mechanics",
  type: "research",
  title: "Понять механику плеча",
  topics: ["Анатомия", "Биомеханика", "Травмы"],
  resources: ["Статьи", "Видео", "Книги"]
}

{
  id: "learn-proper-squat",
  type: "research",
  title: "Научиться правильно приседать",
  topics: ["Техника", "Распространённые ошибки", "Вариации"],
  practicalGoal: "squat-100kg" // Связь со спортивной целью
}
```

---

## 🎯 Итоговая Классификация (3 основных типа)

### **ATHLETIC** (Спортивные)
- Strength, Hypertrophy, Aesthetics, Endurance
- Фокус: трансформация тела, спортивные достижения

### **THERAPEUTIC** (Терапевтические)
- Pain Relief, Rehabilitation, Prevention, Posture
- Фокус: здоровье, устранение проблем

### **FUNCTIONAL** (Функциональные)
- Daily Activities, Mobility, Balance, Aging Well
- Фокус: качество жизни, бытовые задачи

### **RESEARCH** (Исследовательские)
- Образование, понимание
- Фокус: знания (часто ведут к другим целям)

---

## 📊 Приоритет Реализации

### Фаза 1: Athletic Goals (3-5 целей)
**Почему первыми:**
- Самые популярные
- Чёткие метрики (вес, объём, повторения)
- Легко визуализировать прогресс

**Примеры для реализации:**
1. "Жать 100кг" (Strength)
2. "Набрать массу груди" (Hypertrophy)
3. "Кубики пресса" (Aesthetics)
4. "Подтянуться 10 раз" (Strength)
5. "Пробежать 5км" (Endurance)

### Фаза 2: Therapeutic Goals (2-3 цели)
1. "Устранить боль в пояснице" (Pain Relief)
2. "Исправить сутулость" (Posture)
3. "Восстановить плечо" (Rehabilitation)

### Фаза 3: Functional Goals (2-3 цели)
1. "Дотянуться до пальцев ног" (Mobility)
2. "Легко носить покупки" (Daily Activities)
3. "Играть с детьми" (Daily Activities)

### Фаза 4: Research Goals (1-2 цели)
1. "Понять механику плеча" (Education)
2. "Научиться правильно приседать" (Education)

---

## 🎨 Визуализация Графа для Разных Типов

### Athletic Goal Graph
```
        [ЦЕЛЬ: Жать 100кг]
               ↓
    ┌──────────┼──────────┐
    ↓          ↓          ↓
[Грудные]  [Трицепс]  [Дельты]
    ↓          ↓          ↓
[Жим лёжа] [Жим узким] [Жим на наклонной]
    ↓
[Программа: 4x8-12, 2x в неделю]
```

### Therapeutic Goal Graph
```
    [ЦЕЛЬ: Устранить боль в пояснице]
               ↓
    ┌──────────┼──────────┐
    ↓          ↓          ↓
[БОЛЬ]    [Слабые мышцы] [Решение]
    ↓          ↓          ↓
[Причины]  [Кор, Ягодицы] [Упражнения]
```

### Functional Goal Graph
```
    [ЦЕЛЬ: Дотянуться до пальцев ног]
               ↓
    ┌──────────┼──────────┐
    ↓          ↓          ↓
[Тугие мышцы] [Растяжки] [Прогресс]
    ↓          ↓          ↓
[Бицепс бедра] [Наклоны] [Тест каждую неделю]
```

---

## 🚀 Структура Данных (Финальная)

```javascript
// js/config/goalData.js

export const goalTypes = {
  ATHLETIC: 'athletic',
  THERAPEUTIC: 'therapeutic',
  FUNCTIONAL: 'functional',
  RESEARCH: 'research'
};

export const athleticSubtypes = {
  STRENGTH: 'strength',
  HYPERTROPHY: 'hypertrophy',
  AESTHETICS: 'aesthetics',
  ENDURANCE: 'endurance'
};

export const goalData = {
  // ATHLETIC: Strength
  "bench-100kg": {
    id: "bench-100kg",
    type: goalTypes.ATHLETIC,
    subtype: athleticSubtypes.STRENGTH,
    title: "Жать 100кг лёжа",
    titleEn: "Bench Press 100kg",

    metrics: {
      current: { value: 70, unit: "kg" },
      target: { value: 100, unit: "kg" },
      timeline: "6 months"
    },

    primaryMuscles: ["pectoralis-major", "triceps", "deltoid-anterior"],
    primaryExercises: ["bench-press", "incline-press", "close-grip-bench"],

    program: {
      frequency: "2-3x per week",
      sets: "4-5 sets",
      reps: "3-6 reps",
      progression: "Linear progression: +2.5kg per week"
    },

    tips: [
      "Фокус на технике при малых весах",
      "Прогрессивная перегрузка каждую неделю",
      "Достаточный отдых между подходами (3-5 мин)"
    ]
  },

  // ATHLETIC: Hypertrophy
  "build-chest": {
    id: "build-chest",
    type: goalTypes.ATHLETIC,
    subtype: athleticSubtypes.HYPERTROPHY,
    title: "Набрать массу груди",
    titleEn: "Build Chest Mass",

    metrics: {
      current: { value: 95, unit: "cm" },
      target: { value: 102, unit: "cm" },
      timeline: "4 months"
    },

    primaryMuscles: ["pectoralis-major"],
    secondaryMuscles: ["deltoid-anterior", "triceps"],

    primaryExercises: [
      { id: "bench-press", sets: "4x8-12", priority: "primary" },
      { id: "incline-press", sets: "3x10-12", priority: "primary" },
      { id: "dumbbell-fly", sets: "3x12-15", priority: "accessory" },
      { id: "cable-crossover", sets: "3x15-20", priority: "accessory" }
    ],

    program: {
      frequency: "2x per week",
      volume: "12-16 sets per week",
      progression: "Add weight when hitting top of rep range"
    },

    nutrition: {
      surplus: "+300-500 kcal",
      protein: "1.6-2.2g per kg bodyweight"
    }
  },

  // THERAPEUTIC: Pain Relief
  "eliminate-lower-back-pain": {
    id: "eliminate-lower-back-pain",
    type: goalTypes.THERAPEUTIC,
    subtype: "pain-relief",
    title: "Устранить боль в пояснице",
    titleEn: "Eliminate Lower Back Pain",

    problem: {
      painId: "lower-back-pain",
      severity: "common",
      painLevel: { current: 7, target: 2, scale: "0-10" }
    },

    affectedMuscles: ["erector-spinae", "quadratus-lumborum", "gluteus-maximus"],

    solution: {
      phase1: {
        duration: "2 weeks",
        focus: "Mobility & Pain Relief",
        exercises: ["cat-cow", "child-pose", "pelvic-tilt"]
      },
      phase2: {
        duration: "4 weeks",
        focus: "Stability & Strength",
        exercises: ["bird-dog", "dead-bug", "plank", "glute-bridge"]
      },
      phase3: {
        duration: "ongoing",
        focus: "Maintenance",
        exercises: ["deadlift", "squat", "farmer-walk"]
      }
    },

    avoidExercises: ["heavy-deadlift", "sit-ups", "leg-raises"],

    lifestyle: [
      "Вставать каждые 30 минут при сидячей работе",
      "Правильная эргономика рабочего места",
      "Растяжка 2 раза в день"
    ]
  },

  // FUNCTIONAL: Mobility
  "touch-toes": {
    id: "touch-toes",
    type: goalTypes.FUNCTIONAL,
    subtype: "mobility",
    title: "Дотянуться до пальцев ног",
    titleEn: "Touch Your Toes",

    metrics: {
      current: { value: 15, unit: "cm from floor" },
      target: { value: 0, unit: "cm (touching toes)" },
      timeline: "6 weeks"
    },

    limitingFactors: [
      { muscle: "hamstrings", tightness: "high" },
      { muscle: "lower-back", tightness: "medium" },
      { muscle: "calves", tightness: "low" }
    ],

    exercises: [
      { id: "standing-hamstring-stretch", duration: "30s x 3", frequency: "daily" },
      { id: "seated-forward-fold", duration: "60s x 2", frequency: "daily" },
      { id: "downward-dog", duration: "30s x 3", frequency: "daily" }
    ],

    progressionTest: "Measure distance from floor weekly",

    benefits: [
      "Улучшение осанки",
      "Снижение риска травм",
      "Легче завязывать шнурки"
    ]
  }
};
```

---

## ✅ Решение

**Финальная классификация: 3 основных типа**
1. **ATHLETIC** (с подтипами: strength, hypertrophy, aesthetics, endurance)
2. **THERAPEUTIC** (с подтипами: pain-relief, rehabilitation, prevention, posture)
3. **FUNCTIONAL** (с подтипами: daily-activities, mobility, balance, aging-well)
4. **RESEARCH** (образовательные)

**Приоритет реализации:**
1. Athletic (3-5 целей) ← **НАЧИНАЕМ С ЭТОГО**
2. Therapeutic (2-3 цели)
3. Functional (2-3 цели)
4. Research (1-2 цели)

**Визуализация:**
- D3.js force-directed layout
- Отдельная страница с навигацией
- Доступ через кнопку или бургер-меню

---

**Готовы начинать реализацию?** 🚀
