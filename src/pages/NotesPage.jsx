import React from 'react';
import NotesEditor from '../components/NotesEditor';

const NotesPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Daily Notes</h1>
      <NotesEditor />
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
};

export default NotesPage;
