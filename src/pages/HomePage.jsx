import React from 'react';
import Timer from '../components/Timer';

const HomePage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Focus Garden!</h1>
      <Timer />
      <p style={styles.description}>Start your pomodoro session and focus.</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--background-dark)', // Use CSS variable
    color: 'var(--text-color-dark)', // Use CSS variable
    fontFamily: 'monospace', // Pixel-art inspired font
    padding: '20px',
  },
  title: {
    color: 'var(--primary-color-dark)', // Use CSS variable
    marginBottom: '20px',
    fontSize: '2.5em',
  },
  description: {
    marginTop: '20px',
    fontSize: '1.2em',
    color: 'var(--secondary-color-dark)', // Use CSS variable
  },
};

export default HomePage;
