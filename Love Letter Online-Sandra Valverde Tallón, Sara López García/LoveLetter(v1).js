/*
    ENTREGA 3: limpieza de código y mejora en los turnos y el reparto
    Siguiente: crear el array cartasMesaJugadores y poder rellenarlo clicando en las cartas (de J1)
               Añadir -> El canPlay funcionará a partir de que juegue J1, hasta entonces Timer.

    ENTREGA 4: interacción con las cartas del jugador al clicar sobre ellas. Reparto automático en la primera ronda.
    Siguiente: crear el array cartasMesaJugadores y poder rellenarlo clicando en las cartas (de J1)

    1. Para pasar a pantalla completa basta con pulsar F11.
    2. He seguido el tutorial de Emanuele de Deck of cards management.
    3. Las cartas se irán generando en el mazo y deslizándose con Timer y Tween hacia los jugadores.
    4. La imagen de las cartas será un spritesheet. Este tendrá todas las cartas juntas, con los personajes repetidos y siguiendo
       un cierto orden. El orden de la spritesheet será el mismo que hay en Trello. Es decir: asesino, asesino, guardia, guardia, guardia...
    5. Usar destroy al echar carta, ya que deja un undefined(?)
    6. Según como está el código, siempre va a empezar J1 (persona real). Para cambiarlo habría que asignar un índice al J1, en vez de
       acceder con [0][0] y [0][1] a sus cartas. La segunda coordenada sí se mantiene.
*/

var gameOptions = {
    gameWidth: 1280,
    gameHeight: 720,
    cardSheetWidth: 710/4,
    cardSheetHeight: 416/2,
    //cardScale: 0.8,
}
var game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('mesa', 'assets/prueba/mesa.png');//mejor en el css como background
    game.load.image('carta', 'assets/prueba/carta.png');
    game.load.image('descarte', 'assets/prueba/descarte.png');
    game.load.spritesheet("cartas","assets/prueba/cartaSHEET.png",gameOptions.cardSheetWidth,gameOptions.cardSheetHeight);

}

//variables globales
var mazo;
var cartaMazo;
var indiceMazo = 0; //Para ir sacando las cartas del mazo, recorre todas las cartas
var turno = 0; //Aumenta cada vez que juega un jugador
var numeroJugadores = 4;
var cartasManoJugadores = [];
var cartasMesaJugadores = [];
var cartaDescarteJugadores = [];
var canPlay = true;
var finReparto = false;

var numJugador;

//Posiciones para repartir las cartas. Facilita la lectura del código
var posManoJ1 = [gameOptions.gameWidth-gameOptions.cardSheetWidth/2, gameOptions.gameHeight-gameOptions.cardSheetHeight/2];
var posManoJ2 = [gameOptions.gameWidth*2/3, gameOptions.cardSheetHeight/2+32];
var posManoJ3 = [gameOptions.gameWidth/2, gameOptions.cardSheetHeight/2+32];
var posManoJ4 = [gameOptions.gameWidth/3, gameOptions.cardSheetHeight/2+32];

var posManoJugadores = [posManoJ1, posManoJ2, posManoJ3, posManoJ4];
var posMesaJugadores = [   [ posManoJ1[0]-32-512, posManoJ1[1] ],   posManoJ2,   posManoJ3,   posManoJ4   ];

function create() {
    
    //Fondo -> Cargar como fondo
    game.add.sprite(0, 0, 'mesa');
    
    //Imagen que simula el mazo
    cartaMazo = game.add.image(game.world.centerX, game.world.centerY, 'carta');
    cartaMazo.anchor.setTo(0.5, 0.5);
    cartaMazo.angle=90;

    //Creación del mazo 
    mazo = Phaser.ArrayUtils.numberArray(0,7); //Esta versión tiene 8 cartas: guardia, guardia, princesa, rey, rey, rey, rey, rey
    Phaser.ArrayUtils.shuffle(mazo);

    //Creación de los objetos mesa. Para elegir a los demás jugadores y donde se posicionan sus cartas descartadas
    for(var i=0; i<numeroJugadores; i++){
        cartasMesaJugadores[i]=game.add.group();
        cartaDescarteJugadores[i] = game.add.sprite(posMesaJugadores[i][0], posMesaJugadores[i][1],'descarte');
        cartaDescarteJugadores[i].anchor.setTo(0.5, 0.5);
        //if(finRepartir) cartasDescarteJugadores[i].inputEnabled;
     }
}


function sacarCartaMazo() {
    //La carta se genera encima del mazo
    var carta = game.add.sprite(game.world.centerX, game.world.centerY, "carta");
    carta.anchor.setTo(0.5,0.5);
    carta.angle = 90;

    var tipo = mazo[indiceMazo];
     //Se asignan las propiedades de la carta                               //Cambiar a switch
    if(tipo===2){
        carta.valor = 8;
        carta.personaje = "Princesa";
    }else if(tipo===0 || tipo===1){
        carta.valor = 1;
        carta.personaje = "Guardia";
    }else{
        carta.valor = 6;
        carta.personaje = "Rey";
    }

    //Cuando se acaba el mazo, se quita la imagen que hacía de mazo
    if(indiceMazo>mazo.length-2){
        //cartaMazo.kill();     //Una de dos
        cartaMazo.destroy();
    }


    //Hacer el desplazamiento de la carta.
    animacionRepartir(carta,tipo);
    if(turno<numeroJugadores) canPlay = true;


    return carta;
}

