class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    preload() {
        //load images/tile sprites
        this.load.image('Ball', './assets/Ball.png');
        this.load.image('sheepBrown', './assets/sheepBrown.png');
        this.load.image('mainBackground', './assets/mainBackground.png');

        //load spritesheet
        this.load.spritesheet('BrownAnim', './assets/BrownAnim.png', {frameWidth: 404, frameHeight: 285, startFrame: 0, endFrame: 2});
    }

    create() {
        //place tile sprite
        this.mainBackground = this.add.tileSprite(0, 0, 1920, 1080, 'mainBackground').setOrigin(0,0);

        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00ff00).setOrigin(0, 0);

        //white borders
        this.add.rectangle(0,0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        //add rocket (p1)
        this.p1Ball = new Ball(this, game.config.width/2, game.config.height - (borderUISize * 1.5), 'Ball').setOrigin(0.5, 0);

        //add spaceships (x3)
        this.sheep01 = new Sheeps(this, game.config.width + borderUISize*6, borderUISize*4, 'sheepBrown', 0, 30).setOrigin(0,0);
        this.sheep02 = new Sheeps(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'sheepBrown', 0, 20).setOrigin(0,0);
        this.sheep03 = new Sheeps(this, game.config.width, borderUISize*6 + borderPadding*4, 'sheepBrown', 0, 10).setOrigin(0,0);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'BrownAnim',
            frames: this.anims.generateFrameNumbers('BrownAnim', {start:0, end: 2, first:0}),
            frameRate: 10
        });

        //initalize Score
        this.p1Score = 0;

        //display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605', 
            align: 'right',
            padding: {
                top: 5, 
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        
        // GAME OVER flag
        this.gameOver = false;
        
        // 60-Second Play Clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart of ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }
    
    update (){
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.mainBackground.tilePositionX -= 4;
        this.p1Ball.update();

        //update spaceships (x3)
        if (!this.gameOver){
            this.p1Ball.update();         //update rocket sprite
            this.sheep01.update();           //update spaceships (x3)
            this.sheep02.update();
            this.sheep03.update();
        }

        //check collisions
        if (this.checkCollision(this.p1Ball, this.sheep03)){
            this.p1Ball.reset();
            this.shipExplode(this.sheep03);
        }
        if (this.checkCollision(this.p1Ball, this.sheep02)){
            this.p1Ball.reset();
            this.shipExplode(this.sheep02);
        }
        if (this.checkCollision(this.p1Ball, this.sheep01)){
            this.p1Ball.reset();
            this.shipExplode(this.sheep01);
        }
    }

    checkCollision(ball,sheep){
        //simple AABB(Axis-Aligned Bounding Boxes) checking
        if (ball.x < sheep.x + sheep.width && ball.x + ball.width > sheep.x && ball.y < sheep.y + sheep.height && ball.height + ball.y > sheep.y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(sheep) {
        // temporarily hide ship
        sheep.alpha = 0;

        // create explosion sprite at ship's position
        let boom = this.add.sprite(sheep.x, sheep.y, 'BrownAnim').setOrigin(0,0);
        boom.anims.play('BrownAnim');                         // play explode animation
        boom.on('animationcomplete', () => {                // callback after anim completes
            sheep.reset();                                   // reset ship position
            sheep.alpha = 1;                                 // make ship visble again
            boom.destroy();                                 // remove explosion sprite
        });

        //score add and repaint
        this.p1Score += sheep.points;
        this.scoreLeft.text = this.p1Score;

        this.sound.play('points');
    }
}