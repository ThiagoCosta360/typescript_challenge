import { useState } from 'react';
import AuthorsList from './components/AuthorsList';
import BooksList from './components/BooksList';

type Tab = 'authors' | 'books';

const styles = {
  container: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '24px 16px',
  } as React.CSSProperties,
  header: {
    marginBottom: 24,
    borderBottom: '2px solid #ddd',
    paddingBottom: 16,
  } as React.CSSProperties,
  h1: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: '#1a1a2e',
  } as React.CSSProperties,
  tabBar: {
    display: 'flex',
    gap: 4,
    marginBottom: 24,
  } as React.CSSProperties,
  tab: (active: boolean): React.CSSProperties => ({
    padding: '8px 24px',
    border: 'none',
    borderRadius: '6px 6px 0 0',
    cursor: 'pointer',
    fontWeight: active ? 700 : 400,
    fontSize: 15,
    background: active ? '#1a1a2e' : '#e0e0e0',
    color: active ? '#fff' : '#555',
    borderBottom: active ? '2px solid #1a1a2e' : '2px solid transparent',
    transition: 'all 0.15s',
  }),
};

export default function App() {
  const [tab, setTab] = useState<Tab>('authors');

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.h1}>Books &amp; Authors</h1>
      </header>

      <nav style={styles.tabBar}>
        <button style={styles.tab(tab === 'authors')} onClick={() => setTab('authors')}>
          Authors
        </button>
        <button style={styles.tab(tab === 'books')} onClick={() => setTab('books')}>
          Books
        </button>
      </nav>

      {tab === 'authors' && <AuthorsList />}
      {tab === 'books' && <BooksList />}
    </div>
  );
}
