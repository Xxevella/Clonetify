import Router from 'express';
import ArtistController from "../../controllers/artistController.js";

const router = new Router();
const artistController = new ArtistController();

router.get('/artists', artistController.getAll.bind(artistController));
router.get('/artists/:id', artistController.getOne.bind(artistController));
router.post('/artists', artistController.create.bind(artistController));
router.delete('/artists/:id', artistController.delete.bind(artistController));
router.put('/artists', artistController.update.bind(artistController));

export default router;