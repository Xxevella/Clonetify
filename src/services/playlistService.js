import fileService from "./fileService.js";
import { models } from '../models/index.js';
import Artist from "../models/artistModel.js";
import Track_artists from "../models/track_artists.js";
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

    async getOne(id) {
        const playlist = await Playlist.findOne({
            where: { id: id },
            include: [
                {
                    model: Track,
                    through: {
                        model: Playlist_tracks,
                        attributes: ['added_at'],
                    },
                    include: [
                        {
                            model: Artist,
                            through: {
                                model: Track_artists,
                                attributes: []
                            },
                            required: false
                        }
                    ],
                    required: false
                },
            ]
        });
        return playlist;
    }

    async getAll() {
        const playlists = await Playlist.findAll({
            include: [
                {
                    model: Track,
                    through: {
                        model: Playlist_tracks,
                        attributes: ['added_at'],
                    },
                    include: [
                        {
                            model: Artist,
                            through: {
                                model: Track_artists,
                                attributes: []
                            },
                            required: false
                        }
                    ],
                    required: false
                },
            ]
        });
        return playlists;
    }
    async getAllWithId(userId) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');
        const playlists = await Playlist.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Track,
                    through: {
                        model: Playlist_tracks,
                        attributes: ['added_at'],
                    },
                    include: [
                        {
                            model: Artist,
                            through: {
                                model: Track_artists,
                                attributes: []
                            },
                            required: false
                        }
                    ],
                    required: false
                },
            ]
        });
        return playlists;
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

    async removeTrackFromPlaylist(playlistId, trackId) {
        const result = await Playlist_tracks.destroy({
            where: {
                playlist_id: playlistId,
                track_id: trackId
            }
        });

        if (result === 0) {
            throw new Error('Track not found in playlist');
        }
    }
}

export default new PlaylistService();