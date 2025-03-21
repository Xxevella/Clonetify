import { Router } from 'express';
import albumController from '../../controllers/albumController.js';


const router = Router();

router.get('/albums', albumController.getAll);
router.get('/albums/:id', albumController.getOne);

router.post('/albums', albumController.create);
router.put('/albums/:id', albumController.update);
router.delete('/albums/:id', albumController.delete);

router.post('/artist', albumController.addArtist);
router.delete('/artist',  albumController.removeArtist);

router.post('/genre', albumController.addGenre);
router.delete('/genre', albumController.removeGenre);

export default router;