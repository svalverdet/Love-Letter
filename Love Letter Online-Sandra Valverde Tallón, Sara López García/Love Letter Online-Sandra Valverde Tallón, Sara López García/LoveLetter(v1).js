/*
    1. Para pasar a pantalla completa basta con pulsar F11.
    2. He seguido el tutorial de Emanuele de Deck of cards management.
    3. Las cartas se irán generando en el mazo y deslizándose con Timer y Tween hacia los jugadores.
    4. La imagen de las cartas será un spritesheet. Este tendrá todas las cartas juntas, con los personajes repetidos y siguiendo
       un cierto orden. El orden de la spritesheet será el mismo que hay en Trello. Es decir: asesino, asesino, guardia, guardia, guardia...
*/

var gameOptions = {
    gameWidth: 1280,
    gameHeight: 720,
    cardSheetWidth: 710/4,
    cardSheetHeight: 212,
    cardScale: 0.8
}
var game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('mesa', 'assets/prueba/mesa.png');//mejor en el css como background
    game.load.image('carta', 'assets/prueba/carta.png');
    game.load.spritesheet("cartas","assets/prueba/cartaSHEET.png",gameOptions.cardSheetWidth,gameOptions.cardSheetHeight);

}

//variables globales
var mazo;
var cartaMazo;
var indiceMazo = 0; //Para ir sacando las cartas del mazo, ¿hacer local?
var turno = 0; //Aumenta cada vez que juega un jugador
var numeroJugadores = 2;
var cartasManoJugadores = [];

function create() {

    game.add.sprite(0, 0, 'mesa');
    cartaMazo = game.add.sprite(game.world.centerX, game.world.centerY, 'carta'); //Imagen que simula el mazo -> con load image mejor
    cartaMazo.anchor.setTo(0.5, 0.5);
    cartaMazo.angle=90;

    //Creación del mazo 
    mazo = Phaser.ArrayUtils.numberArray(0,3); //Esta versión tiene 4 cartas: guardia, guardia, princesa, rey
    Phaser.ArrayUtils.shuffle(mazo);
    
    //Se reparte la primera carta al jugador
    //game.time.events.add(2000, manejadorTurnos, this);
    manejadorTurnos();

}

function sacarCartaMazo(indiceCarta) {
    //La carta se genera encima del mazo
    var carta = game.add.sprite(game.world.centerX, game.world.centerY, "carta");
    carta.anchor.setTo(0.5,0.5);
    carta.angle = 90;

    var tipo = mazo[indiceCarta];
     //Se asignan las propiedades de la carta
    if(tipo==2){
        carta.valor = 8;
        carta.personaje = "Princesa";
    }else if(tipo==3){
        carta.valor = 6;
        carta.personaje = "Rey";
    }else{
        carta.valor = 1;
        carta.personaje = "Guardia";
    }

    //Cuando se acaba el mazo, se quita la imagen que hacía de mazo
    if(indiceCarta>2){
        cartaMazo.kill();
    }

    //Hacer la animación.
    //var animacion = game.time.events.add(2000, animar, this, carta, tipo); //Espera 3 segundos y se reparte.
    animar(carta,tipo);
    
    
    return carta;
}

function animar(carta, tipo){
    carta.angle = 0; 
    carta.loadTexture("cartas", tipo); //Se "da la vuelta" a la carta, revelando el personaje. Sólo para el J1
    var tween = undefined;
    numJugador = turno%numeroJugadores;

    if(numJugador === 0){ //Con el resto se calcula hacia quien va la carta. Si va para el primer jugador, se hace la animación hacia él
        tween = game.add.tween(carta).to({
           // x: gameOptions.gameWidth-gameOptions.cardSheetWidth/2, //Coordenadas aproximadas
            x: 64,
            y: gameOptions.gameHeight-gameOptions.cardSheetHeight/2
        },500,Phaser.Easing.Cubic.Out, true);
    }else{
        tween = game.add.tween(carta).to({
            x: gameOptions.gameWidth/2, //Coordenadas aproximadas
            y: gameOptions.cardSheetHeight/2
        },500,Phaser.Easing.Cubic.Out, true);
    }
}

function manejadorTurnos(){
    numJugador = turno%numeroJugadores;
    if(numJugador === 0){
        cartasManoJugadores[0] = [sacarCartaMazo(indiceMazo)];
        indiceMazo++;
    }else{
        //cartasManoJugadores[0].push(sacarCartaMazo(indiceMazo));
        cartasManoJugadores[1] = [sacarCartaMazo(indiceMazo)];
        indiceMazo++;
    }
    turno++;
    

    if(indiceMazo < 4){
        game.time.events.add(2050, manejadorTurnos, this);
        //manejadorTurnos();
    }
}

function update(){


}

