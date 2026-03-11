const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  backgroundColor: '#2d1b0f',

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  physics: {
    default: 'arcade'
  },

  scene: [MenuScene, StartScene, GameScene, EndScene, LeaderboardScene]
};

const game = new Phaser.Game(config);