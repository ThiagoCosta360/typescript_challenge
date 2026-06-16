import { useState, useEffect, useCallback } from 'react';
import {
  getBooks,
  getAuthors,
  createBook,
  updateBook,
  deleteBook,
  type Author,
  type Book,
  type BookInput,
} from '../api';
import BooksForm from './BooksForm';

const s = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  } as React.CSSProperties,
  h2: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: '#1a1a2e',
  } as React.CSSProperties,
  btnNew: {
    padding: '8px 18px',
    background: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
  } as React.CSSProperties,
  tableWrap: {
    overflowX: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    background: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  } as React.CSSProperties,
  th: {
    background: '#1a1a2e',
    color: '#fff',
    padding: '10px 14px',
    textAlign: 'left' as const,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.03em',
  } as React.CSSProperties,
  td: {
    padding: '10px 14px',
    borderBottom: '1px solid #eee',
    fontSize: 14,
    verticalAlign: 'top' as const,
  } as React.CSSProperties,
  tdId: {
    padding: '10px 14px',
    borderBottom: '1px solid #eee',
    fontSize: 14,
    color: '#888',
    width: 50,
  } as React.CSSProperties,
  btnEdit: {
    padding: '4px 12px',
    background: '#2980b9',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
    marginRight: 6,
  } as React.CSSProperties,
  btnDelete: {
    padding: '4px 12px',
    background: '#c0392b',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
  } as React.CSSProperties,
  empty: {
    textAlign: 'center' as const,
    color: '#888',
    padding: 32,
    background: '#fff',
    borderRadius: 8,
  } as React.CSSProperties,
  error: {
    color: '#c0392b',
    marginBottom: 12,
    fontSize: 14,
  } as React.CSSProperties,
};

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Book | undefined>(undefined);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [booksData, authorsData] = await Promise.all([getBooks(), getAuthors()]);
      setBooks(booksData);
      setAuthors(authorsData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleNewClick = () => {
    setEditing(undefined);
    setShowForm(true);
  };

  const handleEditClick = (book: Book) => {
    setEditing(book);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(undefined);
  };

  const handleSubmit = async (data: BookInput) => {
    if (editing) {
      await updateBook(editing.id, data);
    } else {
      await createBook(data);
    }
    setShowForm(false);
    setEditing(undefined);
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await deleteBook(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete book.');
    }
  };

  return (
    <section>
      <div style={s.header}>
        <h2 style={s.h2}>Books</h2>
        {!showForm && (
          <button style={s.btnNew} onClick={handleNewClick}>
            + New Book
          </button>
        )}
      </div>

      {error && <p style={s.error}>{error}</p>}

      {showForm && (
        <BooksForm
          initialData={editing}
          authors={authors}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {books.length === 0 && !showForm ? (
        <div style={s.empty}>No books yet. Create one!</div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>ID</th>
                <th style={s.th}>Title</th>
                <th style={s.th}>Year</th>
                <th style={s.th}>Author</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td style={s.tdId}>{b.id}</td>
                  <td style={s.td}>{b.title}</td>
                  <td style={s.td}>{b.year ?? <em style={{ color: '#aaa' }}>—</em>}</td>
                  <td style={s.td}>
                    {b.author_name ?? <em style={{ color: '#aaa' }}>—</em>}
                  </td>
                  <td style={s.td}>
                    <button style={s.btnEdit} onClick={() => handleEditClick(b)}>
                      Edit
                    </button>
                    <button style={s.btnDelete} onClick={() => void handleDelete(b.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
