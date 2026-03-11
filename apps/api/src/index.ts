import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authMiddleware } from './middleware/auth'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Публічний роут
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tax Tracker API is running 🚀' })
})

// Захищений роут — тільки для авторизованих
app.get('/api/me', authMiddleware, (req: any, res) => {
  res.json({ userId: req.userId })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app