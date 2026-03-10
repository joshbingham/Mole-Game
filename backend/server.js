const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const scores = [];

app.get("/", (req, res) => {
  res.send("Mole Game API running");
});

app.get("/scores", (req, res) => {
  res.json(scores);
});

app.get("/scores/top10", (req, res) => {
  const top10 = scores
    .sort((a, b) => b.score - a.score) // descending order
    .slice(0, 10);
  res.json(top10);
});

app.post("/scores", (req, res) => {

  const { name, score } = req.body;

  const newScore = {
    name,
    score,
    date: new Date()
  };

  scores.push(newScore);

  console.log("New score added:", newScore);

  res.json({ message: "Score saved successfully" });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});