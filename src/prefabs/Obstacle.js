/**
 * @typedef {Object} Obstacle
 * @property {boolean} ingame Is this obstacle actively in the game or is it marked as offscreen.
 * @extends Phaser.Physics.Arcade.Sprite
 */
class Obstacle extends Phaser.Physics.Arcade.Sprite {

    /**
     * @param {GameScene} scene
     * @param {string|Phaser.Textures.Texture} texture
     */
    constructor(scene, manager, index, texture, frame) {
        super(scene, 0, 0, texture, frame);
        this.myScene = scene;
        
        this.myScene.add.existing(this);
        this.myScene.physics.add.existing(this);

        this.disableBody(true, true);
        this.setOrigin(0.5)
        this.setDepth(LAYERS.FOREGROUND_OBJECTS);
        this.setPushable(false);

        this.ingame = false;
        this.manager = manager;
        this.index = index;
    }

    update() {
        if (this.ingame) {
            this.setVelocityY(this.myScene.worldScrollingSpeed * GAME_SETTINGS.SCROLL_SPEED * PARALLAX_FACTORS[LAYERS.FOREGROUND_OBJECTS]);

            if (this.getTopCenter().y > height) {
                this.returnToPool();
            }    
        }
    }

    introduceAt(x, y) {
        this.enableBody(true, x, y, true, true);
        this.ingame = true;
    }

    returnToPool() {
        this.ingame = false;
        this.disableBody(true, true);
        this.manager.reclaim(this.index);
    }
}
