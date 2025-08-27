import React, { useState, useEffect } from 'react';
import { getNotes, saveNote, deleteNote } from '../services/NotesService';

const NotesEditor = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [noteContent, setNoteContent] = useState('');
  const [allNotes, setAllNotes] = useState({});

  useEffect(() => {
    const notes = getNotes();
    setAllNotes(notes);
    setNoteContent(notes[selectedDate] || '');
  }, [selectedDate]);

  const handleSave = () => {
    saveNote(selectedDate, noteContent);
    setAllNotes(getNotes()); // Refresh all notes after saving
    alert('Note saved!');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(selectedDate);
      setAllNotes(getNotes()); // Refresh all notes after deleting
      setNoteContent(''); // Clear content for the deleted date
      alert('Note deleted!');
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Notes for {selectedDate}</h2>
      <div style={styles.datePickerContainer}>
        <label htmlFor="noteDate" style={styles.label}>Select Date:</label>
        <input
          type="date"
          id="noteDate"
          value={selectedDate}
          onChange={handleDateChange}
          style={styles.dateInput}
        />
      </div>
      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Write your notes here..."
        style={styles.textarea}
      />
      <div style={styles.buttonGroup}>
        <button onClick={handleSave} style={styles.button}>Save Note</button>
        <button onClick={handleDelete} style={styles.deleteButton}>Delete Note</button>
      </div>

      <h3 style={styles.pastNotesTitle}>Past Notes</h3>
      <div style={styles.pastNotesList}>
        {Object.keys(allNotes).length === 0 ? (
          <p>No past notes available.</p>
        ) : (
          Object.keys(allNotes).sort((a, b) => b.localeCompare(a)).map((date) => (
            <div key={date} style={styles.pastNoteItem}>
              <span style={styles.pastNoteDate} onClick={() => setSelectedDate(date)}>{date}:</span>
              <span style={styles.pastNoteContent}>{allNotes[date].substring(0, 50)}...</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px',
    backgroundColor: 'var(--card-background-dark)',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    color: 'var(--text-color-dark)',
    fontFamily: 'monospace',
    width: '100%',
    maxWidth: '700px',
    margin: '20px auto',
  },
  title: {
    color: 'var(--primary-color-dark)',
    marginBottom: '20px',
    fontSize: '1.8em',
  },
  datePickerContainer: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  label: {
    color: 'var(--secondary-color-dark)',
  },
  dateInput: {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid var(--secondary-color-dark)',
    backgroundColor: 'var(--background-dark)',
    color: 'var(--text-color-dark)',
    fontFamily: 'monospace',
  },
  textarea: {
    width: '90%',
    height: '200px',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid var(--secondary-color-dark)',
    backgroundColor: 'var(--background-dark)',
    color: 'var(--text-color-dark)',
    fontFamily: 'monospace',
    fontSize: '1em',
    resize: 'vertical',
    marginBottom: '20px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: 'var(--accent-color-dark)',
    color: 'var(--background-dark)',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  deleteButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#e06c75',
    color: 'var(--background-dark)',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  pastNotesTitle: {
    color: 'var(--primary-color-dark)',
    marginBottom: '15px',
    fontSize: '1.5em',
  },
  pastNotesList: {
    width: '90%',
    maxHeight: '250px',
    overflowY: 'auto',
    border: '1px solid var(--secondary-color-dark)',
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: 'var(--background-dark)',
  },
  pastNoteItem: {
    padding: '8px 0',
    borderBottom: '1px dashed var(--secondary-color-dark)',
    display: 'flex',
    gap: '10px',
    alignItems: 'baseline',
  },
  pastNoteDate: {
    color: 'var(--accent-color-dark)',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  pastNoteContent: {
    color: 'var(--text-color-dark)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
};

export default NotesEditor;
