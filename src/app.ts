import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
const app = express()

app.use(express.json())

//ROUTES
//AUTHENTICATION
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
//USER



export default app

