import { Router } from "express";
import TaskController from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/authenticate.js";


const router = Router();
const taskController = new TaskController();


router.post('/', authenticate, (req, res) => taskController.create(req, res));
router.get('/', authenticate, (req, res) => taskController.getAllTasks(req, res));
router.get('/:id', authenticate, (req, res) => taskController.getTask(req, res));
router.patch('/:id', authenticate, (req, res) => taskController.update(req, res));
router.patch('/completed/:id', authenticate, (req, res) => taskController.completed(req, res));
router.patch('/uncompleted/:id', authenticate, (req, res) => taskController.uncompleted(req, res));
router.delete('/:id', authenticate, (req, res) => taskController.delete(req, res));

export default router;