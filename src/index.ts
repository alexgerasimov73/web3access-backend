import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './router'
import { connectDB } from './config/db'

dotenv.config()

const PORT = process.env.PORT || 5001
const app = express()

connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)

const start = async () => {
	try {
		app.listen(PORT, () => console.log('alive'))
	} catch (error) {
		console.log(error)
	}
}

start()
