import { models } from '../models/index.js';
import fileService from './fileService.js';
import {Op} from "sequelize";
import sequelize from "../api/sequelize.js";

const { Album, Artist, Album_artists, Album_genres, Track, Genres, User } = models;

class AlbumService {
    async create(albumData, picture, artistIds, genreIds, trackIds) {
        const t = await sequelize.transaction();

        try {
            const fileName = picture ? await fileService.saveFile(picture) : null;

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

            if (trackIds?.length) {
                await Track.update(
                    { album_id: null },
                    { where: { album_id: album.id }, transaction: t }
                );

                await Track.update(
                    { album_id: album.id },
                    { where: { id: trackIds }, transaction: t }
                );
            }

            await t.commit();
            return this.getById(album.id);
        } catch (error) {
            console.error('Error creating album:', error);
            await t.rollback();
            throw error;
        }
    }

    async getAll(options = {}) {
        const albums = await Album.findAll({
            include: [
                {
                    model: Artist,
                    through: { attributes: [] },
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username']
                        }
                    ]
                },
                { model: Genres, through: { attributes: [] } },
                { model: Track }
            ],
            ...options
        });

        return albums;
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
                    model: Genres,
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                },
                {
                    model: Track,
                    attributes: ['id', 'title', 'release_date', 'picture', 'audio'],
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

    async update(id, albumData, picture, artistIds, genreIds, trackIds) {
        const t = await sequelize.transaction();

        try {
            const album = await Album.findByPk(id);
            if (!album) {
                throw new Error("Album not found");
            }

            let fileName = album.picture;
            if (picture) {
                if (album.picture) {
                    await fileService.deleteImage(album.picture);
                }
                fileName = fileService.saveFile(picture);
            }

            await album.update(
                {
                    ...albumData,
                    picture: fileName
                },
                { transaction: t }
            );

            if (artistIds) {
                await Album_artists.destroy({
                    where: { album_id: id },
                    transaction: t
                });

                if (artistIds.length > 0) {
                    await Album_artists.bulkCreate(
                        artistIds.map(artistId => ({
                            album_id: id,
                            artist_id: artistId
                        })),
                        { transaction: t }
                    );
                }
            }

            if (genreIds) {
                await Album_genres.destroy({
                    where: { album_id: id },
                    transaction: t
                });

                if (genreIds.length > 0) {
                    await Album_genres.bulkCreate(
                        genreIds.map(genreId => ({
                            album_id: id,
                            genre_id: genreId
                        })),
                        { transaction: t }
                    );
                }
            }

            if (trackIds) {
                await Track.update(
                    { album_id: null },
                    {
                        where: { album_id: id },
                        transaction: t
                    }
                );

                if (trackIds.length > 0) {
                    await Track.update(
                        { album_id: id },
                        {
                            where: { id: trackIds },
                            transaction: t
                        }
                    );
                }
            }

            await t.commit();

            return await this.getById(id);
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

            await Album_artists.destroy({
                where: { album_id: id },
                transaction: t
            });

            await Album_genres.destroy({
                where: { album_id: id },
                transaction: t
            });

            await Track.update(
                { album_id: null },
                {
                    where: { album_id: id },
                    transaction: t
                }
            );

            if (album.picture) {
                await fileService.deleteImage(album.picture);
            }

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