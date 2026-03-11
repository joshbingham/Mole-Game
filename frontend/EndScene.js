class EndScene extends Phaser.Scene {
	constructor() {
		super({ key: 'EndScene' });
	}

	preload() {
		this.load.image('endScreen', 'https://content.codecademy.com/courses/learn-phaser/mole-unearther/game-over.png');
	}

	create() {
		// Display final score
		this.add.text(240, 150, `Your Score: ${score}`, {
			fontSize: '48px',
			fontStyle: 'bold',
			color: '#ffcc00',
			stroke: '#000000',
			strokeThickness: 6
		}).setOrigin(0.5);

		// Instruction to enter name
		const instructionText = this.add.text(240, 220, 'Enter your name:', {
			fontSize: '28px',
			fontStyle: 'bold',
			color: '#ffcc00',
			stroke: '#000000',
			strokeThickness: 4
		}).setOrigin(0.5);

		// Create HTML input element for name
		const nameInput = document.createElement('input');
		nameInput.type = 'text';
		nameInput.placeholder = 'Your name';
		nameInput.style.position = 'absolute';
		nameInput.style.width = '240px';
		nameInput.style.fontSize = '24px';
		nameInput.style.padding = '8px';
		nameInput.style.borderRadius = '12px';
		nameInput.style.border = '3px solid #ffcc00';
		nameInput.style.backgroundColor = '#553a1f';
		nameInput.style.color = '#ffcc00';
		nameInput.style.fontWeight = 'bold';
		document.body.appendChild(nameInput);

		// Submit button
		const submitButton = document.createElement('button');
		submitButton.innerText = 'Submit Score';
		submitButton.style.position = 'absolute';
		submitButton.style.width = '160px';
		submitButton.style.fontSize = '20px';
		submitButton.style.padding = '8px';
		submitButton.style.borderRadius = '12px';
		submitButton.style.border = '3px solid #ffcc00';
		submitButton.style.backgroundColor = '#ffcc00';
		submitButton.style.color = '#553a1f';
		submitButton.style.fontWeight = 'bold';
		submitButton.style.cursor = 'pointer';

		// Hover effect
		submitButton.onmouseover = () => { submitButton.style.backgroundColor = '#ffd633'; }
		submitButton.onmouseout = () => { submitButton.style.backgroundColor = '#ffcc00'; }

		document.body.appendChild(submitButton);

		// Center input and button relative to Phaser canvas coordinates
		function centerInputAndButton() {
		const canvasRect = this.game.canvas.getBoundingClientRect();

		// Phaser canvas center
		const canvasCenterX = canvasRect.left + this.game.config.width / 2;
		const canvasTop = canvasRect.top;

		// Input slightly below instruction text
		nameInput.style.top = canvasTop + instructionText.y + 50 + 'px';
		nameInput.style.left = canvasCenterX - nameInput.offsetWidth / 2 + 'px';

		// Submit button slightly below input
		submitButton.style.top = canvasTop + instructionText.y + 110 + 'px';
		submitButton.style.left = canvasCenterX - submitButton.offsetWidth / 2 + 'px';
		}

		// Call once at create
		centerInputAndButton.call(this);

		// Optional: adjust on window resize
		window.addEventListener('resize', () => {
		centerInputAndButton.call(this);
		});

		// Submit button click
		submitButton.addEventListener('click', async () => {
			const playerName = nameInput.value.trim() || 'Player 1';

			try {
				const response = await fetch("https://mole-unearther.onrender.com/scores", {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name: playerName, score })
				});

				const result = await response.json();
				console.log('Score saved:', result);

				// Clean up HTML elements
				nameInput.remove();
				submitButton.remove();

				// Go to leaderboard
				this.scene.start('LeaderboardScene');
			} catch (err) {
				console.error('Failed to save score:', err);
			}
		});

		// Optional: Back to Menu button
		const menuButton = this.add.text(240, 420, 'Back to Menu', {
			fontSize: '28px',
			color: '#00ccff'
		}).setOrigin(0.5).setInteractive();

		menuButton.on('pointerdown', () => {
			nameInput.remove();
			submitButton.remove();
			this.scene.start('MenuScene');
		});

		const playAgainButton = this.add.text(240, 470, 'Play Again', {
			fontSize: '28px',
			color: '#00ff00'
		}).setOrigin(0.5).setInteractive();

		playAgainButton.on('pointerdown', () => {
			nameInput.remove();
			submitButton.remove();
			this.scene.start('GameScene');
		});
	}
}

