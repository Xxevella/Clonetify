import albumService from '../services/albumService.js';

class AlbumController {
    async create(req, res, next) {
        try {
            const { title, release_date, artist_ids, genre_ids } = req.body;
            const { picture } = req.files || {};

            const album = await albumService.create(
                { title, release_date },
                picture,
                JSON.parse(artist_ids || '[]'),
                JSON.parse(genre_ids || '[]')
            );

            return res.json(album);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const {
                limit,
                page,
                search,
                genre,
                artist,
                sort
            } = req.query;

            const offset = page ? (parseInt(page) - 1) * parseInt(limit) : 0;

            const albums = await albumService.getAll({
                limit,
                offset,
                search,
                genre,
                artist,
                sort
            });

            return res.json(albums);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const album = await albumService.getById(id);
            return res.json(album);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { title, release_date, artist_ids, genre_ids } = req.body;
            const { picture } = req.files || {};

            const album = await albumService.update(
                id,
                { title, release_date },
                picture,
                artist_ids ? JSON.parse(artist_ids) : undefined,
                genre_ids ? JSON.parse(genre_ids) : undefined
            );

            return res.json(album);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const deletedId = await albumService.delete(id);
            return res.json({ id: deletedId });
        } catch (error) {
            next(error);
        }
    }

    async addArtist(req, res, next) {
        try {
            const { albumId, artistId } = req.body;
            const result = await albumService.addArtist(albumId, artistId);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async removeArtist(req, res, next) {
        try {
            const { albumId, artistId } = req.body;
            const result = await albumService.removeArtist(albumId, artistId);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async addGenre(req, res, next) {
        try {
            const { albumId, genreId } = req.body;
            const result = await albumService.addGenre(albumId, genreId);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async removeGenre(req, res, next) {
        try {
            const { albumId, genreId } = req.body;
            const result = await albumService.removeGenre(albumId, genreId);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new AlbumController();