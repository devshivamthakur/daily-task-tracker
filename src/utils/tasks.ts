import type { Category, FilterKey, Priority, SortKey, Task } from "@/types/task";

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const isOverdue = (t: Task) =>
  !t.completed && !!t.dueDate && t.dueDate < todayISO();

export const isToday = (t: Task) => !!t.dueDate && t.dueDate === todayISO();

export const isThisWeek = (t: Task) => {
  if (!t.dueDate) return false;
  const d = new Date(t.dueDate + "T00:00:00");
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return d >= start && d < end;
};

const priorityWeight: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export const sortTasks = (tasks: Task[], sort: SortKey): Task[] => {
  const arr = [...tasks];
  switch (sort) {
    case "newest":
      return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "oldest":
      return arr.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "priority":
      return arr.sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);
    case "due":
      return arr.sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"));
    case "alpha":
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    case "completed":
      return arr.sort((a, b) => Number(b.completed) - Number(a.completed));
    default:
      return arr.sort((a, b) => a.order - b.order);
  }
};

export const filterTasks = (tasks: Task[], filter: FilterKey, search: string): Task[] => {
  const q = search.trim().toLowerCase();
  return tasks.filter((t) => {
    if (t.archived) return false;
    if (filter === "completed" && !t.completed) return false;
    if (filter === "pending" && t.completed) return false;
    if (filter === "overdue" && !isOverdue(t)) return false;
    if (filter === "high" && t.priority !== "high") return false;
    if (filter === "today" && !isToday(t)) return false;
    if (filter === "week" && !isThisWeek(t)) return false;
    if (filter.startsWith("cat:") && t.category !== (filter.slice(4) as Category)) return false;
    if (q) {
      const hay = `${t.title} ${t.description} ${t.category}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
};

export const computeStreak = (tasks: Task[]): { current: number; longest: number } => {
  const dates = new Set(
    tasks
      .filter((t) => t.completed && t.completedAt)
      .map((t) => t.completedAt!.slice(0, 10)),
  );
  let current = 0;
  const d = new Date();
  while (dates.has(d.toISOString().slice(0, 10))) {
    current++;
    d.setDate(d.getDate() - 1);
  }
  const sorted = [...dates].sort();
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const s of sorted) {
    const cur = new Date(s + "T00:00:00");
    if (prev && (cur.getTime() - prev.getTime()) / 86400000 === 1) run++;
    else run = 1;
    longest = Math.max(longest, run);
    prev = cur;
  }
  return { current, longest };
};

export const motivationalMessage = (pct: number) => {
  if (pct >= 100) return "Excellent! Daily goal achieved. 🎉";
  if (pct >= 71) return "Almost there!";
  if (pct >= 31) return "You're making progress!";
  return "Let's get started!";
};

export const QUOTES = [
  "The secret of getting ahead is getting started.",
  "Small steps every day.",
  "Focus on being productive instead of busy.",
  "Done is better than perfect.",
  "You don't have to be great to start, but you have to start to be great.",
  "Discipline is choosing between what you want now and what you want most.",
];
