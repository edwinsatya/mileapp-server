import { Router } from 'express';
import UserController from '../controllers/usersController';

const router = Router();
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/users', UserController.getUsers)
router.get('/users/:id', UserController.getUsers)

export default router