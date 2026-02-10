# Interactive Muscle Anatomy - Architecture Documentation

## 📋 Project Overview

Interactive web application for exploring human muscle anatomy with dual-view (front/back) visualization, responsive design, and detailed muscle information.

**Tech Stack**: Vanilla JS (ES6 modules), CSS3, SVG

---

## 🏗️ Project Structure

```
muscles/
├── index.html              # Main HTML page
├── styles.css              # All styles (680 lines)
├── body-front.svg          # Front view SVG
├── body-back.svg           # Back view SVG
├── js/
│   ├── main.js            # Entry point
│   ├── config/
│   │   ├── muscleData.js      # Muscle anatomical data
│   │   └── muscleIdMap.js     # SVG ID → muscle key mapping
│   ├── core/
│   │   ├── svgLoader.js       # SVG loading + auto ID generation
│   │   ├── interactivity.js   # Muscle hover/click logic
│   │   ├── zoom.js            # Zoom & pan functionality
│   │   └── mobile.js          # Mobile-specific UX
│   └── ui/
│       ├── sidebar.js         # Desktop sidebar
│       └── tooltip.js         # Hover tooltip
├── muscle-mapper.html      # Tool for mapping muscles
├── muscle-mapper.js        # Mapping tool logic
└── archive/
    └── script.js          # Old monolithic code
```

---

## 🎯 Core Concepts

### 1. Muscle Mapping System

**Problem**: SVG paths don't have semantic IDs
**Solution**: Two-layer mapping system

```javascript
// Layer 1: SVG element ID → Muscle key
muscleIdMap = {
  "front-path-94": "pectoralis-major",
  "front-path-93": "pectoralis-major"  // Same muscle, different part
}

// Layer 2: Muscle key → Anatomical data
muscleData = {
  "pectoralis-major": {
    name: "Pectoralis Major",
    latinName: "Musculus pectoralis major",
    function: "...",
    origin: "...",
    insertion: "..."
  }
}
```

**Key Feature**: Multiple SVG elements can map to one muscle (e.g., left/right pectorals)

### 2. Cross-View Highlighting

When user interacts with a muscle, ALL parts highlight (including on opposite view):

```javascript
// Store elements grouped by muscle key
allMuscleElements = {
  "pectoralis-major": [element1, element2],  // Both parts
  "trapezius-upper": [frontEl1, frontEl2, backEl1, backEl2]  // All views
}

// Highlight all at once
function highlightMuscleGroup(muscleKey, highlight) {
  allMuscleElements[muscleKey].forEach(el => {
    el.classList.toggle('highlighted', highlight);
  });
}
```

### 3. Responsive Design Strategy

**Desktop** (>768px):
- Sidebar (left, 400px)
- Dual view (front + back side-by-side)
- Hover tooltip
- Zoom controls

**Mobile** (≤768px):
- Fullscreen single view
- Horizontal swipe to switch views
- Bottom sheet (collapsed/expanded)
- Tap to select (persistent highlight)
- Info button for general info

---

## 🔄 Data Flow

### Desktop Flow

```
User hovers → highlightMuscleGroup() → All parts glow
            → showTooltip() → Tooltip appears

User clicks → showMuscleDetails() → Sidebar updates
```

### Mobile Flow

```
User taps → selectMuscle() → All parts get .selected class
          → showSheet() → Bottom sheet appears (collapsed)

User swipes up → expandSheet() → Full details shown

User taps selected → deselectMuscle() → Clear selection + hide sheet
User taps empty → deselectMuscle() → Clear selection + hide sheet
```

---

## 🎨 CSS Architecture

### Key Classes

```css
/* Muscle states */
.muscle-interactive          /* Base: cursor, transitions */
.muscle-interactive:hover    /* Desktop: temporary highlight */
.muscle-interactive.highlighted  /* Desktop: with animation */
.muscle-interactive.selected     /* Mobile: persistent highlight */

/* Layout */
.sidebar                     /* Desktop sidebar */
.dual-view-container         /* Desktop: two views */
.mobile-view-container       /* Mobile: swipeable views */
.mobile-bottom-sheet         /* Mobile: info panel */
```

### Mobile Overrides

```css
@media (max-width: 768px) {
  /* Disable desktop features */
  .sidebar, .dual-view-container, .zoom-controls, #hover-tooltip {
    display: none;
  }

  /* Disable hover/active on non-selected */
  .muscle-interactive:hover:not(.selected) {
    filter: none !important;
  }

  /* Ensure selected works */
  .muscle-interactive.selected {
    filter: brightness(1.8) ... !important;
  }
}
```

---

## 🔧 Key Modules

### [`js/main.js`](js/main.js)
Entry point. Detects mobile/desktop, loads SVGs, initializes modules.

### [`js/core/svgLoader.js`](js/core/svgLoader.js)
- Fetches SVG files
- Auto-generates IDs for paths without IDs (`front-path-0`, `front-path-1`, etc.)
- Returns SVG element

### [`js/core/interactivity.js`](js/core/interactivity.js)
- Maps SVG elements to muscle keys
- Sets up event listeners (desktop: hover/click, mobile: none)
- Manages `allMuscleElements` registry
- Provides `highlightMuscleGroup()` for cross-view highlighting

### [`js/core/mobile.js`](js/core/mobile.js)
**Mobile-specific UX**:
- Horizontal swipe detection (view switching)
- Tap to select (persistent `.selected` class)
- Bottom sheet management (hidden/collapsed/expanded)
- Deselect on tap selected or empty space
- Info button handler
- Swipe hint (shown once)

### [`js/core/zoom.js`](js/core/zoom.js)
Pan & zoom for SVG (desktop only):
- Mouse drag to pan
- Mouse wheel to zoom
- Zoom buttons (+, reset, -)

