import express from 'express'
import cors from 'cors'
import { config } from './config/config.js'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import leaderboardRoutes from './routes/leaderboardRoutes.js'
import gameHistoryRoutes from './routes/gameHistoryRoutes.js'
import puzzleRoutes from './routes/puzzleRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

connectDB()

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Fish Game Backend API is running smoothly',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/history', gameHistoryRoutes)
app.use('/api/puzzle', puzzleRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = config.port
app.listen(PORT, () => {
  console.log(`🌊 Fish Game Backend running in ${config.nodeEnv} mode on http://localhost:${PORT}`)
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`)
})
