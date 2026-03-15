import { Router } from 'express'
import { prisma } from '../config/prisma'
import { authMiddleware, type AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const dividends = await prisma.dividend.findMany({
      where: { userId: req.userId! },
      orderBy: { date: 'desc' },
    })
    res.json(dividends)
  } catch (error) {
    console.error('GET /dividends error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { ticker, date, value, currency, withholding, valuePln, withholdingPln } = req.body
    const dividend = await prisma.dividend.create({
      data: {
        ticker,
        date: new Date(date),
        value: Number(value),
        currency: currency || 'USD',
        withholding: Number(withholding) || 0,
        valuePln: valuePln ? Number(valuePln) : null,
        withholdingPln: withholdingPln ? Number(withholdingPln) : null,
        userId: req.userId!,
      },
    })
    res.json(dividend)
  } catch (error) {
    console.error('POST /dividends error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { ticker, date, value, currency, withholding, valuePln, withholdingPln } = req.body
    const dividend = await prisma.dividend.update({
      where: { id: req.params.id, userId: req.userId! },
      data: {
        ticker,
        date: new Date(date),
        value: Number(value),
        currency: currency || 'USD',
        withholding: Number(withholding) || 0,
        valuePln: valuePln ? Number(valuePln) : null,
        withholdingPln: withholdingPln ? Number(withholdingPln) : null,
      },
    })
    res.json(dividend)
  } catch (error) {
    console.error('PUT /dividends error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await prisma.dividend.delete({
      where: { id: req.params.id, userId: req.userId! },
    })
    res.json({ success: true })
  } catch (error) {
    console.error('DELETE /dividends error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
