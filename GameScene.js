// Stores game state variables
let timeLeft = 30;
let score = 0;
let isPaused = false;
let currentBurrowKey = null;
let comboStreak = 0;
let moleMoveDelay = 1500;

const gameState = {};

// calculate points earned based on combo streak
const calculatePoints = () => {
  if (comboStreak >= 15) return 15;
  if (comboStreak >= 10) return 10;
  if (comboStreak >= 5) return 7;
  return 5;
};

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    this.burrowLocations = [
      { key: 'j', x: 100, y: 310 },
      { key: 'k', x: 240, y: 390 },
      { key: 'l', x: 380, y: 310 },
    ];
  }

  preload() {
    this.load.image('background', 'https://content.codecademy.com/courses/learn-phaser/mole-unearther/background.png');
    this.load.spritesheet('mole', 'https://content.codecademy.com/courses/learn-phaser/mole-unearther/mole-sprite.png', { frameWidth: 198, frameHeight: 250 });
    this.load.image('dirt', 'https://i.postimg.cc/3x3QmFJx/brown.png');
  }

  create() {
    // reset game variables
    score = 0;
    timeLeft = 30;
    comboStreak = 0;
    moleMoveDelay = 1500;
    currentBurrowKey = null;
    isPaused = false;

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

  applyHitReward() {
    const pointsEarned = calculatePoints();
    score += pointsEarned;
    this.updateScoreText();

    // camera feedback
    this.cameras.main.shake(100, 0.01);
    if (comboStreak >= 15) this.cameras.main.flash(120, 255, 80, 80);
    else if (comboStreak >= 10) this.cameras.main.flash(120, 255, 200, 0);
    else if (comboStreak >= 5) this.cameras.main.flash(100, 255, 255, 150);
    else this.cameras.main.flash(100, 255, 255, 255);

    this.displayRewardText(pointsEarned);
  }

  applyMissPenalty() {
    this.cameras.main.shake(80, 0.004);
    this.cameras.main.flash(100, 255, 50, 50);

    this.tweens.add({
      targets: gameState.mole,
      angle: 10,
      duration: 80,
      yoyo: true,
      repeat: 2
    });

    this.displayPenaltyText();
    this.updateScoreText();
    score -= 5;
  }

  onBurrowHit(key) {
    if (key === currentBurrowKey) {
      this.emitDirtBurst();
      this.applyHitReward();
      comboStreak++;
      this.increaseDifficulty();

      if (comboStreak >= 10) gameState.mole.setTint(0xffcc00);
      if (comboStreak >= 15) gameState.mole.setTint(0xff4444);

      this.updateComboDisplay();
      this.checkComboMilestone();

      this.tweens.add({
        targets: gameState.mole,
        scaleX: 0.4,
        scaleY: 0.3,
        duration: 80,
        yoyo: true
      });

      this.relocateMole();
    } else {
      this.applyMissPenalty();
      comboStreak = 0;
      this.updateComboDisplay();
      gameState.mole.clearTint();
    }
  }

  togglePause() {
    isPaused = !isPaused;
    if (isPaused) this.displayPauseScreen();
    else this.removePauseScreen();
  }

  // ---------------------- UPDATE LOOP ----------------------

  update() {
    const activeElement = document.activeElement;
    const typing = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';

    if (!typing && !isPaused) {
      if (Phaser.Input.Keyboard.JustDown(gameState.jKey)) this.onBurrowHit('j');
      if (Phaser.Input.Keyboard.JustDown(gameState.kKey)) this.onBurrowHit('k');
      if (Phaser.Input.Keyboard.JustDown(gameState.lKey)) this.onBurrowHit('l');
    }

    if (Phaser.Input.Keyboard.JustDown(gameState.spaceKey)) this.togglePause();
  }

  // ---------------------- INITIALIZATION ----------------------

  initializeBackground() {
    const bg = this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.5);
    const scoreBox = this.add.rectangle(90, 70, 140, 90, 0xFFFFFF).setAlpha(0.5);
  }

  initializeScoreText() {
    gameState.scoreText = this.add.text(50, 50, `Score: ${score}`).setColor('#000000');
  }

  initializeComboText() {
    gameState.comboText = this.add.text(50, 140, `Combo: ${comboStreak}`, {
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffcc00',
      stroke: '#000',
      strokeThickness: 4
    });
  }

  initializeTimer() {
    gameState.timerText = this.add.text(50, 75, `Time: ${timeLeft}`).setColor('#000000');

    gameState.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!isPaused) {
          timeLeft--;
          this.updateTimerText();
          if (timeLeft <= 0) {
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
    gameState.jKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    gameState.kKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    gameState.lKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    gameState.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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
    gameState.mole = this.physics.add.sprite(0, 0, 'mole').setScale(0.5);
    this.updateBurrow();

    gameState.mole.on('animationcomplete-appear', () => gameState.mole.anims.play('idle'));
    gameState.mole.on('animationcomplete-disappear', () => this.updateBurrow());
  }

  initializeParticles() {
    gameState.dirtParticles = this.add.particles('dirt');
    gameState.dirtEmitter = gameState.dirtParticles.createEmitter({
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
    if (gameState.moleTimer) gameState.moleTimer.remove(false);

    gameState.moleTimer = this.time.addEvent({
      delay: Phaser.Math.Between(moleMoveDelay - 200, moleMoveDelay + 200),
      callback: () => { if (!isPaused) this.relocateMole(); },
      callbackScope: this,
      loop: true
    });
  }

  // ---------------------- MOLE LOGIC ----------------------

  increaseDifficulty() {
    moleMoveDelay = Math.max(500, moleMoveDelay - 50);
    this.startMoleMovement();
  }

  getRandomBurrow() {
    return Phaser.Utils.Array.GetRandom(this.burrowLocations);
  }

  updateBurrow() {
    const burrow = this.getRandomBurrow();
    currentBurrowKey = burrow.key;
    gameState.mole.setPosition(burrow.x, burrow.y);
    gameState.mole.anims.play('appear');
  }

  relocateMole() {
    if (gameState.mole) gameState.mole.anims.play('disappear');
  }

  emitDirtBurst() {
    const x = gameState.mole.x;
    const y = gameState.mole.y;

    let quantity = 20;
    if (comboStreak >= 15) quantity = 60;
    else if (comboStreak >= 10) quantity = 40;
    else if (comboStreak >= 5) quantity = 30;

    gameState.dirtEmitter.explode(quantity, x, y);
  }

  // ---------------------- UI UPDATES ----------------------

  updateScoreText() { gameState.scoreText.setText(`Score: ${score}`); }
  updateTimerText() { gameState.timerText.setText(`Time: ${timeLeft}`); }
  updateComboDisplay() { gameState.comboText.setText(`Combo: ${comboStreak}`); }

  displayRewardText(points) {
    const x = gameState.mole.x;
    const y = gameState.mole.y - 40;
    const rewardText = this.add.text(x, y, `+${points}`, {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#00ff00',
      stroke: '#003300',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.tweens.timeline({
      targets: rewardText,
      tweens: [
        { scale: 2, duration: 100, ease: 'Back.easeOut' },
        { y: y - 70, alpha: 0, scale: 1.2, angle: Phaser.Math.Between(-10,10), duration: 500, ease: 'Cubic.easeOut' }
      ],
      onComplete: () => rewardText.destroy()
    });
  }

  displayPenaltyText() {
    const x = gameState.mole.x;
    const y = gameState.mole.y - 40;
    const penaltyText = this.add.text(x, y, '-5', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ff4444',
      stroke: '#330000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.tweens.timeline({
      targets: penaltyText,
      tweens: [
        { scale: 1.6, duration: 100, ease: 'Back.easeOut' },
        { y: y + 60, alpha: 0, scale: 1, angle: Phaser.Math.Between(-15,15), duration: 500, ease: 'Cubic.easeOut' }
      ],
      onComplete: () => penaltyText.destroy()
    });
  }

  checkComboMilestone() {
    const milestone = [5, 10, 15];
    if (milestone.includes(comboStreak)) {
      const x = 240, y = 300;
      const text = this.add.text(x, y, `COMBO x${comboStreak}!`, {
        fontSize: '48px', fontStyle: 'bold', color: '#FFD700',
        stroke: '#FF8C00', strokeThickness: 8
      }).setOrigin(0.5);

      this.tweens.add({
        targets: text,
        scale: { from: 0, to: 1.5 },
        alpha: { from: 0, to: 1 },
        duration: 350,
        yoyo: true,
        onComplete: () => text.destroy()
      });

      this.cameras.main.shake(150, 0.02);
    }
  }

  // ---------------------- PAUSE SCREEN ----------------------

  displayPauseScreen() {
    gameState.pauseOverlay = this.add.rectangle(0, 0, 480, 640, 0xFFFFFF).setOrigin(0,0).setAlpha(0.75);
    gameState.pauseText = this.add.text(225, 325, 'PAUSED').setColor('#000000');
    gameState.resumeText = this.add.text(125, 375, 'Press space to resume game').setColor('#000000');
  }

  removePauseScreen() {
    gameState.pauseOverlay.destroy();
    gameState.pauseText.destroy();
    gameState.resumeText.destroy();
  }
}

