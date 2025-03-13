import ArtistService from "../services/artistService.js";

class ArtistController {
    async create(req, res) {
        try {
            const userId = req.body.user_id;
            console.log(req.user_id);
            const artist = await ArtistService.create(req.body, userId);
            res.status(201).json(artist);
        } catch (error) {
            console.error('Error adding artist:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAll(req, res) {
        try {
            const artists = await ArtistService.getAll();
            return res.status(200).json(artists);
        } catch (error) {
            console.error('Error getting artists:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getOne(req, res) {
        try {
            const artist = await ArtistService.getOne(req.params.id);
            if (!artist) return res.status(404).json({ message: 'Artist not found' });
            return res.status(200).json(artist);
        } catch (error) {
            console.error('Error getting artist:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req, res) {
        try {
            const artist = req.body;
            if (!artist.id) {
                return res.status(400).json({ message: 'Type correct id' });
            }
            const updatedArtist = await ArtistService.update(artist);
            res.status(200).json(updatedArtist);
        } catch (error) {
            console.error('Error updating artist:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'Artist ID is required' });
            }
            await ArtistService.delete(id);
            return res.status(200).json({ message: 'Artist deleted successfully' });
        } catch (error) {
            console.error('Error deleting artist:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default ArtistController;