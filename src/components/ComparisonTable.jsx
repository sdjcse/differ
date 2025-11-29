import { useState } from 'react';
import * as Diff from 'diff';
import './ComparisonTable.css';

function ComparisonTable({ onViewDiff }) {
  const [comparisons] = useState([
    {
      id: 1,
      name: 'Employee Query',
      oracleSQL: `SELECT
  e.employee_id,
  e.first_name,
  e.last_name,
  d.department_name,
  NVL(e.salary, 0) AS salary
FROM employees e
INNER JOIN departments d
  ON e.department_id = d.department_id
WHERE ROWNUM <= 10
ORDER BY e.employee_id`,
      postgresSQL: `SELECT
  e.employee_id,
  e.first_name,
  e.last_name,
  d.department_name,
  COALESCE(e.salary, 0) AS salary
FROM employees e
INNER JOIN departments d
  ON e.department_id = d.department_id
ORDER BY e.employee_id
LIMIT 10`
    },
    {
      id: 2,
      name: 'Department Summary',
      oracleSQL: `SELECT
  d.department_name,
  COUNT(*) as employee_count
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_name`,
      postgresSQL: `SELECT
  d.department_name,
  COUNT(*) as employee_count
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_name`
    },
    {
      id: 3,
      name: 'Date Functions',
      oracleSQL: `SELECT
  employee_id,
  hire_date,
  SYSDATE as current_date,
  TRUNC(SYSDATE) as today,
  ADD_MONTHS(hire_date, 12) as anniversary
FROM employees`,
      postgresSQL: `SELECT
  employee_id,
  hire_date,
  CURRENT_TIMESTAMP as current_date,
  CURRENT_DATE as today,
  hire_date + INTERVAL '12 months' as anniversary
FROM employees`
    },
    {
      id: 4,
      name: 'String Concatenation',
      oracleSQL: `SELECT
  first_name || ' ' || last_name as full_name,
  UPPER(email) as email_upper
FROM employees`,
      postgresSQL: `SELECT
  first_name || ' ' || last_name as full_name,
  UPPER(email) as email_upper
FROM employees`
    }
  ]);

  const checkMatch = (oracle, postgres) => {
    const normalizedOracle = oracle.trim().replace(/\s+/g, ' ');
    const normalizedPostgres = postgres.trim().replace(/\s+/g, ' ');
    return normalizedOracle === normalizedPostgres;
  };

  const hasDifferences = (oracle, postgres) => {
    const differences = Diff.diffLines(oracle, postgres);
    return differences.some(part => part.added || part.removed);
  };

  return (
    <div className="comparison-table-container">
      <h1>SQL Query Comparisons</h1>
      <div className="table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Name/ID</th>
              <th>Oracle SQL</th>
              <th>PostgreSQL</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((comparison) => {
              const isMatch = checkMatch(comparison.oracleSQL, comparison.postgresSQL);

              return (
                <tr key={comparison.id}>
                  <td className="id-cell">
                    <div className="id-content">
                      <span className="id-number">#{comparison.id}</span>
                      <span className="name">{comparison.name}</span>
                    </div>
                  </td>
                  <td className="sql-cell">
                    <pre className="sql-preview">{comparison.oracleSQL}</pre>
                  </td>
                  <td className="sql-cell">
                    <pre className="sql-preview">{comparison.postgresSQL}</pre>
                  </td>
                  <td className="status-cell">
                    {isMatch ? (
                      <span className="status-badge match">Perfect Match</span>
                    ) : (
                      <button
                        className="btn-view-diff"
                        onClick={() => onViewDiff(comparison)}
                      >
                        View Diff
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComparisonTable;
