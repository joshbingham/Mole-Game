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

    // Fetch top scores from API
    let scores = [];
    try {
      const response = await fetch('https://your-backend.com/api/scores/top10');
      scores = await response.json();
    } catch (err) {
      console.error('Failed to fetch scores:', err);
      this.add.text(240, 200, 'Unable to load scores', { fontSize: '24px', color: '#ff0000' }).setOrigin(0.5);
    }

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