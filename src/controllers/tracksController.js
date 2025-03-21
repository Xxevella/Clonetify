// controllers/trackController.js
import trackService from '../services/trackService.js';

class TrackController {
    async create(req, res, next) {
        try {
            const { title, duration, releaseDate, album_id, artist_ids, genre_ids } = req.body;
            const { picture } = req.files || {};

            const trackData = { title, duration, releaseDate };
            const track = await trackService.create(
                trackData,
                picture,
                JSON.parse(artist_ids || '[]'),
                JSON.parse(genre_ids || '[]'),
                album_id
            );

            return res.json(track);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const { genre, artist, album, limit, page } = req.query;
            const options = {};

            // Пагинация
            if (limit && page) {
                options.limit = parseInt(limit);
                options.offset = (parseInt(page) - 1) * parseInt(limit);
            }

            options.where = {};
            options.include = [];

            const tracks = await trackService.getAll(options);
            return res.json(tracks);
        } catch (error) {
            next(error);
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
            const { title, duration, release_date, album_id, artist_ids, genre_ids } = req.body;
            const { picture } = req.files || {};

            const trackData = { title, duration, release_date };
            const track = await trackService.update(
                id,
                trackData,
                picture,
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