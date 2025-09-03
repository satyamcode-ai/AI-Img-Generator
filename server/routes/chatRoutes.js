import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createChat, deleteChat, getChats } from '../controller/chatController.js';
const chatRouter = express.Router();

chatRouter.post('/create',authMiddleware,createChat)
chatRouter.get('/get',authMiddleware,getChats)
chatRouter.post('/delete',authMiddleware,deleteChat)

export default chatRouter;