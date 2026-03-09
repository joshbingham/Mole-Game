const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const scores = [];

app.get("/", (req, res) => {
  res.send("Mole Game API running");
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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});