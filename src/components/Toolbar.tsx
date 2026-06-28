import { useTasks } from "@/context/TaskContext";
import type { FilterKey, SortKey } from "@/types/task";
import { CATEGORIES } from "@/types/task";
import { FiSearch, FiPlus } from "react-icons/fi";
import { forwardRef } from "react";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" },
  { key: "high", label: "High Priority" },
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "priority", label: "Priority" },
  { key: "due", label: "Due Date" },
  { key: "alpha", label: "Alphabetical" },
  { key: "completed", label: "Completed" },
];

export const Toolbar = forwardRef<HTMLInputElement, { onAdd: () => void }>(function Toolbar(
  { onAdd },
  ref,
) {
  const { filter, setFilter, sort, setSort, search, setSearch } = useTasks();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:flex sm:flex-wrap">
        <div className="relative min-w-0 sm:flex-1 sm:min-w-[240px]">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={ref}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm shadow-soft outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
            aria-label="Search tasks"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm shadow-soft outline-none transition-all focus:border-primary"
          aria-label="Sort tasks"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              Sort: {s.label}
            </option>
          ))}
        </select>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-all hover:shadow-glow hover:scale-[1.02]"
        >
          <FiPlus className="h-4 w-4" /> New Task
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <FilterChip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </FilterChip>
        ))}
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            active={filter === `cat:${c}`}
            onClick={() => setFilter(`cat:${c}` as FilterKey)}
          >
            <span className="capitalize">{c}</span>
          </FilterChip>
        ))}
      </div>
    </div>
  );
});

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all " +
        (active
          ? "border-transparent bg-gradient-primary text-primary-foreground shadow-soft"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary")
      }
    >
      {children}
    </button>
  );
}
