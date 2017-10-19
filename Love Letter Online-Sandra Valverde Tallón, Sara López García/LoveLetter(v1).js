var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('mesa', 'assets/prueba/mesa.png');//mejor en el css como background(?)
    game.load.image('carta', 'assets/prueba/carta.png');

}

//variables globales
var cartaPrueba;

function create() {

    game.add.sprite(0, 0, 'mesa');
    cartaPrueba = game.add.sprite(game.world.centerX, game.world.centerY, 'carta');

    //para que la carta rote:
    cartaPrueba.anchor.setTo(0.5, 0.5);
    cartaPrueba.angle=90;
    
    //pruebas de fullscreen
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
    game.input.onDown.add(gofull, this);//cambiar por un botón en vez de pulsar click

}

function gofull() {
    if (game.scale.isFullScreen){game.scale.stopFullScreen();}
    else{game.scale.startFullScreen(false);}
}

function update(){


}
