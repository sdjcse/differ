# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based SQL diff viewer application designed for comparing Oracle and PostgreSQL queries. Features syntax highlighting, real-time diff calculation, and an editable PostgreSQL side for easy query migration and comparison.

## Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Code Editor**: react-simple-code-editor (with syntax highlighting)
- **Syntax Highlighting**: Prism.js with SQL language support and Okaidia theme
- **Diff Library**: `diff` (for computing text differences)
- **Language**: JavaScript (JSX)

## Repository Structure

```
differ/
├── src/
│   ├── components/
│   │   ├── DiffViewer.jsx      # Main diff viewer component
│   │   └── DiffViewer.css      # Diff viewer styles
│   ├── App.jsx                 # Root application component
│   ├── App.css                 # Application styles
│   ├── index.css               # Global styles
│   └── main.jsx                # Application entry point
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── CLAUDE.md                  # Claude Code guidance
└── README.md                  # Project documentation
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Component Architecture

### DiffViewer Component

Located in `src/components/DiffViewer.jsx`, this is the main component that:

- Manages two SQL query inputs (Oracle and PostgreSQL)
- Provides syntax-highlighted code editors using react-simple-code-editor
- Computes line-by-line differences using the `diff` library
- Renders two views:
  1. **Code Editors**: Two syntax-highlighted editors for Oracle (left) and PostgreSQL (right) queries
  2. **Side-by-Side Diff**: Parallel comparison with syntax highlighting and diff coloring

Key features:
- **SQL Syntax Highlighting**: Uses Prism.js to highlight SQL keywords, functions, and syntax
- **Dark Theme**: Okaidia theme for comfortable long-session viewing
- **Editable PostgreSQL Side**: Right side editor is fully editable for query refinement
- **Real-time Diff**: Automatically updates diff view as you type
- **Color-coded Changes**: Green for additions, red for deletions, with semi-transparent backgrounds
- **Database-Specific Labels**: Clearly labeled Oracle vs PostgreSQL sections

## Styling

The application uses vanilla CSS with a dark-themed code editor design:
- **Okaidia Theme**: Dark background (#272822) with vibrant syntax colors
- **Diff Colors**: Semi-transparent green (additions) and red (deletions) overlays
- **Monospace Fonts**: Fira Code/Fira Mono for optimal code readability
- **Responsive Grid Layout**: Side-by-side views for both editors and diff display
- **Focus States**: Glowing borders (cyan/green) for active editors
- **Dark Diff View**: Matching dark theme in the comparison section for visual consistency
