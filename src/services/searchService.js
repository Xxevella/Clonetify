// backend/services/searchService.js
import { models } from '../models/index.js';
import { Op } from 'sequelize';

const { Album, Artist, Track } = models;

class SearchService {
    async search(query) {
        console.log(`Searching tracks with title ILIKE '%${query}%'`);
        const likeQuery = { [Op.iLike]: `%${query}%` };
        console.log(`Like query: ${likeQuery}`);

        const artistInclude = {
            model: Artist,
            through: { attributes: [] },
            attributes: ['id', 'name']
        };
        const trackArtistInclude = {
            model: Artist,
            through: { attributes: [] },
            attributes: ['id', 'name']
        };

        const albums = await Album.findAll({
            where: { title: likeQuery },
            include: [artistInclude],
            limit: 30,
            order: [['title', 'ASC']],
        });

        const tracks = await Track.findAll({
            where: {
                title: likeQuery
            },
            include: [trackArtistInclude],
            limit: 30,
            order: [['title', 'ASC']],
        });

        const artists = await Artist.findAll({
            where: { name: likeQuery },
            attributes: ['id', 'name'],
            limit: 30,
            order: [['name', 'ASC']],
        });

        return { albums, tracks, artists };
    }
}

export default new SearchService();