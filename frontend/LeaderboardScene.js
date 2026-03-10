class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LeaderboardScene' });
  }

  async create() {
    this.add.text(240, 100, 'Leaderboard', {
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Fetch scores from your local server
    fetch("http://localhost:3000/scores")
    .then(response => response.json())
    .then(data => {

        console.log("Scores received:", data);

        // sort highest score first
        data.sort((a, b) => b.score - a.score);

        // take top 10
        const topScores = data.slice(0, 10);

        // display them
        topScores.forEach((entry, index) => {
        const text = `${index + 1}. ${entry.name} - ${entry.score}`;
        this.add.text(240, 150 + index * 40, text, {
            fontSize: "24px",
            color: "#ffff00"
        }).setOrigin(0.5);
        });

    })
    .catch(error => {
        console.error("Error fetching scores:", error);
        this.add.text(240, 200, 'Unable to load scores', { fontSize: '24px', color: '#ff0000' }).setOrigin(0.5);
    });

    // Display scores
    scores.forEach((entry, index) => {
      this.add.text(240, 200 + index * 40, `${index + 1}. ${entry.name} – ${entry.score} pts`, {
        fontSize: '28px',
        color: '#ffffff'
      }).setOrigin(0.5);
    });

    // Back to Menu button
    const backButton = this.add.text(240, 650, 'Back to Menu', {
      fontSize: '32px',
      color: '#ff4444'
    }).setOrigin(0.5).setInteractive();

    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}