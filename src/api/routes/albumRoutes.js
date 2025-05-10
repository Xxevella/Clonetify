import { Router } from 'express';
import albumController from '../../controllers/albumController.js';


const router = Router();
router.use((req, res, next) => {
    console.log(`[AlbumRouter] ${req.method} ${req.originalUrl}`);
    next();
});
router.get('/albums', albumController.getAll);
router.get('/albums/:id', albumController.getOne);

router.post('/albums', albumController.create.bind(albumController));
router.put('/albums/:id', albumController.update.bind(albumController));
router.delete('/albums/:id', albumController.delete);
router.get('/:id/tracks', albumController.getTracksByAlbumId.bind(albumController));

router.post('/artist', albumController.addArtist);
router.delete('/artist',  albumController.removeArtist);

router.post('/genre', albumController.addGenre);
router.delete('/genre', albumController.removeGenre);

export default router;