import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';

export default function PomodoroPage() {
  const {
    settings,
    setSettings,
    mode,
    setMode,
    running,
    setRunning,
    seconds,
    cycleCount,
    streak,
    level,
    levelProgress,
    focusCompletedToday,
    tasks,
    setTasks,
    toggleTask,
    reminders,
    setReminders,
    resetTimer,
    fmt,
    uid,
  } = useContext(DataContext);

  // UI helpers
  const ModeTab = ({ id, label }) => (
    <button
      onClick={() => {
        setMode(id);
        setRunning(false);
      }}
      className={`px-3 py-1 rounded-full text-sm transition border ${
        mode === id
          ? "bg-terracotta text-white border-terracotta"
          : "bg-champagne text-charcoal-gray border-taupe hover:bg-taupe"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-sand text-charcoal-gray min-h-screen">
        <div className="relative max-w-6xl mx-auto px-4 py-6">
          {/* Header */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Focus Garden</h1>
              <p className="text-sm text-mushroom">Pomodoro × Streaks × Todos × Daily Reminders</p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <div>
                    <div className="text-xs uppercase text-mushroom">Streak</div>
                    <div className="text-lg font-semibold">{streak} day{streak === 1 ? "" : "s"}</div>
                  </div>
                </div>
                <div className="h-10 w-px bg-taupe" />
                <div>
                  <div className="text-xs uppercase text-mushroom">Level {level}</div>
                  <div className="w-40 h-2 bg-taupe rounded-full overflow-hidden">
                    <div className="h-full bg-terracotta" style={{ width: `${levelProgress}%` }} />
                  </div>
                  <div className="text-xs text-mushroom mt-1">{levelProgress}/100 XP</div>
                </div>
              </div>
          </header>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Timer + Stats */}
            <section className="lg:col-span-2 space-y-6">
              {/* Timer Card */}
              <div className="bg-champagne shadow p-6 rounded-2xl border border-taupe">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex gap-2">
                    <ModeTab id="focus" label="Focus" />
                    <ModeTab id="short" label="Short Break" />
                    <ModeTab id="long" label="Long Break" />
                  </div>
                  <Settings settings={settings} setSettings={setSettings} />
                </div>

                <div className="flex flex-col items-center py-6">
                  <div className="text-7xl font-bold tabular-nums tracking-tight leading-none select-none">{fmt(seconds)}</div>
                  <div className="mt-6 flex items-center gap-3">
                    <button onClick={() => setRunning((r) => !r)} className="px-5 py-2 rounded-full font-medium shadow hover:opacity-90 bg-terracotta text-white">
                      {running ? "Pause" : "Start"}
                    </button>
                    <button onClick={resetTimer} className="px-4 py-2 rounded-full border border-taupe bg-champagne hover:bg-taupe">Reset</button>
                  </div>
                  <p className="mt-4 text-xs text-mushroom">Space = Start/Pause · R = Reset</p>
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <Stat label="Focus today" value={`${focusCompletedToday}`} />
                  <Stat label="Cycle count" value={`${cycleCount}`} />
                  <Stat label="Daily goal" value={`${settings.dailyGoal} pom`} />
                </div>
              </div>
            </section>

            {/* Column 2: Todos + Reminders */}
            <section className="space-y-6">
              <TodoCard tasks={tasks} setTasks={setTasks} toggleTask={toggleTask} uid={uid} />
              <RemindersCard reminders={reminders} setReminders={setReminders} uid={uid} />
            </section>
          </div>

          <footer className="mt-10 text-center text-xs text-mushroom">
            Built for you. Your data stays in your browser (localStorage).
          </footer>
        </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-taupe p-3">
      <div className="text-xs uppercase text-mushroom">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function Settings({ settings, setSettings }) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(settings);
  React.useEffect(() => setForm(settings), [settings]);

  const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const saveSettings = () => {
    setSettings({
      focusMins: Math.max(1, Math.round(Number(form.focusMins) || 25)),
      shortBreakMins: Math.max(1, Math.round(Number(form.shortBreakMins) || 5)),
      longBreakMins: Math.max(1, Math.round(Number(form.longBreakMins) || 15)),
      longEvery: Math.max(1, Math.round(Number(form.longEvery) || 4)),
      autoStartNext: !!form.autoStartNext,
      dailyGoal: Math.max(1, Math.round(Number(form.dailyGoal) || 1)),
    });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="text-sm px-3 py-1.5 rounded-full border border-taupe bg-champagne hover:bg-taupe">Settings</button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-champagne border border-taupe rounded-xl shadow-lg p-4 z-10">
          <h3 className="font-semibold mb-3">Timer & Game Settings</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <LabeledNumber label="Focus (min)" value={form.focusMins} onChange={(v) => handle("focusMins", v)} />
            <LabeledNumber label="Short break (min)" value={form.shortBreakMins} onChange={(v) => handle("shortBreakMins", v)} />
            <LabeledNumber label="Long break (min)" value={form.longBreakMins} onChange={(v) => handle("longBreakMins", v)} />
            <LabeledNumber label="Long every (cycles)" value={form.longEvery} onChange={(v) => handle("longEvery", v)} />
            <LabeledNumber label="Daily goal (pom)" value={form.dailyGoal} onChange={(v) => handle("dailyGoal", v)} />
            <div className="col-span-2 flex items-center gap-2 mt-1">
              <input id="auto" type="checkbox" checked={form.autoStartNext} onChange={(e) => handle("autoStartNext", e.target.checked)} />
              <label htmlFor="auto">Auto-start next session</label>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button className="px-3 py-1.5 rounded-full border border-taupe" onClick={() => setOpen(false)}>Cancel</button>
            <button className="px-3 py-1.5 rounded-full bg-terracotta text-white" onClick={saveSettings}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

function LabeledNumber({ label, value, onChange }) {
  return (
    <label className="text-sm flex flex-col gap-1">
      <span className="text-mushroom">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-taupe bg-champagne rounded-lg px-2 py-1"
      />
    </label>
  );
}

function TodoCard({ tasks, setTasks, toggleTask, uid }) {
  const [input, setInput] = React.useState("");

  const add = () => {
    const txt = input.trim();
    if (!txt) return;
    setTasks((ts) => [...ts, { id: uid(), text: txt, done: false }]);
    setInput("");
  };

  const remove = (id) => setTasks((ts) => ts.filter((t) => t.id !== id));
  const clearDone = () => setTasks((ts) => ts.filter((t) => !t.done));

  return (
    <div className="bg-champagne rounded-2xl shadow p-6 border border-taupe">
      <h2 className="text-lg font-semibold mb-3">Today's To‑Do</h2>
      <div className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a task and press Enter"
          className="flex-1 border border-taupe rounded-xl px-3 py-2 bg-sand"
        />
        <button onClick={add} className="px-3 py-2 rounded-xl bg-terracotta text-white">Add</button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-mushroom">No tasks yet. Add your plan for today.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-center gap-3 border border-taupe rounded-xl p-2">
              <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
              <span className={`flex-1 ${t.done ? "line-through text-mushroom" : ""}`}>{t.text}</span>
              <button className="text-xs px-2 py-1 rounded border border-taupe" onClick={() => remove(t.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex justify-between text-sm">
        <div className="text-mushroom">{tasks.filter((t) => t.done).length} done / {tasks.length} total</div>
        <button onClick={clearDone} className="text-charcoal-gray hover:underline">Clear completed</button>
      </div>
      <p className="mt-3 text-xs text-mushroom">Tasks reset each day. Incomplete tasks carry over automatically.</p>
    </div>
  );
}

function RemindersCard({ reminders, setReminders, uid }) {
  const [input, setInput] = React.useState("");
  const add = () => {
    const txt = input.trim();
    if (!txt) return;
    setReminders((rs) => [...rs, { id: uid(), text: txt }]);
    setInput("");
  };
  const remove = (id) => setReminders((rs) => rs.filter((r) => r.id !== id));

  return (
    <div className="bg-champagne rounded-2xl shadow p-6 border border-taupe">
      <h2 className="text-lg font-semibold mb-3">Everyday Reminders</h2>
      <div className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="e.g., Drink water, Quick stretch, Review notes"
          className="flex-1 border border-taupe rounded-xl px-3 py-2 bg-sand"
        />
        <button onClick={add} className="px-3 py-2 rounded-xl bg-terracotta text-white">Add</button>
      </div>

      {reminders.length === 0 ? (
        <p className="text-sm text-mushroom">Set reminders you want to see every day.</p>
      ) : (
        <ul className="space-y-2">
          {reminders.map((r) => (
            <li key={r.id} className="flex items-center gap-3 border border-taupe rounded-xl p-2">
              <span className="flex-1">{r.text}</span>
              <button className="text-xs px-2 py-1 rounded border border-taupe" onClick={() => remove(r.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-mushroom">These appear every day (they don't reset).</p>
    </div>
  );
}
