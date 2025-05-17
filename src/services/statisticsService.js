import { models, sequelize } from '../models/index.js';
import { Op } from 'sequelize';
const { Track, Album, Genres, User , Album_artists} = models;

class StatisticsService {
    async getStatisticsForAdmin() {
        try {
            const tracksCount = await Track.count();
            const albumsCount = await Album.count();
            const genresCount = await Genres.count();
            const usersCount = await User.count({
                where: { role: { [Op.not]: 'admin' } }
            });

            const popularGenresRaw = await sequelize.query(`
                SELECT g.name, COUNT(tg.track_id) as count
                FROM genres g
                    LEFT JOIN track_genres tg ON g.id = tg.genre_id
                GROUP BY g.id
                ORDER BY count DESC
                    LIMIT 6
            `, { type: sequelize.QueryTypes.SELECT });

            const currentYear = new Date().getFullYear();

            const userRegistrationsRaw = await User.findAll({
                attributes: [
                    [sequelize.fn('to_char', sequelize.col('created_at'), 'Mon'), 'month'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                where: sequelize.where(sequelize.fn('date_part', 'year', sequelize.col('created_at')), currentYear),
                group: [sequelize.fn('to_char', sequelize.col('created_at'), 'Mon')],
                order: [[sequelize.fn('to_char', sequelize.col('created_at'), 'Mon'), 'ASC']],
                raw: true
            });

            const trackReleasesRaw = await Track.findAll({
                attributes: [
                    [sequelize.fn('to_char', sequelize.col('created_at'), 'Mon'), 'month'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                where: sequelize.where(sequelize.fn('date_part', 'year', sequelize.col('created_at')), currentYear),
                group: [sequelize.fn('to_char', sequelize.col('created_at'), 'Mon')],
                order: [[sequelize.fn('to_char', sequelize.col('created_at'), 'Mon'), 'ASC']],
                raw: true
            });

            const popularGenres = popularGenresRaw.map(g => ({
                name: g.name,
                count: parseInt(g.count, 10)
            }));

            const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            const userRegistrations = allMonths.map(month => {
                const found = userRegistrationsRaw.find(r => r.month === month);
                return {
                    month,
                    count: found ? parseInt(found.count, 10) : 0
                };
            });

            const trackReleases = allMonths.map(month => {
                const found = trackReleasesRaw.find(r => r.month === month);
                return {
                    month,
                    count: found ? parseInt(found.count, 10) : 0
                };
            });

            return {
                tracksCount,
                albumsCount,
                genresCount,
                usersCount,
                popularGenres,
                userRegistrations,
                trackReleases
            };
        } catch (error) {
            console.error('StatisticsService.getStatistics error:', error);
            throw error;
        }
    }
    async getStatisticsForArtist(artistId) {
        if (!artistId) throw new Error('artistId is required');

        const currentYear = new Date().getFullYear();

        const albumsCountRaw = await Album_artists.count({
            where: { artist_id: artistId }
        });

        const tracksCountRaw = await sequelize.query(`
      SELECT COUNT(DISTINCT t.id) as count
      FROM tracks t
      JOIN track_artists ta ON t.id = ta.track_id
      WHERE ta.artist_id = :artistId
    `, {
            replacements: { artistId },
            type: sequelize.QueryTypes.SELECT
        });
        const tracksCount = tracksCountRaw[0]?.count || 0;

        const genresRaw = await sequelize.query(`
            SELECT g.name, COUNT(tg.track_id) as count
            FROM genres g
                LEFT JOIN track_genres tg ON g.id = tg.genre_id
                LEFT JOIN track_artists ta ON tg.track_id = ta.track_id
            WHERE ta.artist_id = :artistId
            GROUP BY g.id, g.name
            ORDER BY count DESC
                LIMIT 6
        `, { replacements: { artistId }, type: sequelize.QueryTypes.SELECT });

        const popularGenres = genresRaw.map(g => ({
            name: g.name,
            count: parseInt(g.count, 10)
        }));

        const genresCount = popularGenres.length;

        const monthlyReleasesRaw = await sequelize.query(`
            SELECT
                to_char(t.created_at, 'Mon') AS month, 
    COUNT(t.id) AS count
            FROM tracks t
                JOIN track_artists ta ON t.id = ta.track_id
            WHERE ta.artist_id = :artistId AND date_part('year', t.created_at) = :year
            GROUP BY to_char(t.created_at, 'Mon'), to_char(t.created_at, 'MM')
            ORDER BY to_char(t.created_at, 'MM')::int
        `, { replacements: { artistId, year: currentYear }, type: sequelize.QueryTypes.SELECT });

        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const monthlyReleases = allMonths.map(month => {
            const found = monthlyReleasesRaw.find(r => r.month === month);
            return {
                month,
                count: found ? parseInt(found.count, 10) : 0
            };
        });

        return {
            albumsCount: albumsCountRaw,
            tracksCount,
            genresCount,
            popularGenres,
            monthlyReleases
        };
    }
}

export default new StatisticsService();