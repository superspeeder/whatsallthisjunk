

class ObstacleManager {
    /** 
     * @param {GameScene} scene
     */
    constructor(scene) {
        this.scene = scene;

        /** @type {Obstacle[]} */
        this.obstacles = [];

        /** @type {integer[]} */
        this.offscreenObstacles = [];

        let collection = generateWeightedCollection(OBSTACLE_DISTRIBUTION, GAME_SETTINGS.NUM_OBSTACLES);

        for (let i = 0 ; i < GAME_SETTINGS.NUM_OBSTACLES ; i++) {
            let obstacle = new Obstacle(this.scene, this, i, TEXTURE_NAMES.OBSTACLES, OBSTACLE_TYPE_NAMES[collection[i]]);
            this.obstacles.push(obstacle);
            this.offscreenObstacles.push(i);
        }

        this.group = this.scene.add.group(this.obstacles);

        this.scene.physics.add.collider(this.group, this.group);
    }

    introduceNextObstacle() {
        if (this.offscreenObstacles.length > GAME_SETTINGS.NUM_OFFSCREEN_OBSTACLES) {
            // we don't have too many obstacles on screen right now

            let i = Phaser.Math.Between(0, this.offscreenObstacles.length - 1);
            let obst = this.obstacles[this.offscreenObstacles[i]];
            this.offscreenObstacles.splice(i, 1);

            let oWidth = obst.width;

            let x = Phaser.Math.Between(oWidth / 2, width - oWidth / 2);
            obst.introduceAt(x, -50);
        }
    }

    reclaim(index) {
        this.offscreenObstacles.push(index);
    }

    update(time, delta) {
        for (let i = 0 ; i < this.obstacles.length ; i++) {
            let obst = this.obstacles[i];
            if (obst.active) {
                obst.update(time, delta);
            }
        }
    }
}