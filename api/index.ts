import express from 'express'
import { createServer } from 'vercel-express'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import SpotifyWebApi from 'spotify-web-api-node'
import axios from 'axios'
import 'dotenv/config'

const app = express()

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.YOUR_CLIENT_ID,
  clientSecret: process.env.YOUR_CLIENT_SECRET,
  redirectUri: process.env.YOUR_REDIRECT_URI,
  refreshToken: process.env.YOUR_REFRESH_TOKEN,
})

app.get('/', async (_, res) => {
  console.log('✅ Hit the root /api route')

  try {
    const data = await spotifyApi.refreshAccessToken()
    spotifyApi.setAccessToken(data.body['access_token'])

    const current = await spotifyApi.getMyCurrentPlayingTrack()
    console.log('🎵 Now playing response:', current.body)

    res.status(200).json(current.body)
  } catch (err) {
    console.error('❌ Spotify error:', err)
    res.status(500).json({ error: 'Spotify API failed' })
  }
})

module.exports = createServer(app)
