import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Toaster } from "sonner";

import { TaskProvider, useTasks } from "@/context/TaskContext";
import { Navbar } from "@/components/Navbar";
import { Dashboard } from "@/components/Dashboard";
import { StatsCards } from "@/components/StatsCards";
import { Toolbar } from "@/components/Toolbar";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { MiniCalendar } from "@/components/MiniCalendar";
import { EmptyState } from "@/components/EmptyState";
import { filterTasks, isTaskCompletedForDate, sortTasks, isToday, todayISO } from "@/utils/tasks";
import type { Task } from "@/types/task";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daily Task Tracker — Premium Productivity" },
      {
        name: "description",
        content:
          "A beautiful, minimalist daily task tracker with streaks, progress, and smooth animations. Local-first.",
      },
      { property: "og:title", content: "Daily Task Tracker" },
      {
        property: "og:description",
        content: "Plan your day. Track your progress. Build your streak.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <TaskProvider>
      <Toaster position="top-right" richColors closeButton />
      <App />
    </TaskProvider>
  );
}

function App() {
  const { tasks, filter, sort, search, selectedDate } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const lastAllDoneRef = useRef(false);

  const visible = useMemo(
    () => sortTasks(filterTasks(tasks, filter, search, selectedDate), sort),
    [tasks, filter, search, sort, selectedDate],
  );

  // Confetti when all today's tasks complete
  useEffect(() => {
    const todays = tasks.filter((t) => !t.archived && isToday(t));
    const allDone = todays.length > 0 && todays.every((t) => isTaskCompletedForDate(t, todayISO()));
    if (allDone && !lastAllDoneRef.current) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#a78bfa", "#f0abfc", "#60a5fa", "#34d399"],
      });
    }
    lastAllDoneRef.current = allDone;
  }, [tasks]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (e.key === "/" && !inField) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if ((e.key === "n" || e.key === "N") && !inField && !modalOpen) {
        e.preventDefault();
        setEditing(null);
        setModalOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (t: Task) => {
    setEditing(t);
    setModalOpen(true);
  };

  const hasAnyTasks = tasks.some((t) => !t.archived);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:space-y-6 sm:px-6 sm:py-8">
        <Dashboard />
        <StatsCards tasks={tasks} />

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <section className="space-y-4">
            <Toolbar ref={searchRef} onAdd={openNew} />

            {!hasAnyTasks ? (
              <EmptyState onAdd={openNew} />
            ) : visible.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
                No tasks match your filters.
              </div>
            ) : (
              <div className="space-y-2.5">
                <AnimatePresence mode="popLayout">
                  {visible.map((t) => (
                    <TaskCard key={t.id} task={t} onEdit={handleEdit} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <MiniCalendar />
            <ShortcutsCard />
          </aside>
        </div>
      </main>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  );
}

function ShortcutsCard() {
  const items: [string, string][] = [
    ["New task", "N"],
    ["Search", "/"],
    ["Save task", "⌘/Ctrl + ↵"],
    ["Close modal", "Esc"],
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <h3 className="text-sm font-semibold">Keyboard shortcuts</h3>
      <ul className="mt-3 space-y-2 text-xs">
        {items.map(([label, k]) => (
          <li key={label} className="flex items-center justify-between">
            <span className="text-muted-foreground">{label}</span>
            <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold">
              {k}
            </kbd>
          </li>
        ))}
      </ul>
    </div>
  );
}
