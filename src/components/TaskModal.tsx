import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiX, FiRepeat } from "react-icons/fi";
import { CATEGORIES, PRIORITIES, type Category, type Priority, type Task } from "@/types/task";
import { useTasks } from "@/context/TaskContext";

interface Props {
  open: boolean;
  onClose: () => void;
  editing: Task | null;
}

export function TaskModal({ open, onClose, editing }: Props) {
  const { addTask, updateTask, selectedDate } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("personal");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState<string>("");
  const [daily, setDaily] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(editing?.title ?? "");
      setDescription(editing?.description ?? "");
      setCategory(editing?.category ?? "personal");
      setPriority(editing?.priority ?? "medium");
      setDueDate(editing?.dueDate ?? selectedDate);
      setDaily(editing?.daily ?? false);
    }
  }, [open, editing, selectedDate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, title, description, category, priority, dueDate, daily]);

  const submit = () => {
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      daily,
      dueDate: daily ? null : dueDate || null,
    };
    if (editing) updateTask(editing.id, payload);
    else addTask(payload);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-elegant"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-lg font-bold tracking-tight">
                {editing ? "Edit task" : "New task"}
              </h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <form
              className="space-y-4 px-5 py-5"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <Field label="Title">
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Optional details..."
                  className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Category">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm capitalize outline-none focus:border-primary"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Priority">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm capitalize outline-none focus:border-primary"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p} className="capitalize">
                        {p}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Due date">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </Field>
              </div>

              {/* Daily toggle */}
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 transition hover:bg-muted/50">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={daily}
                    onChange={(e) => {
                      setDaily(e.target.checked);
                      if (e.target.checked) setDueDate("");
                    }}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full border border-border bg-muted transition-all peer-checked:border-transparent peer-checked:bg-gradient-primary" />
                  <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-soft transition-all peer-checked:translate-x-4" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FiRepeat className="h-4 w-4 text-primary" />
                  <span className="font-medium">Repeat daily</span>
                  <span className="text-xs text-muted-foreground">
                    — shows up every day, tracks completion per day
                  </span>
                </div>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:shadow-glow"
                >
                  {editing ? "Save changes" : "Create task"}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Tip: Ctrl/Cmd + Enter to save, Esc to close
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
