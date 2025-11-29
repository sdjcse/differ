import { useState, useEffect } from 'react';
import * as Diff from 'diff';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css';
import './DiffViewer.css';

function DiffViewer({ initialOracle, initialPostgres, comparisonName }) {
  const defaultOracle = `SELECT
  e.employee_id,
  e.first_name,
  e.last_name,
  d.department_name,
  NVL(e.salary, 0) AS salary
FROM employees e
INNER JOIN departments d
  ON e.department_id = d.department_id
WHERE ROWNUM <= 10
ORDER BY e.employee_id`;

  const defaultPostgres = `SELECT
  e.employee_id,
  e.first_name,
  e.last_name,
  d.department_name,
  COALESCE(e.salary, 0) AS salary
FROM employees e
INNER JOIN departments d
  ON e.department_id = d.department_id
ORDER BY e.employee_id
LIMIT 10`;

  const [originalText, setOriginalText] = useState(initialOracle || defaultOracle);
  const [modifiedText, setModifiedText] = useState(initialPostgres || defaultPostgres);

  const [diff, setDiff] = useState([]);

  const highlightSQL = (code) => {
    return Prism.highlight(code, Prism.languages.sql, 'sql');
  };

  useEffect(() => {
    const differences = Diff.diffLines(originalText, modifiedText);
    setDiff(differences);
  }, [originalText, modifiedText]);

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
      <h1>{comparisonName ? `${comparisonName} - SQL Diff Viewer` : 'SQL Diff Viewer'}</h1>

      <div className="editor-container">
        <div className="editor-pane">
          <div className="editor-header">
            <h2>Oracle SQL</h2>
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
                Save
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

export default DiffViewer;
