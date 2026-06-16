import { useState, useEffect } from 'react';
import type { Author, Book, BookInput } from '../api';

interface Props {
  initialData?: Book;
  authors: Author[];
  onSubmit: (data: BookInput) => Promise<void>;
  onCancel: () => void;
}

const s = {
  form: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  } as React.CSSProperties,
  title: {
    margin: '0 0 16px',
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
  } as React.CSSProperties,
  fieldset: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: '1fr 1fr',
    marginBottom: 16,
  } as React.CSSProperties,
  label: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
    fontSize: 13,
    fontWeight: 500,
    color: '#555',
  } as React.CSSProperties,
  input: {
    padding: '8px 10px',
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
  } as React.CSSProperties,
  select: {
    padding: '8px 10px',
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 14,
    background: '#fff',
    outline: 'none',
  } as React.CSSProperties,
  actions: {
    display: 'flex',
    gap: 8,
  } as React.CSSProperties,
  btnPrimary: {
    padding: '8px 20px',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
  } as React.CSSProperties,
  btnSecondary: {
    padding: '8px 20px',
    background: '#e0e0e0',
    color: '#333',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
  } as React.CSSProperties,
  error: {
    color: '#c0392b',
    fontSize: 13,
    marginBottom: 10,
  } as React.CSSProperties,
};

export default function BooksForm({ initialData, authors, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [year, setYear] = useState(initialData?.year?.toString() ?? '');
  const [authorId, setAuthorId] = useState(initialData?.author_id?.toString() ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(initialData?.title ?? '');
    setYear(initialData?.year?.toString() ?? '');
    setAuthorId(initialData?.author_id?.toString() ?? '');
    setError('');
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    const yearNum = year !== '' ? parseInt(year, 10) : undefined;
    if (year !== '' && (isNaN(yearNum!) || yearNum! < 0 || yearNum! > 9999)) {
      setError('Year must be a valid number between 0 and 9999.');
      return;
    }
    const authorIdNum = authorId !== '' ? parseInt(authorId, 10) : undefined;
    setLoading(true);
    setError('');
    try {
      await onSubmit({
        title: title.trim(),
        year: yearNum,
        author_id: authorIdNum,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form style={s.form} onSubmit={handleSubmit} noValidate>
      <p style={s.title}>{initialData ? 'Edit Book' : 'New Book'}</p>
      {error && <p style={s.error}>{error}</p>}
      <div style={s.fieldset}>
        <label style={s.label}>
          Title *
          <input
            style={s.input}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 1984"
            required
          />
        </label>
        <label style={s.label}>
          Year
          <input
            style={s.input}
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 1949"
            min={0}
            max={9999}
          />
        </label>
        <label style={s.label}>
          Author
          <select style={s.select} value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
            <option value="">— none —</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={s.actions}>
        <button style={s.btnPrimary} type="submit" disabled={loading}>
          {loading ? 'Saving…' : initialData ? 'Update' : 'Create'}
        </button>
        <button style={s.btnSecondary} type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
}
