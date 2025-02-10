

class ObstacleManager {
    /** 
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        this.scene = scene;

        /** @type {Prefabs.Obstacle[]} */
        this.obstacles = [];

        /** @type {integer[]} */
        this.offscreenObstacles = [];

        let collection = MyUtils.generateWeightedCollection(OBSTACLE_DISTRIBUTION, GAME_SETTINGS.NUM_OBSTACLES);

        for (let i = 0 ; i < GAME_SETTINGS.NUM_OBSTACLES ; i++) {
            let obstacle = new Prefabs.Obstacle(this.scene, this, i, TEXTURE_NAMES.OBSTACLES, OBSTACLE_TYPE_NAMES[collection[i]]);
            this.obstacles.push(obstacle);
            this.offscreenObstacles.push(i);
        }

        this.group = this.scene.add.group(this.obstacles);
    }

    introduceNextObstacle() {
        if (this.offscreenObstacles.length > GAME_SETTINGS.NUM_OFFSCREEN_OBSTACLES) {
            // we don't have too many obstacles on screen right now

            let i = Phaser.Math.Between(0, this.offscreenObstacles.length - 1);
            let obst = this.obstacles[this.offscreenObstacles[i]];
            delete this.offscreenObstacles[i];

            let oWidth = obst.width;

            let x = Phaser.Math.Between(oWidth / 2, width - oWidth / 2);
            obst.introduceAt(x, 0);
        }
    }

    reclaim(index) {
        this.offscreenObstacles.push(index);
    }
}