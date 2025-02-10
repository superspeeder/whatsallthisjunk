class LoadScene extends Phaser.Scene {
    constructor() {
        super("load");
    }

    preload() {
        this.load.image(TEXTURE_NAMES.MENU_BACKGROUND, "assets/background_menu.png");
        this.load.atlas(TEXTURE_NAMES.OBSTACLES, "assets/tileset.png", "assets/obstacle_atlas.json")
    }

    create() {
        this.scene.start("mainMenu");
    }
}