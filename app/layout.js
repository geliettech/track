import "./globals.css";
import { ProjectProvider } from "@/context/ProjectContext";
import { TaskProvider } from "@/context/TaskContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "Track — Your work, in focus",
  description: "A thoughtful workspace for planning, tracking, and finishing your tasks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ProjectProvider>
            <TaskProvider>{children}</TaskProvider>
          </ProjectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
