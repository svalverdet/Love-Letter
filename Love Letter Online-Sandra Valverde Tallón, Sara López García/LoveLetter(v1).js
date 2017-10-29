/*
    ENTREGA 8: más efectos añadidos.
    - Efecto Timador terminado.
    - Efecto Rey terminado.
    - Efecto Guardia empezado.
    
    Siguiente: depurar errores, terminar guardia y asesino, hacer el descarte de la ultima carta una vez un jugador muere.


    ENTREGA 9: terminado guardia + botones añadidos. Cuadro de ayuda hecho. hacer el descarte de la ultima carta una vez un jugador muere. cartas cubiertas/descubiertas.
    Ahora: hacer la animacion, habilitar los botones para el guardia.

    1. Para pasar a pantalla completa basta con pulsar F11.
    2. He seguido el tutorial de Emanuele de Deck of cards management.
    3. Las cartas se irán generando en el mazo y deslizándose con Timer y Tween hacia los jugadores.
    4. La imagen de las cartas será un spritesheet. Este tendrá todas las cartas juntas, con los personajes repetidos y siguiendo
       un cierto orden. El orden de la spritesheet será el mismo que hay en Trello. Es decir: asesino, asesino, guardia, guardia, guardia...
    5. Según como está el código, siempre va a empezar J1 (persona real). Para cambiarlo habría que asignar un índice al J1, en vez de
       acceder con [0][0] y [0][1] a sus cartas. La segunda coordenada sí se mantiene.

    6. Animation.onComplete
    7. al morir: sprite.alpha = 1; game.add.tween(sprite).to( { alpha: 0.5 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    PENDIENTE:
    - podria evitar que J1 hiciera trampas llamando a una funcion extra elegir, tal y como cuando se elige la 2da carta del timador
    - A veces dice que has echado una carta que no has echado (echas cura y hace accion de principe - comprobar si el principe está en la otra mano)
    - El array de acusaciones que esta en orden podría cambiarse por otro con los nombres mas propables repetidos y sin guardia. Así no sería
      necesario el bucle !=1 y mejoraría la IA.

*/

