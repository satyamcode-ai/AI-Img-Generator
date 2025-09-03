import express from 'express';
import { registerUser , login , logout, getUserData, getPublishedImages } from '../controller/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register',registerUser)
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/data',authMiddleware, getUserData);
authRouter.get('/published-images', getPublishedImages);

export default authRouter;