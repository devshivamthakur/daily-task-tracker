import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTasks } from "@/context/TaskContext";

export function MiniCalendar() {
  const { tasks, setFilter, setSearch } = useTasks();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const datesWithTasks = useMemo(() => {
    const s = new Set<string>();
    tasks.forEach((t) => {
      if (!t.archived && t.dueDate) s.add(t.dueDate);
    });
    return s;
  }, [tasks]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().slice(0, 10);

  const cells: (number | null)[] = Array(first).fill(null).concat(
    Array.from({ length: days }, (_, i) => i + 1),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-4 shadow-soft"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </h3>
        <div className="flex gap-1">
          <button
            aria-label="Previous month"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="rounded-md p-1 hover:bg-muted"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next month"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="rounded-md p-1 hover:bg-muted"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const has = datesWithTasks.has(iso);
          const isToday = iso === todayStr;
          return (
            <button
              key={i}
              onClick={() => {
                setFilter("all");
                setSearch(iso);
              }}
              className={
                "relative aspect-square rounded-lg text-xs font-medium transition-all hover:bg-accent " +
                (isToday ? "bg-gradient-primary text-primary-foreground shadow-soft " : "")
              }
            >
              {d}
              {has && !isToday && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
