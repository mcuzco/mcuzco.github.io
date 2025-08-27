const STATS_KEY = 'pomodoroStats';

export const getStats = () => {
  const stats = localStorage.getItem(STATS_KEY);
  return stats ? JSON.parse(stats) : {};
};

export const addCompletedPomodoro = () => {
  const stats = getStats();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Months are 0-indexed
  const week = getWeekNumber(today); // Helper function needed
  const day = today.toISOString().slice(0, 10); // YYYY-MM-DD

  if (!stats[year]) stats[year] = {};
  if (!stats[year][month]) stats[year][month] = {};
  if (!stats[year][month][week]) stats[year][month][week] = {};
  if (!stats[year][month][week][day]) stats[year][month][week][day] = 0;

  stats[year][month][week][day]++;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

// Helper function to get week number (ISO week date system)
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};
