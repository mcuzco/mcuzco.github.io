import React, { useState, useEffect, useRef } from 'react';
import { addCompletedPomodoro } from '../services/StatsService';

const Timer = () => {
  const workTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60;  // 5 minutes

  const [time, setTime] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false); // For floating view

  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(intervalRef.current);
      // Switch session type
      if (isWorkSession) {
        alert('Work session finished! Time for a break.');
        addCompletedPomodoro(); // Record completed pomodoro
        setTime(breakTime);
      } else {
        alert('Break finished! Time to work.');
        setTime(workTime);
      }
      setIsWorkSession((prev) => !prev);
      setIsActive(false); // Pause after session ends
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, time, isWorkSession]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setIsWorkSession(true);
    setTime(workTime);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div style={isMinimized ? styles.minimizedContainer : styles.container}>
      <h2 style={styles.sessionType}>
        {isWorkSession ? 'Work Session' : 'Break Session'}
      </h2>
      <div style={styles.timeDisplay}>{formatTime(time)}</div>
      <div style={styles.controls}>
        <button onClick={toggleTimer} style={styles.button}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} style={styles.button}>Reset</button>
        <button onClick={toggleMinimize} style={styles.button}>
          {isMinimized ? 'Maximize' : 'Minimize'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px',
    backgroundColor: 'var(--card-background-dark)',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    color: 'var(--text-color-dark)',
    fontFamily: 'monospace',
    width: '400px',
    margin: '20px auto',
  },
  minimizedContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '15px',
    backgroundColor: 'var(--card-background-dark)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    color: 'var(--text-color-dark)',
    fontFamily: 'monospace',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1000,
    width: '150px',
  },
  sessionType: {
    fontSize: '1.5em',
    marginBottom: '15px',
    color: 'var(--primary-color-dark)',
  },
  timeDisplay: {
    fontSize: '4em',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: 'var(--accent-color-dark)',
  },
  controls: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: 'var(--secondary-color-dark)',
    color: 'var(--background-dark)',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
};

export default Timer;
