# SQL Diff Viewer

A React-based web application for comparing SQL queries with syntax highlighting. Specifically designed to compare Oracle SQL queries with their PostgreSQL equivalents, making database migration and query comparison easier.

## Features

- **SQL Syntax Highlighting**: Full syntax highlighting for both Oracle and PostgreSQL queries using Prism.js with Okaidia dark theme
- **Dual Code Editors**: Interactive code editors with syntax highlighting for both input areas
- **Real-time Diff Calculation**: Automatically computes differences as you type
- **Side-by-Side Comparison**: View Oracle and PostgreSQL queries side-by-side with highlighted differences
- **Editable PostgreSQL Side**: Edit the PostgreSQL query while viewing differences in real-time
- **Color-coded Changes**: Green highlights for additions, red for deletions
- **Dark Theme**: Code editor uses Okaidia dark theme for better readability during long sessions

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

### Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **react-simple-code-editor** - Code editor with syntax highlighting support
- **Prism.js** - Syntax highlighting engine for SQL
- **diff** library - Computing text differences

## Project Structure

```
src/
├── components/
│   ├── DiffViewer.jsx         # Main diff component (standalone)
│   ├── DiffViewerWithAPI.jsx  # Example with API integration
│   └── DiffViewer.css         # Component styles
├── App.jsx                    # Root component
└── main.jsx                   # Entry point
```

## API Integration

This application is designed to work with backend APIs to load and save SQL queries. Here's how to integrate it with your API:

### Quick Start - Loading Data from Your API

**Step 1:** Modify `src/components/DiffViewer.jsx` to accept props:

```javascript
// In DiffViewer.jsx - Add props to function signature
function DiffViewer({ initialOracle = '', initialPostgres = '' }) {
  const [originalText, setOriginalText] = useState(initialOracle);
  const [modifiedText, setModifiedText] = useState(initialPostgres);

  // Update when props change
  useEffect(() => {
    if (initialOracle) setOriginalText(initialOracle);
  }, [initialOracle]);

  useEffect(() => {
    if (initialPostgres) setModifiedText(initialPostgres);
  }, [initialPostgres]);

  // ... rest of component stays the same
}
```

**Step 2:** Load data from your API in `src/App.jsx`:

```javascript
import { useState, useEffect } from 'react';
import DiffViewer from './components/DiffViewer';

function App() {
  const [oracleQuery, setOracleQuery] = useState('');
  const [postgresQuery, setPostgresQuery] = useState('');

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch('https://your-api.com/api/queries/latest')
      .then(res => res.json())
      .then(data => {
        setOracleQuery(data.oracleQuery);
        setPostgresQuery(data.postgresQuery);
      })
      .catch(error => console.error('Error loading queries:', error));
  }, []);

  return (
    <div className="app">
      <DiffViewer
        initialOracle={oracleQuery}
        initialPostgres={postgresQuery}
      />
    </div>
  );
}

export default App;
```

### Loading Queries by ID

If you need to load specific queries based on an ID (e.g., from URL parameters):

```javascript
import { useState, useEffect } from 'react';
import DiffViewer from './components/DiffViewer';

function App() {
  const [queries, setQueries] = useState({ oracle: '', postgres: '' });

  // Get query ID from URL: http://localhost:5173?id=123
  const queryId = new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    if (queryId) {
      fetch(`https://your-api.com/api/queries/${queryId}`)
        .then(res => res.json())
        .then(data => {
          setQueries({
            oracle: data.oracleQuery,
            postgres: data.postgresQuery
          });
        })
        .catch(error => console.error('Error:', error));
    }
  }, [queryId]);

  return (
    <div className="app">
      <DiffViewer
        initialOracle={queries.oracle}
        initialPostgres={queries.postgres}
      />
    </div>
  );
}
```

### Expected API Response Format

Your API should return data in this format:

```json
{
  "oracleQuery": "SELECT * FROM employees WHERE ROWNUM <= 10",
  "postgresQuery": "SELECT * FROM employees LIMIT 10"
}
```

### Complete Working Example

See `src/components/DiffViewerWithAPI.jsx` for a complete example that includes:
- Loading queries from API
- Loading by query ID
- Saving modified queries back to API
- Loading states and error handling

To use the API example:
1. Update `src/App.jsx` to import `DiffViewerWithAPI` instead of `DiffViewer`
2. Replace API endpoints in the component with your actual backend URLs
3. Implement the corresponding endpoints on your backend

### Detailed Documentation

For comprehensive API integration examples, authentication, and best practices, see:
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Complete integration guide with multiple examples
