import React, { useState } from 'react';
import StatsChart from '../components/StatsChart';

const StatsPage = () => {
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Pomodoro Stats</h1>
      <div style={styles.buttonGroup}>
        <button
          onClick={() => setTimeRange('week')}
          style={timeRange === 'week' ? styles.activeButton : styles.button}
        >
          Weekly
        </button>
        <button
          onClick={() => setTimeRange('month')}
          style={timeRange === 'month' ? styles.activeButton : styles.button}
        >
          Monthly
        </button>
        <button
          onClick={() => setTimeRange('year')}
          style={timeRange === 'year' ? styles.activeButton : styles.button}
        >
          Yearly
        </button>
      </div>
      <StatsChart timeRange={timeRange} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 'calc(100vh - 80px)', // Adjust for navbar height
    backgroundColor: 'var(--background-dark)',
    color: 'var(--text-color-dark)',
    fontFamily: 'monospace',
    padding: '20px',
  },
  title: {
    color: 'var(--primary-color-dark)',
    marginBottom: '20px',
    fontSize: '2.5em',
  },
  buttonGroup: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: '2px solid var(--secondary-color-dark)',
    backgroundColor: 'var(--card-background-dark)',
    color: 'var(--text-color-dark)',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
  activeButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: '2px solid var(--primary-color-dark)',
    backgroundColor: 'var(--primary-color-dark)',
    color: 'var(--background-dark)',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
};

export default StatsPage;