### [`js/ui/sidebar.js`](js/ui/sidebar.js)
Desktop sidebar:
- Toggle collapse/expand
- Display muscle details

### [`js/ui/tooltip.js`](js/ui/tooltip.js)
Hover tooltip (desktop only):
- Follows mouse
- Shows muscle name + brief function

---

## 🎯 Critical Implementation Details

### 1. Mobile Event Handling

**Problem**: Desktop events (hover, tooltip) interfere on mobile
**Solution**: Conditional event binding

```javascript
// In interactivity.js
if (!isMobile()) {
  muscleElement.addEventListener('mouseenter', ...);
  muscleElement.addEventListener('click', ...);
}
// Mobile: click handled in mobile.js
```

### 2. CSS Specificity Issues

**Problem**: Mobile overrides killed `.selected` highlighting
**Solution**: Use `:not(.selected)` and `!important`

```css
/* Don't override selected */
.muscle-interactive:hover:not(.selected) {
  filter: none !important;
}

/* Ensure selected works */
.muscle-interactive.selected {
  filter: ... !important;
}
```

### 3. Tap Highlight Flash

**Problem**: Browser's native tap highlight flashes
**Solution**: Disable with CSS

```css
.muscle-interactive {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
}
```

### 4. Element Registration Timing

**Problem**: `allMuscleElements` not populated for mobile
**Solution**: Call `registerMuscleElements()` after setup

```javascript
// In interactivity.js
setupInteractivity(svg, view);

if (isMobile()) {
  registerMuscleElements(allMuscleElements);
}
```

---

## 🛠️ Tools

### Muscle Mapper (`muscle-mapper.html`)

Interactive tool for mapping SVG elements to muscles:

1. Load SVG
2. Click elements to assign muscle key
3. Export `muscleIdMap` code
4. Copy to `js/config/muscleIdMap.js`

**Usage**:
```bash
# Open in browser
open muscle-mapper.html

# Or via server
python3 -m http.server 8000
# Navigate to http://localhost:8000/muscle-mapper.html
```

---

## 🚀 Development Workflow

### Adding New Muscles

1. **Update SVG** (if needed)
   - Export from Figma/Illustrator
   - Place in project root

2. **Map Elements**
   ```bash
   open muscle-mapper.html
   # Click elements, assign keys, export
   ```

3. **Update Config**
   ```javascript
   // js/config/muscleIdMap.js
   export const muscleIdMap = {
     "new-element-id": "new-muscle-key",
     ...
   };

   // js/config/muscleData.js
   export const muscleData = {
     "new-muscle-key": {
       name: "...",
       latinName: "...",
       function: "...",
       origin: "...",
       insertion: "...",
       description: "..."
     }
   };
   ```

4. **Test**
   - Desktop: hover, click
   - Mobile: tap, swipe, bottom sheet

### Testing Mobile

**Option 1**: Browser DevTools
```
F12 → Toggle device toolbar → Select mobile device
```

**Option 2**: Real device
```bash
# Find your IP
ifconfig | grep inet

# Start server
python3 -m http.server 8000

# On mobile, navigate to:
http://YOUR_IP:8000
```

---

## 📱 Mobile UX States

### Bottom Sheet States

```
Hidden (default)
  ↓ tap muscle
Collapsed (peek: name + function, ~120px)
  ↓ swipe up / tap sheet
Expanded (fullscreen: all details, ~85vh)
  ↓ swipe down
Collapsed
  ↓ swipe down / tap selected / tap empty
Hidden
```

### Selection States

```
No selection
  ↓ tap muscle
Selected (persistent .selected class)
  ↓ tap same muscle
Deselected

  ↓ tap different muscle
Selected (new muscle, old deselected)
```

---

## 🐛 Known Issues & Solutions

### Issue: Tooltip flashes on mobile
**Solution**: Disabled all mouse events on mobile in `interactivity.js`

### Issue: Not all muscle parts highlight
**Solution**: Fixed CSS specificity with `:not(.selected)` and `!important`

### Issue: Tap causes flash
**Solution**: Added `-webkit-tap-highlight-color: transparent`

### Issue: Selected muscle not highlighted
**Solution**: Used `setTimeout(..., 0)` to ensure DOM updates

---

## 🔮 Future Enhancements

### Planned Features

1. **Muscle Hierarchy**
   - Tree view in info panel
   - Navigate muscle groups
   - Filter by region/function

2. **Search**
   - Search by name
   - Filter by function
   - Highlight matching muscles

3. **Animations**
   - Muscle contraction animations
   - Movement demonstrations
   - Exercise examples

4. **Data Expansion**
   - Complete all muscle descriptions
   - Add exercises per muscle
   - Add injury information
   - Add stretching guides

5. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - High contrast mode
   - Text size controls

### Technical Debt

- [ ] Complete muscle data (currently TODOs)
- [ ] Add unit tests
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Performance optimization (lazy load SVGs)
- [ ] PWA support (offline mode)

---

## 📚 References

- **SVG Source**: Custom anatomical illustrations
- **Design Inspiration**: CodePen neon effects
- **Mobile UX**: iOS/Android bottom sheet patterns
- **Fonts**: Inter (UI), JetBrains Mono (code/latin names)

---

## 🤝 Contributing

When working with LLM on this project:

1. **Context**: Share this file + relevant module
2. **Changes**: Update this doc if architecture changes
3. **Testing**: Always test both desktop + mobile
4. **Mapping**: Use muscle-mapper tool for new muscles

---

**Last Updated**: 2026-02-10
**Version**: 1.0
**Status**: Production Ready (Desktop ✅, Mobile ✅)
