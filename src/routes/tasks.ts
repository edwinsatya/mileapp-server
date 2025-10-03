import { Router } from 'express'
import TaskController from '../controllers/tasksController'
import { authentication } from '../middlewares/auth'

const router = Router()
router.use(authentication)
router.post('/', TaskController.create)

export default router
