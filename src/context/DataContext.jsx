import React, { createContext, useState, useEffect, useRef } from 'react';

// === Utility helpers ===
const KEY = {
  SETTINGS: "focus_app_settings_v1",
  STATE: "focus_app_state_v1",
  TASKS_TODAY: "focus_app_tasks_today_v1",
  REMINDERS: "focus_app_reminders_v1",
  HISTORY: "focus_app_history_v1",
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const yesterdayISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
const fmt = (secs) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${pad(m)}:${pad(s)}`;
};

const uid = () => Math.random().toString(36).slice(2, 9);

// Beep without external files
const beep = (duration = 180, frequency = 880) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.value = frequency;
    o.start();
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, duration + 20);
  } catch {}
};

// === Default settings ===
const defaultSettings = {
  focusMins: 25,
  shortBreakMins: 5,
  longBreakMins: 15,
  longEvery: 4, // long break every N focus sessions
  autoStartNext: true,
  dailyGoal: 1, // pomodoros to consider the day "complete" for streaks
};

const load = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const save = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // === Settings ===
  const [settings, setSettings] = useState(() => load(KEY.SETTINGS, defaultSettings));

  // === Timer state ===
  const [mode, setMode] = useState("focus"); // 'focus' | 'short' | 'long'
  const [running, setRunning] = useState(false);
  const initialSecs = () =>
    (mode === "focus"
      ? settings.focusMins
      : mode === "short"
      ? settings.shortBreakMins
      : settings.longBreakMins) * 60;
  const [seconds, setSeconds] = useState(initialSecs);
  const [cycleCount, setCycleCount] = useState(0); // completed focus in the current cycle

  // === Progress / gamification ===
  const [xp, setXp] = useState(() => load(KEY.STATE, { xp: 0, streak: 0, lastCompletedDate: null }).xp);
  const [streak, setStreak] = useState(() => load(KEY.STATE, { xp: 0, streak: 0, lastCompletedDate: null }).streak);
  const [lastCompletedDate, setLastCompletedDate] = useState(() => load(KEY.STATE, { xp: 0, streak: 0, lastCompletedDate: null }).lastCompletedDate);

  const level = 1 + Math.floor(xp / 100);
  const levelProgress = xp % 100; // 0..99

  // === History per day ===
  const [history, setHistory] = useState(() => load(KEY.HISTORY, {})); // { YYYY-MM-DD: { focusCompleted: number, completedTasks: number } }

  const focusCompletedToday = history[todayISO()]?.focusCompleted || 0;

  // === Tasks (today-only) ===
  const [tasks, setTasks] = useState(() => {
    const saved = load(KEY.TASKS_TODAY, { date: todayISO(), items: [] });
    if (saved.date !== todayISO()) {
      // new day — keep only unfinished tasks
      const carry = saved.items?.filter((t) => !t.done) || [];
      const fresh = { date: todayISO(), items: carry };
      save(KEY.TASKS_TODAY, fresh);
      return carry;
    }
    return saved.items || [];
  });

  // === Everyday reminders ===
  const [reminders, setReminders] = useState(() => load(KEY.REMINDERS, []));

  // Persist various pieces
  useEffect(() => save(KEY.SETTINGS, settings), [settings]);
  useEffect(() => save(KEY.TASKS_TODAY, { date: todayISO(), items: tasks }), [tasks]);
  useEffect(() => save(KEY.REMINDERS, reminders), [reminders]);
  useEffect(() => save(KEY.HISTORY, history), [history]);
  useEffect(() => save(KEY.STATE, { xp, streak, lastCompletedDate }), [xp, streak, lastCompletedDate]);

  // Reinitialize seconds when mode/settings change (but keep running state untouched)
  useEffect(() => {
    setSeconds(initialSecs());
  }, [mode, settings.focusMins, settings.shortBreakMins, settings.longBreakMins]);

  // Request notifications silently
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission?.();
    }
  }, []);

  // Tick
  const tickRef = useRef(null);
  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          // session complete
          clearInterval(tickRef.current);
          handleSessionComplete();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const handleSessionComplete = () => {
    beep(220, mode === "focus" ? 880 : 660);
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(
          mode === "focus" ? "Focus complete!" : "Break complete!",
          { body: mode === "focus" ? "Nice work. Time for a break." : "Ready to focus again?" }
        );
      } catch {}
    }

    if (mode === "focus") {
      // award XP and update history
      setXp((x) => x + 10);
      setHistory((h) => {
        const d = todayISO();
        const prev = h[d]?.focusCompleted || 0;
        return { ...h, [d]: { ...h[d], focusCompleted: prev + 1 } };
      });
      setCycleCount((c) => c + 1);

      // update streak if daily goal reached now
      const after = (history[todayISO()]?.focusCompleted || 0) + 1; // we haven't committed setHistory yet, so +1
      if (after >= settings.dailyGoal) {
        const t = todayISO();
        const y = yesterdayISO();
        setStreak((s) => (lastCompletedDate === t ? s : lastCompletedDate === y ? s + 1 : 1));
        setLastCompletedDate(t);
      }

      // auto-switch to break
      const nextMode = (settings.longEvery && (cycleCount + 1) % settings.longEvery === 0) ? "long" : "short";
      setMode(nextMode);
      setSeconds(
        (nextMode === "short" ? settings.shortBreakMins : settings.longBreakMins) * 60
      );
      setRunning(settings.autoStartNext);
    } else {
      // from break to focus
      setMode("focus");
      setSeconds(settings.focusMins * 60);
      setRunning(settings.autoStartNext);
    }
  };

  const resetTimer = () => {
    setRunning(false);
    setSeconds(initialSecs());
  };

  const toggleTask = (id) => {
    let wasCompleted;
    const newTasks = tasks.map((t) => {
      if (t.id === id) {
        wasCompleted = t.done;
        return { ...t, done: !t.done };
      }
      return t;
    });
    setTasks(newTasks);

    setHistory((h) => {
        const d = todayISO();
        const prevCompleted = h[d]?.completedTasks || 0;
        const newCompleted = wasCompleted ? prevCompleted -1 : prevCompleted + 1;
        return { ...h, [d]: { ...h[d], completedTasks: newCompleted >= 0 ? newCompleted : 0 } };
    });
  };

  const value = {
    settings,
    setSettings,
    mode,
    setMode,
    running,
    setRunning,
    seconds,
    cycleCount,
    xp,
    streak,
    lastCompletedDate,
    level,
    levelProgress,
    history,
    focusCompletedToday,
    tasks,
    setTasks,
    toggleTask,
    reminders,
    setReminders,
    resetTimer,
    fmt,
    uid,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
