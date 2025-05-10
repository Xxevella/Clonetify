import statisticsService from '../services/statisticsService.js';
import ArtistService from "../services/artistService.js";


class StatisticsController {
    async getStatisticsForAdmin(req, res) {
        try {
            const stats = await statisticsService.getStatisticsForAdmin();
            res.json(stats);
        } catch (error) {
            console.error('Error getting statistics:', error);
            throw error;
        }
    }
    async getStatisticsForArtist(req, res) {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ message: 'userId query parameter is required' });
            }

            // Ищем артиста по user_id, а не по id
            const artist = await ArtistService.getByUserId(userId);
            if (!artist) {
                return res.status(404).json({ message: 'Artist not found for this user' });
            }

            const stats = await statisticsService.getStatisticsForArtist(artist.id);

            return res.json(stats);
        } catch (error) {
            console.error('ArtistStatisticsController.getStatistics error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default new StatisticsController();