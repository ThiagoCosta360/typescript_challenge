import { Router, Request, Response } from 'express';
import { query } from '../db';

interface Author {
  id: number;
  name: string;
  bio: string | null;
}

interface AuthorBody {
  name: string;
  bio?: string;
}

const router = Router();

/**
 * @openapi
 * /api/authors:
 *   get:
 *     tags: [Authors]
 *     summary: List all authors
 *     responses:
 *       200:
 *         description: Array of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query<Author>('SELECT * FROM authors ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
});


/**
 * @openapi
 * /api/authors/{id}:
 *   get:
 *     tags: [Authors]
 *     summary: Get one author
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Author found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  try {
    const result = await query<Author>('SELECT * FROM authors WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Author not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch author' });
  }
});

/**
 * @openapi
 * /api/authors:
 *   post:
 *     tags: [Authors]
 *     summary: Create an author
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req: Request<object, object, AuthorBody>, res: Response) => {
  const { name, bio } = req.body;
  if (!name || name.trim() === '') {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  try {
    const result = await query<Author>(
      'INSERT INTO authors (name, bio) VALUES ($1, $2) RETURNING *',
      [name.trim(), bio ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create author' });
  }
});

/**
 * @openapi
 * /api/authors/{id}:
 *   put:
 *     tags: [Authors]
 *     summary: Update an author
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
 *             $ref: '#/components/schemas/AuthorInput'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', async (req: Request<{ id: string }, object, AuthorBody>, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const { name, bio } = req.body;
  if (!name || name.trim() === '') {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  try {
    const result = await query<Author>(
      'UPDATE authors SET name = $1, bio = $2 WHERE id = $3 RETURNING *',
      [name.trim(), bio ?? null, id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Author not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update author' });
  }
});

/**
 * @openapi
 * /api/authors/{id}:
 *   delete:
 *     tags: [Authors]
 *     summary: Delete an author
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
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  try {
    const result = await query('DELETE FROM authors WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Author not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete author' });
  }
});

export default router;
