const gameState = {}
let totalScore = 0;

let bulletCanSend = true
class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super("MyGame");
    }


    preload ()
    {
        this.load.image('player', './assets/shipai.png');
        this.load.image('floor', './assets/floor.png');
        this.load.image('enemy', './assets/bee.png');
        this.load.image('bullet', './assets/bullets.png')

        // load spritesheets
        this.load.atlas("emery", "./assets/emery/spritesheet.png", "./assets/emery/spritesheet.json")
        this.load.atlas("henry", "./assets/henry/henry-spritesheet.png", "./assets/henry/henry-spritesheet.json")
        this.load.atlas("mason", "./assets/mason/mason-spritesheet.png", "./assets/mason/mason-spritesheet.json")
        this.load.atlas("evy", "./assets/evy/evy-spritesheet.png", "./assets/evy/evy-spritesheet.json")

        // select random background image
        const backgroundNumber = Math.floor(Math.random() * 8)
        let background;
        switch(backgroundNumber) {
          case 1:
            background = "./assets/backgrounds/blue_desert.png"
            break
          case 2:
            background = "./assets/backgrounds/blue_grass.png"
            break
          case 3:
            background = "./assets/backgrounds/blue_land.png"
            break
          case 4:
            background = "./assets/backgrounds/blue_shroom.png"
            break
          case 5: 
            background = "./assets/backgrounds/colored_grass.png"
            break
          case 6:
            background = "./assets/backgrounds/colored_land.png"
            break
          case 7:
            background = "./assets/backgrounds/colored_shroom.png"
            break
        }
        this.load.image("background", background)
      
    }
      
    create ()
    {
      // add background
      this.add.image(300, 100, "background")
        // create player
        gameState.player = this.physics.add.sprite(400, 524, 'emery', 'walk0').setScale(.25)
        gameState.direction = 1 // direction that player moves
        gameState.accelerator = 1 // speed that enemies move
        gameState.player.setCollideWorldBounds(true)

        // crate player animations
        this.anims.create({
          key: "run",
          framerate: 1,
          frames: this.anims.generateFrameNames("emery", { prefix: "walk", start: 0, end: 2 }),
          repeat: 1
        })
        this.anims.create({
          key: "shoot",
          framerate: 1,
          frames: this.anims.generateFrameNames("emery", { prefix: "shoot", start: 2, end: 2 }),
          repeat: 1
        })

        // create ground
        let platforms = this.physics.add.staticGroup()
        //gameState.floor = this.add.rectangle(400, 600, 850, 50, 0x000000)
        gameState.floor = platforms.create(400, 600, 'floor').refreshBody();
        //gameState.floor.scaleX = 2

        // create score
        gameState.score = 0
        gameState.scoreText = this.add.text(50, 450, `Score: ${gameState.score}`, { fontSize: "15px", fill: "#000000" })

        // ship stops on ground
        this.physics.add.collider(gameState.player, platforms)
        
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.createEnemies = (physics) => {
            // create enemies
            gameState.enemies = []
            gameState.xValues = [51, 130, 210, 290, 370, 450, 530, 610, 690] // x values enemies start at
            gameState.endRow = 8
            let yValues = [10, 60, 110] // y values enemies start at
            yValues.forEach( row => {
                for (let i = 0; i <= 8; i ++) {
                    let enemy = {
                        sprite: physics.add.sprite(gameState.xValues[i], row, 'enemy').setScale(.7),
                        end: i == 8 ? true : false,
                        row: i
                    }
                    gameState.enemies.push(enemy)
                    enemy.sprite.flipX = true
                    enemy.sprite.body.setSize(100, 50)
                }
            })
            gameState.enemies.forEach( enemy => {
                physics.add.collider( enemy.sprite, platforms, () => {
                    this.scene.stop("MyGame")
                    this.scene.start("EndScreen")
                })
            })
        }
        gameState.createEnemies(this.physics)
        this.beesFlipped = true

        this.groundEnemies = this.physics.add.group()
        this.groundEnemiesArr = []
        this.groundEnemiesCanRun = true
        this.physics.add.collider(this.groundEnemies, gameState.player, () => {
          this.scene.stop("MyGame")
          this.scene.start("EndScreen")
        })
        // ground enemy animations
        this.anims.create({
          key: "henry",
          framerate: 1,
          frames: this.anims.generateFrameNames("henry", { prefix: "roll", start: 0, end: 2 }),
          repeat: -1
        })
        this.anims.create({
          key: "mason",
          framerate: 1,
          frames: this.anims.generateFrameNames("mason", { prefix: "run", start: 0, end: 2 }),
          repeat: -1
        })
        this.anims.create({
          key: "evy",
          framerate: 1,
          frames: this.anims.generateFrameNames("evy", { prefix: "run", start: 0, end: 2 }),
          repeat: -1
        })

        gameState.bullets = [] // bullets

        gameState.enemyBullets = this.physics.add.group()
        gameState.bulletTime = true

        this.physics.add.collider(gameState.player, gameState.enemyBullets, () => {
            this.scene.stop("MyGame")
            this.scene.start("EndScreen")
        })
    }

    update()
    {

         // shoot bullet
        if (gameState.cursors.space.isDown) {
            if (bulletCanSend) {
              gameState.player.setVelocityX(0);
              gameState.player.play("shoot"), true
                let bullet = this.physics.add.sprite(gameState.player.x, gameState.player.y - 15, 'bullet').setScale(.05)
                gameState.bullets.push(bullet)
                this.physics.add.overlap(bullet, gameState.enemiesGroup, () => {
                    bullet.destroy()
                })
                bullet.setVelocity(0, -200)

                // destroy bullet and enemy on collision
                gameState.enemies.forEach( enemy => {
                    this.physics.add.collider(bullet, enemy.sprite, () => {
                        bullet.destroy()
                        enemy.sprite.destroy()
                        gameState.enemies = gameState.enemies.filter( item => {
                            return item !== enemy
                        })

                        // add to score
                        gameState.score++
                        totalScore++
                        gameState.scoreText.setText(`Score: ${gameState.score}`)
                    })
                })
                allowBullets()
            }
        }
        // move player
        else if (gameState.cursors.left.isDown) {
            gameState.player.setVelocityX(-160);
            gameState.player.flipX = 
            gameState.player.play("run", true)
        } else if (gameState.cursors.right.isDown) {
            gameState.player.setVelocityX(160);
            gameState.player.flipX = false
            gameState.player.play("run", true)
        } else {
            gameState.player.setVelocityX(0);
            //gameState.player.play("run")
        }

        // jump player
        if (gameState.cursors.up.isDown) {
          gameState.player.setVelocityY(-100)
        }
        else {
          gameState.player.setVelocityY(100)
        }
       
        // moves bullets upword, deletes bullet if out of screen
        gameState.bullets.forEach( bullet => {
            if (bullet.y < 0) {
                bullet.destroy()
            }
        })

        // create enemy bullets
        if (gameState.bulletTime && gameState.enemies.length > 0) {
            let index = Math.floor(Math.random() * gameState.enemies.length)
            let shootingEnemy = gameState.enemies[index]
            let enemyBullet = gameState.enemyBullets.create(shootingEnemy.sprite.x, shootingEnemy.sprite.y, "bullet").setScale(.05)
            enemyBullet.setVelocity(0, 200)
            allowEnemyBullet()

            this.physics.add.overlap(enemyBullet, gameState.floor, () => {
                enemyBullet.destroy()
            })
        }

        // create ground enemies
        if (this.groundEnemiesCanRun && Math.random() < .005) {
          const rightOrLeft = Math.random() > .5 ? 800 : 0
          const enemy = {
            sprite: this.groundEnemies.create(rightOrLeft, 550, "henry", "roll0"),
            direction: rightOrLeft === 800 ? "left" : "right"
          }
          enemy.sprite.setVelocityX(enemy.direction === "left" ? -100 : 100)
          const chooseChild = Math.random()
          if (chooseChild < .33) {
            enemy.sprite.play("henry", true)
            enemy.sprite.setScale(.05)
            enemy.name = "henry"
          }
          else if (chooseChild > .33 && chooseChild < .66 ) {
            enemy.sprite.play("mason", true)
            enemy.sprite.body.setSize(100, 250)
            enemy.sprite.setScale(.2)
            enemy.sprite.flipX = enemy.direction === "left" ? true : false
            enemy.sprite.y -= 15
            enemy.name = "mason"
          }
          else {
            enemy.sprite.play("evy", true)
            enemy.sprite.body.setSize(100, 200)
            enemy.sprite.setScale(.15)
            enemy.sprite.flipX = enemy.direction === "left" ? true : false
            enemy.sprite.y -= 13
            enemy.name = "evy"
          }
          this.groundEnemiesArr.push(enemy)
          this.groundEnemiesCanRun = false
        }
        this.groundEnemiesArr.forEach(enemy => {
          if (enemy.name === "henry") enemy.sprite.rotation -= enemy.direction === "left" ? .05 : -.05
          // destroys ground enemies when they are off screen
          if (enemy.sprite.x < 0 || enemy.sprite.x > 900) {
            this.groundEnemiesCanRun = true
            this.groundEnemies.clear();
            this.groundEnemiesArr.shift()
          }
        }, this.physics)
        

        // if enemy touches one of the sides, all of the enemies change direction
        let end = false
        gameState.enemies.forEach( (enemy, i) => {
          enemy.sprite.flipX = this.beesFlipped
                if (enemy.sprite.x >= 751) {
                    gameState.direction = gameState.accelerator * -1
                    gameState.enemies.forEach( enemy => {
                        enemy.sprite.y += 3
                    })
                    gameState.accelerator += .01
                    // for a bug where the end row scoots to the left every change of direction
                    gameState.endRow = enemy.row
                    gameState.enemies.forEach( enemyToMove => {
                        if (enemyToMove.row === gameState.endRow) enemyToMove.sprite.x = 750
                        else enemyToMove.sprite.x += gameState.direction - 1.5    
                    })
                    // flips bees
                    this.beesFlipped = false
                }
                else if (enemy.sprite.x <= 50) {
                    gameState.direction = gameState.accelerator
                    gameState.enemies.forEach( enemy => {
                        enemy.sprite.y += 3
                    })
                    gameState.accelerator += .01
                    this.beesFlipped = true
                }
                enemy.sprite.x += enemy.row === gameState.endRow ? 0 : gameState.direction
                gameState.endRow = -1
        })

        // when there are no more enemies, create more enemies
        if (gameState.enemies.length === 0) {
            gameState.createEnemies(this.physics)
            if (bulletCanSend) allowBullets()
            gameState.bullets.forEach( bullet => bullet.destroy())
        }
    }
}

// makes user wait 1 second before being able to shoot bullet
function allowBullets() {
    bulletCanSend = false
    setTimeout(() => {
        bulletCanSend = true
    }, 1000)
}

// send enemy bullet every second
function allowEnemyBullet() {
    gameState.bulletTime = false
    setTimeout( () => {
        gameState.bulletTime = true
    }, 1000)
}