var gameOptions = {
    gameWidth: 1280,
    gameHeight: 720,
    cardSheetWidth: 178,
    cardSheetHeight: 208
}
var game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {

    game.load.image('mesa', 'assets/prueba/mesa.png');//mejor en el css como background
    game.load.image('carta', 'assets/prueba/Carta_atras_ok.png');
    game.load.image('descarte', 'assets/prueba/descarte.png');
    game.load.spritesheet('cartas1', 'assets/prueba/SpriteSheet1.png', gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
    game.load.spritesheet('cartas2', 'assets/prueba/SpriteSheet2.png', gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
    game.load.spritesheet('boton', 'assets/prueba/button1NO.png', 265/2, 52);
    game.load.image('cuadro', 'assets/prueba/cuadroNO.png');
    game.load.image('cerrar', 'assets/prueba/cerrarNO.png');
}

//variables globales
var mazo; //El mazo en sí
var cartaMazo; //Representa la imagen del mazo.
var indiceMazo = 0; //Para ir sacando las cartas del mazo, recorre todas las cartas
var turnos = 0; //Aumenta cada vez que juega un jugador
var numeroJugadores = 4; //Número entre 2 y 4.
var turnoJugador; //A qué jugador le toca jugar

var cartasManoJugadores = []; //Las cartas que tienen los jugadores en mano
var cartasMesaJugadores = []; //Las cartas que han ido descartando los jugadores
var cartaDescarteJugadores = []; //Objeto para interactuar con los demás jugadores y mostrar la última carta descartada

var jugadorElegido = false; //Para los efectos de las cartas
var canPlay = true; //Determina si es el turno del siguiente jugador
var finReparto = false; //Utilizada para hacer el reparto inicial automático.

var jugadoresVivos = numeroJugadores;
var personajesOrden = ["Asesino", "Guardia", "Timador", "Cura", "Baron", "Baronesa", "Mayordomo", "Criada", "Principe", "Rey", "Condesa", "Pricesa"];
var guardiaActivo = false;

//Posiciones para repartir las cartas. Facilita la lectura del código
var posManoJ1 = [gameOptions.gameWidth-gameOptions.cardSheetWidth/2, gameOptions.gameHeight-gameOptions.cardSheetHeight/2];
var posManoJ2 = [gameOptions.gameWidth*2/3, -gameOptions.cardSheetHeight/2];
var posManoJ3 = [gameOptions.gameWidth/2, -gameOptions.cardSheetHeight/2];
var posManoJ4 = [gameOptions.gameWidth/3, -gameOptions.cardSheetHeight/2];

var posManoJugadores = [posManoJ1, posManoJ2, posManoJ3, posManoJ4];
var posMesaJugadores = [   [ posManoJ1[0]-32-512, posManoJ1[1] ],   
                           [ posManoJ2[0], posManoJ2[1]+gameOptions.cardSheetHeight+32],   
                           [ posManoJ3[0], posManoJ3[1]+gameOptions.cardSheetHeight+32],   
                           [ posManoJ4[0], posManoJ4[1]+gameOptions.cardSheetHeight+32]   ];

var botones = [];
var posBoton1 = [gameOptions.gameWidth-300, 32];

var popupAyuda;
var tweenAyuda = null;
var textoAyudaOrden = ["Texto Asesino:\nResulta que el asesino blabla bla blabalabla blabalab nblabalbala.", "Texto Guardia", "Texto Timador", "Texto Cura", 
                        "Texto Baron", "Texto Baronesa", "Texto Mayordomo", "Texto Criada", 
                        "Texto Principe", "Texto Rey", "Texto Condesa", "Texto Princesa"];
var textoAyuda;

var cuadroPartida;
var textoPartida;


function create() {
    
    //Cargar como fondo
    //game.add.sprite(0, 0, 'mesa');
    game.stage.backgroundColor = "#c73a3a";
    //Centrar el juego en la pantalla
    this.game.scale.pageAlignHorizontally = true;this.game.scale.pageAlignVertically = true;this.game.scale.refresh();
    
    //Imagen que simula el mazo
    cartaMazo = game.add.image(game.world.centerX, game.world.centerY, 'carta');
    cartaMazo.anchor.setTo(0.5, 0.5);
    cartaMazo.angle=90;

    //Creación del mazo 
    mazo = Phaser.ArrayUtils.numberArray(0,27);
    Phaser.ArrayUtils.shuffle(mazo);

    //Creación de los objetos mesa. Para elegir a los demás jugadores y donde se posicionan sus cartas descartadas
    //De hecho, representa al jugador
    for(var i=0; i<numeroJugadores; i++){
        cartaDescarteJugadores[i] = game.add.sprite(posMesaJugadores[i][0], posMesaJugadores[i][1],'descarte');
        cartaDescarteJugadores[i].anchor.setTo(0.5, 0.5);
        cartaDescarteJugadores[i].inputEnabled=true;
        cartaDescarteJugadores[i].vivo = true;
        cartaDescarteJugadores[i].protegido = false;
     }

    //Botones para el guardia y para la ayuda
    for(var btn=0; btn<12; btn++){
        botones[btn] = game.add.button(posBoton1[0]+(140)*Math.floor(btn/6), posBoton1[1]+(60)*btn-(60*6)*Math.floor(btn/6), 'boton', undefined, undefined, 1, 0);
        botones[btn].events.onInputDown.add(abrirAyuda, this, 0, btn);
        botones[btn].useHandCursor = true;
    }



    //Para la ventana de ayuda
    popupAyuda = game.add.sprite(40, 40, 'cuadro');
    popupAyuda.alpha = 0.8;

    //Boton de cerrar ayuda
    var pw = (popupAyuda.width) - 38;
    var ph = 8;

    //Clicar el boton para cerrar la ayuda
    var cerrar = game.make.sprite(pw, ph, 'cerrar');
    cerrar.inputEnabled = true;
    cerrar.input.priorityID = 1;
    cerrar.input.useHandCursor = true;
    cerrar.events.onInputDown.add(cerrarAyuda, this);

    //Se añade el botón de cerrar a la popupAyuda
    popupAyuda.addChild(cerrar);
    
    //Se añade el texto
    var style = { font: "16px Arial", wordWrap: true, wordWrapWidth: popupAyuda.width, align: "center"};
    textoAyuda = game.add.text(popupAyuda.width/2, popupAyuda.height/2, " ", style);
    textoAyuda.anchor.set(0.5);
    popupAyuda.addChild(textoAyuda);

    //Se esconde
    popupAyuda.scale.set(0.1);

}

function abrirAyuda(a, b, indice){
    textoAyuda.setText(textoAyudaOrden[indice]);
    if(!(guardiaActivo && turnoJugador===0)){
        if ((tweenAyuda !== null && tweenAyuda.isRunning) || popupAyuda.scale.x === 1)
        {
            return;
        }
        
        //La ventana se abre sólo si ya está abierta o abriéndose
        tweenAyuda = game.add.tween(popupAyuda.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);

    } 
}
function cerrarAyuda(){
    if (tweenAyuda && tweenAyuda.isRunning || popupAyuda.scale.x === 0.1)
    {
        return;
    }

    //La ventana se cierra sólo si no se está cerrando/está cerrada
    tweenAyuda = game.add.tween(popupAyuda.scale).to( { x: 0.1, y: 0.1 }, 500, Phaser.Easing.Elastic.In, true);
}

function sacarCartaMazo(jugadorReceptor) {
    //La carta a repartir se genera encima del mazo
    var carta = game.add.sprite(game.world.centerX, game.world.centerY, 'carta');
    carta.anchor.setTo(0.5,0.5);
    carta.angle = 90;

    //Según el índice se accede al tipo de carta
    var tipo = mazo[indiceMazo];
     //Se asignan las propiedades de la carta                               
    switch (tipo){
        case 0:
        case 1:
            carta.valor = 0;
            carta.personaje = "Asesino";
            carta.tipoframe = 1;
            break;
        case 10:
        case 11:
            carta.valor = 2;
            carta.personaje = "Timador";
            carta.tipoframe = 11;
            break;
        case 12:
        case 13:
        case 14:
        case 15:
            carta.valor = 2;
            carta.personaje = "Cura";
            carta.tipoframe = 15;
            break;
        case 16:
        case 17:
            carta.valor = 3;
            carta.personaje = "Baron";
            carta.tipoframe = 17;
            break;
        case 18:
            carta.valor = 3;
            carta.personaje = "Baronesa";
            carta.tipoframe = 18;
            break;
        case 19:
            carta.valor = 4;
            carta.personaje = "Mayordomo";
            carta.tipoframe = 19;
            break;
        case 20:
        case 21:
            carta.valor = 4;
            carta.personaje = "Criada";
            carta.tipoframe = 21;
            break;
        case 22:
        case 23:
        case 24:
            carta.valor = 5;
            carta.personaje = "Principe";
            carta.tipoframe = 24;
            break;
        case 25:
            carta.valor = 6;
            carta.personaje = "Rey";
            carta.tipoframe = 25;
            break;
        case 26:
            carta.valor = 7;
            carta.personaje = "Condesa";
            carta.tipoframe = 26;
            break;
        case 27:
            carta.valor = 8;
            carta.personaje = "Princesa";
            carta.tipoframe = 27;
            break;
        default:
            carta.valor = 1;
            carta.personaje = "Guardia";
            carta.tipoframe = 9;

    }

    //Cuando se acaba el mazo, se quita la imagen que hacía de mazo
    if(indiceMazo>mazo.length-2){
        //cartaMazo.kill();     //Una de dos
        cartaMazo.destroy();
    }


    //Desplazamiento de la carta hacia la mano del jugador.
    animacionRepartir(carta,tipo,jugadorReceptor);

    //Reparto automático de la primera ronda
    if(turnos<numeroJugadores) canPlay = true;

    
    return carta;
}

function animacionRepartir(carta, tipo, jugadorReceptor){
    carta.angle = 0; 
    //Se "da la vuelta" a la carta, revelando el personaje. Sólo para el J1
    if(turnoJugador===0)                                                                                //UNCOMMENT  
        carta.loadTexture('cartas1', tipo); 
    
    var tween;
    if(jugadorReceptor===0){
        if(turnos ===0 || cartasManoJugadores[0][0] === undefined) {
            tween = game.add.tween(carta).to({
                x: posManoJugadores[0][0], 
                y: posManoJugadores[0][1]
            },750,Phaser.Easing.Cubic.Out, true);
        }else{
            tween = game.add.tween(carta).to({
                x: posManoJugadores[0][0]-gameOptions.cardSheetWidth-32,
                y: posManoJugadores[0][1]
            },750,Phaser.Easing.Cubic.Out, true);
        } 
    }else{
        tween = game.add.tween(carta).to({
            x: posManoJugadores[jugadorReceptor][0], 
            y: posManoJugadores[jugadorReceptor][1]
        },750,Phaser.Easing.Cubic.Out, true);
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


function elegirCarta(carta, a, b, indice, condesa){
    
    if(turnoJugador!==0){
        if(!condesa){
            var indice = Math.floor(Math.random()*2);
            var carta = cartasManoJugadores[turnoJugador][indice];     //Automático
        }
        if(cartasMesaJugadores[turnoJugador]==null)   cartasMesaJugadores[turnoJugador] = [carta];
        else cartasMesaJugadores[turnoJugador].push(carta);
    }
    else {
        if(turnoJugador===0) {
            if(cartasManoJugadores[0][0] != undefined && cartasManoJugadores[0][0].inputEnabled==true)
            cartasManoJugadores[0][0].inputEnabled=false;
            if(cartasManoJugadores[0][1] != undefined && cartasManoJugadores[0][1].inputEnabled==true)
            cartasManoJugadores[0][1].inputEnabled=false;
        }

        if(cartasMesaJugadores[0]==null)    cartasMesaJugadores[0]=[carta];
        else    cartasMesaJugadores[0].push(carta);
    }
    animacionDescartar(carta, indice);
}


function animacionDescartar(carta, indice){
    var tween;
    tween = game.add.tween(carta).to({
        x: posMesaJugadores[turnoJugador][0], 
        y: posMesaJugadores[turnoJugador][1]
    },750,Phaser.Easing.Cubic.Out, true);
    //Al terminar la animación, se cambia la imagen de descarte de jugadores.
    tween.onComplete.add(function() {
        //Se añade la imagen encima
        var im_temp = game.add.image(posMesaJugadores[turnoJugador][0], posMesaJugadores[turnoJugador][1], 'cartas1', carta.tipoframe);
        //AÑADIR ANIMACION AQUÍ                                                                                                 AQUI ANIMACION
        im_temp.anchor.setTo(0.5, 0.5);
    }); 

    //No ha habido otro modo de eliminar la carta
    delete cartasManoJugadores[turnoJugador][indice];

    game.time.events.add(800, accionCarta, this, carta, indice);
}

function accionCarta(carta, indice){

    switch(carta.personaje){
        case "Guardia":
            guardiaActivo = true;    
            if(turnoJugador === 0){
                //No puede realizar la accion sobre sí mismo
                for(var jugador=1; jugador<numeroJugadores; jugador++){
                    if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
                        cartaDescarteJugadores[jugador].events.onInputUp.add(eleccionGuardia, this, 0, jugador);
                }
            }else{
                var jugador = jugadorVivoAlAzar(false);
                accionGuardia(undefined, undefined, undefined, jugador);
            }
            break;

        case "Timador":
            if(turnoJugador === 0){
                //Puede realizar la accion sobre sí mismo
                for(var jugador=0; jugador<numeroJugadores; jugador++){
                    if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
                        cartaDescarteJugadores[jugador].events.onInputUp.add(accionTimador, this, 0, carta.personaje, jugador);
                }
            }else{
                var jugador1 = jugadorVivoAlAzar(true);
                //No puede elegir al mismo jugador las dos veces
                do{
                    var jugador2 = jugadorVivoAlAzar(true);
                }while(jugador1===jugador2);

                accionTimaRey(undefined, undefined, undefined, carta.personaje, jugador1, jugador2);
            }
            break;
        case "Cura":
            if(turnoJugador === 0){
                //No puede realizar la accion sobre sí mismo
                for(var jugador=1; jugador<numeroJugadores; jugador++){
                    if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
                        cartaDescarteJugadores[jugador].events.onInputUp.add(accionCura, this, 0, jugador);
                }
            }else{
                var jugador = jugadorVivoAlAzar(false);
                accionCura(undefined, undefined, undefined, jugador);
            }
            break;
        
        case "Baron":
        case "Baronesa":
            if(turnoJugador === 0){
                //No puede realizar la accion sobre sí mismo
                for(var jugador=1; jugador<numeroJugadores; jugador++){
                    if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
                        cartaDescarteJugadores[jugador].events.onInputUp.add(accionBaronBaronesa, this, 0, jugador, carta.personaje);
                }
            }else{
                var jugador = jugadorVivoAlAzar(false);
                accionBaronBaronesa(undefined, undefined, undefined, jugador, carta.personaje);
            }
            break;

        case "Criada":
        case "Mayordomo":
            cartaDescarteJugadores[turnoJugador].protegido=true;
            console.log("El jugador "+(turnoJugador+1) + " se ha protegido.");
            game.time.events.add(1000, finTurno);
            break;

        case "Principe":
            if(turnoJugador === 0){
                //Sí puede realizar la accion sobre sí mismo
                for(var jugador=0; jugador<numeroJugadores; jugador++){
                    if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
                        cartaDescarteJugadores[jugador].events.onInputUp.add(accionPrincipe, this, 0, jugador);
                }
            }else{
                var jugador = jugadorVivoAlAzar(true);
                accionPrincipe(undefined, undefined, undefined, jugador);
            }
            break;

        case "Rey":
            if(turnoJugador === 0){
                //No puede realizar la accion sobre sí mismo
                for(var jugador=1; jugador<numeroJugadores; jugador++){
                    if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
                        cartaDescarteJugadores[jugador].events.onInputUp.add(accionTimaRey, this, 0, carta.personaje, jugador);
                }
            }else{
                var jugador = jugadorVivoAlAzar(false);
                accionTimaRey(undefined, undefined, undefined, carta.personaje, jugador);
            }
            break;

        case "Princesa":
            cartaDescarteJugadores[turnoJugador].vivo = false;
            jugadoresVivos--;

            if(indice===0)
                game.time.events.add(750, echarCartaDerrotados, this, cartasManoJugadores[turnoJugador][1], turnoJugador);
            else
                game.time.events.add(750, echarCartaDerrotados, this, cartasManoJugadores[turnoJugador][0], turnoJugador);
            
            console.log("El jugador "+(turnoJugador+1) + " ha perdido tras descartar a la princesa.");
            game.time.events.add(3250, finTurno);
            break;

        default: game.time.events.add(50, finTurno);
    }
    
}

//Self indica si en un principio el jugador puede elegirse a sí mismo.
//Tal vez pueda simplificarse si está especificado en las acciones de cada uno                                     
function jugadorVivoAlAzar(self){
    var jugProts = 0;
    for(var i=0; i<numeroJugadores; i++){
        if(cartaDescarteJugadores[i].protegido || !cartaDescarteJugadores[i].vivo) jugProts++;
    }

    var numJug = Math.floor(Math.random()*numeroJugadores);
    if(cartaDescarteJugadores[numJug].vivo && !cartaDescarteJugadores[numJug].protegido)
        if(!self && numJug === turnoJugador){
            //De este modo no entrará en un bucle infinito buscando jugadores que no estén protegidos.
            //Como último recurso, actuará sobre sí mismo si todos están protegidos.
            if(jugProts>=numeroJugadores-1) return numJug; 
            else return jugadorVivoAlAzar(self);
        }
        else return numJug;
    else
        return jugadorVivoAlAzar(self);
}

function finTurno(){
    if(indiceMazo<mazo.length && jugadoresVivos>1){ 
        //canPlay se pone a true cuando le toca al siguiente jugador y si no se ha acabado el mazo y si queda más de un jugador vivo.   
        turnos++;
        jugadorElegido = false;
        guardiaActivo = false;
        canPlay = true;
    }else{
        //Se determina quién ha ganado
        finPartida(); 
    }
}

function finPartida(){}


function manejadorTurnos(){
    //Con el resto se calcula hacia quién va la carta.
    turnoJugador = turnos%numeroJugadores;

    if(cartaDescarteJugadores[turnoJugador].vivo==true){
        //if-else evita el error de undefined porque al pricipio el array está vacío.
        if(turnos<numeroJugadores){ 
            cartasManoJugadores[turnoJugador] = [sacarCartaMazo(turnoJugador)];
            if(turnoJugador===0) {
                if(cartasManoJugadores[0][0] != undefined)
                cartasManoJugadores[0][0].inputEnabled=true;
            }
        }else {
           
            if(cartasManoJugadores[turnoJugador][0]==undefined){
                cartasManoJugadores[turnoJugador][0] = sacarCartaMazo(turnoJugador);
            }else{
                cartasManoJugadores[turnoJugador][1] = sacarCartaMazo(turnoJugador);
            }
            //Se permite interactuar con el ratón clicando en las cartas
            if(turnoJugador===0) {
                if(cartasManoJugadores[0][0] != undefined)
                cartasManoJugadores[0][0].inputEnabled=true;
                if(cartasManoJugadores[0][1] != undefined)
                cartasManoJugadores[0][1].inputEnabled=true;
            }
            //Ya se ha terminado de repartir, así que ya se puede interactuar con las cartas.
            finReparto=true;
        }

        
        

        if(finReparto){
            
            //Se anula el efecto de la protección cuando le vuelve a tocar al jugador
            for(var i=0; i<numeroJugadores; i++){
                if(cartaDescarteJugadores[i].protegido && i==turnoJugador){
                    cartaDescarteJugadores[i].protegido = false;
                    console.log("El jugador "+(turnoJugador+1) +" ya no está protegido.");
                }
            }

            //El jugador está obligado a descartar la condesa si tiene un príncipe o un rey
            if((cartasManoJugadores[turnoJugador][0].personaje === "Condesa") && (cartasManoJugadores[turnoJugador][1].personaje === "Principe" || cartasManoJugadores[turnoJugador][1].personaje === "Rey"))
            {
                game.time.events.add(1500, elegirCarta, undefined, cartasManoJugadores[turnoJugador][0], undefined, undefined, 0, true);              
            }else if((cartasManoJugadores[turnoJugador][1].personaje === "Condesa") && (cartasManoJugadores[turnoJugador][0].personaje === "Principe" || cartasManoJugadores[turnoJugador][0].personaje === "Rey"))
            {
                game.time.events.add(1500, elegirCarta, undefined, cartasManoJugadores[turnoJugador][1], undefined, undefined, 1, true);
            }
            else{
                if(cartasManoJugadores[0][0] !== undefined) {cartasManoJugadores[0][0].events.onInputUp.add(elegirCarta, this, 0, 0, false);}
                if(cartasManoJugadores[0][1] !== undefined) {cartasManoJugadores[0][1].events.onInputUp.add(elegirCarta, this, 0, 1, false);}
                if(turnoJugador!==0){game.time.events.add(800, elegirCarta, undefined, undefined, undefined, undefined, undefined, false)};
            }
        }
        else{
            turnos++;
        }

        indiceMazo++;
    }else{
        finTurno();
    }
}


function echarCartaDerrotados(carta, jugador){
    var tween;
    tween = game.add.tween(carta).to({
        x: posMesaJugadores[jugador][0], 
        y: posMesaJugadores[jugador][1]
    },1000,Phaser.Easing.Cubic.Out, true);
    //Al terminar la animación, se cambia la imagen de descarte de jugadores.
    tween.onComplete.add(function() {
        //Se añade la imagen encima
        var im_temp = game.add.image(posMesaJugadores[jugador][0], posMesaJugadores[jugador][1], 'cartas1', carta.tipoframe);
        im_temp.anchor.setTo(0.5, 0.5);
    });
}


function accionAsesino(){}

function eleccionGuardia(carta, a, b, jugador){
    console.log("Elige de qué quieres acusar al jugador "+(jugador-1));
    
    //Puede realizar la accion sobre sí mismo
    for(var btn=0; btn<botones.length;btn++)
        botones[btn].onInputDown.add(accionGuardia, carta, this, 0, jugador, btn);
}

function accionGuardia(carta, a, b, jugador, btn){
    if(guardiaActivo){
        jugadorElegido = true;
        cartaDescarteJugadores[jugador].events.destroy();
        //No puede acusarse a sí mismo
        if(cartaDescarteJugadores[jugador].vivo && jugador!==turnoJugador && !cartaDescarteJugadores[jugador].protegido){
            //Se determina a qué carta está acusando
            var cartaAcusada;
            if(cartasManoJugadores[jugador][0]!=undefined)
                cartaAcusada = cartasManoJugadores[jugador][0];
            else
                cartaAcusada = cartasManoJugadores[jugador][1];

            //De qué acusa (aleatorio para !J1)
            var acusacion;
            if(turnoJugador===0){    
                acusacion = personajesOrden[btn];
            }else{
                do{
                    var indice = Math.floor(Math.random()*9);
                }while(indice === 1);
                
                acusacion = personajesOrden[indice];
            }
            
            if(acusacion !== "Guardia"){
                if(cartaAcusada.personaje===acusacion){
                    cartaDescarteJugadores[jugador].vivo = false;
                    jugadoresVivos--;
                    if(indice===0)
                        game.time.events.add(750, echarCartaDerrotados, this, cartaAcusada, jugador);
                    else
                        game.time.events.add(750, echarCartaDerrotados, this, cartaAcusada, jugador);
                
                    console.log("El jugador " + (turnoJugador+1)+" ha acusado al jugador " + (jugador+1)+" de tener un/a "+acusacion+" y ha acertado.\nEl jugador "+(jugador+1)+" ha sido eliminado.");
                }
                else 
                    console.log("El jugador " + (turnoJugador+1)+" ha acusado al jugador " + (jugador+1)+" de tener un/a "+acusacion+" y ha fallado.");
            }else{
                console.log("No puedes acusar de Guardia a otro jugador.")
            }

        }else{
            console.log("El jugador " + (turnoJugador+1)+" no ha podido acusar al jugador " + (jugador+1));
        }
        
        game.time.events.add(3250, finTurno);
    }
}

function accionTimador(carta, a, b, person, jugador1){
    console.log("Elige al segundo jugador");
    
    //Puede realizar la accion sobre sí mismo
    for(var jugador2=0; jugador2<numeroJugadores; jugador2++){
        if(cartaDescarteJugadores[jugador2].vivo)
            cartaDescarteJugadores[jugador2].events.onInputUp.add(accionTimaRey, this, 0, person, jugador1, jugador2);
    }
}

function accionTimaRey(carta, a, b, person, jugador1, jugador2){
    jugadorElegido = true;
    cartaDescarteJugadores[jugador1].events.destroy();

    if(person==="Rey")  jugador2 = turnoJugador;
    else if(turnoJugador===0){

        if(jugador1===jugador2){
            console.log("Elige a otro jugador");
            //Puede realizar la accion sobre sí mismo
            for(var jugador=0; jugador<numeroJugadores; jugador++){                                     //Podría interferir con la llamada a siguiente turno de abajo
                if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
                    cartaDescarteJugadores[jugador].events.onInputUp.add(accionTimador, this, 0, carta.personaje, jugador);
            }
        }

        cartaDescarteJugadores[jugador2].events.destroy();
    }



    if(cartaDescarteJugadores[jugador1].vivo && jugador1!==jugador2 && !cartaDescarteJugadores[jugador1].protegido){
        console.log("El jugador " + (jugador2+1)+" se ha cambiado las cartas con el jugador " + (jugador1+1));
        
        var idx_cambiado; //jugador cambiado (j1)
        var idx_cambiadoR; //jugador cambiador (j2)
        var carta_aux;

        if(cartasManoJugadores[jugador1][0]!=undefined){
            idx_cambiado = 0;
        }else{
            idx_cambiado = 1;
        }
        if(cartasManoJugadores[jugador2][0]!=undefined){
            idx_cambiadoR = 0;
        }else{
            idx_cambiadoR = 1;
        }

        carta_aux = cartasManoJugadores[jugador1][idx_cambiado];

        var tween1;//Primero el cambiado
        var tween2;//Luego el cambiador
        
        //El cambiado le da su carta al cambiador
        var pos_x = posManoJugadores[jugador2][0];
        var pos_y = posManoJugadores[jugador2][1];

        //Hay dos posiciones de cartas del J1           
        if(jugador2 === 0 && idx_cambiadoR===1){
            pos_x = posManoJugadores[jugador2][0]-gameOptions.cardSheetWidth-32;
            pos_y = posManoJugadores[jugador2][1];
        }

        tween1 = game.add.tween(cartasManoJugadores[jugador1][idx_cambiado]).to({
            x: pos_x, 
            y: pos_y
        },1000,Phaser.Easing.Cubic.Out, true);
        
        //El cambiador le da su carta al cambiado
        tween1.onComplete.add(function() {

            pos_x = posManoJugadores[jugador1][0];
            pos_y = posManoJugadores[jugador1][1];
    
            //Hay dos posiciones de cartas del J1
            if(jugador1 === 0 && idx_cambiado===1){
                pos_x = posManoJugadores[jugador1][0]-gameOptions.cardSheetWidth-32;
                pos_y = posManoJugadores[jugador1][1];
            }

            tween2 = game.add.tween(cartasManoJugadores[jugador2][idx_cambiadoR]).to({
                x: pos_x, 
                y: pos_y
            },1000,Phaser.Easing.Cubic.Out, true);
            
            tween2.onComplete.add(function() {
                cartasManoJugadores[jugador1][idx_cambiado] = cartasManoJugadores[jugador2][idx_cambiadoR];
                cartasManoJugadores[jugador2][idx_cambiadoR] = carta_aux;
                if(jugador1===0){
                    cartasManoJugadores[jugador1][idx_cambiado].loadTexture('cartas1', cartasManoJugadores[jugador1][idx_cambiado].tipoframe);
                }else if(jugador2===0){
                    cartasManoJugadores[jugador2][idx_cambiadoR].loadTexture('cartas1', cartasManoJugadores[jugador2][idx_cambiadoR].tipoframe);
                }
            });
        });
    }else{
        console.log("El jugador " + (jugador2+1)+" no ha podido cambiarle la mano al jugador " + (jugador1+1));
    }
    

    game.time.events.add(3500, finTurno);                                           
}

function accionCura(carta, a, b, jugador){
    jugadorElegido = true;
    cartaDescarteJugadores[jugador].events.destroy();
    //No puede verse la carta a sí mismo
    if(cartaDescarteJugadores[jugador].vivo && jugador!==turnoJugador && !cartaDescarteJugadores[jugador].protegido){
        var pvisto;
        if(cartasManoJugadores[jugador][0]!=undefined)
            pvisto = cartasManoJugadores[jugador][0].personaje;
        else
            pvisto = cartasManoJugadores[jugador][1].personaje;

        if(turnoJugador===0) console.log("El jugador " + (jugador+1) + " tiene un/a: " + pvisto);
        else console.log("El jugador " + (turnoJugador+1)+" le ha visto la mano al jugador " + (jugador+1));
    }else{
        console.log("El jugador " + (turnoJugador+1)+" no ha podido verle la mano al jugador " + (jugador+1));
    }
    
    game.time.events.add(1000, finTurno);
}

function accionBaronBaronesa(carta, a, b, jugador, person){
    jugadorElegido = true;
    cartaDescarteJugadores[jugador].events.destroy();

    if(cartaDescarteJugadores[jugador].vivo && jugador!==turnoJugador && !cartaDescarteJugadores[jugador].protegido){
        var retado; //jugador retado
        var retadoR; //jugador retador
        var indice;

        if(cartasManoJugadores[jugador][0]!=undefined){
            retado = cartasManoJugadores[jugador][0];
            indice = 0;
        }else{
            retado = cartasManoJugadores[jugador][1];
            indice = 1;
        }
        if(cartasManoJugadores[turnoJugador][0]!=undefined){
            retadoR = cartasManoJugadores[turnoJugador][0];
            indice = 0;
        }else{
            retadoR = cartasManoJugadores[turnoJugador][1];
            indice = 1;
        }

        console.log("El jugador " + (turnoJugador+1)+" ha retado al jugador " + (jugador+1)+ " usando el/la "+person);


        //Gana el retado
        if((retado.valor>retadoR.valor && person==="Baron") || (retado.valor<retadoR.valor && person==="Baronesa")){
            jugadoresVivos--;
            
            game.time.events.add(750, echarCartaDerrotados, this, retadoR, turnoJugador);
            
            cartaDescarteJugadores[turnoJugador].vivo = false;
            console.log("El jugador " + (jugador+1)+" ha salido victorioso."); 
            
        //Gana el retador
        }else if((retado.valor<retadoR.valor && person==="Baron") || (retado.valor>retadoR.valor && person==="Baronesa")){
            jugadoresVivos--;
            
            game.time.events.add(750, echarCartaDerrotados, this, retado, jugador);

            cartaDescarteJugadores[jugador].vivo = false;
            console.log("El jugador " + (turnoJugador+1)+" ha salido victorioso.");

        //Hay empate
        }else{
           console.log("¡Parece que ha habido un empate!");
        }

    }else{
        console.log("El jugador " + (turnoJugador+1)+" no ha podido compararse con el jugador " + (jugador+1));
    }
    
    game.time.events.add(3250, finTurno);

}

function accionPrincipe(carta, a, b, jugador){
    jugadorElegido = true;
    cartaDescarteJugadores[jugador].events.destroy();

    if(cartaDescarteJugadores[jugador].vivo && !cartaDescarteJugadores[jugador].protegido){
        var carta; //La carta de la que se tiene que descartar
        var indice;
        
        if(cartasManoJugadores[jugador][0]==undefined){
            cartasManoJugadores[jugador][0]=sacarCartaMazo(jugador);
            carta = cartasManoJugadores[jugador][1];
            indice = 1;
        }
        else{
            cartasManoJugadores[jugador][1]=sacarCartaMazo(jugador);
            carta = cartasManoJugadores[jugador][0];
            indice = 0;
        }

        game.time.events.add(150, principeDescartar);

        function principeDescartar(){
            var tween;
            tween = game.add.tween(carta).to({
                x: posMesaJugadores[jugador][0], 
                y: posMesaJugadores[jugador][1]
            },1000,Phaser.Easing.Cubic.Out, true);
            //Al terminar la animación, se cambia la imagen de descarte de jugadores.
            tween.onComplete.add(function() {
                //Se añade la imagen encima
                var im_temp = game.add.image(posMesaJugadores[jugador][0], posMesaJugadores[jugador][1], 'cartas1', carta.tipoframe);
                im_temp.anchor.setTo(0.5, 0.5);
            }); 

            console.log("El jugador " + (turnoJugador+1)+" ha hecho descartarse al jugador " + (jugador+1));

            if(carta.personaje==="Princesa"){
                cartaDescarteJugadores[jugador].vivo = false;
                jugadoresVivos--;
                console.log("El jugador "+(jugador+1) + " ha perdido tras descartar a la princesa.");
            }

            if(cartasMesaJugadores[jugador]==null)    cartasMesaJugadores[jugador]=[carta];
            else    cartasMesaJugadores[jugador].push(carta);

            //No ha habido otro modo de eliminar la carta
            if(indice===0) delete cartasManoJugadores[jugador][0];
            else delete cartasManoJugadores[jugador][1];

            indiceMazo++;
        }
    }else{
        console.log("El jugador " + (turnoJugador+1)+" no ha podido hacer descartarse al jugador " + (jugador+1));
    }
    game.time.events.add(2500, finTurno);
}
