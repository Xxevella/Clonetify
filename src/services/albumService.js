import { models } from '../models/index.js';
import fileService from './fileService.js';
import {Op} from "sequelize";

const { Album, Artist, Album_artists, Album_genres, Track, Genre } = models;

class AlbumService {
    async create(albumData, picture, artistIds, genreIds) {
        const t = await sequelize.transaction();

        try {
            const fileName = picture ? fileService.saveFile(picture) : null;

            const album = await Album.create({
                ...albumData,
                picture: fileName
            }, { transaction: t });

            if (artistIds?.length) {
                const artistRecords = artistIds.map(artistId => ({
                    album_id: album.id,
                    artist_id: artistId
                }));
                await Album_artists.bulkCreate(artistRecords, { transaction: t });
            }

            if (genreIds?.length) {
                const genreRecords = genreIds.map(genreId => ({
                    album_id: album.id,
                    genre_id: genreId
                }));
                await Album_genres.bulkCreate(genreRecords, { transaction: t });
            }

            await t.commit();
            return this.getById(album.id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getAll(options = {}) {
        const { limit, offset, search, genre, artist, sort } = options;

        const queryOptions = {
            include: [
                {
                    model: Artist,
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                },
                {
                    model: Genre,
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                },
                {
                    model: Track,
                    attributes: ['id', 'title', 'duration']
                }
            ],
            where: {},
            order: [['release_date', 'DESC']],
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined
        };

        if (search) {
            queryOptions.where.title = {
                [Op.iLike]: `%${search}%`
            };
        }

        if (genre) {
            queryOptions.include[1].where = { id: genre };
        }

        if (artist) {
            queryOptions.include[0].where = { id: artist };
        }

        if (sort) {
            const [field, order] = sort.split(':');
            queryOptions.order = [[field, order.toUpperCase()]];
        }

        return await Album.findAndCountAll(queryOptions);
    }

    async getById(id) {
        const album = await Album.findByPk(id, {
            include: [
                {
                    model: Artist,
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                },
                {
                    model: Genre,
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                },
                {
                    model: Track,
                    attributes: ['id', 'title', 'duration', 'release_date'],
                    include: [
                        {
                            model: Artist,
                            through: { attributes: [] },
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        if (!album) throw new Error("Album not found");
        return album;
    }

    async update(id, albumData, picture, artistIds, genreIds) {
        const t = await sequelize.transaction();

        try {
            const album = await Album.findByPk(id);
            if (!album) throw new Error("Album not found");

            const fileName = picture ? fileService.saveFile(picture) : album.picture;

            await album.update({
                ...albumData,
                picture: fileName
            }, { transaction: t });

            if (artistIds) {
                await Album_artists.destroy({
                    where: { album_id: id },
                    transaction: t
                });

                if (artistIds.length) {
                    const artistRecords = artistIds.map(artistId => ({
                        album_id: id,
                        artist_id: artistId
                    }));
                    await Album_artists.bulkCreate(artistRecords, { transaction: t });
                }
            }

            if (genreIds) {
                await Album_genres.destroy({
                    where: { album_id: id },
                    transaction: t
                });

                if (genreIds.length) {
                    const genreRecords = genreIds.map(genreId => ({
                        album_id: id,
                        genre_id: genreId
                    }));
                    await Album_genres.bulkCreate(genreRecords, { transaction: t });
                }
            }

            await t.commit();
            return this.getById(id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async delete(id) {
        const t = await sequelize.transaction();

        try {
            const album = await Album.findByPk(id);
            if (!album) throw new Error("Album not found");

            // Remove all associations
            await Album_artists.destroy({
                where: { album_id: id },
                transaction: t
            });

            await Album_genres.destroy({
                where: { album_id: id },
                transaction: t
            });

            // Update tracks to remove album association
            await Track.update(
                { album_id: null },
                {
                    where: { album_id: id },
                    transaction: t
                }
            );

            // Delete album picture if exists
            if (album.picture) {
                await fileService.deleteFile(album.picture);
            }

            // Delete the album
            await album.destroy({ transaction: t });

            await t.commit();
            return id;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async addArtist(albumId, artistId) {
        const exists = await Album_artists.findOne({
            where: {
                album_id: albumId,
                artist_id: artistId
            }
        });

        if (exists) throw new Error("Artist already associated with this album");

        return await Album_artists.create({
            album_id: albumId,
            artist_id: artistId
        });
    }

    async removeArtist(albumId, artistId) {
        const result = await Album_artists.destroy({
            where: {
                album_id: albumId,
                artist_id: artistId
            }
        });

        if (!result) throw new Error("Association not found");
        return { albumId, artistId };
    }

    async addGenre(albumId, genreId) {
        const exists = await Album_genres.findOne({
            where: {
                album_id: albumId,
                genre_id: genreId
            }
        });

        if (exists) throw new Error("Genre already associated with this album");

        return await Album_genres.create({
            album_id: albumId,
            genre_id: genreId
        });
    }

    async removeGenre(albumId, genreId) {
        const result = await Album_genres.destroy({
            where: {
                album_id: albumId,
                genre_id: genreId
            }
        });

        if (!result) throw new Error("Association not found");
        return { albumId, genreId };
    }
}

export default new AlbumService();