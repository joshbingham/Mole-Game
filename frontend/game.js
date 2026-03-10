const config = {
	type: Phaser.AUTO,
	width: 480,
	height: 640,
	physics: {
		default: 'arcade',
	},
	backgroundColor: '#F8B392',
	scene: [MenuScene, StartScene, GameScene, EndScene, LeaderboardScene],
};

const game = new Phaser.Game(config);