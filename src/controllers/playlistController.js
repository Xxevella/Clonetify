import PlaylistService from "../services/playlistService.js";
import fileService from "../services/fileService.js";
class PlaylistController{
    async create(req, res) {
        try {
            const userId = req.body.user_id;
            const playlist = await PlaylistService.create(req.body, req.files.picture, userId);
            res.status(201).json(playlist);
        } catch (error) {
            console.error('Error adding playlist:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getAll(req, res) {
        try {
            const playlists = await PlaylistService.getAll();
            return res.status(200).json(playlists);
        } catch (error) {
            console.error('Error getting playlists:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getClonetifyRecs(req, res) {
        const userId = process.env.ADMIN_ID;
        try {
            const playlists = await PlaylistService.getAllWithId(userId);
            return res.status(200).json(playlists);
        } catch (error) {
            console.error('Error getting playlists:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getOne(req, res) {
        try {
            const playlist = await PlaylistService.getOne(req.params.id);
            if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
            return res.status(200).json(playlist);
        } catch (error) {
            console.error('Error getting playlist:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getPlaylistsByUserId(req, res) {
        const { userId } = req.params;
        try {
            const playlists = await PlaylistService.getAllWithId(userId);
            return res.status(200).json(playlists);
        } catch (error) {
            console.error('Error fetching playlists:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req, res) {
        try {
            const playlistId = req.params.id;
            if (!playlistId) {
                return res.status(400).json({ message: 'Type correct id' });
            }

            const playlistData = req.body;

            const existingPlaylist = await PlaylistService.getOne(playlistId);
            if (!existingPlaylist) {
                return res.status(404).json({ message: 'Playlist not found' });
            }

            if (req.files && req.files.picture) {
                const oldFileName = existingPlaylist.picture;

                if (oldFileName) {
                    fileService.saveFileWithName(req.files.picture, oldFileName, 'image');
                    playlistData.picture = oldFileName;
                } else {
                    const newFileName = fileService.saveFile(req.files.picture, 'image');
                    playlistData.picture = newFileName;
                }
            } else {
                playlistData.picture = existingPlaylist.picture;
            }

            playlistData.id = playlistId;

            const updatedPlaylist = await PlaylistService.update(playlistData);

            res.status(200).json(updatedPlaylist);
        } catch (error) {
            console.error('Error updating playlist:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'Playlist ID is required' });
            }
            await PlaylistService.delete(id);
            return res.status(200).json({ message: 'Playlist deleted successfully' });
        } catch (error) {
            console.error('Error deleting playlist:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async removeTrackFromPlaylist(req, res) {
        try {
            const { playlistId, trackId } = req.params;
            if (!playlistId || !trackId) {
                return res.status(400).json({ message: 'Playlist ID and Track ID are required' });
            }

            await PlaylistService.removeTrackFromPlaylist(playlistId, trackId);
            return res.status(200).json({ message: 'Track removed from playlist successfully' });
        } catch (error) {
            console.error('Error removing track from playlist:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}

export default PlaylistController;