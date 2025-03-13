import Router from 'express';
import PlaylistController from "../../controllers/playlistController.js";

const router = new Router();
const playlistController = new PlaylistController();

router.get('/playlists', playlistController.getAll.bind(playlistController));
router.get('/playlists/:id', playlistController.getOne);
router.post('/playlists', playlistController.create.bind(playlistController));
router.delete('/playlists/:id', playlistController.delete.bind(playlistController));
router.put('/playlists', playlistController.update.bind(playlistController));

export default router;