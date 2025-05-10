import { Router } from 'express';
import searchController from '../../controllers/searchController.js';

const router = Router();

router.use((req, res, next) => {
    console.log(`[SearchRouter] ${req.method} ${req.originalUrl}`);
    next();
});


router.get('/search', searchController.search);

export default router;