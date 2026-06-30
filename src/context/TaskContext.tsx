import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { FilterKey, SortKey, Task } from "@/types/task";
import { todayISO, uid } from "@/utils/tasks";
import { toast } from "sonner";

interface TaskContextValue {
  tasks: Task[];
  filter: FilterKey;
  sort: SortKey;
  search: string;
  theme: "light" | "dark";
  selectedDate: string;
  setFilter: (f: FilterKey) => void;
  setSort: (s: SortKey) => void;
  setSearch: (s: string) => void;
  setSelectedDate: (d: string) => void;
  toggleTheme: () => void;
  addTask: (
    t: Omit<
      Task,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "completed"
      | "completedAt"
      | "archived"
      | "order"
      | "completedDates"
    >,
  ) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  duplicateTask: (id: string) => void;
  archiveTask: (id: string) => void;
  reorderTasks: (fromId: string, toId: string) => void;
}

const Ctx = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>("dtt.tasks", []);
  const [filter, setFilter] = useLocalStorage<FilterKey>("dtt.filter", "today");
  const [sort, setSort] = useLocalStorage<SortKey>("dtt.sort", "newest");
  const [search, setSearch] = useLocalStorage<string>("dtt.search", "");
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("dtt.theme", "light");
  const [selectedDate, setSelectedDate] = useLocalStorage<string>("dtt.selectedDate", todayISO());

  // Reset selectedDate to today if it's a past date (e.g. when opening app on a new day)
  useEffect(() => {
    const today = todayISO();
    if (selectedDate < today) {
      setSelectedDate(today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const addTask: TaskContextValue["addTask"] = useCallback(
    (t) => {
      const now = new Date().toISOString();
      const next: Task = {
        ...t,
        daily: t.daily ?? false,
        completedDates: {},
        id: uid(),
        completed: false,
        completedAt: null,
        archived: false,
        createdAt: now,
        updatedAt: now,
        order: Date.now(),
      };
      setTasks((p) => [next, ...p]);
      toast.success("Task created");
    },
    [setTasks],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((p) =>
        p.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t)),
      );
      toast.success("Task updated");
    },
    [setTasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((p) => p.filter((t) => t.id !== id));
      toast.success("Task deleted");
    },
    [setTasks],
  );

  const toggleComplete = useCallback(
    (id: string) => {
      setTasks((p) =>
        p.map((t) => {
          if (t.id !== id) return t;
          if (t.daily) {
            const date = selectedDate || todayISO();
            const completedDates = { ...t.completedDates };
            if (completedDates[date]) {
              delete completedDates[date];
              toast("Daily task unmarked");
            } else {
              completedDates[date] = new Date().toISOString();
              toast.success("Daily task done! ✅");
            }
            return { ...t, completedDates, updatedAt: new Date().toISOString() };
          }
          const completed = !t.completed;
          if (completed) toast.success("Task completed");
          else toast("Task restored");
          return {
            ...t,
            completed,
            completedAt: completed ? new Date().toISOString() : null,
            updatedAt: new Date().toISOString(),
          };
        }),
      );
    },
    [setTasks, selectedDate],
  );

  const duplicateTask = useCallback(
    (id: string) => {
      setTasks((p) => {
        const orig = p.find((t) => t.id === id);
        if (!orig) return p;
        const now = new Date().toISOString();
        const copy: Task = {
          ...orig,
          id: uid(),
          title: orig.title + " (copy)",
          completed: false,
          completedAt: null,
          createdAt: now,
          updatedAt: now,
          order: Date.now(),
        };
        return [copy, ...p];
      });
      toast.success("Task duplicated");
    },
    [setTasks],
  );

  const archiveTask = useCallback(
    (id: string) => {
      setTasks((p) => p.map((t) => (t.id === id ? { ...t, archived: true } : t)));
      toast("Task archived");
    },
    [setTasks],
  );

  const reorderTasks = useCallback(
    (fromId: string, toId: string) => {
      if (fromId === toId) return;
      setTasks((p) => {
        const arr = [...p];
        const fromIdx = arr.findIndex((t) => t.id === fromId);
        const toIdx = arr.findIndex((t) => t.id === toId);
        if (fromIdx < 0 || toIdx < 0) return p;
        const [m] = arr.splice(fromIdx, 1);
        arr.splice(toIdx, 0, m);
        return arr.map((t, i) => ({ ...t, order: i }));
      });
    },
    [setTasks],
  );

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      toast(`Theme: ${next}`);
      return next;
    });
  }, [setTheme]);

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      filter,
      sort,
      search,
      theme,
      selectedDate,
      setFilter,
      setSort,
      setSearch,
      setSelectedDate,
      toggleTheme,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      duplicateTask,
      archiveTask,
      reorderTasks,
    }),
    [
      tasks,
      filter,
      sort,
      search,
      theme,
      selectedDate,
      setFilter,
      setSort,
      setSearch,
      setSelectedDate,
      toggleTheme,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      duplicateTask,
      archiveTask,
      reorderTasks,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTasks() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTasks must be used within TaskProvider");
  return v;
}
