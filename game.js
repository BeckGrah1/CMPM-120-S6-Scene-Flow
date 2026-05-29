class start extends Phaser.Scene {
    constructor() {
        super("start");
    }
    create() {
        const cx = this.scale.width / 2;

        const titleText = this.add.text(this.scale.width + 250, 200, "Roly Poly: To the End", {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: ' #681297',
            stroke: '#102030',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        


        this.add.star(400, 300, 5, 20, 40, "#effb0a");
        
        this.add.text(this.scale.width / 2, 300, "Tap to Start", {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: ' #681297',
            stroke: '#102030',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.8);

        this.input.on("pointerdown", () => {
            this.scene.start("gameplayScene");
        });
    
        

    }
}

class gameplayScene extends Phaser.Scene {
    constructor() {
        super("gameplayScene"); 
    }

    create() {
        this.moveRect = true;

        this.add.text(this.scene.width / 2, this.scene.height / 2 - 400, "demo gamplay scene, press space to jump over the red rectangle to win", { 
            fontSize: "48px", fill: "#fff",
            wordWrap: { width: 1000, useAdvancedWrap: true },
            align: "center"
        }).setOrigin(0.5);
        this.player = this.add.circle(200, 850, 50, 0x9dfc8b);
        this.obstacle = this.add.rectangle(1000, 850, 100, 100, 0xff0000);
        const floor = this.add.rectangle(0, 900, 1920, 100, 0x102030).setOrigin(0, 0);

        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.player.y === 850) {
                this.tweens.add({
                    targets: this.player,
                    y: 650,
                    duration: 600,
                    ease: "Cubic.easeOut",
                    yoyo: true
                });
            }
        });
    }

    update() {
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.obstacle.getBounds()) && this.moveRect && this.player.y === 850) {
            this.moveRect = false;
            this.cameras.main.shake(500, 0.01);
            this.cameras.main.fade(200, 0, 0, 0);
            this.time.delayedCall(200, () => {
                // reset scene
                this.scene.restart();
            });
        }
        if (this.obstacle.x < 0) {
            this.moveRect = false;

            this.cameras.main.fade(1000, 255, 255, 255);
            this.time.delayedCall(1000, () => {
                this.scene.start("BadgeMessageScene");
            });
        }
        if (this.moveRect) {
            this.obstacle.x -= 5;
        }
    }
}

class BadgeMessageScene extends Phaser.Scene {
    constructor() {
        super("BadgeMessageScene")
    }
    create() {
        this.add.text(960, 250, "The roly poly gets a badge!", {
            fontSize: "32px", color: "#3d0842"
        }).setOrigin(0.5)
        this.input.once("pointerdown", () =>{
            this.cameras.main.fade(500, 247, 231, 255);
            this.time.delayedCall(500, () => {
                this.scene.start("VictoryScene")
            })
        })
    }
}
class VictoryScene extends Phaser.Scene {
    constructor() {
        super("VictoryScene")
    }
    create() {
        this.cameras.main.setBackgroundColor("#f7e7ff");
        const roly = this.add.circle(760, 600, 80, 0x9b8cff);
        this.add.circle(730, 575, 8, 0x000000);
        this.add.circle(790, 575, 8, 0x000000);
        
        const badge = this.add.circle(1060, 560, 55, 0xffd966);
        this.add.text(1060, 560, "★",{
            fontSize: "52px",
            color: "#ece278"
        })
        this.add.text(960, 850, "Tap to return to title", {
            fontSize: "32px",color: "#000000"
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: roly,
            y: 570,
            duration: 700,
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: badge,
            y: 520,
            duration: 900,
            yoyo: true,
            repeat: -1
        })
        this.input.once("pointerdown", () => {
            this.scene.start("start");
        })

        
    }
}

let config = {
    type: Phaser.WEBGL,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    parent: "root",
    backgroundColor: 0xffffff,
    scene: [start, gameplayScene, BadgeMessageScene, VictoryScene]
}

let game = new Phaser.Game(config);