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
        

        this.add([this.tinter]);

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
    }

    create() {
        // Background and decorations
        this.backgroundImage = this.add.tileSprite(0, 0, width, height, TEXTURE_NAMES.GAME_BACKGROUND);
        this.backgroundImage.setOrigin(0);
        this.backgroundImage.setDepth(LAYERS.BACKGROUND);

        this.nebula1 = this.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'nebulae', 'nebula-1').setOrigin(0.5).setDepth(LAYERS.BACKGROUND_DECORATION);
        this.nebula2 = this.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'nebulae', 'nebula-2').setOrigin(0.5).setDepth(LAYERS.BACKGROUND_DECORATION);
        this.nebula3 = this.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'nebulae', 'nebula-3').setOrigin(0.5).setDepth(LAYERS.BACKGROUND_DECORATION);
        this.nebula4 = this.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'nebulae', 'nebula-4').setOrigin(0.5).setDepth(LAYERS.BACKGROUND_DECORATION);

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

        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        this.input.keyboard.on('keydown-ESC', () => {
            console.log("Pause");
            if (this.paused) {
                this.unpauseGame();
            } else {
                this.pauseGame();
            }
        }, this);

        // Event Handlers
        this.physics.world.on("collide", (object1, object2, body1, body2) => {
            console.log("Collision!");
            if (object1 instanceof LaserShot) {
                if (object2 instanceof Obstacle) {
                    object1.returnToPool();
                    object2.returnToPool();
                }
            } else if (object2 instanceof LaserShot) {
                if (object1 instanceof Obstacle) {
                    object1.returnToPool();
                    object2.returnToPool();
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
            this.spawnTimer = Phaser.Math.Between(GAME_SETTINGS.OBSTACLE_SPAWN_TIMING_MIN, GAME_SETTINGS.OBSTACLE_SPAWN_TIMING_MAX);
        }

        this.obstacleManager.update(time, delta);
        this.player.update();
    }

    update(time, delta) {
        if (!this.paused) {
            this.gameUpdates(time, delta);
        }
    }

    pauseGame() {
        this.paused = true;
        this.physics.world.pause();
        this.pauseMenu.setVisible(true);
    }

    unpauseGame() {
        this.paused = false;
        this.physics.world.resume();
        this.pauseMenu.setVisible(false);
    }
}