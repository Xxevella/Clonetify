
import { models } from '../models/index.js';
import fileService from './fileService.js';

const { Track, Artist, Genres, Track_genres, Track_artists, Album } = models;

class TrackService {
    async create(trackData, picture, artistIds, genreIds, albumId) {
        try {
            const fileName = picture ? fileService.saveFile(picture) : null;
            console.log('Track data:', trackData);
            const track = await Track.create({
                ...trackData,
                picture: fileName,
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
        }
     catch (error) {
        console.error('Error creating track:', error);
        throw error;
    }
    }

    async getAll(options = {}) {
        const tracks = await Track.findAll({
            include: [
                {
                    model: Album,
                    attributes: ['id', 'title']
                },
                {
                    model: Artist,
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                },
                {
                    model: Genres,
                    through: { attributes: [] },
                    attributes: ['id', 'name']
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
                    attributes: ['id', 'title']
                },
                {
                    model: Artist,
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                },
                {
                    model: Genres,
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                }
            ]
        });

        if (!track) throw new Error("Track not found");
        return track;
    }

    async update(id, trackData, picture, artistIds, genreIds, albumId) {
        const track = await Track.findByPk(id);
        if (!track) throw new Error("Track not found");

        const fileName = picture ? fileService.saveFile(picture) : track.picture;
        await track.update({
            ...trackData,
            picture: fileName,
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
        await models.Favorites.create({
            track_id: trackId,
            user_id: userId,
            added_at: new Date()
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
}

export default new TrackService();