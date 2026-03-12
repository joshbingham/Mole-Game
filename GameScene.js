class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    // Burrow locations and initial game state
    this.burrowLocations = [
      { key: 'j', x: 100, y: 310 },
      { key: 'k', x: 240, y: 390 },
      { key: 'l', x: 380, y: 310 }
    ];

    this.timeLeft = 30;
    this.score = 0;
    this.comboStreak = 0;
    this.moleMoveDelay = 1500;
    this.currentBurrowKey = null;
    this.isPaused = false;
  }

  preload() {
    this.load.image('background', 'https://content.codecademy.com/courses/learn-phaser/mole-unearther/background.png');
    this.load.spritesheet('mole', 'https://content.codecademy.com/courses/learn-phaser/mole-unearther/mole-sprite.png', { frameWidth: 198, frameHeight: 250 });
    this.load.image('dirt', 'https://i.postimg.cc/3x3QmFJx/brown.png');
  }

  create() {
    // Initialize scene visuals and logic
    this.initializeBackground();
    this.initializeScoreText();
    this.initializeComboText();
    this.initializeTimer();
    this.initializeBurrowKeys();
    this.initializeAnimations();
    this.initializeMole();
    this.startMoleMovement();
    this.initializeParticles();
  }

  // ---------------------- CLASS METHODS ----------------------

  calculatePoints() {
    if (this.comboStreak >= 15) return 15;
    if (this.comboStreak >= 10) return 10;
    if (this.comboStreak >= 5) return 7;
    return 5;
  }

  applyHitReward() {
    const points = this.calculatePoints();
    this.score += points;
    this.updateScoreText();

    // Camera feedback
    this.cameras.main.shake(100, 0.01);
    if (this.comboStreak >= 15) this.cameras.main.flash(120, 255, 80, 80);
    else if (this.comboStreak >= 10) this.cameras.main.flash(120, 255, 200, 0);
    else if (this.comboStreak >= 5) this.cameras.main.flash(100, 255, 255, 150);
    else this.cameras.main.flash(100, 255, 255, 255);

    this.displayRewardText(points);
  }

  applyMissPenalty() {
    this.cameras.main.shake(80, 0.004);
    this.cameras.main.flash(100, 255, 50, 50);

    this.tweens.add({
      targets: this.mole,
      angle: 10,
      duration: 80,
      yoyo: true,
      repeat: 2
    });

    this.displayPenaltyText();
    this.score -= 5;
    this.updateScoreText();
  }

  onBurrowHit(key) {
    if (key === this.currentBurrowKey) {
      this.emitDirtBurst();
      this.applyHitReward();
      this.comboStreak++;
      this.increaseDifficulty();

      if (this.comboStreak >= 10) this.mole.setTint(0xffcc00);
      if (this.comboStreak >= 15) this.mole.setTint(0xff4444);

      this.updateComboDisplay();
      this.checkComboMilestone();

      this.tweens.add({
        targets: this.mole,
        scaleX: 0.4,
        scaleY: 0.3,
        duration: 80,
        yoyo: true
      });

      this.relocateMole();
    } else {
      this.applyMissPenalty();
      this.comboStreak = 0;
      this.updateComboDisplay();
      this.mole.clearTint();
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) this.displayPauseScreen();
    else this.removePauseScreen();
  }

  // ---------------------- UPDATE LOOP ----------------------

  update() {
    const activeEl = document.activeElement;
    const typing = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA';

    if (!typing && !this.isPaused) {
      if (Phaser.Input.Keyboard.JustDown(this.jKey)) this.onBurrowHit('j');
      if (Phaser.Input.Keyboard.JustDown(this.kKey)) this.onBurrowHit('k');
      if (Phaser.Input.Keyboard.JustDown(this.lKey)) this.onBurrowHit('l');
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.togglePause();
  }

  // ---------------------- INITIALIZATION ----------------------

  initializeBackground() {
    this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.5);
    this.add.rectangle(90, 70, 140, 90, 0xFFFFFF).setAlpha(0.5);
  }

  initializeScoreText() {
    this.scoreText = this.add.text(50, 50, `Score: ${this.score}`).setColor('#000000');
  }

  initializeComboText() {
    this.comboText = this.add.text(50, 140, `Combo: ${this.comboStreak}`, {
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffcc00',
      stroke: '#000',
      strokeThickness: 4
    });
  }

  initializeTimer() {
    this.timerText = this.add.text(50, 75, `Time: ${this.timeLeft}`).setColor('#000000');

    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.isPaused) {
          this.timeLeft--;
          this.updateTimerText();
          if (this.timeLeft <= 0) {
            this.scene.stop('GameScene');
            this.scene.start('EndScene');
          }
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  initializeBurrowKeys() {
    this.jKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.kKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.lKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.burrowLocations.forEach(b => {
      this.add.text(b.x - 10, b.y + 70, b.key.toUpperCase(), { fontSize: 32, color: '#553a1f' });
    });
  }

  initializeAnimations() {
    this.anims.create({ key: 'appear', frames: this.anims.generateFrameNumbers('mole', { start: 0, end: 2 }), frameRate: 10 });
    this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('mole', { frames: [1,3,1,1,4] }), frameRate: 3, repeat: -1 });
    this.anims.create({ key: 'disappear', frames: this.anims.generateFrameNumbers('mole', { frames: [5,6,6,5,2,1,0] }), frameRate: 15 });
  }

  initializeMole() {
    this.mole = this.physics.add.sprite(0, 0, 'mole').setScale(0.5);
    this.updateBurrow();

    this.mole.on('animationcomplete-appear', () => this.mole.anims.play('idle'));
    this.mole.on('animationcomplete-disappear', () => this.updateBurrow());
  }

  initializeParticles() {
    this.dirtParticles = this.add.particles('dirt');
    this.dirtEmitter = this.dirtParticles.createEmitter({
      speed: { min: -200, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.6, end: 0 },
      lifespan: 500,
      gravityY: 300,
      quantity: 10,
      tint: [0x8B4513, 0x5C4033, 0xA0522D],
      on: false
    });
  }

  startMoleMovement() {
    if (this.moleTimer) this.moleTimer.remove(false);

    this.moleTimer = this.time.addEvent({
      delay: Phaser.Math.Between(this.moleMoveDelay - 200, this.moleMoveDelay + 200),
      callback: () => { if (!this.isPaused) this.relocateMole(); },
      callbackScope: this,
      loop: true
    });
  }

  // ---------------------- MOLE LOGIC ----------------------

  increaseDifficulty() {
    this.moleMoveDelay = Math.max(500, this.moleMoveDelay - 50);
    this.startMoleMovement();
  }

  getRandomBurrow() {
    return Phaser.Utils.Array.GetRandom(this.burrowLocations);
  }

  updateBurrow() {
    const burrow = this.getRandomBurrow();
    this.currentBurrowKey = burrow.key;
    this.mole.setPosition(burrow.x, burrow.y);
    this.mole.anims.play('appear');
  }

  relocateMole() {
    if (this.mole) this.mole.anims.play('disappear');
  }

  emitDirtBurst() {
    let quantity = 20;
    if (this.comboStreak >= 15) quantity = 60;
    else if (this.comboStreak >= 10) quantity = 40;
    else if (this.comboStreak >= 5) quantity = 30;

    this.dirtEmitter.explode(quantity, this.mole.x, this.mole.y);
  }

  // ---------------------- UI UPDATES ----------------------

  updateScoreText() { this.scoreText.setText(`Score: ${this.score}`); }
  updateTimerText() { this.timerText.setText(`Time: ${this.timeLeft}`); }
  updateComboDisplay() { this.comboText.setText(`Combo: ${this.comboStreak}`); }

  displayRewardText(points) {
    const x = this.mole.x, y = this.mole.y - 40;
    const text = this.add.text(x, y, `+${points}`, { fontSize: '32px', fontStyle: 'bold', color: '#00ff00', stroke: '#003300', strokeThickness: 6 }).setOrigin(0.5);

    this.tweens.timeline({
      targets: text,
      tweens: [
        { scale: 2, duration: 100, ease: 'Back.easeOut' },
        { y: y - 70, alpha: 0, scale: 1.2, angle: Phaser.Math.Between(-10, 10), duration: 500, ease: 'Cubic.easeOut' }
      ],
      onComplete: () => text.destroy()
    });
  }

  displayPenaltyText() {
    const x = this.mole.x, y = this.mole.y - 40;
    const text = this.add.text(x, y, '-5', { fontSize: '32px', fontStyle: 'bold', color: '#ff4444', stroke: '#330000', strokeThickness: 6 }).setOrigin(0.5);

    this.tweens.timeline({
      targets: text,
      tweens: [
        { scale: 1.6, duration: 100, ease: 'Back.easeOut' },
        { y: y + 60, alpha: 0, scale: 1, angle: Phaser.Math.Between(-15, 15), duration: 500, ease: 'Cubic.easeOut' }
      ],
      onComplete: () => text.destroy()
    });
  }

  checkComboMilestone() {
    const milestones = [5, 10, 15];
    if (milestones.includes(this.comboStreak)) {
      const x = 240, y = 300;
      const text = this.add.text(x, y, `COMBO x${this.comboStreak}!`, { fontSize: '48px', fontStyle: 'bold', color: '#FFD700', stroke: '#FF8C00', strokeThickness: 8 }).setOrigin(0.5);

      this.tweens.add({ targets: text, scale: { from: 0, to: 1.5 }, alpha: { from: 0, to: 1 }, duration: 350, yoyo: true, onComplete: () => text.destroy() });
      this.cameras.main.shake(150, 0.02);
    }
  }

  // ---------------------- PAUSE SCREEN ----------------------

  displayPauseScreen() {
    this.pauseOverlay = this.add.rectangle(0, 0, 480, 640, 0xFFFFFF).setOrigin(0,0).setAlpha(0.75);
    this.pauseText = this.add.text(225, 325, 'PAUSED').setColor('#000000');
    this.resumeText = this.add.text(125, 375, 'Press space to resume game').setColor('#000000');
  }

  removePauseScreen() {
    this.pauseOverlay.destroy();
    this.pauseText.destroy();
    this.resumeText.destroy();
  }
}

