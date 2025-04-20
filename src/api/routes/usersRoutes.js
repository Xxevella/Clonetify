import Router from "express";
import UserController from "../../controllers/userController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = new Router();
const userController = new UserController(router);

router.post('/users', userController.create);
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getOne); // Проверяем авторизацию
router.put('/users', userController.update);
router.delete('/users/:id', userController.delete);

export default router;