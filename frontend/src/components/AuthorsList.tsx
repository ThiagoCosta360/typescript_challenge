import { useState, useEffect, useCallback } from 'react';
import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  type Author,
  type AuthorInput,
} from '../api';
import AuthorsForm from './AuthorsForm';

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
    maxWidth: 320,
    wordBreak: 'break-word' as const,
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

export default function AuthorsList() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Author | undefined>(undefined);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await getAuthors();
      setAuthors(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load authors.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleNewClick = () => {
    setEditing(undefined);
    setShowForm(true);
  };

  const handleEditClick = (author: Author) => {
    setEditing(author);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(undefined);
  };

  const handleSubmit = async (data: AuthorInput) => {
    if (editing) {
      await updateAuthor(editing.id, data);
    } else {
      await createAuthor(data);
    }
    setShowForm(false);
    setEditing(undefined);
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this author? All their books will also be deleted.')) return;
    try {
      await deleteAuthor(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete author.');
    }
  };

  return (
    <section>
      <div style={s.header}>
        <h2 style={s.h2}>Authors</h2>
        {!showForm && (
          <button style={s.btnNew} onClick={handleNewClick}>
            + New Author
          </button>
        )}
      </div>

      {error && <p style={s.error}>{error}</p>}

      {showForm && (
        <AuthorsForm initialData={editing} onSubmit={handleSubmit} onCancel={handleCancel} />
      )}

      {authors.length === 0 && !showForm ? (
        <div style={s.empty}>No authors yet. Create one!</div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>ID</th>
                <th style={s.th}>Name</th>
                <th style={s.th}>Bio</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((a) => (
                <tr key={a.id}>
                  <td style={s.tdId}>{a.id}</td>
                  <td style={s.td}>{a.name}</td>
                  <td style={s.td}>{a.bio ?? <em style={{ color: '#aaa' }}>—</em>}</td>
                  <td style={s.td}>
                    <button style={s.btnEdit} onClick={() => handleEditClick(a)}>
                      Edit
                    </button>
                    <button style={s.btnDelete} onClick={() => void handleDelete(a.id)}>
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
