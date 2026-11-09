"use client";

import { useMemo, useState } from "react";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFolder,
  FiPlus,
  FiCheckCircle,
} from "react-icons/fi";
import { useTasks } from "@/context/TaskContext";
import { useDashboardShell } from "@/components/layout/DashboardShell";
import { getProjectByName } from "@/context/Projects";
import type { Task } from "@/context/types";

function parseDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CalendarPage() {
  const { tasks, updateTaskStatus } = useTasks();
  const { openTaskDialog } = useDashboardShell();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayKey, setSelectedDayKey] = useState<string>(() => parseDateKey(new Date()));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);

  // Group tasks by date string (YYYY-MM-DD)
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      if (!task.date) return;
      // Match YYYY-MM-DD
      const datePart = task.date.slice(0, 10);
      const list = map.get(datePart) || [];
      list.push(task);
      map.set(datePart, list);
    });
    return map;
  }, [tasks]);

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Days in current month
    const totalDays = lastDayOfMonth.getDate();
    // Monday as first day: 0=Mon, 6=Sun
    const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

    const days = [];

    // Prev month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayIndex - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const key = `${month === 0 ? year - 1 : year}-${String(
        month === 0 ? 12 : month
      ).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ dayNumber: d, isCurrentMonth: false, dateKey: key });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ dayNumber: d, isCurrentMonth: true, dateKey: key });
    }

    // Next month padding to complete 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const key = `${month === 11 ? year + 1 : year}-${String(
        month === 11 ? 1 : month + 2
      ).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ dayNumber: d, isCurrentMonth: false, dateKey: key });
    }

    return days;
  }, [year, month]);

  const selectedDayTasks = tasksByDate.get(selectedDayKey) || [];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDayKey(parseDateKey(now));
  };

  const todayKey = parseDateKey(new Date());

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-accent-soft text-accent">
              <FiCalendar size={18} />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
              Schedule & Calendar
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted">
            Track upcoming deadlines, plan future sprints, and schedule your tasks.
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleToday}
            className="cursor-pointer inline-flex h-9 items-center justify-center rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-muted hover:bg-surface-hover hover:text-ink transition-colors"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl border border-line bg-surface p-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="cursor-pointer grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-hover hover:text-ink transition-colors"
              aria-label="Previous month"
            >
              <FiChevronLeft size={16} />
            </button>
            <span className="px-3 text-xs font-bold text-ink min-w-[110px] text-center">
              {monthName} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="cursor-pointer grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-hover hover:text-ink transition-colors"
              aria-label="Next month"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Calendar Grid + Selected Day Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Calendar Grid (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-xs">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center pb-3 border-b border-line text-xs font-bold text-muted">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-3">
            {calendarDays.map(({ dayNumber, isCurrentMonth, dateKey }) => {
              const dayTasks = tasksByDate.get(dateKey) || [];
              const isSelected = selectedDayKey === dateKey;
              const isToday = todayKey === dateKey;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDayKey(dateKey)}
                  className={`min-h-[74px] sm:min-h-[92px] p-1.5 sm:p-2 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                      : isToday
                      ? "border-accent/40 bg-surface-muted/60"
                      : isCurrentMonth
                      ? "border-line/60 bg-surface hover:bg-surface-hover"
                      : "border-transparent bg-surface-muted/20 opacity-40 hover:opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isToday
                          ? "grid size-5 place-items-center rounded-full bg-accent text-white font-bold"
                          : isCurrentMonth
                          ? "text-ink"
                          : "text-faint"
                      }`}
                    >
                      {dayNumber}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-bold text-muted">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task preview dots/bars */}
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => {
                      const project = getProjectByName(t.project);
                      return (
                        <div
                          key={t.id}
                          className="truncate rounded px-1 py-0.5 text-[9px] font-medium leading-none text-ink bg-surface border border-line/60 flex items-center gap-1"
                        >
                          <span
                            className="size-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                          <span className="truncate">{t.title}</span>
                        </div>
                      );
                    })}
                    {dayTasks.length > 2 && (
                      <p className="text-[9px] text-faint pl-1 font-semibold">
                        +{dayTasks.length - 2} more
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Panel (1 col) */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <h2 className="font-display text-sm font-bold text-ink">
                {selectedDayKey === todayKey ? "Today's Agenda" : "Scheduled Tasks"}
              </h2>
              <p className="text-xs text-muted">{selectedDayKey}</p>
            </div>
            <button
              type="button"
              onClick={() => openTaskDialog({ task: undefined })}
              className="grid size-7 place-items-center rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs"
              title="Add task"
              aria-label="Add task"
            >
              <FiPlus size={15} />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto">
            {selectedDayTasks.length > 0 ? (
              selectedDayTasks.map((task) => {
                const project = getProjectByName(task.project);
                return (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl border border-line/70 bg-surface-muted/40 hover:bg-surface-hover transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-ink leading-tight">
                        {task.title}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          updateTaskStatus(
                            task.id,
                            task.status === "done" ? "todo" : "done"
                          )
                        }
                        className={`grid size-6 shrink-0 place-items-center rounded-md border transition-colors ${
                          task.status === "done"
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-line bg-surface text-muted hover:border-emerald-500 hover:text-emerald-500"
                        }`}
                        title={task.status === "done" ? "Mark incomplete" : "Mark complete"}
                      >
                        <FiCheckCircle size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted">
                      <span className="flex items-center gap-1">
                        <span
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        {task.project}
                      </span>
                      <span className="capitalize font-medium">
                        {task.status === "inprogress" ? "In progress" : task.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <FiClock size={20} className="mx-auto text-faint mb-2" />
                <p className="text-xs font-medium text-muted">No tasks due this day.</p>
                <button
                  type="button"
                  onClick={() => openTaskDialog()}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline cursor-pointer"
                >
                  <FiPlus size={13} /> Add task for this day
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
