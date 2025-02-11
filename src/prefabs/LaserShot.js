class LaserShot extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {GameScene} scene
     * @param {ObjectPool.<LaserShot>} pool
     * @param {integer} index
     * @param {boolean} intiallyDisabled
     */
    constructor(scene, pool, index, intiallyDisabled) {
        super(scene, 0, 0, TEXTURE_NAMES.LASER_SHOT);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.pool = pool;
        this.poolIndex = index;

        this.body.setCircle(2, 6, 6);

        this.setDepth(LAYERS.FOREGROUND_OBJECTS);
        this.body.onCollide = true;

        if (intiallyDisabled) {
            this.disableBody(true, true);
        }
    }

    introduceAt(x, y) {
        this.enableBody(true, x, y, true, true);
        this.setVelocityY(-GAME_SETTINGS.LASER_SHOT_SPEED);
        this.scene.sound.play("laserShoot")
    }

    makeDisabled() {
        this.disableBody(true, true);
    }

    update() {
        if (this.y + this.height < 0 || this.y > height + this.height) {
            this.pool.release(this.poolIndex);
        }
    }

    returnToPool() {
        this.pool.release(this.poolIndex);
    }
}