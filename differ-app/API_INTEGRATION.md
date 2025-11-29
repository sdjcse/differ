# API Integration Guide

This guide shows how to integrate the SQL Diff Viewer with your backend APIs to populate and save query data.

## Quick Start

The DiffViewer component uses React state to manage the SQL queries. You can populate these from your API and save changes back.

## Example 1: Loading Data from API on Mount

```javascript
import { useState, useEffect } from 'react';
import DiffViewer from './components/DiffViewer';

function App() {
  const [oracleQuery, setOracleQuery] = useState('');
  const [postgresQuery, setPostgresQuery] = useState('');

  useEffect(() => {
    // Load queries from your API when component mounts
    fetch('/api/queries/latest')
      .then(res => res.json())
      .then(data => {
        setOracleQuery(data.oracleQuery);
        setPostgresQuery(data.postgresQuery);
      })
      .catch(error => console.error('Error loading queries:', error));
  }, []);

  return (
    <DiffViewer
      initialOracle={oracleQuery}
      initialPostgres={postgresQuery}
    />
  );
}
```

## Example 2: Load Query by ID

```javascript
function App() {
  const [queries, setQueries] = useState({ oracle: '', postgres: '' });
  const [queryId, setQueryId] = useState('');

  const loadQuery = async (id) => {
    try {
      const response = await fetch(`/api/queries/${id}`);
      const data = await response.json();
      setQueries({
        oracle: data.oracleQuery,
        postgres: data.postgresQuery
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <input
        type="text"
        value={queryId}
        onChange={(e) => setQueryId(e.target.value)}
        placeholder="Query ID"
      />
      <button onClick={() => loadQuery(queryId)}>Load</button>

      <DiffViewer
        initialOracle={queries.oracle}
        initialPostgres={queries.postgres}
      />
    </>
  );
}
```

## Example 3: Making DiffViewer Accept Props

To make the DiffViewer component work with API data, modify it to accept initial values as props:

```javascript
// In DiffViewer.jsx
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

  // ... rest of the component
}
```

## Example 4: Saving PostgreSQL Query to API

Add a save handler to send data back to your API:

```javascript
function DiffViewer({ onSave }) {
  const [modifiedText, setModifiedText] = useState('');

  const handleSaveToAPI = async () => {
    try {
      const response = await fetch('/api/queries/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postgresQuery: modifiedText,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        alert('Saved successfully!');
        if (onSave) onSave(modifiedText);
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save');
    }
  };

  return (
    // ... editors ...
    <button onClick={handleSaveToAPI} className="btn btn-primary">
      Save to Database
    </button>
  );
}
```

## Example 5: Complete Component with API Integration

See `src/components/DiffViewerWithAPI.jsx` for a complete working example that includes:

- Loading queries from API on mount
- Loading specific queries by ID
- Saving modified queries back to API
- Error handling
- Loading states

## API Endpoint Examples

Your backend should provide these endpoints:

### GET `/api/queries/default`
Returns the default Oracle and PostgreSQL queries.

**Response:**
```json
{
  "oracleQuery": "SELECT * FROM employees WHERE ROWNUM <= 10",
  "postgresQuery": "SELECT * FROM employees LIMIT 10"
}
```

### GET `/api/queries/:id`
Returns a specific query pair by ID.

**Response:**
```json
{
  "id": "123",
  "oracleQuery": "SELECT ...",
  "postgresQuery": "SELECT ...",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### POST `/api/queries/save`
Saves a new or updated query pair.

**Request Body:**
```json
{
  "id": "123",
  "oracleQuery": "SELECT ...",
  "postgresQuery": "SELECT ..."
}
```

**Response:**
```json
{
  "success": true,
  "id": "123",
  "message": "Query saved successfully"
}
```

## Using URL Parameters

You can also use URL parameters to load specific queries:

```javascript
import { useSearchParams } from 'react-router-dom';

function App() {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('queryId');

  useEffect(() => {
    if (queryId) {
      loadQuery(queryId);
    }
  }, [queryId]);

  // Access like: http://localhost:5173?queryId=123
}
```

## Best Practices

1. **Loading States**: Show loading indicators while fetching data
2. **Error Handling**: Display user-friendly error messages
3. **Debouncing**: If auto-saving, debounce the save function to avoid too many API calls
4. **Validation**: Validate SQL queries before saving to API
5. **Authentication**: Include authentication tokens in API requests
6. **CORS**: Configure CORS properly on your backend

## Example with Authentication

```javascript
const loadQuery = async (id) => {
  try {
    const response = await fetch(`/api/queries/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Unauthorized');
    }

    const data = await response.json();
    // ... handle data
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Integration with Different Frameworks

### Next.js
```javascript
// pages/diff/[id].js
export async function getServerSideProps({ params }) {
  const res = await fetch(`${process.env.API_URL}/queries/${params.id}`);
  const data = await res.json();

  return {
    props: { queryData: data }
  };
}
```

### React Query
```javascript
import { useQuery } from '@tanstack/react-query';

function App() {
  const { data, isLoading } = useQuery({
    queryKey: ['queries', queryId],
    queryFn: () => fetch(`/api/queries/${queryId}`).then(r => r.json())
  });

  if (isLoading) return <div>Loading...</div>;

  return <DiffViewer initialOracle={data.oracleQuery} initialPostgres={data.postgresQuery} />;
}
```
