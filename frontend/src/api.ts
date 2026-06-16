const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

export interface Author {
  id: number;
  name: string;
  bio: string | null;
}

export interface Book {
  id: number;
  title: string;
  year: number | null;
  author_id: number | null;
  author_name: string | null;
}

export interface AuthorInput {
  name: string;
  bio?: string;
}

export interface BookInput {
  title: string;
  year?: number;
  author_id?: number;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Authors
export const getAuthors = (): Promise<Author[]> => request<Author[]>('/api/authors');
export const getAuthor = (id: number): Promise<Author> => request<Author>(`/api/authors/${id}`);
export const createAuthor = (data: AuthorInput): Promise<Author> =>
  request<Author>('/api/authors', { method: 'POST', body: JSON.stringify(data) });
export const updateAuthor = (id: number, data: AuthorInput): Promise<Author> =>
  request<Author>(`/api/authors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAuthor = (id: number): Promise<void> =>
  request<void>(`/api/authors/${id}`, { method: 'DELETE' });

// Books
export const getBooks = (): Promise<Book[]> => request<Book[]>('/api/books');
export const getBook = (id: number): Promise<Book> => request<Book>(`/api/books/${id}`);
export const createBook = (data: BookInput): Promise<Book> =>
  request<Book>('/api/books', { method: 'POST', body: JSON.stringify(data) });
export const updateBook = (id: number, data: BookInput): Promise<Book> =>
  request<Book>(`/api/books/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBook = (id: number): Promise<void> =>
  request<void>(`/api/books/${id}`, { method: 'DELETE' });
