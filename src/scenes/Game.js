
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
        this.backgroundImage = this.add.tileSprite(0, 0, width, height, TEXTURE_NAMES.GAME_BACKGROUND);
        this.backgroundImage.setOrigin(0);
        this.backgroundImage.setDepth(LAYERS.BACKGROUND);

        this.nebula1 = this.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'nebulae', 'nebula-1').setOrigin(0.5).setDepth(LAYERS.BACKGROUND_DECORATION);
        this.nebula2 = this.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'nebulae', 'nebula-2').setOrigin(0.5).setDepth(LAYERS.BACKGROUND_DECORATION);
        this.nebula3 = this.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'nebulae', 'nebula-3').setOrigin(0.5).setDepth(LAYERS.BACKGROUND_DECORATION);
        this.nebula4 = this.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'nebulae', 'nebula-4').setOrigin(0.5).setDepth(LAYERS.BACKGROUND_DECORATION);

        this.obstacleManager = new ObstacleManager(this);
        this.timerStart = this.time.now;
        this.spawnTimer = Phaser.Math.Between(GAME_SETTINGS.OBSTACLE_SPAWN_TIMING_MIN, GAME_SETTINGS.OBSTACLE_SPAWN_TIMING_MAX);
    }

    update(time, delta) {
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
    }
}