import { useState, useEffect } from 'react';
import type { Author, AuthorInput } from '../api';

interface Props {
  initialData?: Author;
  onSubmit: (data: AuthorInput) => Promise<void>;
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
  labelFull: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
    fontSize: 13,
    fontWeight: 500,
    color: '#555',
    gridColumn: '1 / -1',
  } as React.CSSProperties,
  input: {
    padding: '8px 10px',
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
  } as React.CSSProperties,
  textarea: {
    padding: '8px 10px',
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 14,
    resize: 'vertical' as const,
    minHeight: 72,
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

export default function AuthorsForm({ initialData, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [bio, setBio] = useState(initialData?.bio ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(initialData?.name ?? '');
    setBio(initialData?.bio ?? '');
    setError('');
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit({ name: name.trim(), bio: bio.trim() || undefined });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form style={s.form} onSubmit={handleSubmit} noValidate>
      <p style={s.title}>{initialData ? 'Edit Author' : 'New Author'}</p>
      {error && <p style={s.error}>{error}</p>}
      <div style={s.fieldset}>
        <label style={s.label}>
          Name *
          <input
            style={s.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. George Orwell"
            required
          />
        </label>
        <label style={s.labelFull}>
          Bio
          <textarea
            style={s.textarea}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short biography…"
          />
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
