import { motion } from "framer-motion";
import { useState, useRef } from "react";
import type { Task } from "@/types/task";
import { useTasks } from "@/context/TaskContext";
import { isOverdue, isTaskCompletedForDate } from "@/utils/tasks";
import {
  FiCheck,
  FiMoreVertical,
  FiEdit2,
  FiCopy,
  FiArchive,
  FiTrash2,
  FiCalendar,
  FiRepeat,
} from "react-icons/fi";

const priorityStyle: Record<Task["priority"], string> = {
  high: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  low: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
};

const categoryStyle: Record<Task["category"], string> = {
  personal: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  work: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  study: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  fitness: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  shopping: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  other: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

export function TaskCard({ task, onEdit }: { task: Task; onEdit: (t: Task) => void }) {
  const { toggleComplete, duplicateTask, archiveTask, deleteTask, reorderTasks, selectedDate } =
    useTasks();
  const [menuOpen, setMenuOpen] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const overdue = !task.daily && isOverdue(task);
  const isComplete = isTaskCompletedForDate(task, selectedDate);

  return (
    <motion.div
      ref={dragRef}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
      whileHover={{ y: -2 }}
      draggable
      onDragStart={(e) => {
        (e as unknown as DragEvent).dataTransfer?.setData("text/plain", task.id);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const id = (e as unknown as DragEvent).dataTransfer?.getData("text/plain");
        if (id) reorderTasks(id, task.id);
      }}
      className={
        "group relative rounded-2xl border bg-card p-4 shadow-soft transition-shadow hover:shadow-elegant " +
        (isComplete ? "opacity-70" : "") +
        (overdue ? " border-rose-500/40" : " border-border")
      }
    >
      <div className="flex items-start gap-3">
        <button
          aria-label={isComplete ? "Mark incomplete" : "Mark complete"}
          onClick={() => toggleComplete(task.id)}
          className={
            "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all " +
            (isComplete
              ? "border-transparent bg-gradient-primary text-primary-foreground shadow-soft"
              : "border-border hover:border-primary")
          }
        >
          {isComplete && <FiCheck className="h-3.5 w-3.5" strokeWidth={3} />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {task.daily && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <FiRepeat className="h-3 w-3" /> Daily
              </span>
            )}
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityStyle[task.priority]}`}
            >
              {task.priority}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider capitalize ${categoryStyle[task.category]}`}
            >
              {task.category}
            </span>
            {overdue && (
              <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Overdue
              </span>
            )}
          </div>
          <h3
            className={
              "mt-1.5 truncate text-sm font-semibold sm:text-base " +
              (isComplete ? "line-through text-muted-foreground" : "")
            }
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            {task.dueDate && !task.daily && (
              <span className="inline-flex items-center gap-1">
                <FiCalendar className="h-3 w-3" />
                Due {task.dueDate}
              </span>
            )}
            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            aria-label="Task actions"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <FiMoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-xl border border-border bg-popover shadow-elegant"
              >
                <MenuItem
                  icon={<FiEdit2 />}
                  label="Edit"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(task);
                  }}
                />
                <MenuItem
                  icon={<FiCopy />}
                  label="Duplicate"
                  onClick={() => {
                    setMenuOpen(false);
                    duplicateTask(task.id);
                  }}
                />
                <MenuItem
                  icon={<FiArchive />}
                  label="Archive"
                  onClick={() => {
                    setMenuOpen(false);
                    archiveTask(task.id);
                  }}
                />
                <MenuItem
                  icon={<FiTrash2 />}
                  label="Delete"
                  danger
                  onClick={() => {
                    setMenuOpen(false);
                    deleteTask(task.id);
                  }}
                />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted " +
        (danger ? "text-destructive" : "")
      }
    >
      <span className="opacity-70">{icon}</span>
      {label}
    </button>
  );
}
