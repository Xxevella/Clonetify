import genreService from '../services/genreService.js';

class GenreController {
    async getAll(req, res, next) {
        try {
            const genres = await genreService.getAll();
            return res.json(genres);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const genre = await genreService.getById(id);
            return res.json(genre);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { name } = req.body;
            const newGenre = await genreService.create({ name });
            return res.status(201).json(newGenre);
        } catch (error) {
            console.error('Error creating genre:', error);
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const updatedGenre = await genreService.update(id, { name });
            return res.json(updatedGenre);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await genreService.delete(id);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new GenreController();