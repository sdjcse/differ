import { useState, useEffect } from 'react';
import * as Diff from 'diff';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css';
import './DiffViewer.css';

/**
 * Example component showing how to integrate with APIs
 * This component demonstrates:
 * 1. Loading queries from API on mount
 * 2. Loading queries based on query ID
 * 3. Saving modified query back to API
 */
function DiffViewerWithAPI() {
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [diff, setDiff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queryId, setQueryId] = useState('');

  const highlightSQL = (code) => {
    return Prism.highlight(code, Prism.languages.sql, 'sql');
  };

  useEffect(() => {
    const differences = Diff.diffLines(originalText, modifiedText);
    setDiff(differences);
  }, [originalText, modifiedText]);

  // Example: Load queries from API on component mount
  useEffect(() => {
    loadDefaultQueries();
  }, []);

  const loadDefaultQueries = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/queries/default');
      const data = await response.json();

      setOriginalText(data.oracleQuery);
      setModifiedText(data.postgresQuery);
    } catch (error) {
      console.error('Error loading queries:', error);
      // Set default queries on error
      setOriginalText('-- Failed to load Oracle query\n-- Check API connection');
      setModifiedText('-- Failed to load PostgreSQL query\n-- Check API connection');
    } finally {
      setLoading(false);
    }
  };

  // Example: Load specific query by ID
  const loadQueryById = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/queries/${id}`);
      const data = await response.json();

      setOriginalText(data.oracleQuery);
      setModifiedText(data.postgresQuery);
      setQueryId(id);
    } catch (error) {
      console.error('Error loading query:', error);
      alert('Failed to load query');
    } finally {
      setLoading(false);
    }
  };

  // Example: Save modified query to API
  const saveToAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/queries/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: queryId,
          oracleQuery: originalText,
          postgresQuery: modifiedText,
        }),
      });

      if (response.ok) {
        alert('Query saved successfully!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving query:', error);
      alert('Failed to save query');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOriginal = () => {
    const blob = new Blob([originalText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oracle_query.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveModified = () => {
    const blob = new Blob([modifiedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'postgresql_query.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyOriginal = async () => {
    try {
      await navigator.clipboard.writeText(originalText);
      alert('Oracle SQL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyModified = async () => {
    try {
      await navigator.clipboard.writeText(modifiedText);
      alert('PostgreSQL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="diff-container">
      <h1>SQL Diff Viewer (with API)</h1>

      {/* API Controls */}
      <div className="api-controls">
        <input
          type="text"
          placeholder="Enter Query ID"
          value={queryId}
          onChange={(e) => setQueryId(e.target.value)}
          className="query-id-input"
        />
        <button
          onClick={() => loadQueryById(queryId)}
          disabled={!queryId || loading}
          className="btn btn-primary"
        >
          Load Query
        </button>
        <button
          onClick={saveToAPI}
          disabled={loading}
          className="btn btn-primary"
        >
          Save to API
        </button>
        {loading && <span className="loading-text">Loading...</span>}
      </div>

      <div className="editor-container">
        <div className="editor-pane">
          <div className="editor-header">
            <h2>Oracle SQL</h2>
            <div className="button-group">
              <button onClick={handleCopyOriginal} className="btn btn-secondary">
                Copy
              </button>
              <button onClick={handleSaveOriginal} className="btn btn-primary">
                Save File
              </button>
            </div>
          </div>
          <Editor
            value={originalText}
            onValueChange={setOriginalText}
            highlight={highlightSQL}
            padding={12}
            className="code-editor"
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              backgroundColor: '#f5f5f5',
              minHeight: '300px',
              borderRadius: '4px',
            }}
          />
        </div>

        <div className="editor-pane">
          <div className="editor-header">
            <h2>PostgreSQL (Editable)</h2>
            <div className="button-group">
              <button onClick={handleCopyModified} className="btn btn-secondary">
                Copy
              </button>
              <button onClick={handleSaveModified} className="btn btn-primary">
                Save File
              </button>
            </div>
          </div>
          <Editor
            value={modifiedText}
            onValueChange={setModifiedText}
            highlight={highlightSQL}
            padding={12}
            className="code-editor editable"
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              backgroundColor: '#f5f5f5',
              minHeight: '300px',
              borderRadius: '4px',
            }}
          />
        </div>
      </div>

      <div className="diff-side-by-side">
        <h2>Side-by-Side Diff</h2>
        <div className="side-by-side-container">
          <div className="side-by-side-pane">
            <h3>Oracle</h3>
            <div className="side-by-side-content">
              {diff.filter(part => !part.added).map((part, index) => (
                <div key={index}>
                  {part.value.split('\n').filter((line, idx, arr) => idx < arr.length - 1 || line !== '').map((line, lineIndex) => (
                    <div
                      key={`${index}-${lineIndex}`}
                      className={`diff-line ${part.removed ? 'removed' : 'unchanged'}`}
                      dangerouslySetInnerHTML={{
                        __html: highlightSQL(line || ' ')
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="side-by-side-pane">
            <h3>PostgreSQL</h3>
            <div className="side-by-side-content">
              {diff.filter(part => !part.removed).map((part, index) => (
                <div key={index}>
                  {part.value.split('\n').filter((line, idx, arr) => idx < arr.length - 1 || line !== '').map((line, lineIndex) => (
                    <div
                      key={`${index}-${lineIndex}`}
                      className={`diff-line ${part.added ? 'added' : 'unchanged'}`}
                      dangerouslySetInnerHTML={{
                        __html: highlightSQL(line || ' ')
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiffViewerWithAPI;
