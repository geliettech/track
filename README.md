# Track

Track is a responsive task-management dashboard built with Next.js. It brings task planning, project views, and workspace navigation together in a polished interface with light and dark themes.

> Track is currently a frontend-only application. It does not include authentication, a backend, or cloud synchronization. Tasks and user-created projects are stored in the browser.

## Features

- **Overview:** Task summary cards, due-date visualization, and a searchable, filterable task schedule.
- **Projects:** Browse projects and view their tasks as a board, backlog, or timeline; create projects and assign tasks.
- **Task management:** Create and edit tasks with descriptions, priorities, statuses, due dates, and project assignments.
- **Workspace navigation:** Overview, Projects, Messages, Users, Activity, Calendar, Notifications, Settings, and Workspace pages.
- **Responsive sidebar:** Collapsible desktop navigation and a mobile drawer.
- **Search and themes:** Search tasks and switch between light and dark themes.
- **Browser persistence:** Tasks and user-created projects are saved in `localStorage`.
- **3D background:** A Three.js / React Three Fiber visual background.

Messages and teammate information are frontend sample content; they are not connected to a messaging service or user directory.

## Tech stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4 and application styles in `app/globals.css`
- [React Icons](https://react-icons.github.io/react-icons/)
- [Three.js](https://threejs.org/) with [React Three Fiber](https://r3f.docs.pmnd.rs/)
- React Context for task, project, and theme state

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

The production server runs at [http://localhost:3000](http://localhost:3000) by default.

## Project structure

```text
app/
  globals.css             Global styles and responsive layouts
  layout.js               Root layout and application providers
  page.js                 Dashboard entry point
components/
  Dashboard.jsx           Main dashboard and section routing
  Header.jsx              Search, theme, profile, and task actions
  Overview.jsx            Workspace overview and task schedule
  ProjectWorkspace.jsx    Project directory and project task views
  SideBar.jsx             Responsive workspace navigation
  TaskDialog.jsx          Task creation and editing
  WorkspacePages.jsx      Messages, users, activity, calendar, and more
  TaskBoard/              Kanban board and task cards
context/
  TaskContext.jsx         Task state and browser persistence
  ProjectContext.jsx      Project state and browser persistence
  ThemeContext.jsx        Theme state
```

## Data and privacy

Track does not send tasks or projects to a server. Task data is stored in the browser under `tasks`, and user-created projects under `projects`. Clearing this browser's site data removes those locally saved items. The app starts with example tasks and projects when no saved data is present.

## Deployment

Track can be deployed to a host that supports Next.js, such as [Vercel](https://vercel.com/). Configure the deployment to install dependencies with `npm install`, build with `npm run build`, and start with `npm run start`.
