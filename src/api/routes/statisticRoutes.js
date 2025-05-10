import { Router } from 'express';
import statisticsController from '../../controllers/statisticsController.js';

const router = Router();

router.get('/admin', statisticsController.getStatisticsForAdmin);
router.get('/artist', statisticsController.getStatisticsForArtist);

export default router;