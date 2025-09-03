import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getPlans, purchasePlan } from '../controller/creditController.js';


const creditRouter = express.Router();

creditRouter.get('/plan', getPlans)
creditRouter.post('/purchase',authMiddleware, purchasePlan)

export default creditRouter;