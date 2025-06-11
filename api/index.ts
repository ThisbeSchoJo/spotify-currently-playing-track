import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node'
import axios from 'axios'
import 'dotenv/config'
import serverless from 'serverless-http'

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
    res.status(500).send('Internal Server Error')
  }
})

// 👇 THIS is the magic line Vercel needs
export default serverless(app)
