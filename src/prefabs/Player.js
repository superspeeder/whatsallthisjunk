class Player extends Phaser.Physics.Arcade.Sprite {

    /**
     * @param {GameScene} scene
     */
    constructor(scene) {
        super(scene, width / 2, height - 48, TEXTURE_NAMES.PLAYER);
        this.myScene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5);
        this.setDepth(LAYERS.PLAYER);
        this.setActive(true);

        // physics stuff
        this.body.setSize(24, 28);
        this.setCollideWorldBounds(true);
        this.setPushable(false);
        scene.physics.add.collider(this, scene.obstacleManager.group);

        /** @type {FSMStateMachine} */
        this.fsm = new FSMStateMachine({
            idle: {
                state: new IdleState(),
                extraArgs: [this, scene],
            },
            firing: {
                state: new FiringState(),
                extraArgs: [this, scene],
            },
            firingCooldown: {
                state: new FiringCooldownState(),
                extraArgs: [this, scene],
            },
        });
        this.fsm.setState('idle');

        /** @type {ObjectPool.<LaserShot>} */
        this.projectilePool = new ObjectPool({
            init(pool, index, scene) {
                return new LaserShot(scene, pool, index, true);
            },

            create(obj, x, y) {
                obj.introduceAt(x, y);
            },

            release(obj) {
                obj.makeDisabled();
            }
        }, 64, scene);

        this.projectileGroup = scene.add.group(this.projectilePool.pool, {
            runChildUpdate: true,
        });

        this.hasPowerup = false; // TODO: powerup.

        this.health = GAME_SETTINGS.MAX_HEALTH;
    }

    update() {
        this.fsm.step();
    }

    updateMovement() {
        if (this.myScene.keys.left.isDown) {
            this.setVelocityX(-GAME_SETTINGS.PLAYER_MOVE_SPEED);
        } else if (this.myScene.keys.right.isDown) {
            this.setVelocityX(GAME_SETTINGS.PLAYER_MOVE_SPEED);
        } else {
            this.setVelocityX(0);
        }
    }

    fire() {
        this.projectilePool.create(this.x - 12, this.y - 13)
        this.projectilePool.create(this.x + 12, this.y - 13)
    }

    hurt() {
        this.health -= 1;

        this.emit('userevent.healthchanged', this.health);
    }
}

class IdleState extends FSMState {
    /**
     * @param {FSMStateMachine} stateMachine
     * @param {Player} player
     * @param {GameScene} scene
     */
    onEnter(stateMachine, player, scene) {
        player.anims.playAfterRepeat(ANIM_NAMES.PLAYER_IDLE);
    }

    /**
     * @param {FSMStateMachine} stateMachine
     * @param {Player} player
     * @param {GameScene} scene
     */
    onUpdate(stateMachine, player, scene) {
        player.updateMovement();
        
        if (Phaser.Input.Keyboard.JustDown(player.myScene.keys.fire)) {
            stateMachine.setState('firing');
        } else if (Phaser.Input.Keyboard.JustDown(player.myScene.keys.powerup)) {
            // TODO: powerups.
        }
    }
}

class FiringState extends FSMState {
    /**
     * @param {FSMStateMachine} stateMachine
     * @param {Player} player
     * @param {GameScene} scene
     */
    onEnter(stateMachine, player, scene) {
        player.setVelocity(0);
        player.anims.play(ANIM_NAMES.PLAYER_FIRING).once('animationcomplete', () => {
            player.fire();
            stateMachine.setState('firingCooldown');
        })
    }
}

class FiringCooldownState extends FSMState {
    /**
     * @param {FSMStateMachine} stateMachine
     * @param {Player} player
     * @param {GameScene} scene
     */
    onEnter(stateMachine, player, scene) {
        player.anims.play(ANIM_NAMES.PLAYER_FIRING_COOLDOWN).once('animationcomplete', () => {
            stateMachine.setState('idle');
        });
    }

    onUpdate(stateMachine, player, scene) {
        player.updateMovement();

        if (Phaser.Input.Keyboard.JustDown(player.myScene.keys.powerup)) {
            // TODO: powerups.
        }
    }
}