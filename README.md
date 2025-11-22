# Project Budget Tracker

A comprehensive web application for tracking and managing project budgets with Thai Fiscal Year timeline (October to September).

## Features

- **Gantt Chart Timeline**: Visual representation of projects across Thai fiscal year months
- **Drag & Drop**: Easily move projects between months by dragging the project bars
- **Budget Tracking**: Monthly and cumulative budget calculations with target vs actual comparison
- **CRUD Operations**: Add, edit, and delete projects with validation
- **Smart Date Handling**: Auto-lock start month based on meeting dates
- **Interactive Calendar**: Click month headers to view detailed calendar with meeting highlights
- **Data Persistence**: Auto-save to localStorage with CSV import/export capabilities
- **Dark Mode**: Toggle between light and dark themes
- **Filtering & Sorting**: Filter by department group and sort by various criteria
- **Thai Language**: Complete Thai language interface

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Lucide React** for icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ProjectGanttChart.tsx   # Main Gantt chart component
│   ├── ProjectModal.tsx         # Add/Edit project modal
│   └── CalendarModal.tsx        # Monthly calendar view
├── types.ts                     # TypeScript interfaces
├── constants.ts                 # App constants and fiscal year logic
├── utils.ts                     # Utility functions (CSV, dates, storage)
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
└── index.css                    # Global styles

public/
└── projects.csv                 # Initial project data
```

## Usage

### Adding a Project

1. Click the "เพิ่ม" (Add) button in the header
2. Fill in project details:
   - Project name
   - Department group
   - Budget amount
   - Meeting dates (optional - auto-locks start month)
   - Start month
   - Status
   - Color
3. Click "เพิ่มโครงการ" to save

### Moving Projects

Simply drag a project bar from one month column and drop it into another month.

### Viewing Calendar

Click on any month header to see:
- Full calendar grid for that month
- Highlighted days with project meetings
- List of all projects starting in that month

### Data Management

- **Auto-save**: Changes are automatically saved to localStorage
- **Export**: Download current data as CSV file
- **Reset**: Clear localStorage and reload from original CSV file

## License

MIT
Budget Tracker
