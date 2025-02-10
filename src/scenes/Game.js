
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
        this.backgroundImage = this.add.tileSprite(0, 0, width, height, '');

        this.obstacleManager = new ObstacleManager(this);
    }

    update() {
        
    }
}