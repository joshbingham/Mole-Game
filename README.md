Mole Unearther 🎯

A browser-based whack-a-mole-style game built with Phaser, Node.js, and PostgreSQL (Supabase), featuring a live leaderboard.

🚀 Live Demo

Frontend: https://joshbingham.github.io/Mole-Game/

Backend / API: https://mole-unearther.onrender.com/

⚠️ Note: The leaderboard may take a few seconds to load due to free hosting wake-up. Using an uptime monitor (like UptimeRobot) can improve responsiveness.

🕹️ Gameplay

Click Play Game to start.

Moles will pop up at random positions — hit them using j, k and l on your keyboard to score points.

At the end of the game, enter your name to submit your score.

View the Leaderboard to see the top 10 scores globally.

🛠️ Tech Stack

Frontend: Phaser 3, HTML, CSS, JavaScript

Backend: Node.js, Express

Database: PostgreSQL (via Supabase)

Hosting: GitHub Pages (frontend), Render (backend)

⚡ Features

Fully responsive Phaser game that scales to the viewport.

Live leaderboard backed by PostgreSQL (Supabase).

REST API built with Node.js and Express.

Real-time score submission.

Secure environment variables (.env) for API keys.

🏗️ Architecture Diagram
+-----------------+       HTTPS       +-----------------+
|   Frontend      | <--------------> |   Backend API    |
|  Phaser 3 Game  |                   | Node.js + Express|
+-----------------+                   +-----------------+
        |                                     |
        |                                     |
        v                                     v
+-----------------+                   +-----------------+
|   Supabase      | <--------------> |   Database      |
| PostgreSQL DB   |                   |  scores table   |
+-----------------+                   +-----------------+

Optional: Uptime Monitor (UptimeRobot)
Keeps Render backend awake to reduce leaderboard loading delays.
📝 Setup / Development
Backend

Clone the repo:

git clone https://github.com/joshbingham/Mole-Game.git
cd Mole-Game/backend

Install dependencies:

npm install

Create a .env file:

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

Run the server locally:

node server.js

The backend will be available at http://localhost:3000.

Frontend

Open index.html in a browser (or deploy via GitHub Pages).

The frontend communicates with the backend via:

fetch('https://mole-unearther.onrender.com/scores/top10')
💡 Notes / Considerations

Leaderboard Loading: Free tiers on Render may cause a slight delay when the backend “wakes up.”

Supabase Policies: Row-level security is enabled; INSERT and SELECT policies must allow your API key to read/write scores.

Environment Security: Ensure .env is in .gitignore to prevent exposing keys.

👨‍💻 Next Steps

Improve UI/UX (animations, sounds).

Add more levels or difficulty modes.

Add unit tests for backend routes.

Integrate a caching layer to reduce leaderboard load times.

📬 Contact

LinkedIn: https://www.linkedin.com/in/joshua-bingham-48961112b/

GitHub: https://github.com/joshbingham
