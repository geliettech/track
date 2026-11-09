# Track

Track is a responsive productivity dashboard for planning, prioritizing, and tracking work across projects. The app combines a task overview, project workspaces, and a polished dashboard shell in a modern Next.js interface.

> Track is a frontend-only project. It does not include authentication, a backend, or cloud sync. Tasks, project data, and activity are stored in the browser with `localStorage`.

## Features

- **Overview dashboard:** summary cards, priority and completion metrics, due-date tracking, and searchable task views.
- **Project workspaces:** grouped task views with project-level progress and organization.
- **Task management:** create and edit tasks with titles, descriptions, priorities, statuses, due dates, and project assignments.
- **Workspace navigation:** dedicated routes for Overview, Projects, Calendar, Messages, Notifications, Activity, Workspace, Users, and Settings.
- **Responsive layout:** collapsible sidebar for desktop and a mobile-friendly navigation drawer.
- **Theme switching:** light and dark mode support built into the dashboard shell.
- **Browser persistence:** task lists, projects, and activity feed are saved locally in the browser.

The app includes sample tasks, projects, and workspace content to demonstrate the interface without connecting to any external services.

## Tech stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [React Icons](https://react-icons.github.io/react-icons/)
- `uuid` for task identifiers
- React Context for task, project, and theme state management

## Getting started

### Prerequisites

- Node.js 20.9 or later
- npm

### Install and run

```bash
git clone https://github.com/geliettech/track.git
cd track
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
npm run start
```

The production server runs on [http://localhost:3000](http://localhost:3000) by default.

## Project structure

```text
app/
  (dashboard)/
    activity/page.jsx
    calendar/page.jsx
    layout.jsx
    messages/page.jsx
    notifications/page.jsx
    overview/page.jsx
    projects/page.jsx
    settings/page.jsx
    users/page.jsx
    workspace/page.jsx
  globals.css
  layout.js
  page.js
components/
  TaskBoard/
    TaskBoard.jsx
    TaskCard.jsx
  TaskDialog.jsx
  layout/
    DashboardShell.jsx
    Header.jsx
    Sidebar.jsx
context/
  DefaultTasks.jsx
  ProjectContext.jsx
  TaskContext.jsx
  ThemeContext.jsx
public/
  sideBar-icons/
```

## Data and privacy

Track does not send task or project information to a server. Data is stored locally in the browser under keys such as `tasks`, `activity`, and project-related state. Clearing site data removes the saved items, and the app restores the built-in sample content when no saved data is available.

## Deployment

Track can be deployed to any host that supports Next.js applications, including [Vercel](https://vercel.com/). Use the standard Next.js deployment flow:

```bash
npm install
npm run build
npm run start
```

For production hosting, configure the platform to run the app from the project root and serve the built Next.js output.
