/*
    ENTREGA 3: limpieza de código y mejora en los turnos y el reparto
    Siguiente: crear el array cartasMesaJugadores y poder rellenarlo clicando en las cartas (de J1)
               Añadir -> El canPlay funcionará a partir de que juegue J1.

    1. Para pasar a pantalla completa basta con pulsar F11.
    2. He seguido el tutorial de Emanuele de Deck of cards management.
    3. Las cartas se irán generando en el mazo y deslizándose con Timer y Tween hacia los jugadores.
    4. La imagen de las cartas será un spritesheet. Este tendrá todas las cartas juntas, con los personajes repetidos y siguiendo
       un cierto orden. El orden de la spritesheet será el mismo que hay en Trello. Es decir: asesino, asesino, guardia, guardia, guardia...
    5. Usar delete, ya que deja un undefined(?)
*/

var gameOptions = {
    gameWidth: 1280,
    gameHeight: 720,
    cardSheetWidth: 710/4,
    cardSheetHeight: 212,
    cardScale: 0.8,
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
var indiceMazo = 0; //Para ir sacando las cartas del mazo, recorre todas las cartas
var turno = 0; //Aumenta cada vez que juega un jugador
var numeroJugadores = 2;
var cartasManoJugadores = [];
var canPlay = true;

//Posiciones para repartir las cartas. Facilita la lectura del código
var posJ1 = [gameOptions.gameWidth-gameOptions.cardSheetWidth/2, gameOptions.gameHeight-gameOptions.cardSheetHeight/2];
var posJ2 = [gameOptions.gameWidth*2/3, gameOptions.cardSheetHeight/2];
var posJ3 = [gameOptions.gameWidth/2, gameOptions.cardSheetHeight/2];
var posJ4 = [gameOptions.gameWidth/3, gameOptions.cardSheetHeight/2];

function create() {

    //Fondo -> Cargar como fondo
    game.add.sprite(0, 0, 'mesa');

    //Imagen que simula el mazo
    cartaMazo = game.add.image(game.world.centerX, game.world.centerY, 'carta');
    cartaMazo.anchor.setTo(0.5, 0.5);
    cartaMazo.angle=90;

    //Creación del mazo 
    mazo = Phaser.ArrayUtils.numberArray(0,3); //Esta versión tiene 4 cartas: guardia, guardia, princesa, rey
    Phaser.ArrayUtils.shuffle(mazo);
}


function sacarCartaMazo() {
    //La carta se genera encima del mazo
    var carta = game.add.sprite(game.world.centerX, game.world.centerY, "carta");
    carta.anchor.setTo(0.5,0.5);
    carta.angle = 90;

    var tipo = mazo[indiceMazo];
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
    if(indiceMazo>2){
        //cartaMazo.kill();     //Una de dos
        cartaMazo.destroy();
    }

    //Hacer el desplazamiento de la carta.
    animacionRepartir(carta,tipo);
    
    return carta;
}

function animacionRepartir(carta, tipo){
    //Con el resto se calcula hacia quien va la carta. Si va para el primer jugador, se hace la animación hacia él.
    numJugador = turno%numeroJugadores;
    
    carta.angle = 0; 
    //Se "da la vuelta" a la carta, revelando el personaje. Sólo para el J1
    if(numJugador===0)    
        carta.loadTexture("cartas", tipo); 
    
    var tween;
    if(numJugador === 0){
        if(cartasManoJugadores[0] == null) {
            tween = game.add.tween(carta).to({
                x: posJ1[0], 
                y: posJ1[1]
            },500,Phaser.Easing.Cubic.Out, true);
        }else{
            tween = game.add.tween(carta).to({
                x: posJ1[0]-gameOptions.cardSheetWidth-32, 
                y: posJ1[1]
            },500,Phaser.Easing.Cubic.Out, true);
        }
    }else if(numJugador === 1){
        tween = game.add.tween(carta).to({
            x: posJ2[0], 
            y: posJ2[1]
        },500,Phaser.Easing.Cubic.Out, true);
    }else if(numJugador === 2){
        tween = game.add.tween(carta).to({
            x: posJ3[0],
            y: posJ3[1]
        },500,Phaser.Easing.Cubic.Out, true);
    }else{
        tween = game.add.tween(carta).to({
            x: posJ4[0], 
            y: posJ4[1]
        },500,Phaser.Easing.Cubic.Out, true);
    }
}



function update(){
    if(canPlay){
        canPlay = false;
        manejadorTurnos();
        //game.time.events.add(500, manejadorTurnos, this);         //Para añadir retardo
    }else{
        game.input.onTap.add(onTap);
    }
}

function onTap(){
    if(indiceMazo<4) canPlay = true;
}

function manejadorTurnos(){
    numJugador = turno%numeroJugadores;
    if(turno<numeroJugadores){ //Poner que el primero sea distinto. La primera vez siempre será a cero, las siguientes con push
        cartasManoJugadores[numJugador] = [sacarCartaMazo()];
    }else{
        cartasManoJugadores[numJugador].push(sacarCartaMazo()); //        CREO
    }
    indiceMazo++;
    turno++;
}
