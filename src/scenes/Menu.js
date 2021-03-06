class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('select', './assets/Sounds/select.wav');
        this.load.audio('points', './assets/Sounds/points.wav');
        this.load.audio('goldenGoat', './assets/Sounds/goldenGoat.wav');

        this.load.image('MenuArt', './assets/MenuArt.png');
    }

    create() {
        //let's add the background image
        this.menuArt = this.add.tileSprite(0, 0, 1920, 1080, 'MenuArt').setOrigin(0,0);
        
        // menu text configuration
        // let menuConfig = {
        //     fontFamily: 'Courier',
        //     fontSize: '28px',
        //     backgroundColor: '#F3B141',
        //     color: '#843605',
        //     align: 'right',
        //     padding: {
        //         top: 5,
        //         bottom: 5,
        //     },
        //     fixedWidth: 0
        // }

        //show menu text
        // this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        // this.add.text(game.config.width/2, game.config.height/2, 'Use ← → arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        // menuConfig.backgroundColor = '#00FF00';
        // menuConfig.color = '#000';
        // this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
    
        // it says keys are undefined in Update so mayhaps this shall help that issue?
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    }

    update(){
        // easy mode
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            game.settings = {
                sheepSpeed: 3, 
                goatSpeed: 7,
                gameTimer: 60000
            }
            this.sound.play('select');
            this.scene.start('playScene');
        }

        // hard mode
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            game.settings = {
                sheepSpeed: 4, 
                goatSpeed: 8,
                gameTimer: 45000
            }
            this.sound.play('select');
            this.scene.start('playScene');
        }
    }
}