require('dotenv').config(); // Load env variables
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Health check
app.get('/', (req, res) => {
  res.send('Mole Game API running with Supabase!');
});

// Get top 10 scores
app.get('/scores/top10', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (error) throw error;

    console.log("Fetched top10 scores:", data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top scores' });
  }
});

// Add a new score
app.post('/scores', async (req, res) => {
  const { name, score } = req.body;

  try {
    const { data, error } = await supabase
      .from('scores')
      .insert([{ name, score, date: new Date() }]);

    if (error) throw error;

    res.json({ message: 'Score saved successfully', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));