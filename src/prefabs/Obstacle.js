/**
 * @typedef {Object} Prefabs.Obstacle
 * @property {boolean} ingame Is this obstacle actively in the game or is it marked as offscreen.
 * @extends Phaser.Physics.Arcade.Sprite
 */
Prefabs.Obstacle = class extends Phaser.Physics.Arcade.Sprite {

    /**
     * @param {GameScene} scene
     * @param {string|Phaser.Textures.Texture} texture
     */
    constructor(scene, manager, index, texture, frame) {
        super(scene, 0, 0, texture, frame);
        this.setVisible(false);
        this.body.setEnable(false)
        this.body.setImmovable(true);
        this.setOrigin(0.5)
        this.setDepth(LAYERS.FOREGROUND_OBJECTS);

        this.ingame = false;
        this.manager = manager;
        this.index = index;
    }

    update() {
        if (this.ingame) {
            this.body.setVelocityY(this.scene.worldScrollingSpeed * GAME_SETTINGS.SCROLL_SPEED * PARALLAX_FACTORS[LAYERS.FOREGROUND_OBJECTS]);

            if (this.getTopCenter().y > height) {
                this.ingame = false;
                this.body.stop();
                this.setPosition(0);
                this.body.setEnable(false);
                this.setVisible(false);
    
                this.manager.reclaim(this.index);
            }    
        }
    }

    introduceAt(x, y) {
        this.setPosition(x, y);
        this.setVisible(true);
        this.body.setEnable(true)
        
        this.ingame = true;
    }
}
