import Router from 'express';
import TracksController from "../../controllers/tracksController.js";

const router = new Router();
const tracksController = new TracksController();

router.get('/tracks', tracksController.getAll);

router.get('/tracks/:id', tracksController.getOne);

router.post('/tracks', tracksController.create);

router.delete('/tracks/:id',tracksController.delete);

router.put('/tracks', tracksController.update);

export default router;