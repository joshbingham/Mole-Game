// Stores the current "key" location of the mole
let timeLeft = 30;
let score = 0;
let isPaused = false;
let currentBurrowKey;
// initialise comboStreak to 0, which will keep track of how many times in a row the user has successfully hit the mole
let comboStreak = 0;
// updates the combo display to show the current comboStreak
function handleHit() {
  comboStreak++;
  updateComboDisplay();
}
// resets comboStreak to 0 if user misses the mole and updates the display
function handleMiss() {
  comboStreak = 0;
  updateComboDisplay();
}

// calculate points earned based on combo streak
const calculatePoints = () => {
  if (comboStreak >= 15) return 15; // big combo
  if (comboStreak >= 10) return 10;
  if (comboStreak >= 5) return 7;
  return 5; // base points
};

const gameState = {};

class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameScene' });

		// list of all burrow locations
		// each location contains a corresponding key on the keyboard,
		// and the x and y pixel coordinates on the screen
		this.burrowLocations = [{
			key: 'j',
			x: 100,
			y: 310,
		},
		{
			key: 'k',
			x: 240,
			y: 390,
		},
		{
			key: 'l',
			x: 380,
			y: 310,
		}];
	}

	// import all of the visual assets we will use throughout the game
	preload() {
		// calls the image function to load in the background, and assigns the image to the field key
		// the background is loaded from the given url
		this.load.image('background', 'https://content.codecademy.com/courses/learn-phaser/mole-unearther/background.png');
		// calls the spritesheet function to load in the mole as a spritesheet to make animations, and assigns it to the mole key
		// the mole is loaded from the given url with the given width and height
		this.load.spritesheet('mole',
			'https://content.codecademy.com/courses/learn-phaser/mole-unearther/mole-sprite.png',
			{ frameWidth: 198, frameHeight: 250 });
		// dirt particle that will be emitted when mole is hit
		this.load.image(
			'dirt',
			'https://labs.phaser.io/assets/particles/brown.png'
			);
	}

	// set up scene visuals, animations, and game logic when events occur
	create() {
    // update timer 
    const updateTimer = () => {
      timeLeft -= 1;
    };

		// executed after every second passes
		const onSecondElapsed = () => {
			if (isPaused === false) {
        // elapse one second
        updateTimer();

				// display the new time to the user
				this.updateTimerText();
			}
		};

		// display background
		this.initializeBackground();

		// set up score text
		this.initializeScoreText();

		// set up combo text
		this.initializeComboText();

		// go through each burrow and set up key listeners on the corresponding key
		this.initializeBurrowKeys();

		// set up animation callbacks
		this.initializeAnimations();

		// set up mole and place in first location
		this.initializeMole();

		// set up text for timer and callback for countdown
		this.initializeTimer(onSecondElapsed);

		// set up particle emitter for dirt when mole is hit
		this.initializeParticles();
	}

	// periodically checks and handles user input by updating game logic
	update() {
		if (timeLeft <= 0) {
			// Provided for user
			this.scene.stop('GameScene');
			this.scene.start('EndScene');
		}

		// update score
		const updateScore = (points) => {
			score += points;
		};
		// user successfully hit the mole, so reward the user with 5pts
		const applyHitReward = () => {
			// shake and flash camera to provide feedback on successful hit
			this.cameras.main.shake(100, 0.01);
			if (comboStreak >= 15) {
			this.cameras.main.flash(120, 255, 80, 80); // red
			} else if (comboStreak >= 10) {
			this.cameras.main.flash(120, 255, 200, 0); // gold
			} else if (comboStreak >= 5) {
			this.cameras.main.flash(100, 255, 255, 150); // yellow
			} else {
			this.cameras.main.flash(100, 255, 255, 255);
			}

			// calculate combo-based points
			const pointsEarned = calculatePoints();

			// display how many points the user will gain taking into account combo streak
			this.displayRewardText(pointsEarned);

			// display the new score to the user
			score += pointsEarned;
			this.updateScoreText();
		};

		// user missed the mole, so penalize the user by taking away 5pts
		const applyMissPenalty = () => {
			// shake and flash camera to provide feedback on missed hit
			this.cameras.main.shake(80, 0.004);
			this.cameras.main.flash(100, 255, 50, 50);
			// animate mole to provide feedback on missed hit
			this.tweens.add({
				targets: gameState.mole,
				angle: 10,
				duration: 80,
				yoyo: true,
				repeat: 2
				});
			// display how many points the user will lose
			this.displayPenaltyText();

			// display the new score to the user
			this.updateScoreText();

			// update the score
			updateScore(-5);
		};

    const onBurrowHit = (key) => {
      
	  if (key === currentBurrowKey) {
		// emit dirt particles at the mole's current location
		this.emitDirtBurst();
		// apply reward for hitting the mole
		applyHitReward();
		// update combo streak and display the new combo streak to the user
		comboStreak++;
		this.updateComboDisplay();
		this.checkComboMilestone();
		// animate mole to provide feedback on successful hit and then move mole to new location
		this.tweens.add({
			targets: gameState.mole,
			scaleX: 0.4,
			scaleY: 0.3,
			duration: 80,
			yoyo: true
			});
		this.relocateMole();
	  } else {
		applyMissPenalty();
		comboStreak = 0;
		this.updateComboDisplay();
	  }
	};

	const togglePause = () => {
		if (isPaused === false) {
			// pause the game and display pause screen
			isPaused = true;
			this.displayPauseScreen();
		} else {
			// unpause the game and remove pause screen
			isPaused = false;
			this.removePauseScreen();
		}
	};

		if (isPaused === false) {
			// check each burrow's location if the user is hitting the corresponding key
			// and run the handler to determine if user should get a reward or penalty
			if (Phaser.Input.Keyboard.JustDown(gameState.jKey)) {
        onBurrowHit('j');
			} else if (Phaser.Input.Keyboard.JustDown(gameState.kKey)) {
        onBurrowHit('k');
			} else if (Phaser.Input.Keyboard.JustDown(gameState.lKey)) {
        onBurrowHit('l');
			}
		}

		if (Phaser.Input.Keyboard.JustDown(gameState.spaceKey)) {
			togglePause();
		}
	}

	// adds the background image to the scene starting at the coordinates (0, 0)
	initializeBackground() {
		const background = this.add.image(0, 0, 'background');
		background.setScale(0.5);
		background.setOrigin(0, 0);

		// create box for the score and timer
		const scoreBox = this.add.rectangle(90, 70, 140, 90, 0xFFFFFF);
		scoreBox.alpha = 0.5;
	}

	// display user's score on screen
	initializeScoreText() {
		gameState.scoreText = this.add.text(50, 50, `Score: ${score}`).setColor('#000000');
	}

	// display user's current combo streak on screen
	initializeComboText() {
	gameState.comboText = this.add.text(50, 140, `Combo: ${comboStreak}`, {
		fontSize: '22px',
		fontStyle: 'bold',
		color: '#ffcc00',
		stroke: '#000000',
		strokeThickness: 4
		});
	}

	// display combo milestone popup and shake screen if user reaches a combo milestone at 5, 10, or 15 combo streaks
	checkComboMilestone() {
		const milestone = [5, 10, 15];
		if (milestone.includes(comboStreak)) {
			const x = 240; // center of the canvas
			const y = 300;

			const milestoneText = this.add.text(x, y, `COMBO x${comboStreak}!`, {
			fontSize: '48px',
			fontStyle: 'bold',
			color: '#FFD700',
			stroke: '#FF8C00',
			strokeThickness: 8
			}).setOrigin(0.5);

			// Animate the popup
			this.tweens.add({
			targets: milestoneText,
			scale: { from: 0, to: 1.5 },
			alpha: { from: 0, to: 1 },
			duration: 350,
			yoyo: true,
			onComplete: () => milestoneText.destroy()
			});

			// shake screen
			this.cameras.main.shake(150, 0.02);
		}
	}

	// go through each burrow and set up listeners on the corresponding key
	initializeBurrowKeys() {
		// set up listeners at the burrow's assigned key that will tell us when user input at that key occurs
		gameState.jKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
		gameState.kKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
		gameState.lKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
		gameState.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		// set up text to identify which key belongs to which burrow
		this.burrowLocations.forEach((burrow) => {
			this.add.text(burrow.x - 10, burrow.y + 70, burrow.key.toUpperCase(), {
				fontSize: 32,
				color: '#553a1f',
			});
		});
	}

	// create mole character from the spritesheet that was loaded
	initializeMole() {
		// add mole sprite to scene
		gameState.mole = this.physics.add.sprite(0, 0, 'mole');
		gameState.mole.setScale(0.5, 0.5);

		// set mole's location
		this.updateBurrow();


		// after mole appears, run idle animation
		gameState.mole.on('animationcomplete-appear', () => {
			gameState.mole.anims.play('idle');
		});

		// after mole is hidden, immediately relocate to another burrow
		gameState.mole.on('animationcomplete-disappear', () => {
			this.updateBurrow();
		});
	}

	// creates all the animations that will run after an action is performed
	initializeAnimations() {
		// create the appear animation from mole spritesheet
		this.anims.create({
			key: 'appear',
			frames: this.anims.generateFrameNumbers('mole', { start: 0, end: 2 }),
			frameRate: 10,
		});

		// create the idle animation from mole spritesheet that will repeat indefinitely
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('mole', { frames: [1, 3, 1, 1, 4] }),
			frameRate: 3,
			repeat: -1,
		});

		// create the disappear animation from mole spritesheet
		this.anims.create({
			key: 'disappear',
			frames: this.anims.generateFrameNumbers('mole', { frames: [5, 6, 6, 5, 2, 1, 0] }),
			frameRate: 15,
		});
	}

	// display remaining time left on screen and run update after every second
	initializeTimer(timerCallback) {
		gameState.timerText = this.add.text(50, 75, `Time: ${timeLeft}`).setColor('#000000');

		this.time.addEvent({
			delay: 1000, // call after every 1000ms (1sec)
			callback: timerCallback, // run function after 1sec elapsed
			args: [1], // amount of time that elapsed
			callbackScope: this, // scope to this class
			loop: true, // repeat forever
		});
	}
	// set up particle emitter for dirt when mole is hit
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
	// emit dirt particles at the mole's current location when mole is hit
	emitDirtBurst() {

		const x = gameState.mole.x;
		const y = gameState.mole.y;

		let quantity = 20;

		if (comboStreak >= 15) quantity = 60;
		else if (comboStreak >= 10) quantity = 40;
		else if (comboStreak >= 5) quantity = 30;

		gameState.dirtEmitter.explode(quantity, x, y);
  
	}

	// fetches a random burrow from our list of burrows
	getRandomBurrow() {
		return Phaser.Utils.Array.GetRandom(this.burrowLocations);
	}

	// select new burrow and move mole to it
	updateBurrow() {
		// select a random burrow from our list of burrows
		const burrowLocation = this.getRandomBurrow();

		// update the current burrow key to the new burrow's key
		currentBurrowKey = burrowLocation.key;

		// set the mole's position to the new burrow's (x, y) coordinates
		gameState.mole.setPosition(burrowLocation.x, burrowLocation.y);

		// play animation to make mole appear
		gameState.mole.anims.play('appear');
	}

	// play the mole's disappear animation to indicate it was hit
	// and after animation is complete, mole will move to a new burrow
	relocateMole() {
		gameState.mole.anims.play('disappear');
	}

	// update the clock text on the screen to reflect the changed amount
	updateTimerText() {
		gameState.timerText.setText(`Time: ${timeLeft}`);
	}

	// update the score text on the screen to reflect the changed amount
	updateScoreText() {
		gameState.scoreText.setText(`Score: ${score}`);
	}

	updateComboDisplay() {
		gameState.comboText.setText(`Combo: ${comboStreak}`);
	}


	// display the number of points the user gained
	displayRewardText(points) {
		// add text to display score reward
  		const x = gameState.mole.x;
  		const y = gameState.mole.y - 40;

		const rewardText = this.add.text(x, y, `+${points}`, {
			fontSize: '32px',
			fontStyle: 'bold',
			color: '#00ff00',
			stroke: '#003300',
			strokeThickness: 6,
			shadow: {
				offsetX: 3,
				offsetY: 3,
				color: '#000',
				blur: 2,
				fill: true
			}
			}).setOrigin(0.5);

		this.tweens.timeline({

			targets: rewardText,

			tweens: [
				{
				scale: 2,
				duration: 100,
				ease: 'Back.easeOut'
				},
				{
				y: y - 70,
				alpha: 0,
				scale: 1.2,
				angle: Phaser.Math.Between(-10, 10),
				duration: 500,
				ease: 'Cubic.easeOut'
				}
			],

			onComplete: () => rewardText.destroy()

			});
	}

	// display the number of points the user lost
	displayPenaltyText() {

		const x = gameState.mole.x;
		const y = gameState.mole.y - 40;

		const penaltyText = this.add.text(x, y, '-5', {
			fontSize: '32px',
			fontStyle: 'bold',
			color: '#ff4444',
			stroke: '#330000',
			strokeThickness: 6,
			shadow: {
			offsetX: 3,
			offsetY: 3,
			color: '#000',
			blur: 2,
			fill: true
			}
		}).setOrigin(0.5);

		this.tweens.timeline({

			targets: penaltyText,

			tweens: [
			{
				scale: 1.6,
				duration: 100,
				ease: 'Back.easeOut'
			},
			{
				y: y + 60,   // falls downward instead of upward
				alpha: 0,
				scale: 1,
				angle: Phaser.Math.Between(-15, 15),
				duration: 500,
				ease: 'Cubic.easeOut'
			}
			],

			onComplete: () => penaltyText.destroy()

		});
	}

	// display background overlay with pause messages to indicate game is paused
	displayPauseScreen() {
		gameState.pauseOverlay = this.add.rectangle(0, 0, 480, 640, 0xFFFFFF);
		gameState.pauseOverlay.alpha = 0.75;
		gameState.pauseOverlay.setOrigin(0, 0);

		gameState.pauseText = this.add.text(225, 325, 'PAUSED').setColor('#000000');
		gameState.resumeText = this.add.text(125, 375, 'Press space to resume game').setColor('#000000');
	}

	// remove overlay and pause messages when game is unpaused
	removePauseScreen() {
		gameState.pauseOverlay.destroy();
		gameState.pauseText.destroy();
		gameState.resumeText.destroy();
	}
}

