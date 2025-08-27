const USERNAME = 'matthews';
const PASSWORD = 'MAtt1233xd';

export const login = (username, password) => {
  if (username === USERNAME && password === PASSWORD) {
    localStorage.setItem('isAuthenticated', 'true');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};
