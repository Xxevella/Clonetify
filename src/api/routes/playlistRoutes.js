import Router from 'express';
import PlaylistController from "../../controllers/playlistController.js";

const router = new Router();
const playlistController = new PlaylistController();

// Existing routes
router.get('/recs', playlistController.getClonetifyRecs.bind(playlistController));
router.get('/playlists/:id', playlistController.getOne);
router.post('/playlists', playlistController.create.bind(playlistController));
router.delete('/playlists/:id', playlistController.delete.bind(playlistController));
router.put('/playlists', playlistController.update.bind(playlistController));

// New route for getting playlists by userId
router.get('/user/:userId', playlistController.getPlaylistsByUserId.bind(playlistController));

export default router;