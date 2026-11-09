## Project Overview


Build a task management dashboard with full authentication,  to organize and track tasks using a Kanban-style board. It provides a clear, intuitive interface for managing project workflows from initial ideation to completion. The application is built to be scalable and maintainable, leveraging a robust and popular technology stack.

-----

## Key Features

  * **Kanban Board:** A three-column layout to visually manage tasks in `To Do`, `In Progress`, and `Done` states.
  * **Dynamic Task Management:** Users can add new tasks, edit existing task title, and permanently delete tasks.
  * **Interactive Progress Tracking:** Each task card features a real-time progress bar that automatically updates its value and color based on the task's status.
  * **Intuitive UI/UX:** Features include smooth functionality for moving tasks by clicking on dotted line(...) on the todo cards, a persistent light/dark theme toggle, and a subtle hover-and-scale effect on task cards for enhanced user feedback.
  * **Scalable Architecture:** Built with a React Context API for centralized state management, ensuring a predictable data flow and easy-to-manage application state.
  * **A 3D background behind the task list:** created soft glowing particles that slowly float, giving a sense of depth.

-----

## Technical Stack
* **authentication:** next/auth
* **Framework:** Next.js (App Router) 
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **Icons:** React Icons
* **Data Handling:** `localStorage` for persistent data storage
* **Unique Identifiers:** `uuid`
* **3D:** React Three Fiber (Three.js)

-----

## Project Setup

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your system.

### Installation

1.  Clone the repository to your local machine:
    ```bash
    git clone [https://github.com/geliettech/todo-app-3d]
    ```
2.  Navigate into the project directory:
    ```bash
    cd [todo-app-3d]
    ```
3.  Install all required dependencies:
    ```bash
    npm install
    ```

### Running the Application

To start the development server, run the following command in your terminal:

```bash
npm run dev
```

The application will be accessible in your web browser at `http://localhost:3000`.

-----

## Project Structure

The codebase is organized into a clean and modular structure for clarity and ease of maintenance.

```
/my-task-board
├── components/          # Reusable UI components (e.g., TaskCard, Sidebar)
├── context/             # State management using React Context (e.g., TaskContext)
├── app/                 # Next.js routing and root layout
├── public/              # Static assets and images
└── styles/              # Global styling and Tailwind configuration
```

-----

## 🚀 Deployment

This project can be easily deployed to any hosting platform that supports Next.js.

  * [Vercel](https://vercel.com/) (recommended)
  * [Netlify](https://www.netlify.com/)

-----

## 👨‍💻 Author

  * **OGE** – [@geliettech](https://github.com/geliettech)

-----

## 📜 License

This project is licensed under the MIT License.
