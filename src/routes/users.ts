import { Router } from 'express';
import UserController from '../controllers/usersController';
import { authentication } from '../middlewares/auth';

const router = Router();
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.use(authentication)
router.get('/token', UserController.getUserByToken)

export default router