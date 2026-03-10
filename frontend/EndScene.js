class EndScene extends Phaser.Scene {
	constructor() {
		super({ key: 'EndScene' });
	}

	preload() {
		this.load.image('endScreen', 'https://content.codecademy.com/courses/learn-phaser/mole-unearther/game-over.png');
	}

	create() {

		sendScore("Player 1", score);

		const background = this.add.image(0, 0, 'endScreen');
		background.setOrigin(0);
		background.setScale(0.5);

		// display score
  		this.add.text(163, 470, `Your score is ${score}.`).setColor('#553a1f');

		// View Leaderboard button
		const leaderboardButton = this.add.text(240, 550, "View Leaderboard", {
			fontSize: "28px",
			color: "#0000ff"
		}).setOrigin(0.5).setInteractive();

		leaderboardButton.on("pointerdown", () => {
			this.scene.start("LeaderboardScene");
		});

		this.input.on('pointerup', () => {
			score = 0;
			timeLeft = 30;
			isPaused = false;

			this.scene.start('MenuScene');
			this.scene.stop('EndScene');
		});

		this.add.text(163, 470, `Your score is ${score}.`).setColor('#553a1f');
	}
}

function sendScore(name, score) {

	fetch("http://localhost:3000/scores", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			name: name,
			score: score
		})
	})
	.then(response => response.json())
	.then(data => {
		console.log("Score saved:", data);
	})
	.catch(error => {
		console.error("Error saving score:", error);
	});

}