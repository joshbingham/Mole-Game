# Mole Unearther 🎮

Mole Unearther is a browser-based game where players dig up moles to score points and compete on a live leaderboard.

The project combines a **Phaser.js game frontend** with a **Node.js/Express backend** and a **Supabase PostgreSQL database** to store scores.

## Live Demo

Play the game here:

https://mole-unearther-game.netlify.app

## Features

- Interactive browser game built with Phaser
- Submit your name and score after each game
- Global leaderboard showing the top 10 scores
- Backend API for score submission and retrieval
- Persistent score storage using Supabase (PostgreSQL)
- Responsive UI elements for different screen sizes
- Loading animation while leaderboard data loads
- Uptime monitoring to prevent backend cold starts

## Tech Stack

### Frontend
- JavaScript
- Phaser 3
- HTML / CSS

### Backend
- Node.js
- Express.js
- REST API

### Database
- Supabase
- PostgreSQL
- Row Level Security (RLS)

### Deployment
- Netlify (frontend)
- Render (backend)
- Supabase (database)

### DevOps
- Environment variables for API keys
- `.gitignore` to protect secrets
- Uptime monitoring to keep backend active

## How It Works

1. The player starts the game in the browser.
2. After the game ends, the player enters their name.
3. The frontend sends a POST request to the backend API.
4. The backend inserts the score into the Supabase PostgreSQL database.
5. The leaderboard fetches the top 10 scores from the backend.

## API Endpoints

### Submit Score

POST `/scores`

Example request body:

```json
{
  "name": "Player1",
  "score": 120
}