/*
    ENTREGA 4: interacción con las cartas del jugador al clicar sobre ellas. Reparto automático en la primera ronda. 
    Siguiente: crear el array cartasMesaJugadores y poder rellenarlo clicando en las cartas (de J1)

    (ACT) ENTREGA 5: se muestra la última carta descartada. Se rellena el array de las cartas en mesa del J1. 
                La partida continua hasta que se acaba el mazo.
    Siguiente: solución de errores pendientes (3/4) y limpieza de código

    1. Para pasar a pantalla completa basta con pulsar F11.
    2. He seguido el tutorial de Emanuele de Deck of cards management.
    3. Las cartas se irán generando en el mazo y deslizándose con Timer y Tween hacia los jugadores.
    4. La imagen de las cartas será un spritesheet. Este tendrá todas las cartas juntas, con los personajes repetidos y siguiendo
       un cierto orden. El orden de la spritesheet será el mismo que hay en Trello. Es decir: asesino, asesino, guardia, guardia, guardia...
    5. Según como está el código, siempre va a empezar J1 (persona real). Para cambiarlo habría que asignar un índice al J1, en vez de
       acceder con [0][0] y [0][1] a sus cartas. La segunda coordenada sí se mantiene.



    PENDIENTE:
    1. Por qué no están haciendo los bots la animacion de descarte. Sol
    2. Por qué no se cambia la imagen a la que debería. 
    3. por qué falla al volver al J1. Sol
    4. Hacer que no se puedan echar dos cartas a la vez. Sol

*/

var gameOptions = {
    gameWidth: 1280,
    gameHeight: 720,
    cardSheetWidth: 1416/8-1,
    cardSheetHeight: 214-1,
}
var game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('mesa', 'assets/prueba/mesa.png');//mejor en el css como background
    game.load.image('carta', 'assets/prueba/carta.png');
    game.load.image('descarte', 'assets/prueba/descarte.png');
    game.load.spritesheet("cartas","assets/prueba/cartaSHEET.png",gameOptions.cardSheetWidth,gameOptions.cardSheetHeight);

}

//variables globales
var mazo; //El mazo en sí
var cartaMazo; //Representa la imagen del mazo.
var indiceMazo = 0; //Para ir sacando las cartas del mazo, recorre todas las cartas
var turnos = 0; //Aumenta cada vez que juega un jugador
var numeroJugadores = 2; //Número entre 2 y 4.
var turnoJugador; //A qué jugador le toca jugar

var cartasManoJugadores = []; //Las cartas que tienen los jugadores en mano
var cartasMesaJugadores = []; //Las cartas que han ido descartando los jugadores
var cartaDescarteJugadores = []; //Objeto para interactuar con los demás jugadores y mostrar la última carta descartada

var cartaSeleccionada = false; //Para evitar que el J1 eche dos cartas a la vez
var canPlay = true; //Determina si es el turno del siguiente jugador
var finReparto = false; //Utilizada para hacer el reparto inicial automático.


//Posiciones para repartir las cartas. Facilita la lectura del código
var posManoJ1 = [gameOptions.gameWidth-gameOptions.cardSheetWidth/2, gameOptions.gameHeight-gameOptions.cardSheetHeight/2];
var posManoJ2 = [gameOptions.gameWidth*2/3, -gameOptions.cardSheetHeight/2+175];
var posManoJ3 = [gameOptions.gameWidth/2, -gameOptions.cardSheetHeight/2+175];
var posManoJ4 = [gameOptions.gameWidth/3, -gameOptions.cardSheetHeight/2+175];

var posManoJugadores = [posManoJ1, posManoJ2, posManoJ3, posManoJ4];
var posMesaJugadores = [   [ posManoJ1[0]-32-512, posManoJ1[1] ],   
                           [ posManoJ2[0]+256, posManoJ2[1]+156],   
                           [ posManoJ3[0], posManoJ3[1]+56],   
                           [ posManoJ4[0], posManoJ4[1]+56]   ];

function create() {
    
    //Cargar como fondo
    game.add.sprite(0, 0, 'mesa');
    
    //Imagen que simula el mazo
    cartaMazo = game.add.image(game.world.centerX, game.world.centerY, 'carta');
    cartaMazo.anchor.setTo(0.5, 0.5);
    cartaMazo.angle=90;

    //Creación del mazo 
    mazo = Phaser.ArrayUtils.numberArray(0,7); //Esta versión tiene 8 cartas: guardia, guardia, princesa, rey, rey, rey, rey, rey
    Phaser.ArrayUtils.shuffle(mazo);

    //Creación de los objetos mesa. Para elegir a los demás jugadores y donde se posicionan sus cartas descartadas
    //De hecho, representa al jugador
    for(var i=0; i<numeroJugadores; i++){
        cartaDescarteJugadores[i] = game.add.sprite(posMesaJugadores[i][0], posMesaJugadores[i][1],'descarte');
        cartaDescarteJugadores[i].anchor.setTo(0.5, 0.5);
        cartaDescarteJugadores[i].inputEnabled=true;
        cartaDescarteJugadores[i].vivo = true;
     }
     
}