function animacionRepartir(carta, tipo){
    carta.angle = 0; 
    //Se "da la vuelta" a la carta, revelando el personaje. Sólo para el J1
    //if(numJugador===0)                                                                                //UNCOMMENT  
        carta.loadTexture("cartas", tipo); 
    
    var tween;
    if(numJugador === 0){
        if(cartasManoJugadores[0] == null) {
            tween = game.add.tween(carta).to({
                x: posManoJugadores[0][0], 
                y: posManoJugadores[0][1]
            },500,Phaser.Easing.Cubic.Out, true);
        }else{
            tween = game.add.tween(carta).to({
                x: posManoJ1[0]-gameOptions.cardSheetWidth-32,                                                  //ACTUALIZAR EL RESTO
                y: posManoJ1[1]
            },500,Phaser.Easing.Cubic.Out, true);
        }
    }else if(numJugador === 1){
        tween = game.add.tween(carta).to({
            x: posManoJ2[0], 
            y: posManoJ2[1]
        },500,Phaser.Easing.Cubic.Out, true);
    }else if(numJugador === 2){
        tween = game.add.tween(carta).to({
            x: posManoJ3[0],
            y: posManoJ3[1]
        },500,Phaser.Easing.Cubic.Out, true);
    }else{
        tween = game.add.tween(carta).to({
            x: posManoJ4[0], 
            y: posManoJ4[1]
        },500,Phaser.Easing.Cubic.Out, true);
    }
}


function update(){ 
    if(canPlay){
        canPlay = false;
        if(turno<=numeroJugadores){  
            game.time.events.add(250, manejadorTurnos, this);         //Para añadir retardo en el reparto inicial
        }else{
            manejadorTurnos();
        }
    }else{
        //game.input.onTap.add(onTap);
        if(finReparto){
            cartasManoJugadores[0][0].events.onInputUp.add(elegirCarta);
            cartasManoJugadores[0][1].events.onInputUp.add(elegirCarta);
        }
    }
}

function elegirCarta(carta){
    if(numJugador===0){                                         //Pero para todos los jugadores
        cartasMesaJugadores[0].add(carta);
        
        animacionDescartar(carta);
        
        
    }
}

function animacionDescartar(carta){
    var tween;
    if(numJugador === 0){
        
            tween = game.add.tween(carta).to({
                x: posMesaJugadores[0][0], 
                y: posMesaJugadores[0][1]
            },500,Phaser.Easing.Cubic.Out, true);
        
     }
    // else if(numJugador === 1){
    //     tween = game.add.tween(carta).to({
    //         x: posManoJ2[0], 
    //         y: posManoJ2[1]
    //     },500,Phaser.Easing.Cubic.Out, true);
    // }else if(numJugador === 2){
    //     tween = game.add.tween(carta).to({
    //         x: posManoJ3[0],
    //         y: posManoJ3[1]
    //     },500,Phaser.Easing.Cubic.Out, true);
    // }else{
    //     tween = game.add.tween(carta).to({
    //         x: posManoJ4[0], 
    //         y: posManoJ4[1]
    //     },500,Phaser.Easing.Cubic.Out, true);
    // }

    //carta.destroy();
    game.time.events.add(750, finTurno, this);
}

function finTurno(){
     //if(indiceMazo<mazo.length) canPlay = true; //Esta será distinta. canPlay se pone a true cuando le toca al siguiente jugador y si no se ha acabado el mazo.   
    
    turno++;
    canPlay = true;
}



function manejadorTurnos(){
    //Con el resto se calcula hacia quien va la carta. Si va para el primer jugador, se hace la animación hacia él.
    numJugador = turno%numeroJugadores;
    //La primera vez siempre será así, las siguientes con push. Si no, da error de undefined.
    
    if(turno<numeroJugadores){ 
        cartasManoJugadores[numJugador] = [sacarCartaMazo()];
    }else{
        cartasManoJugadores[numJugador].push(sacarCartaMazo());
        //Ya se ha terminado de repartir, así que ya se puede interactuar con las cartas.
        finReparto=true;
    }

    //Se permite interactuar con el ratón clicando en las cartas
    if(numJugador===0) {
        if(cartasManoJugadores[0] != null)
            cartasManoJugadores[0][0].inputEnabled=true;
        if(cartasManoJugadores[0][1] != null)
            cartasManoJugadores[0][1].inputEnabled=true;
    }

    indiceMazo++;
    if(!finReparto) turno++;
}
