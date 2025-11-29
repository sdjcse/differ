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
│   ├── DiffViewer.jsx    # Main diff component
│   └── DiffViewer.css    # Component styles
├── App.jsx               # Root component
└── main.jsx              # Entry point
```