function sacarCartaMazo() {
    //La carta a repartir se genera encima del mazo
    var carta = game.add.sprite(game.world.centerX, game.world.centerY, 'carta');
    carta.anchor.setTo(0.5,0.5);
    carta.angle = 90;

    //Según el índice se accede al tipo de carta
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


    //Desplazamiento de la carta hacia la mano del jugador.
    animacionRepartir(carta,tipo);

    //Reparto automático de la primera ronda
    if(turnos<numeroJugadores) canPlay = true;

    
    return carta;
}

function animacionRepartir(carta, tipo){
    carta.angle = 0; 
    //Se "da la vuelta" a la carta, revelando el personaje. Sólo para el J1
    //if(turnoJugador===0)                                                                                //UNCOMMENT  
        carta.loadTexture('cartas', tipo); 
    
    var tween;
    if(turnoJugador===0){
        if(turnos ===0 || cartasManoJugadores[0][0] === undefined) {
            tween = game.add.tween(carta).to({
                x: posManoJugadores[0][0], 
                y: posManoJugadores[0][1]
            },500,Phaser.Easing.Cubic.Out, true);
        }else{
            tween = game.add.tween(carta).to({
                x: posManoJugadores[0][0]-gameOptions.cardSheetWidth-32,
                y: posManoJugadores[0][1]
            },500,Phaser.Easing.Cubic.Out, true);
        } 
    }else{
        tween = game.add.tween(carta).to({
            x: posManoJugadores[turnoJugador][0], 
            y: posManoJugadores[turnoJugador][1]
        },500,Phaser.Easing.Cubic.Out, true);
    }
}


function update(){ 
    //Si es el turno del siguiente jugador, se comprueba qué hacer
    if(canPlay){
        canPlay = false;
        //Se añade un retardo al reparto inicial
        if(turnos<=numeroJugadores){  
            game.time.events.add(250, manejadorTurnos);
        }else{
            manejadorTurnos();
        }
    }
}

function jugarBot(){
    if(turnoJugador!==0){
        var indice = Math.floor(Math.random()*2);
        var carta = cartasManoJugadores[turnoJugador][indice];     //Automático
        if(cartasMesaJugadores[turnoJugador]==null)   cartasMesaJugadores[turnoJugador] = [carta];
        else cartasMesaJugadores[turnoJugador].push(carta);
        animacionDescartar(carta, indice);
    }

    
}

function elegirCarta(carta, a, b, indice){
    if(turnoJugador===0 && cartaSeleccionada === false){ 
        cartaSeleccionada = true;                                      
        if(cartasMesaJugadores[0]==null)    cartasMesaJugadores[0]=[carta];
        else    cartasMesaJugadores[0].push(carta);
        
        animacionDescartar(carta, indice);
    }
}

function animacionDescartar(carta, indice){
    var tween;
    //if(turnoJugador === 0){
        tween = game.add.tween(carta).to({
            x: posMesaJugadores[turnoJugador][0], 
            y: posMesaJugadores[turnoJugador][1]
        },500,Phaser.Easing.Cubic.Out, true);
        //Al terminar la animación, se cambia la imagen de descarte de jugadores.
        tween.onComplete.add(function() {
            cartaDescarteJugadores[turnoJugador].loadTexture('cartas', carta.frame); 
            delete cartasManoJugadores[turnoJugador][indice];
        }); 
    
    game.time.events.add(1250, finTurno, this);
}

function finTurno(){
    if(indiceMazo<mazo.length){ 
        //canPlay se pone a true cuando le toca al siguiente jugador y si no se ha acabado el mazo y si quedan vivos.   
        if(turnoJugador===0) cartaSeleccionada = false;
        turnos++;
        canPlay = true;
    }
}



function manejadorTurnos(){
    //Con el resto se calcula hacia quién va la carta.
    turnoJugador = turnos%numeroJugadores;

    //if-else evita el error de undefined porque al pricipio el array está vacío.
    if(turnos<numeroJugadores){ 
        cartasManoJugadores[turnoJugador] = [sacarCartaMazo()];
    }else{
        if(cartasManoJugadores[turnoJugador][0]==undefined){
            cartasManoJugadores[turnoJugador][0] = sacarCartaMazo();
        }else{
            cartasManoJugadores[turnoJugador][1] = sacarCartaMazo();
        }

        //Ya se ha terminado de repartir, así que ya se puede interactuar con las cartas.
        finReparto=true;
    }

    //Se permite interactuar con el ratón clicando en las cartas
    if(turnoJugador===0) {
        if(cartasManoJugadores[0] != undefined)
            cartasManoJugadores[0][0].inputEnabled=true;
        if(cartasManoJugadores[0][1] != undefined)
            cartasManoJugadores[0][1].inputEnabled=true;
    }

    if(finReparto){
        if(cartasManoJugadores[0][0] !== undefined) cartasManoJugadores[0][0].events.onInputUp.add(elegirCarta, this, 0, 0);
        if(cartasManoJugadores[0][1] !== undefined) cartasManoJugadores[0][1].events.onInputUp.add(elegirCarta, this, 0, 1);
        jugarBot();
    }
    else{
        turnos++;
    }

    indiceMazo++;
}
