class LoadScene extends Phaser.Scene {
    constructor() {
        super("load");
    }

    preload() {
        this.load.image(TEXTURE_NAMES.MENU_BACKGROUND, "assets/background_menu.png");
        this.load.image(TEXTURE_NAMES.MENU_BACKGROUND_2, "assets/background_menu_2.png");
        this.load.image(TEXTURE_NAMES.GAME_BACKGROUND, "assets/background.png");
        this.load.atlas(TEXTURE_NAMES.OBSTACLES, "assets/tileset.png", "assets/obstacle_atlas.json");
        this.load.atlas(TEXTURE_NAMES.NEBULAE, "assets/nebulae.png", "assets/nebulae.json");
        this.load.spritesheet(TEXTURE_NAMES.PLAYER, "assets/player.png", {frameWidth: 32, frameHeight: 42});
        this.load.image(TEXTURE_NAMES.LASER_SHOT, "assets/laser_shot.png");
        this.load.atlas(TEXTURE_NAMES.HEALTH_BAR, "assets/health_bar.png", "assets/health_bar.json");
        this.load.image("tutorial-move", "assets/tutorial_movement.png");
        this.load.image("tutorial-shoot", "assets/tutorial_shoot.png");
        this.load.image("tutorial-powerup", "assets/tutorial_powerup.png");
        this.load.image("powerupMarker", "assets/powerup.png");
        this.load.spritesheet(TEXTURE_NAMES.POWERUP, "assets/bubble.png", {frameWidth: 32, frameHeight: 72});
        this.load.audio("bgm", "assets/bgm.wav");
        this.load.audio("powerUp", "assets/powerUp.wav");
        this.load.audio("select", "assets/select.wav");
        this.load.audio("laserShoot", "assets/laserShoot.wav");
        this.load.audio("explosion", "assets/explosion.wav");
        this.load.audio("death", "assets/death.wav");

        this.game.sound.setVolume(0.3)
    }

    create() {
        this.anims.create({
            key: ANIM_NAMES.PLAYER_IDLE,
            frames: this.anims.generateFrameNumbers(TEXTURE_NAMES.PLAYER, {
                frames: ANIM_FRAMES.PLAYER_IDLE,
            }),
            frameRate: ANIM_FRAMERATES.PLAYER_IDLE,
            repeat: -1,
            repeatDelay: ANIM_PLAYER_IDLE_REPEAT_DELAY,
            yoyo: true,
        });

        this.anims.create({
            key: ANIM_NAMES.PLAYER_FIRING,
            frames: this.anims.generateFrameNumbers(TEXTURE_NAMES.PLAYER, {
                frames: ANIM_FRAMES.PLAYER_FIRING,
            }),
            frameRate: ANIM_FRAMERATES.PLAYER_FIRING,
            repeat: 0,
        });

        this.anims.create({
            key: ANIM_NAMES.PLAYER_FIRING_COOLDOWN,
            frames: this.anims.generateFrameNumbers(TEXTURE_NAMES.PLAYER, {
                frames: ANIM_FRAMES.PLAYER_FIRING_COOLDOWN,
            }),
            frameRate: ANIM_FRAMERATES.PLAYER_FIRING_COOLDOWN,
            repeat: 0,
        });

        this.anims.create({
            key: ANIM_NAMES.POWERUP_IDLE,
            frames: this.anims.generateFrameNumbers(TEXTURE_NAMES.POWERUP, {
                frames: ANIM_FRAMES.POWERUP_IDLE,
            }),
            frameRate: ANIM_FRAMERATES.POWERUP_IDLE,
            repeat: -1,
        });
        
        this.anims.create({
            key: ANIM_NAMES.POWERUP_POP,
            frames: this.anims.generateFrameNumbers(TEXTURE_NAMES.POWERUP, {
                frames: ANIM_FRAMES.POWERUP_POP,
            }),
            frameRate: ANIM_FRAMERATES.POWERUP_POP,
            repeat: 0,
        });

        this.scene.start("mainMenu");
    }
}