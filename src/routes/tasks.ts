import { Router } from 'express'
import TaskController from '../controllers/tasksController'
import { authentication, authorization } from '../middlewares/auth'

const router = Router()
router.use(authentication)
router.post('/', TaskController.create)
router.get('/', TaskController.getTasks)
router.get('/:id', authorization, TaskController.getTask)
router.put('/:id', authorization, TaskController.update)
router.delete('/:id', authorization, TaskController.remove)

export default router
