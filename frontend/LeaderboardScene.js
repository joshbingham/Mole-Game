class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LeaderboardScene' });
  }

  async create() {
    // Title
    this.add.text(240, 80, 'Leaderboard', {
        fontSize: '48px',
        fontStyle: 'bold',
        color: '#ffcc00',
        stroke: '#000000',
        strokeThickness: 6
    }).setOrigin(0.5);

    // Fetch scores from backend
    let scores = [];
    try {
        const response = await fetch("http://localhost:3000/scores");
        scores = await response.json();

        // Sort descending by score
        scores.sort((a, b) => b.score - a.score);

        // Take top 10
        const topScores = scores.slice(0, 10);

        // Display each score
        topScores.forEach((entry, index) => {
        const text = `${index + 1}. ${entry.name} - ${entry.score}`;
        this.add.text(240, 150 + index * 40, text, {
            fontSize: '24px',
            color: '#ffff00'
        }).setOrigin(0.5);
        });

    } catch (err) {
        console.error('Failed to fetch scores:', err);
        this.add.text(240, 200, 'Unable to load scores', {
        fontSize: '24px',
        color: '#ff0000'
        }).setOrigin(0.5);
    }

    // Back to Menu button
    const backButton = this.add.text(240, 600, 'Back to Menu', {
        fontSize: '28px',
        color: '#00ccff'
    }).setOrigin(0.5).setInteractive();

    backButton.on('pointerdown', () => {
        this.scene.start('MenuScene');
    });
  }
}