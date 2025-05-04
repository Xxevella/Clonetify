import { Router } from 'express';
import GenreController from '../../controllers/genreController.js';

const router = Router();

router.get('/genres', GenreController.getAll);

// Get a genre by ID
router.get('/genres/:id', GenreController.getById);

// Create a new genre
router.post('/genres', GenreController.create);

// Update a genre by ID
router.put('/genres/:id', GenreController.update);

// Delete a genre by ID
router.delete('/genres/:id', GenreController.delete);

export default router;