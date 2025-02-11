// Some simpler prefab classes are just going to be written in here
class HealthBar extends Phaser.GameObjects.Sprite {
    /**
     * @param {GameScene} scene
     * @param {Player} player
     */
    constructor(scene, player) {
        super(scene, UI_LAYOUT.HEALTH_BAR.x, UI_LAYOUT.HEALTH_BAR.y, TEXTURE_NAMES.HEALTH_BAR, `health-bar-${5 - player.health}`);
        scene.add.existing(this);
        this.setOrigin(0);
        this.setDepth(LAYERS.UI_START);

        player.on("userevent.healthchanged", (newHealth) => {
            let healthNumber = 5 - Phaser.Math.Clamp(newHealth, 0, 5);
            this.setFrame(`health-bar-${healthNumber}`);
        });
    }
}

class PauseMenu extends Phaser.GameObjects.Container {
    /**
     * @param {GameScene} scene
     */
    constructor(scene) {
        super(scene, 0, 0, []);
        this.myScene = scene;
        this.tinter = scene.add.rectangle(0, 0, width, height, 0x000000, 65).setOrigin(0);
        this.resume = new MenuButton(scene, 'pm-resume', width / 2, height / 2, UI_LAYOUT.BUTTON.WIDTH, UI_LAYOUT.BUTTON.HEIGHT, "Resume", 0x75ffc6).setAbove(this.tinter);
        this.restart = new MenuButton(scene, 'pm-restart', width / 2, height / 2 + (4 + UI_LAYOUT.BUTTON.HEIGHT), UI_LAYOUT.BUTTON.WIDTH, UI_LAYOUT.BUTTON.HEIGHT, "Restart", 0xff7775).setAbove(this.tinter);
        this.mainMenu = new MenuButton(scene, 'pm-mainmenu', width / 2, height / 2 + (4 + UI_LAYOUT.BUTTON.HEIGHT) * 2, UI_LAYOUT.BUTTON.WIDTH, UI_LAYOUT.BUTTON.HEIGHT, "Main Menu", 0xefff75).setAbove(this.tinter);
        
        this.resume.on('userevent.menu-button-down', (key) => {
            if (key == 'pm-resume') {
                this.myScene.unpauseGame();
            }
        });

        this.restart.on('userevent.menu-button-down', (key) => {
            if (key == 'pm-restart') {
                this.myScene.restart();
            }
        });

        this.mainMenu.on('userevent.menu-button-down', (key) => {
            if (key == 'pm-mainmenu') {
                saveHighScore(this.myScene.player.score);
                scene.scene.start('mainMenu');
            }
        });

        this.add([this.tinter, this.resume, this.restart, this.mainMenu]);
        scene.add.existing(this);
    }

    update() {
        
    }
}


// Main gameplay scene class

