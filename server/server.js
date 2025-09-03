import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/db.js'
import authRouter from './routes/authRoutes.js'
import cookieParser from "cookie-parser"
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebhooks } from './controller/webhooks.js'

const app = express()
await connectDB()

// middlewares

app.use(cors())
app.use(express.json())
app.use(cookieParser());

const PORT = process.env.PORT || 8000

app.post('/api/stripe',express.raw({type: 'application/json'}),stripeWebhooks)

app.use('/api/auth',authRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credit',creditRouter)

app.get('/',(req,res)=>{
    res.send('server is live...!')
})

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})