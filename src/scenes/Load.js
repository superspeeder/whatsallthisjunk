class LoadScene extends Phaser.Scene {
    constructor() {
        super("load");
    }

    preload() {
        this.load.image(TEXTURE_NAMES.MENU_BACKGROUND, "assets/background_menu.png");
        this.load.image(TEXTURE_NAMES.GAME_BACKGROUND, "assets/background.png");
        this.load.atlas(TEXTURE_NAMES.OBSTACLES, "assets/tileset.png", "assets/obstacle_atlas.json")
        this.load.atlas(TEXTURE_NAMES.NEBULAE, "assets/nebulae.png", "assets/nebulae.json")
    }

    create() {
        this.scene.start("mainMenu");
    }
}