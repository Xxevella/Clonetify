import searchService from '../services/searchService.js';

class SearchController {
    async search(req, res) {
        try {
            const query = req.query.query;
            if (!query || query.trim().length === 0) {
                return res.json({ albums: [], tracks: [], artists: [] });
            }

            const results = await searchService.search(query.trim());
            return res.json(results);
        } catch (error) {
            console.error('Error in searchController:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new SearchController();