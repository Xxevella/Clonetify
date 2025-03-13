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

    async update(artist) {
        const existingArtist = await Artist.findByPk(artist.id);
        if (!existingArtist) throw new Error("Artist not found");
        await existingArtist.update(artist);
        return existingArtist;
    }

    async delete(artistId) {
        const artist = await Artist.findByPk(artistId);
        if (!artist) throw new Error("Artist not found");
        await artist.destroy();
        return artistId;
    }
}

export default new ArtistService();