# Project Context (for LLM)

## Structure
```
js/
├── main.js              # Entry: detects mobile, loads SVGs
├── config/
│   ├── muscleData.js    # Anatomical data
│   └── muscleIdMap.js   # SVG ID → muscle key
├── core/
│   ├── svgLoader.js     # Loads SVG, auto-generates IDs
│   ├── interactivity.js # Desktop: hover/click, manages allMuscleElements
│   ├── zoom.js          # Desktop: pan & zoom
│   └── mobile.js        # Mobile: swipe, tap, bottom sheet
└── ui/
    ├── sidebar.js       # Desktop sidebar
    └── tooltip.js       # Desktop tooltip
```

## Key Concepts

**Muscle Mapping**: `muscleIdMap` maps SVG element IDs → muscle keys → `muscleData`
**Cross-View Highlighting**: `allMuscleElements[muscleKey]` = array of all parts (both views)
**Responsive**: Desktop (sidebar, dual-view, hover) vs Mobile (swipe, tap, bottom sheet)

## Critical Fixes

1. **Mobile events**: Desktop events disabled on mobile (`if (!isMobile())` in interactivity.js)
2. **CSS specificity**: `.selected` uses `!important`, hover uses `:not(.selected)`
3. **Tap flash**: `-webkit-tap-highlight-color: transparent`
4. **Element registration**: Call `registerMuscleElements()` after setup for mobile

## Mobile UX

```
Tap muscle → .selected class → bottom sheet (collapsed)
Swipe up → expanded
Tap selected/empty → deselect + hide
Swipe left/right → switch views
```

## Adding Muscles

1. Use `muscle-mapper.html` to map SVG elements
2. Update `muscleIdMap.js` and `muscleData.js`
3. Test desktop (hover/click) + mobile (tap/swipe)

---
**Status**: Production (Desktop ✅, Mobile ✅)
