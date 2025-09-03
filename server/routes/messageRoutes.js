import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { imageMessageController, textMessageController } from '../controller/messageController.js';

const messageRouter = express.Router();

messageRouter.post('/text',authMiddleware,textMessageController)

messageRouter.post('/image',authMiddleware,imageMessageController)


export default messageRouter;