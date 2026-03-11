class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Title
    this.add.text(240, 150, 'Mole Unearther', {
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Play Game button
    const playButton = this.add.text(240, 320, 'Play Game', {
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 6,
      backgroundColor: '#553a1f',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    playButton.on('pointerover', () => playButton.setScale(1.1));
    playButton.on('pointerout', () => playButton.setScale(1));

    playButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Leaderboard button
    const leaderboardButton = this.add.text(240, 400, 'Leaderboard', {
      fontSize: '32px',
      color: '#00ccff'
    }).setOrigin(0.5).setInteractive();

    leaderboardButton.on('pointerdown', () => {
      this.scene.start('LeaderboardScene');
    });
  }
}