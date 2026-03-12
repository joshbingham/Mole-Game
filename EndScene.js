class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }

  preload() {
    this.load.image('endScreen', 'https://content.codecademy.com/courses/learn-phaser/mole-unearther/game-over.png');
  }

  create(data) {
    const finalScore = data.finalScore ?? 0;

    // Display final score
    this.add.text(240, 150, `Your Score: ${finalScore}`, {
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Instruction text
    const instructionText = this.add.text(240, 220, 'Enter your name:', {
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // HTML input element
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Your name';
    Object.assign(nameInput.style, {
      position: 'absolute',
      width: '240px',
      fontSize: '24px',
      padding: '8px',
      borderRadius: '12px',
      border: '3px solid #ffcc00',
      backgroundColor: '#553a1f',
      color: '#ffcc00',
      fontWeight: 'bold',
      zIndex: 9999
    });
    document.body.appendChild(nameInput);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit Score';
    Object.assign(submitButton.style, {
      position: 'absolute',
      width: '160px',
      fontSize: '20px',
      padding: '8px',
      borderRadius: '12px',
      border: '3px solid #ffcc00',
      backgroundColor: '#ffcc00',
      color: '#553a1f',
      fontWeight: 'bold',
      cursor: 'pointer',
      zIndex: 9999
    });
    submitButton.onmouseover = () => submitButton.style.backgroundColor = '#ffd633';
    submitButton.onmouseout = () => submitButton.style.backgroundColor = '#ffcc00';
    document.body.appendChild(submitButton);

    // Loading text
    const loadingText = this.add.text(240, 280, 'Saving score...', {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5).setVisible(false);

    // Center input and button
    const centerElements = () => {
      const canvasRect = this.game.canvas.getBoundingClientRect();
      const centerX = canvasRect.left + canvasRect.width / 2;
      const topY = canvasRect.top;

      nameInput.style.top = `${topY + instructionText.y + 140}px`;
      nameInput.style.left = `${centerX - nameInput.offsetWidth / 2}px`;

      submitButton.style.top = `${topY + instructionText.y + 210}px`;
      submitButton.style.left = `${centerX - submitButton.offsetWidth / 2}px`;
    };
    centerElements();
    window.addEventListener('resize', centerElements);

    // Submit handler
    submitButton.addEventListener('click', async () => {
      const playerName = nameInput.value.trim() || 'Player 1';
      loadingText.setVisible(true);
      submitButton.disabled = true;
      nameInput.disabled = true;

      try {
        const response = await fetch("https://mole-unearther.onrender.com/scores", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: playerName, score: finalScore })
        });

        const result = await response.json();
        console.log('Score saved:', result);

        // Cleanup and move to leaderboard
        nameInput.remove();
        submitButton.remove();
        this.scene.start('LeaderboardScene');
      } catch (err) {
        console.error('Failed to save score:', err);
        loadingText.setText('Failed to save. Try again.');
        submitButton.disabled = false;
        nameInput.disabled = false;
      }
    });

    // Menu button
    const menuButton = this.add.text(240, 420, 'Back to Menu', {
      fontSize: '28px',
      color: '#00ccff'
    }).setOrigin(0.5).setInteractive();
    menuButton.on('pointerdown', () => {
      nameInput.remove();
      submitButton.remove();
      this.scene.start('MenuScene');
    });

    // Play Again button
    const playAgainButton = this.add.text(240, 470, 'Play Again', {
      fontSize: '28px',
      color: '#00ff00'
    }).setOrigin(0.5).setInteractive();
    playAgainButton.on('pointerdown', () => {
      nameInput.remove();
      submitButton.remove();
      this.scene.start('GameScene');
    });

    // Ensure the Phaser canvas is always above HTML input
    this.game.canvas.style.zIndex = 1;
  }
}

