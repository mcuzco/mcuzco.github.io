import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getStats } from '../services/StatsService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatsChart = ({ timeRange }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const stats = getStats();
    let labels = [];
    let data = [];

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    if (timeRange === 'week') {
      // Get data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const day = d.toISOString().slice(0, 10);
        labels.push(d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }));
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const week = getWeekNumber(d);
        data.push(stats[year]?.[month]?.[week]?.[day] || 0);
      }
    } else if (timeRange === 'month') {
      // Get data for the last 30 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const day = d.toISOString().slice(0, 10);
        labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const week = getWeekNumber(d);
        data.push(stats[year]?.[month]?.[week]?.[day] || 0);
      }
    } else if (timeRange === 'year') {
      // Get data for the last 12 months
      for (let i = 11; i >= 0; i--) {
        const d = new Date(currentYear, currentMonth - 1 - i, 1);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        labels.push(d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        
        let monthlyTotal = 0;
        if (stats[year] && stats[year][month]) {
          for (const weekKey in stats[year][month]) {
            for (const dayKey in stats[year][month][weekKey]) {
              monthlyTotal += stats[year][month][weekKey][dayKey];
            }
          }
        }
        data.push(monthlyTotal);
      }
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Completed Pomodoros',
          data,
          backgroundColor: 'rgba(152, 195, 121, 0.6)', // Accent color
          borderColor: 'rgba(152, 195, 121, 1)',
          borderWidth: 1,
        },
      ],
    });
  }, [timeRange]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--text-color-dark)',
          font: {
            family: 'Press Start 2P',
          },
        },
      },
      title: {
        display: true,
        text: `Pomodoros by ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`,
        color: 'var(--primary-color-dark)',
        font: {
          family: 'Press Start 2P',
          size: 18,
        },
      },
      tooltip: {
        titleFont: {
          family: 'Press Start 2P',
        },
        bodyFont: {
          family: 'Press Start 2P',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'var(--text-color-dark)',
          font: {
            family: 'Press Start 2P',
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'var(--text-color-dark)',
          font: {
            family: 'Press Start 2P',
          },
          stepSize: 1, // Ensure integer ticks for counts
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  // Helper function to get week number (copied from StatsService for local use)
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '20px auto', backgroundColor: 'var(--card-background-dark)', padding: '20px', borderRadius: '10px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default StatsChart;
