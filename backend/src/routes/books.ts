import { Router, Request, Response } from 'express';
import { query } from '../db';

interface Book {
  id: number;
  title: string;
  year: number | null;
  author_id: number | null;
  author_name?: string;
}

interface BookBody {
  title: string;
  year?: number;
  author_id?: number;
}

const router = Router();

/**
 * @openapi
 * /api/books:
 *   get:
 *     tags: [Books]
 *     summary: List all books
 *     responses:
 *       200:
 *         description: Array of books with author name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

/**
 * @openapi
 * /api/books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get one book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/books:
 *   post:
 *     tags: [Books]
 *     summary: Create a book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/books/{id}:
 *   put:
 *     tags: [Books]
 *     summary: Update a book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete a book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const SELECT_WITH_AUTHOR = `
  SELECT b.id, b.title, b.year, b.author_id, a.name AS author_name
  FROM books b
  LEFT JOIN authors a ON a.id = b.author_id
`;

// GET /api/books — list all with author name
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query<Book>(`${SELECT_WITH_AUTHOR} ORDER BY b.id`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET /api/books/:id — get one with author name
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  try {
    const result = await query<Book>(`${SELECT_WITH_AUTHOR} WHERE b.id = $1`, [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// POST /api/books — create
router.post('/', async (req: Request<object, object, BookBody>, res: Response) => {
  const { title, year, author_id } = req.body;
  if (!title || title.trim() === '') {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  try {
    const inserted = await query<{ id: number }>(
      'INSERT INTO books (title, year, author_id) VALUES ($1, $2, $3) RETURNING id',
      [title.trim(), year ?? null, author_id ?? null]
    );
    const result = await query<Book>(`${SELECT_WITH_AUTHOR} WHERE b.id = $1`, [
      inserted.rows[0].id,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// PUT /api/books/:id — update
router.put('/:id', async (req: Request<{ id: string }, object, BookBody>, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const { title, year, author_id } = req.body;
  if (!title || title.trim() === '') {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  try {
    const updated = await query<{ id: number }>(
      'UPDATE books SET title = $1, year = $2, author_id = $3 WHERE id = $4 RETURNING id',
      [title.trim(), year ?? null, author_id ?? null, id]
    );
    if (updated.rowCount === 0) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    const result = await query<Book>(`${SELECT_WITH_AUTHOR} WHERE b.id = $1`, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// DELETE /api/books/:id — delete
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  try {
    const result = await query('DELETE FROM books WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

export default router;
