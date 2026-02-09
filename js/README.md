# JavaScript Modules

## Structure

```
js/
├── config/          # Configuration & data
│   ├── muscleData.js    # Muscle anatomical info
│   └── muscleIdMap.js   # SVG ID → muscle key mapping
├── core/            # Core functionality
│   ├── svgLoader.js     # SVG loading & ID generation
│   ├── interactivity.js # Hover/click/highlight logic
│   └── zoom.js          # Zoom & pan controls
├── ui/              # UI components
│   ├── sidebar.js       # Sidebar management
│   └── tooltip.js       # Tooltip display
└── main.js          # Entry point
```

## Key Features

- **ES6 Modules**: Clean imports/exports
- **Cross-view highlighting**: Hover on one muscle → highlights all parts (both views)
- **Auto ID generation**: SVG paths get IDs automatically on load
- **Modular**: Easy to test and maintain

## Usage

Import in HTML:
```html
<script type="module" src="js/main.js"></script>
```

## Adding New Muscles

1. Use `muscle-mapper.html` to map SVG elements
2. Export generated code
3. Update `muscleData.js` and `muscleIdMap.js`
4. Refresh page
