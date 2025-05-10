import { models } from '../models/index.js';

const {User, Artist } = models;

class ArtistService {
    async create(artistData, userId) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error('User not found');
        }

        user.role = 'artist';
        await user.save();

        const artist = {
            ...artistData,
            user_id: userId,
        };

        const createdArtist = await Artist.create(artist);
        return createdArtist;
    }

    async getAll() {
        const artists = await Artist.findAll();
        return artists;
    }

    async getOne(id) {
        if (!id) throw new Error("No id");
        const artist = await Artist.findByPk(id);
        return artist;
    }

    async getTracksByArtistId(artistId) {
        const tracks = await models.Track.findAll({
            include: [{
                model: models.Artist,
                where: { id: artistId },
                attributes: [],
                through: { attributes: [] }
            }],
            order: [['title', 'ASC']],
        });

        return tracks;
    }

    async update(artist) {
        const existingArtist = await Artist.findByPk(artist.id);
        if (!existingArtist) throw new Error("Artist not found");
        await existingArtist.update(artist);
        return existingArtist;
    }

    async getByUserId(userId) {
        if (!userId) throw new Error("No userId provided");
        const artist = await Artist.findOne({ where: { user_id: userId } });
        return artist;
    }

    async delete(artistId) {
        const artist = await Artist.findByPk(artistId);
        if (!artist) throw new Error("Artist not found");
        await artist.destroy();
        return artistId;
    }
}

export default new ArtistService();