import albumService from '../services/albumService.js';
import fileService from '../services/fileService.js';

class AlbumController {
    async create(req, res) {
        try {
            console.log('Create album called');
            console.log('req.body:', req.body);
            console.log('req.files:', req.files);

            const albumData = {
                ...req.body,
                release_date: req.body.release_date ? new Date(req.body.release_date) : null
            };

            let artistIds = [];
            let genreIds = [];
            let trackIds = [];

            try {
                if (albumData.artistIds) artistIds = JSON.parse(albumData.artistIds);
                if (albumData.genreIds) genreIds = JSON.parse(albumData.genreIds);
                if (albumData.trackIds) trackIds = JSON.parse(albumData.trackIds);
            } catch (e) {
                return res.status(400).json({ message: 'Invalid artistIds, genreIds or trackIds format' });
            }

            const pictureFile = req.files && req.files.picture ? req.files.picture : null;

            const album = await albumService.create(albumData, pictureFile, artistIds, genreIds, trackIds);

            return res.status(201).json(album);
        } catch (error) {
            console.error('Error creating album:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAll(req, res) {
        try {
            const albums = await albumService.getAll();
            return res.status(200).json(albums);
        } catch (error) {
            console.error('Error getting albums:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'Album ID required' });

            const album = await albumService.getById(id);
            if (!album) return res.status(404).json({ message: 'Album not found' });

            return res.status(200).json(album);
        } catch (error) {
            console.error('Error getting album:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'Album ID required' });
            }

            const existingAlbum = await albumService.getById(id);
            if (!existingAlbum) {
                return res.status(404).json({ message: 'Album not found' });
            }

            const albumData = {
                title: req.body.title || existingAlbum.title,
                release_date: req.body.release_date ? new Date(req.body.release_date) : existingAlbum.release_date
            };

            let artistIds = [], genreIds = [], trackIds = [];

            try {
                if (req.body.artistIds) artistIds = JSON.parse(req.body.artistIds);
                if (req.body.genreIds) genreIds = JSON.parse(req.body.genreIds);
                if (req.body.trackIds) trackIds = JSON.parse(req.body.trackIds);
            } catch (error) {
                console.error('Error parsing IDs:', error);
                return res.status(400).json({ message: 'Invalid ID format' });
            }

            const picture = req.files && req.files.picture ? req.files.picture : null;

            const updatedAlbum = await albumService.update(
                id,
                albumData,
                picture,
                artistIds,
                genreIds,
                trackIds
            );

            return res.json(updatedAlbum);
        } catch (error) {
            console.error('Error updating album:', error);
            return res.status(500).json({
                message: error.message || 'Internal Server Error'
            });
        }
    }
    async getTracksByAlbumId(req, res) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'Album ID required' });

            const album = await albumService.getById(id);
            if (!album) return res.status(404).json({ message: 'Album not found' });

            return res.status(200).json(album.Tracks || []);
        } catch (error) {
            console.error('Error getting album tracks:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'Album ID required' });

            await albumService.delete(id);
            return res.status(200).json({ message: 'Album deleted successfully' });
        } catch (error) {
            console.error('Error deleting album:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
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