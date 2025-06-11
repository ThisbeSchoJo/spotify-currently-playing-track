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
console.log('CLIENT_ID:', process.env.YOUR_CLIENT_ID)
console.log('REDIRECT_URI:', process.env.YOUR_REDIRECT_URI)
console.log('REFRESH_TOKEN:', process.env.YOUR_REFRESH_TOKEN)


app.get('/', async (_, res) => {
  console.log('✅ Hit the root /api route')

  try {
    const data = await spotifyApi.refreshAccessToken()
    spotifyApi.setAccessToken(data.body['access_token'])

    const current = await spotifyApi.getMyCurrentPlayingTrack()
    console.log('🎵 Now playing response:', current.body)

    res.status(200).json(current.body)
  } catch (error: any) {
    console.error('Error while fetching current playing track:', error.message)
    console.error(error.stack)
    res.status(500).send('Internal Server Error')
    return
  }
})

export default app