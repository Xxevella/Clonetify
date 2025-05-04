import { models } from '../models/index.js';

const { Genres } = models;

class GenreService {
    async getAll() {
        return await Genres.findAll();
    }

    async getById(id) {
        const genre = await Genres.findByPk(id);
        if (!genre) throw new Error("Genre not found");
        return genre;
    }

    async create(genreData) {
        const genre = await Genres.create(genreData);
        return genre;
    }

    async update(id, genreData) {
        const genre = await this.getById(id);
        await genre.update(genreData);
        return genre;
    }

    async delete(id) {
        const genre = await this.getById(id);
        await genre.destroy();
        return id;
    }
}

export default new GenreService();