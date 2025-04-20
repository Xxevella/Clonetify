import fileService from "./fileService.js";
import { models } from '../models/index.js';
const { User, Playlist, Track, Playlist_tracks } = models;

class PlaylistService {
    async create(playlist, picture, userId) {
        const fileName = fileService.saveFile(picture, 'playlists');
        const user = await User.findByPk(userId);

        if (user) {
            const playlistData = {
                ...playlist,
                user_id: userId,
                picture: fileName,
            };

            const createdPlaylist = await Playlist.create(playlistData);
            return createdPlaylist;
        }

        throw new Error('User not found');
    }

    async getAll() {
        const playlists = await Playlist.findAll({
            include: [
                {
                    model: Track,
                    through: {
                        model: Playlist_tracks,
                        attributes: ['added_at'], // Указываем только нужное поле
                    },
                    required: false
                }
            ]
        });
        return playlists;
    }

    async getOne(id) {
        if (!id) throw new Error("No id");
        const playlist = await Playlist.findByPk(id, {
            include: [
                {
                    model: Track,
                    through: Playlist_tracks,
                    required: false
                }
            ]
        });
        return playlist;
    }

    async update(playlist) {
        const existingPlaylist = await Playlist.findByPk(playlist.id);
        if (!existingPlaylist) throw new Error("Playlist not found");
        await existingPlaylist.update(playlist);
        return existingPlaylist;
    }

    async delete(playlistId) {
        const playlist = await Playlist.findByPk(playlistId);
        if (!playlist) throw new Error("Playlist not found");
        await playlist.destroy();
        return playlistId;
    }
}

export default new PlaylistService();