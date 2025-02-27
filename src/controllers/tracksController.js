import Track from "../models/trackModel.js";
import tracksService from "../services/trackService.js";

class tracksController {
    async create(req, res) {
        try {
            console.log(req.files);
            const track = await tracksService.create(req.body, req.file.picture);
            res.status(201).json(track);
        } catch (error) {
            console.error('Error adding track:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAll(req, res) {
        try {
            const tracks = await tracksService.getAll();
            return res.status(200).json(tracks)
        } catch (error) {
            console.error('Error getting tracks:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getOne(req, res) {
        try {
            const track = await tracksService.getOne(req.params.id);
            if (!track) return res.status(404).json({ message: 'Track not found' });
            return res.status(200).json(track);
        } catch (error) {
            console.error('Error getting track:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req, res) {
        try {
            const track = req.body;
            if (!track.id) {
                return res.status(400).json({ message: 'Type correct id' });
            }
            const updatedTrack = await tracksService.update(track);
            res.status(200).json(updatedTrack);
        } catch (error) {
            console.error('Error updating track:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'Track ID is required' });
            }
            await tracksService.delete(id);
            return res.status(200).json({ message: 'Track deleted successfully' });
        } catch (error) {
            console.error('Error deleting track:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default tracksController;