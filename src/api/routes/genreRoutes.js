import { Router } from 'express';
import GenreController from '../../controllers/genreController.js';

const router = Router();

router.get('/genres', GenreController.getAll);

router.get('/genres/:id', GenreController.getById);

router.post('/genres', GenreController.create);

router.put('/genres/:id', GenreController.update);

router.delete('/genres/:id', GenreController.delete);

export default router;