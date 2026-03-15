import { Router, type Response } from 'express'
import { prisma } from '../config/prisma'
import { authMiddleware, type AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const trades = await prisma.trade.findMany({
      where: { userId: req.userId! },
      orderBy: { date: 'desc' },
    })
    res.json(trades)
  } catch (error) {
    console.error('GET /trades error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { ticker, type, quantity, price, currency, date } = req.body
    const trade = await prisma.trade.create({
      data: {
        ticker,
        type,
        quantity: Number(quantity),
        price: Number(price),
        currency: currency || 'USD',
        date: new Date(date),
        userId: req.userId!,
      },
    })
    res.json(trade)
  } catch (error) {
    console.error('POST /trades error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { ticker, type, quantity, price, currency, date } = req.body
    const trade = await prisma.trade.update({
      where: { id: req.params.id, userId: req.userId! },
      data: {
        ticker,
        type,
        quantity: Number(quantity),
        price: Number(price),
        currency: currency || 'USD',
        date: new Date(date),
      },
    })
    res.json(trade)
  } catch (error) {
    console.error('PUT /trades error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.trade.delete({
      where: { id: req.params.id, userId: req.userId! },
    })
    res.json({ success: true })
  } catch (error) {
    console.error('DELETE /trades error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
