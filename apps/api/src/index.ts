import express, { type Request, type Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authMiddleware, type AuthRequest } from './middleware/auth'
import dividendsRouter from './routes/dividends'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Tax Tracker API is running 🚀' })
})

app.get('/api/me', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ userId: req.userId })
})

app.use('/api/dividends', dividendsRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app
