import { models } from '../models/index.js';
import fileService from './fileService.js';
import Favorites from "../models/favorites.js";

const { Track, Artist, Genres, Track_genres, Track_artists, Album } = models;

class TrackService {
    async create(trackData, picture, audio, artistIds, genreIds, albumId) {
        try {
            const pictureFileName = picture ? fileService.saveImage(picture) : null;
            const audioFileName = audio ? fileService.saveAudio(audio) : null;

            const track = await Track.create({
                ...trackData,
                picture: pictureFileName,
                audio: audioFileName,
                album_id: albumId
            });

            if (artistIds && artistIds.length) {
                const artistRecords = artistIds.map(artistId => ({
                    track_id: track.id,
                    artist_id: artistId
                }));
                await Track_artists.bulkCreate(artistRecords);
            }

            if (genreIds && genreIds.length) {
                const genreRecords = genreIds.map(genreId => ({
                    track_id: track.id,
                    genre_id: genreId
                }));
                await Track_genres.bulkCreate(genreRecords);
            }

            return track;
        } catch (error) {
            console.error('Error creating track:', error);
            throw error;
        }
    }

    async getAll(options = {}) {
        const tracks = await Track.findAll({
            include: [
                {
                    model: Album,
                    attributes: ['id', 'title'],
                    required: false,
                },
                {
                    model: Artist,
                    attributes: ['id', 'name'],
                    through: {
                        model: Track_artists,
                        attributes: []
                    },
                },
                {
                    model: Genres,
                    attributes: ['id', 'name'],
                    through: {
                        model: Track_genres,
                        attributes: []
                    },
                }
            ],
            ...options
        });

        return tracks;
    }

    async getById(id) {
        if (!id) throw new Error("No id provided");

        const track = await Track.findByPk(id, {
            include: [
                {
                    model: Album,
                    attributes: ['id', 'title'],
                    required: false,
                },
                {
                    model: Artist,
                    through: { attributes: [] },
                    attributes: ['id', 'name'],
                },
                {
                    model: Genres,
                    through: { attributes: [] },
                    attributes: ['id', 'name'],
                }
            ]
        });

        if (!track) throw new Error("Track not found");
        return track;
    }

    async update(id, trackData, picture, audio, artistIds, genreIds, albumId) {
        const track = await Track.findByPk(id);
        if (!track) throw new Error("Track not found");

        let pictureFileName = track.picture;
        let audioFileName = track.audio;

        if (picture) {
            // Delete old picture file if it exists
            if (track.picture) {
                fileService.deleteFile(track.picture, 'image');
            }
            pictureFileName = fileService.saveImage(picture);
        }

        if (audio) {
            // Delete old audio file if it exists
            if (track.audio) {
                fileService.deleteFile(track.audio, 'audio');
            }
            audioFileName = fileService.saveAudio(audio);
        }

        await track.update({
            ...trackData,
            picture: pictureFileName,
            audio: audioFileName,
            album_id: albumId
        });

        if (artistIds) {
            await Track_artists.destroy({ where: { track_id: id } });

            if (artistIds.length > 0) {
                const artistRecords = artistIds.map(artistId => ({
                    track_id: id,
                    artist_id: artistId
                }));
                await Track_artists.bulkCreate(artistRecords);
            }
        }

        if (genreIds) {
            await Track_genres.destroy({ where: { track_id: id } });

            if (genreIds.length > 0) {
                const genreRecords = genreIds.map(genreId => ({
                    track_id: id,
                    genre_id: genreId
                }));
                await Track_genres.bulkCreate(genreRecords);
            }
        }
        return await this.getById(id);
    }

    async delete(id) {
        const track = await Track.findByPk(id);
        if (!track) throw new Error("Track not found");

        // Delete associated files
        if (track.picture) {
            fileService.deleteFile(track.picture, 'image');
        }
        if (track.audio) {
            fileService.deleteFile(track.audio, 'audio');
        }

        await Track_artists.destroy({ where: { track_id: id } });
        await Track_genres.destroy({ where: { track_id: id } });

        await models.Favorites.destroy({ where: { track_id: id } });
        await models.Playlist_tracks.destroy({ where: { track_id: id } });

        await track.destroy();

        return id;
    }

    async addToPlaylist(trackId, playlistId) {
        await models.Playlist_tracks.create({
            track_id: trackId,
            playlist_id: playlistId,
            added_at: new Date()
        });

        return { trackId, playlistId };
    }

    async removeFromPlaylist(trackId, playlistId) {
        await models.Playlist_tracks.destroy({
            where: {
                track_id: trackId,
                playlist_id: playlistId
            }
        });

        return { trackId, playlistId };
    }

    async addToFavorites(trackId, userId) {
        await Favorites.create({
            track_id: trackId,
            user_id: userId,
        });

        return { trackId, userId };
    }

    async removeFromFavorites(trackId, userId) {
        await models.Favorites.destroy({
            where: {
                track_id: trackId,
                user_id: userId
            }
        });

        return { trackId, userId };
    }
    async getFavoritesByUserId(userId) {
        const favorites = await Favorites.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Track,
                    include: [
                        {
                            model: Artist,
                            attributes: ['id', 'name'],
                        },
                        {
                            model: Genres,
                            attributes: ['id', 'name'],
                        }
                    ],
                }
            ],
        });

        return favorites.map(favorite => favorite.Track);
    }
}

export default new TrackService();