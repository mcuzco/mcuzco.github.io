import React, { useContext } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { DataContext } from '../context/DataContext';
import WeeklyStats from '../components/WeeklyStats';
import MonthlyStats from '../components/MonthlyStats';
import YearlyStats from '../components/YearlyStats';

export default function StatsPage() {
  const { streak, history } = useContext(DataContext);

  const pomodorosThisWeek = () => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const isoDate = date.toISOString().slice(0, 10);
      if (history[isoDate] && history[isoDate].focusCompleted) {
        count += history[isoDate].focusCompleted;
      }
    }
    return count;
  };

  const totalCompletedTodos = () => {
    let count = 0;
    for (const date in history) {
      if (history[date] && history[date].completedTasks) {
        count += history[date].completedTasks;
      }
    }
    return count;
  };

  const getCalendarData = () => {
    const values = [];
    for (const date in history) {
      if (history[date] && history[date].focusCompleted) {
        values.push({ date, count: history[date].focusCompleted });
      }
    }
    return values;
  };

  const classForValue = (value) => {
    if (!value) {
      return 'color-empty';
    }
    if (value.count > 4) {
      return 'color-scale-4';
    }
    return `color-scale-${value.count}`;
  };

  return (
    <div className="bg-sand text-charcoal-gray min-h-screen p-6">
      <style>{`
        .react-calendar-heatmap .color-empty {
          fill: #B8AFA0;
        }
        .react-calendar-heatmap .color-scale-1 {
          fill: #A3B18A;
        }
        .react-calendar-heatmap .color-scale-2 {
          fill: #8A9A5B;
        }
        .react-calendar-heatmap .color-scale-3 {
          fill: #E2725B;
        }
        .react-calendar-heatmap .color-scale-4 {
          fill: #36454F;
        }
      `}</style>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Your Stats</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-champagne p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Pomodoros This Week</h2>
            <p className="text-4xl font-bold text-terracotta">{pomodorosThisWeek()}</p>
          </div>
          <div className="bg-champagne p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Current Streak</h2>
            <p className="text-4xl font-bold text-terracotta">{streak} days</p>
          </div>
          <div className="bg-champagne p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Total Completed To-Dos</h2>
            <p className="text-4xl font-bold text-terracotta">{totalCompletedTodos()}</p>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Your Streak Calendar</h2>
          <div className="bg-champagne p-6 rounded-lg shadow-md">
            <CalendarHeatmap
              startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
              endDate={new Date()}
              values={getCalendarData()}
              classForValue={classForValue}
            />
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Historical Stats</h2>
          <div className="bg-champagne p-6 rounded-lg shadow-md space-y-4">
            <WeeklyStats history={history} />
            <MonthlyStats history={history} />
            <YearlyStats history={history} />
          </div>
        </div>
      </div>
    </div>
  );
}
