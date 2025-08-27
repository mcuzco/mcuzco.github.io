import React from 'react';
import { useTheme } from '../services/ThemeContext.jsx';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} style={styles.button}>
      Toggle to {theme === 'dark' ? 'Light' : 'Dark'} Mode
    </button>
  );
};

const styles = {
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
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
  },
};

export default ThemeToggle;