/**
 * @property {number} worldScrollSpeed
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super("game");
    }

    init() {
        this.worldScrollingSpeed = 1.0;
        this.naturalSpeed = 1.0;
        this.starttime = this.time.now;
    }

    create() {
        // Background and decorations
        this.backgroundImage = this.add.tileSprite(0, 0, width, height, TEXTURE_NAMES.GAME_BACKGROUND);
        this.backgroundImage.setOrigin(0);
        this.backgroundImage.setDepth(LAYERS.BACKGROUND);

        this.nebula1 = this.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'nebulae', 'nebula-0').setOrigin(0.5).setDepth(LAYERS.BACKGROUND_DECORATION);
        this.nebula2 = this.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'nebulae', 'nebula-1').setOrigin(0.5).setDepth(LAYERS.BACKGROUND_DECORATION);
        this.nebula3 = this.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'nebulae', 'nebula-2').setOrigin(0.5).setDepth(LAYERS.BACKGROUND_DECORATION);
        this.nebula4 = this.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'nebulae', 'nebula-3').setOrigin(0.5).setDepth(LAYERS.BACKGROUND_DECORATION);

        // Obstacles
        this.obstacleManager = new ObstacleManager(this);
        this.timerStart = this.time.now;
        this.spawnTimer = Phaser.Math.Between(GAME_SETTINGS.OBSTACLE_SPAWN_TIMING_MIN, GAME_SETTINGS.OBSTACLE_SPAWN_TIMING_MAX);


        // Player
        this.player = new Player(this);

        // Collisions
        this.physics.add.collider(this.obstacleManager.group, this.player.projectileGroup);

        // Inputs
        this.keys = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
            powerup: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        };

        this.input.keyboard.on('keydown-ESC', () => {
            if (this.paused) {
                this.unpauseGame();
            } else {
                this.pauseGame();
            }
        }, this);

        // Event Handlers
        this.physics.world.on("collide", (object1, object2, body1, body2) => {
            if (object1 instanceof LaserShot) {
                if (object2 instanceof Obstacle) {
                    object1.returnToPool();
                    object2.returnToPool();
                    this.sound.play("explosion");
                } else if (object2.iampowerup) {
                    this.powerupSpawnTimer = Phaser.Math.Between(GAME_SETTINGS.POWERUP_SPAWN_TIME_MIN, GAME_SETTINGS.POWERUP_SPAWN_TIME_MAX);
                    this.powerupTimerStart = this.time.now;
                    this.powerupOnScreen = false;
                    object2.disableBody(true, true);
                    object1.returnToPool();
                    this.sound.play("powerUp")
                }
            } else if (object1 instanceof Obstacle) {
                if (object2 instanceof LaserShot) {
                    object1.returnToPool();
                    object2.returnToPool();
                } else if (object2 instanceof Player) {
                    if (object2.inPowerUp) {
                        object1.returnToPool();
                        this.sound.play("explosion");
                    } else {
                        object2.death();
                        this.sound.play("death");
                    }
                }
            } else if (object1 instanceof Player) {
                if (object2 instanceof Obstacle) {
                    if (object1.inPowerUp) {
                        object2.returnToPool();
                        this.sound.play("explosion");
                    } else {
                        object1.death();
                        this.sound.play("death");
                    }
                } else if (object2.iampowerup) {
                    this.powerupSpawnTimer = Phaser.Math.Between(GAME_SETTINGS.POWERUP_SPAWN_TIME_MIN, GAME_SETTINGS.POWERUP_SPAWN_TIME_MAX);
                    this.powerupTimerStart = this.time.now;
                    this.powerupOnScreen = false;
                    object2.disableBody(true, true);
                    object1.hasPowerup = true;
                    this.sound.play("powerUp")
                }
            }
        });

        this.physics.world.on("overlap", (object1, object2, body1, body2) => {
            if (object1.iampowerup) {
                if (object2 instanceof LaserShot) {
                    this.powerupSpawnTimer = Phaser.Math.Between(GAME_SETTINGS.POWERUP_SPAWN_TIME_MIN, GAME_SETTINGS.POWERUP_SPAWN_TIME_MAX);
                    this.powerupTimerStart = this.time.now;
                    this.powerupOnScreen = false;
                    object1.disableBody(true, true);
                    object2.returnToPool();
                    this.player.hasPowerup = true;
                    this.sound.play("powerUp")
                } else if (object2 instanceof Player) {
                    this.powerupSpawnTimer = Phaser.Math.Between(GAME_SETTINGS.POWERUP_SPAWN_TIME_MIN, GAME_SETTINGS.POWERUP_SPAWN_TIME_MAX);
                    this.powerupTimerStart = this.time.now;
                    this.powerupOnScreen = false;
                    object1.disableBody(true, true);
                    object2.hasPowerup = true;
                    this.sound.play("powerUp")
                }
            } else if (object1 instanceof LaserShot) {
                if (object2.iampowerup) {
                    this.powerupSpawnTimer = Phaser.Math.Between(GAME_SETTINGS.POWERUP_SPAWN_TIME_MIN, GAME_SETTINGS.POWERUP_SPAWN_TIME_MAX);
                    this.powerupTimerStart = this.time.now;
                    this.powerupOnScreen = false;
                    object2.disableBody(true, true);
                    object1.returnToPool();
                    this.player.hasPowerup = true;
                    this.sound.play("powerUp")
                }
            } else if (object1 instanceof Player) {
                if (object2.iampowerup) {
                    this.powerupSpawnTimer = Phaser.Math.Between(GAME_SETTINGS.POWERUP_SPAWN_TIME_MIN, GAME_SETTINGS.POWERUP_SPAWN_TIME_MAX);
                    this.powerupTimerStart = this.time.now;
                    this.powerupOnScreen = false;
                    object2.disableBody(true, true);
                    object1.hasPowerup = true;
                    this.sound.play("powerUp")
                }
            }
        });

        // Health bar
        this.healthBar = new HealthBar(this, this.player);

        // Pausing
        this.pauseMenu = new PauseMenu(this);
        this.pauseMenu.setVisible(false);
        this.pauseMenu.setDepth(LAYERS.UI_START + 1);
        this.paused = false;

        let textStyle = {
            fontFamily: UI_LAYOUT.TEXT.FONT_FAMILY,
            fontSize: 14,
            color: 'lime',
            fixedHeight: 16,
            align: 'right',
            backgroundColor: 'black',
        };

        this.scoreMarker = this.add.text(width - 8, 8, `${Math.floor(this.player.score)}`, textStyle);
        this.scoreMarker.setDepth(LAYERS.UI_START).setOrigin(1, 0);

        this.powerup = this.physics.add.sprite(0, 0, TEXTURE_NAMES.POWERUP);
        this.powerup.disableBody(true, true).setOrigin(0.5);
        this.powerupOnScreen = false;
        this.powerup.body.setCircle(15);
        this.powerup.body.setOffset(0, 12);
        this.powerup.iampowerup = true;
        this.powerup.body.onOverlap = true;

        let coll = this.physics.add.collider(this.powerup, this.player);
        coll.overlapOnly = true;
        let coll2 = this.physics.add.collider(this.powerup, this.player.projectileGroup);
        coll2.overlapOnly = true;

        this.powerupSpawnTimer = Phaser.Math.Between(GAME_SETTINGS.POWERUP_SPAWN_TIME_MIN, GAME_SETTINGS.POWERUP_SPAWN_TIME_MAX);
        this.powerupTimerStart = this.time.now;

        this.pauseTime = 0;

        this.starttime = this.time.now;
        this.addedspeed = 0.0;

        this.speedmod = 1.0;

        this.sound.stopByKey('bgm');
        this.sound.play('bgm', {loop: true});

        this.powerupMarker = this.add.sprite(32, 8, "powerupMarker").setOrigin(0).setVisible(false).setDepth(LAYERS.UI_START);
    }

    gameUpdates(time, delta) {
        this.backgroundImage.tilePositionY -= delta * 0.001 * this.worldScrollingSpeed * GAME_SETTINGS.SCROLL_SPEED * PARALLAX_FACTORS[LAYERS.BACKGROUND];
        this.nebula1.y += delta * 0.001 * this.worldScrollingSpeed * GAME_SETTINGS.SCROLL_SPEED * PARALLAX_FACTORS[LAYERS.BACKGROUND_DECORATION];
        this.nebula2.y += delta * 0.001 * this.worldScrollingSpeed * GAME_SETTINGS.SCROLL_SPEED * PARALLAX_FACTORS[LAYERS.BACKGROUND_DECORATION];
        this.nebula3.y += delta * 0.001 * this.worldScrollingSpeed * GAME_SETTINGS.SCROLL_SPEED * PARALLAX_FACTORS[LAYERS.BACKGROUND_DECORATION];
        this.nebula4.y += delta * 0.001 * this.worldScrollingSpeed * GAME_SETTINGS.SCROLL_SPEED * PARALLAX_FACTORS[LAYERS.BACKGROUND_DECORATION];

        if (this.nebula1.getTopCenter().y > height) {
            this.nebula1.x = Phaser.Math.Between(0, width);
            this.nebula1.y = Phaser.Math.Between(-height / 2, -64);
        }

        if (this.nebula2.getTopCenter().y > height) {
            this.nebula2.x = Phaser.Math.Between(0, width);
            this.nebula2.y = Phaser.Math.Between(-height / 2, -64);
        }

        if (this.nebula3.getTopCenter().y > height) {
            this.nebula3.x = Phaser.Math.Between(0, width);
            this.nebula3.y = Phaser.Math.Between(-height / 2, -64);
        }

        if (this.nebula4.getTopCenter().y > height) {
            this.nebula4.x = Phaser.Math.Between(0, width);
            this.nebula4.y = Phaser.Math.Between(-height / 2, -64);
        }

        if (this.timerStart + this.spawnTimer < this.time.now) {
            this.obstacleManager.introduceNextObstacle();
            this.timerStart = this.time.now;
            this.spawnTimer = Phaser.Math.Between(GAME_SETTINGS.OBSTACLE_SPAWN_TIMING_MIN, GAME_SETTINGS.OBSTACLE_SPAWN_TIMING_MAX) * Phaser.Math.Clamp(5.0 - this.addedspeed, 0.5, 5.0) / 5.0;
        }

        this.obstacleManager.update(time, delta);
        this.player.update();

        this.player.score += this.worldScrollingSpeed * delta * GAME_SETTINGS.SCROLL_SPEED / 20000.0;
        
        this.scoreMarker.setText(`${Math.floor(this.player.score)}`)
        if (Math.floor(this.player.score) > getHighScore()) {
            this.scoreMarker.setColor('cyan');
        }

        if (this.powerupOnScreen) {
            this.powerup.setVelocityY(GAME_SETTINGS.SCROLL_SPEED * this.worldScrollingSpeed);
            if (this.powerup.getTopCenter().y > height) {
                this.powerupSpawnTimer = Phaser.Math.Between(GAME_SETTINGS.POWERUP_SPAWN_TIME_MIN, GAME_SETTINGS.POWERUP_SPAWN_TIME_MAX);
                this.powerupTimerStart = this.time.now;
                this.powerupOnScreen = false;
                this.powerup.disableBody(true, true);
            }
        } else if (this.powerupTimerStart + this.powerupSpawnTimer < this.time.now) {
            if (this.player.hasPowerup) {
                this.powerupSpawnTimer = Phaser.Math.Between(GAME_SETTINGS.POWERUP_SPAWN_TIME_MIN, GAME_SETTINGS.POWERUP_SPAWN_TIME_MAX);
                this.powerupTimerStart = this.time.now;
            } else {
                this.powerup.enableBody(true, Phaser.Math.Between(16, width - 16), -50, true, true);
                this.powerup.anims.play(ANIM_NAMES.POWERUP_IDLE);
                this.powerupOnScreen = true;    
            }
        }

        this.addedspeed = (this.time.now - this.starttime) * GAME_SETTINGS.GAMETIME_SPEEDFACTOR / 1000.0;
        this.naturalSpeed = 1.0 + this.addedspeed;
        this.worldScrollingSpeed = this.naturalSpeed * this.speedmod;

        if (this.player.hasPowerup) {
            this.powerupMarker.setVisible(true);
        } else {
            this.powerupMarker.setVisible(false);
        }
    }

    update(time, delta) {
        if (!this.paused) {
            this.gameUpdates(time, delta);
        }
    }

    pauseGame() {
        this.paused = true;
        this.physics.world.pause();
        this.pauseTime = this.time.now;
        this.pauseMenu.setVisible(true);
    }

    unpauseGame() {
        this.paused = false;
        this.physics.world.resume();
        this.timerStart += (this.time.now - this.pauseTime);
        this.powerupTimerStart += (this.time.now - this.pauseTime);
        this.starttime += (this.time.now - this.pauseTime);
        this.pauseMenu.setVisible(false);
    }

    restart() {
        saveHighScore(this.player.score);
        this.sound.stopByKey('bgm');
        this.scene.restart();
    }

    gameOver() {
        let record = saveHighScore(this.player.score);
        this.sound.stopByKey('bgm');
        this.scene.start('gameOver', {score: this.player.score, record: record});
    }
}