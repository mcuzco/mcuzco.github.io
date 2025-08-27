const NOTES_KEY = 'dailyNotes';

export const getNotes = () => {
  const notes = localStorage.getItem(NOTES_KEY);
  return notes ? JSON.parse(notes) : {};
};

export const saveNote = (date, content) => {
  const notes = getNotes();
  notes[date] = content;
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

export const deleteNote = (date) => {
  const notes = getNotes();
  delete notes[date];
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};
