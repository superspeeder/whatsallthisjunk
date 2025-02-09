class LoadScene extends Phaser.Scene {
    constructor() {
        super("load");
    }

    preload() {
        this.load.image("menu_background", "assets/background_menu.png");
    }

    create() {
        this.scene.start("mainMenu");
    }
}