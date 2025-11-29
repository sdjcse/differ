# SQL Diff Viewer

React app for comparing Oracle and PostgreSQL queries with syntax highlighting and diff visualization.

## Features

- **Comparison Table**: Browse multiple SQL comparisons, detect perfect matches, drill into diffs
- **Side-by-Side Diff**: Real-time diff with syntax highlighting and color-coded changes
- **Light/Dark Theme**: Toggle between themes with preference persistence
- **Editable Editors**: Modify queries and see diffs update instantly
- **Copy/Save**: Export PostgreSQL queries to clipboard or file

## Quick Start

```bash
npm install
npm run dev  # Opens at http://localhost:5173
```

## Tech Stack

React 19 • Vite • Prism.js • react-simple-code-editor • diff

## API Integration

### 1. Feed the Comparison Table

Update `src/components/ComparisonTable.jsx` to fetch data:

```javascript
const [comparisons, setComparisons] = useState([]);

useEffect(() => {
  fetch('https://your-api.com/api/comparisons')
    .then(res => res.json())
    .then(data => setComparisons(data));
}, []);
```

**Expected API response:**
```json
[
  {
    "id": 1,
    "name": "Employee Query",
    "oracleSQL": "SELECT * FROM employees WHERE ROWNUM <= 10",
    "postgresSQL": "SELECT * FROM employees LIMIT 10"
  }
]
```

### 2. Add Save Functionality

In `src/components/DiffViewer.jsx`, add a save handler:

```javascript
const handleSave = async () => {
  await fetch('https://your-api.com/api/queries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      oracleSQL: originalText,
      postgresSQL: modifiedText
    })
  });
};

// Add to your button:
<button onClick={handleSave}>Save to Database</button>
```

### 3. Load Specific Comparison by ID

```javascript
// In App.jsx or ComparisonTable.jsx
const loadComparison = (id) => {
  fetch(`https://your-api.com/api/comparisons/${id}`)
    .then(res => res.json())
    .then(data => {
      setSelectedComparison(data);
      setActiveView('diff');
    });
};
```

**Example reference:** See `src/components/DiffViewerWithAPI.jsx` for complete working example with error handling.

**Full guide:** [API_INTEGRATION.md](./API_INTEGRATION.md)
