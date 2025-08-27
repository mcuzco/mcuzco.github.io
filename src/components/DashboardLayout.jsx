import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/stats" style={styles.navLink}>Stats</Link>
        <Link to="/notes" style={styles.navLink}>Notes</Link>
        {/* Add logout button here later */}
      </nav>
      <div style={styles.content}>
        <Outlet /> {/* This is where nested routes will render */}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--background-dark)',
    color: 'var(--text-color-dark)',
    fontFamily: 'monospace',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    padding: '15px 0',
    backgroundColor: 'var(--card-background-dark)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  navLink: {
    color: 'var(--primary-color-dark)',
    textDecoration: 'none',
    margin: '0 15px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    transition: 'color 0.2s',
  },
  content: {
    flexGrow: 1,
    padding: '20px',
  },
};

export default DashboardLayout;
