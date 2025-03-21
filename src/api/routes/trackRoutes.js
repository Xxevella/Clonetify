// routes/trackRoutes.js
import { Router } from 'express';
import trackController from '../../controllers/tracksController.js';

const router = Router();

router.post('/tracks', trackController.create.bind(trackController));
router.get('/tracks', trackController.getAll.bind(trackController));
router.get('/tracks/:id', trackController.getOne.bind(trackController));
router.put('/tracks/:id', trackController.update.bind(trackController));
router.delete('/:id',  trackController.delete.bind(trackController));

router.post('/playlist', trackController.addToPlaylist);
router.delete('/playlist', trackController.removeFromPlaylist);

router.post('/favorites', trackController.addToFavorites);
router.delete('/favorites', trackController.removeFromFavorites);

export default router;