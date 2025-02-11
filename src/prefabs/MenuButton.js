class MenuButton extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene
     * @param {string} key
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {?integer} outlineColor 
     * @param {?string} textColor
     */
    constructor(scene, key, x, y, w, h, text, outlineColor, textColor) {
        super(scene, x, y);

        this.key = key;
        this.text = text;

        if (outlineColor === undefined) {
            this.outlineColor = 0xffffff;
        } else {
            this.outlineColor = outlineColor;
        }

        if (textColor === undefined) {
            this.textColor = `#${this.outlineColor.toString(16).padStart(6, '0')}`;
        } else {
            this.textColor = textColor;
        }

        let textStyle = {
            color: this.textColor,
            align: 'center',
            fontFamily: UI_LAYOUT.TEXT.FONT_FAMILY,
            fontSize: UI_LAYOUT.BUTTON.FONT_SIZE,
        };

        this.outline = scene.add.rectangle(-w/2, -h/2, w, h, 0, 65);
        this.outline.setOrigin(0);
        this.outline.setStrokeStyle(UI_LAYOUT.BUTTON.STROKE_WIDTH, this.outlineColor);

        this.textObject = scene.add.text(0, 0, this.text, textStyle);
        this.textObject.setOrigin(0.5);

        this.add([this.outline, this.textObject]);

        this.setInteractive({ useHandCursor: true, hitArea: this.outline, hitAreaCallback: Phaser.Geom.Rectangle.Contains, hitAreaDebug: this.outline });
        this.on('pointerdown', (pointer, localX, localY, event) => {
            this.emit(`userevent.menu-button-down`, this.key, pointer, localX, localY, event);
            scene.sound.play("select");
        });

        scene.add.existing(this);
    }
}