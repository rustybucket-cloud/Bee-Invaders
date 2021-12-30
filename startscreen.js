class StartScreen extends Phaser.Scene {
    constructor() {
        super("StartScreen")
    }
    
    preload()
    { 
      this.load.image("arrows", "./assets/instructions/arrows.png")
      this.load.image("space", "./assets/instructions/spacebar.jpg")
    }
    create() {
        let clickText = this.add.text(275, 150, "Click To Start", { fontSize: "32px", fill: "#000000" })

        let jumpText = this.add.text(380, 200, "Fly", { fontSize: "24px", fill: "#000000" })
        let rightText = this.add.text(575, 385, "Run Right", { fontSize: "24px", fill: "#000000" })
        let leftText = this.add.text(125, 385, "Run Left", { fontSize: "24px", fill: "#000000" })
        this.add.image(400, 350, "arrows")

        let shootText = this.add.text(370,485, "Shoot", { fontSize: "24px", fill: "#000000" })
        this.add.image(400, 550, "space").setScale(.25)

        this.input.on("pointerup", () =>{
            this.scene.stop("StartScreen")
            this.scene.start("MyGame")
        })
    }
}
