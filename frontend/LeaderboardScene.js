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

    try {

      const response = await fetch("https://mole-unearther.onrender.com/scores/top10");
      const scores = await response.json();

      console.log("Leaderboard scores:", scores);

      scores.forEach((entry, index) => {

        let prefix = `${index + 1}.`;

        if (index === 0) prefix = "🥇";
        if (index === 1) prefix = "🥈";
        if (index === 2) prefix = "🥉";

        const text = `${prefix} ${entry.name} - ${entry.score}`;

        this.add.text(240, 150 + index * 40, text, {
          fontSize: '26px',
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

    // Back button
    const backButton = this.add.text(240, 600, 'Back to Menu', {
      fontSize: '28px',
      color: '#00ccff'
    }).setOrigin(0.5).setInteractive();

    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

  }
}