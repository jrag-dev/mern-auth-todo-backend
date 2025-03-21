import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";


const router = Router();
const authController = new AuthController();


router.post('/signup', (req, res) => authController.signup(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/signout', (req, res) => authController.signout(req, res));
router.post('/refresh-token', (req, res) => authController.refreshToken(req, res));

// Protected routes
router.get('/user', authenticate, (req, res) => authController.getUser(req, res));

export default router;