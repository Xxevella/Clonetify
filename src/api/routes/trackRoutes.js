import Router from 'express';
import TracksController from "../../controllers/tracksController.js";

const router = new Router();
const tracksController = new TracksController();

router.get('/tracks', tracksController.getAll.bind(tracksController));

router.get('/tracks/:id', tracksController.getOne.bind(tracksController));

router.post('/tracks', tracksController.create.bind(tracksController));

router.delete('/tracks/:id',tracksController.delete.bind(tracksController));

router.put('/tracks', tracksController.update.bind(tracksController));

export default router;