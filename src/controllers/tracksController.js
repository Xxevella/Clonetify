import trackService from '../services/trackService.js';

class TrackController {
    async create(req, res, next) {
        try {
            const { title,releaseDate, album_id, artist_ids, genre_ids } = req.body;
            const files = req.files || {};
            const picture = files.picture;
            const audio = files.audio;

            const trackData = { title,releaseDate };
            const track = await trackService.create(
                trackData,
                picture,
                audio,
                JSON.parse(artist_ids || '[]'),
                JSON.parse(genre_ids || '[]'),
                album_id
            );

            return res.json(track);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res) {
        try {
            const tracks = await trackService.getAll();
            return res.json(tracks);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const track = await trackService.getById(id);
            return res.json(track);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { title, releaseDate, album_id, artist_ids, genre_ids } = req.body;
            const files = req.files || {};
            const picture = files.picture;
            const audio = files.audio;

            const trackData = { title, releaseDate };
            const track = await trackService.update(
                id,
                trackData,
                picture,
                audio,
                artist_ids ? JSON.parse(artist_ids) : undefined,
                genre_ids ? JSON.parse(genre_ids) : undefined,
                album_id
            );

            return res.json(track);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const deletedId = await trackService.delete(id);
            return res.json({ id: deletedId });
        } catch (error) {
            next(error);
        }
    }

    async addToPlaylist(req, res, next) {
        try {
            const { trackId, playlistId } = req.body;
            const result = await trackService.addToPlaylist(trackId, playlistId);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async removeFromPlaylist(req, res, next) {
        try {
            const { trackId, playlistId } = req.body;
            const result = await trackService.removeFromPlaylist(trackId, playlistId);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async addToFavorites(req, res, next) {
        try {
            const { trackId } = req.body;
            const userId = req.user.id;

            const result = await trackService.addToFavorites(trackId, userId);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async removeFromFavorites(req, res, next) {
        try {
            const { trackId } = req.body;
            const userId = req.user.id;

            const result = await trackService.removeFromFavorites(trackId, userId);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new TrackController();