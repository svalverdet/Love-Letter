
/************
	* relaciones de confianza - grupo de IPs para acceder a mi servidor java
	* PENDIENTE:
	* - Solucionar el asunto confuso del principe en la ultima ronda (LINEA 727, 1084)
	* - Mostrar siempre el nombre del jugador en todas las pantallas
	* - /permitir varias rondas
	* - mensaje "notificar al ganador" en vez de modificar al jugador desde otro sitio
	* 	- ganar con el asesino o con el mayordomo
	***********/

LoveLetterOnline.Jugar = function(game){

	var partida_actual;
	var pos_ingame;
	var that;
	var msg;
	
	var gameOptions = {
    gameWidth: 1280,
    gameHeight: 720,
    cardSheetWidth: 178,
    cardSheetHeight: 208
	}
	
	//variables globales
	var global_mazo; //El mazo en sí
	var global_cartaMazo; //Representa la imagen del mazo.
	var global_indiceMazo = 0; //Para ir sacando las cartas del mazo, recorre todas las cartas
	var global_turnos = 0; //Aumenta cada vez que juega un jugador
	var numeroJugadores = 3; //Número entre 2 y 4.
	var corazonesParaGanar = 1;
	var ganadorJuego;
	var cartasDePosiblesGanadores = [];
	var nombresEnOrden = [];

	var cartasManoJugadores = []; //Las cartas que tiene el jugador en concreto en mano
	var cartasMesaJugadores = []; //Las cartas que ha ido descartando el jugador en concreto
	var cartaDescarteJugadores = []; //Objeto para interactuar con los demás jugadores y mostrar la última carta descartada

	var necesarioElegir = false; //¿Le toca al jugador elegir un jugador al que atacar?
	var jugadorElegido = false; //Para los efectos de las cartas

	var jugadoresVivos = numeroJugadores;
	var personajesOrden = ["Asesino", "Guardia", "Timador", "Cura", "Baron", "Baronesa", "Mayordomo", "Criada", "Principe", "Rey", "Condesa", "Princesa"];
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
	var textoAyudaOrden = ["Asesino(2):\nSi ganas con él, tus corazones se pondrán a 0. ¡La princesa cree que quieres matarla!\nValor: 0.", "Guardia(8):\nAcusa a otro jugador. Si tu acusación es correcta, ese jugador pierde.\nNo puedes acusar de Guardia.\nValor: 1.", "Timador(2):\nIntercambia tu mano con la de otro jugador.\nValor: 2.", "Cura(4):\nMira la mano de otro jugador.\nValor: 2.", 
							"Baron(2):\nReta a otro jugador. Aquel con el valor de carta MÁS BAJO PIERDE.\nValor: 3", "Baronesa(1):\nReta a otro jugador. Aquel con el valor de carta MÁS ALTO PIERDE.\nValor: 3", "Mayordomo(1):\nIgual que la Criada.\nSi ganas con él al final de la ronda, ganarás 2 CORAZONES.\nValor: 4", "Criada(2):\nDurante una ronda nadie podrá realizar acciones sobre ti.\nValor: 4.", 
							"Principe(3):\nElige a un jugador para que descarte su carta, incluso a ti mismo.\nValor: 5", "Rey(1):\nIntercambia tu mano con la de otro jugador.\nValor: 6", "Condesa(1):\nSe descartará automáticamente si en tu mano hay además un Príncipe o un Rey.\nValor: 7", "Princesa(1):\nEl jugador que la descarte pierde.\nValor: 8"];
	var textoAyuda;

	var cuadroPartida;
	var textoPartida;
	var textoEventosPartida = [];

	var textoJugar;

};

LoveLetterOnline.Jugar.prototype = {
	
	
	/////////////////////////////////////////////
	// SECCION 1: INICIALIZACIÓN DEL JUEGO Y MENSAJES WS (EN INIT)
	
	preload: function(){
	
		game.stage.backgroundColor = "#000000";
	
		game.load.image('menu', 'assets/prueba/menu.png');
		game.load.image('flecha', 'assets/prueba/flecha.png');

		game.load.image('background', 'assets/prueba/mesa.png');
		game.load.image('carta', 'assets/prueba/Carta_atras_ok.png');
		game.load.image('descarte', 'assets/prueba/descarte.png');
		game.load.spritesheet('cartas1', 'assets/prueba/SpriteSheet1.png', gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
		game.load.spritesheet('cartas2', 'assets/prueba/SpriteSheet2.png', gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
		game.load.spritesheet('boton', 'assets/prueba/botones.png', 265/2, 52);
		//Copyright: los sprites de los botones se han obtenido de https://opengameart.org/content/ui-button-and-extra, hechos por StumpyStrust.
		game.load.image('cuadro', 'assets/prueba/ayuda.png');
		game.load.image('cerrar', 'assets/prueba/cerrar.png');
		game.load.image('protegido', 'assets/prueba/prote.png');
		game.load.image('eventos', 'assets/prueba/eventos.png');
		game.load.image('corazon', 'assets/prueba/corazon.png');
		
	},
	
	init: function(partida){
		
		partida_actual = partida;
		that = this;
		
		//Toma el nombre del jugador actual y su posición en el juego
		var name;
		nombresEnOrden = [];
		for(var i=0; i<partida_actual.jugsPartida.length; i++){
			nombresEnOrden.push(partida_actual.jugsPartida[i].nombre);
			if(partida_actual.jugsPartida[i].id == game.id_jugador){
				name = partida_actual.jugsPartida[i].nombre;
				pos_ingame = i;
			}
		}
		
		//Saluda al jugador y le informa sobre quién empieza la ronda y su turno
		if(pos_ingame == 0){
			alert(name+", eres el jugador "+(pos_ingame+1)+". Empiezas la ronda.")
		}else{
			alert(name+", eres el jugador "+(pos_ingame+1)+". "+partida_actual.jugsPartida[0].nombre+" empezará la ronda.")
		}
		
		
		game.connection.onmessage = function(msg) {
			console.log("WS message jugando: " + msg.data);
			var packet = JSON.parse(msg.data);
			
			switch (packet.action) {
				case "CONECTAR":
					console.log("Que comience el juego.");
					that.inicializarVars();
					break;
				case "PASAR_VARIABLES_GLOBALES":
					global_mazo = packet.mazo;
					break;
				case "SEND_DECK_INDEX":
					global_indiceMazo = packet.id;
					break;
				case "REPARTIR":
					that.animacionRepartir(packet.tipo, packet.jugadorReceptor);
					break;
				case "DESCARTAR":
					that.animacionDescartar(packet.tipo, packet.indice, packet.jugadorReceptor, packet.hacerEfecto, packet.muerto);
					break;
				case "HACER_DESAFIO":
					if(pos_ingame == packet.jugadorB){
						
						console.log("OMG el jugador " + (packet.jugadorA+1) + " me está retando con un " + packet.personaje1);
						
						msg = "El J"+ (packet.jugadorA+1) + " ataca al J"+(packet.jugadorB+1)+" con un/a " + packet.personaje1;
						that.ponerMensaje("El J"+ (packet.jugadorA+1) + " te ataca con un/a " + packet.personaje1);
						game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
						
						
						//La carta que tiene en la mano el jugador que ha sido desafiado
						var carta;
						var indice;
						if(cartasManoJugadores[0] != undefined) {
							carta = cartasManoJugadores[0];
							indice = 0;
						}else {
							carta = cartasManoJugadores[1];
							indice = 1;
						}
						
						//Según el personaje que le haya desafiado
						switch(packet.personaje1){
							
							case "Timador":
							case "Rey":
							
								//Creo una carta con las propiedades de la carta del otro jugador
								var cartaAux;
								
								//Se elimina la carta de la pantalla y del array.
								if(cartasManoJugadores[0] != undefined) {
									
									cartaAux = that.crearCarta(posManoJugadores[0][0], posManoJugadores[0][1], packet.personaje2, packet.valor2, packet.tipoframe2, true, true);
									
									cartasManoJugadores[0].destroy();
									delete cartasManoJugadores[0];
									cartasManoJugadores[0] = cartaAux;
									cartasManoJugadores[0].events.onInputUp.addOnce(that.elegirCarta, this, 0, 0);
								}else {
									
									cartaAux = that.crearCarta(posManoJugadores[0][0]-gameOptions.cardSheetWidth-32, posManoJugadores[0][1], packet.personaje2, packet.valor2, packet.tipoframe2, true, true);
									
									cartasManoJugadores[1].destroy();
									delete cartasManoJugadores[1];
									cartasManoJugadores[1] = cartaAux;
									cartasManoJugadores[1].events.onInputUp.addOnce(that.elegirCarta, this, 0, 1);
								}
						
							break;
							
							
							case "Principe":
								console.log("Ma hecho dejcartarm");
								
								msg = "El J"+ (packet.jugadorA+1) + " ha hecho descartarse al J"+(packet.jugadorB+1);
								that.ponerMensaje("El J"+ (packet.jugadorA+1) + " ha hecho que te descartes.");
								game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
						
								
								
								//Se descarta
								cartasMesaJugadores.push(carta);
								
								if(carta.personaje == "Princesa"){
									
									that.animacionDescartar(carta.tipoframe, indice, packet.jugadorB, true, true);
									game.sendMessage("DESCARTAR", {partida: partida_actual, tipo: carta.tipoframe, indice: indice, jugadorReceptor: packet.jugadorB, hacerEfecto: true, muerto: true});
								
									cartaDescarteJugadores[pos_ingame].vivo = false;
									game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: pos_ingame, vivo: cartaDescarteJugadores[pos_ingame].vivo, protegido: cartaDescarteJugadores[pos_ingame].protegido, corazones: cartaDescarteJugadores[pos_ingame].corazones});
								}else{
									
									that.animacionDescartar(carta.tipoframe, indice, packet.jugadorB, false, false);
									game.sendMessage("DESCARTAR", {partida: partida_actual, tipo: carta.tipoframe, indice: indice, jugadorReceptor: packet.jugadorB, hacerEfecto: false, muerto: false});
								
									/************* Y SI ES LA ÚLTIMA CARTA??? - sí, hay fallo  *****************/
									//Se roba una nueva
									that.sacarCartaMazo(packet.jugadorB);
									global_indiceMazo++;
									game.sendMessage("SEND_DECK_INDEX", {partida: partida_actual, id: global_indiceMazo});
								}
								
							break;
							
							case "Cura":
								//Paso mi carta de mi mano al que la solicitó
								that.animEnsenarCarta(carta, packet.jugadorA, packet.jugadorB, packet.personaje1, packet.acusacion, carta.personaje, carta.valor, carta.tipoframe);
							break;
							
							default: //Guardia, cura, barón y baronesa
							break;
						}
						
						//Siempre se le va a devolver el mando al jugador desafiante para que pase él el turno
						if(packet.personaje1 != "Cura")
						game.sendMessage("RESOLVER_DESAFIO", {partida: partida_actual, jugadorA: packet.jugadorA, jugadorB: packet.jugadorB, acusacion: packet.acusacion, personajeB: carta.personaje, valorB: carta.valor, tipoframeB: carta.tipoframe});
					}
					break;
				case "RESOLVER_DESAFIO":
					if(pos_ingame == packet.jugadorA){
						that.resolverDesafio(packet.jugadorA, packet.jugadorB, packet.acusacion, packet.personajeB, packet.valorB, packet.tipoframeB);
					}
					break;
				case "DO_ANIM":
					if(packet.jugadorA == pos_ingame)
						that.animRecibirCarta(packet.jugadorA, packet.cartaA, packet.jugadorB, packet.tipoframeB);
					else
						that.animCambiarCarta(packet.jugadorA, packet.cartaA, packet.jugadorB, packet.tipoframeB);
				break;
				case "PASAR_ESTADO_JUGADOR":
					cartaDescarteJugadores[packet.jugador].vivo = packet.vivo;
					cartaDescarteJugadores[packet.jugador].protegido = packet.protegido;
					cartaDescarteJugadores[packet.jugador].corazones = packet.corazones;
					break;
					
				case "SOLICITAR_CARTAS":
					//Si me piden cartas, las mando, si recibo cartas, las añado al array
					if(packet.valor == undefined && packet.solicitado == pos_ingame){
						var carta;
						if(cartasManoJugadores[0] != undefined) {
							carta = cartasManoJugadores[0];
						}else {
							carta = cartasManoJugadores[1];
						}
						game.sendMessage("SOLICITAR_CARTAS", {partida: partida_actual, solicitante: packet.solicitante, solicitado: pos_ingame, valor: carta.valor});
					
					}else if(packet.solicitante == pos_ingame){
						cartasDePosiblesGanadores.push(packet.solicitado); 
						cartasDePosiblesGanadores.push(packet.valor);
						
						//Si ya están añadidos todos los posibles ganadores, se calcula cuál de ellos es el ganador
						if(that.getNumJugsVivos() == cartasDePosiblesGanadores.length/2){
							
							var max = 0;
							var ganador;
							for(var i=0; i<cartasDePosiblesGanadores.length; i+=2){
								if(cartasDePosiblesGanadores[i+1] > max) {
									max = cartasDePosiblesGanadores[i+1];
									ganador = cartasDePosiblesGanadores[i];
								}
							}
							
							that.finRonda(ganador);
							
							console.log("SE HAN ACABADO LAS CARTAS Y HA GANADO EL JUGADOR " + (ganador+1));
							
						}
					}
					break;
					
				case "DERROTADO":
					if(pos_ingame == packet.jugador){
						console.log("He muerto, me descarto mi carta");
						
						msg = "El J"+packet.jugador+" ha muerto.";
						that.ponerMensaje("He muerto, me descarto mi carta");
						game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
							
						//La carta que tiene en la mano el jugador que ha sido derrotado
						var carta;
						var indice;
						if(cartasManoJugadores[0] != undefined) {
							carta = cartasManoJugadores[0];
							indice = 0;
						}else {
							carta = cartasManoJugadores[1];
							indice = 1;
						}
						that.animacionDescartar(carta.tipoframe, indice, pos_ingame, false, true);
						game.sendMessage("DESCARTAR", {partida: partida_actual, tipo: carta.tipoframe, indice: indice, jugadorReceptor: pos_ingame, hacerEfecto: false, muerto: true});		
					}
					break;
					
				case "PASAR_TURNO":									
					console.log("El turno "+ packet.turno + " ha finalizado.\nAhora es el turno del jugador "+(packet.turno%numeroJugadores + 1));
					global_turnos = packet.turno;
					//Si se refiere a mi, juego
					if(pos_ingame == packet.turno%numeroJugadores){
						that.hacerJugada();
					}
					break;
				case "FIN_RONDA":
					console.log("Pinto los corazones del ganador.");
					that.pintarCorazones(packet.jugador);
					break;
				case "END_GAME": 
					console.log("Se acabó el juego.");
					
					msg = "Se acabó el juego.";
					that.ponerMensaje(msg);
					game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
					
					
					that.deletePartida(partida_actual.id);
					game.time.events.add(6000,function(){
						game.goTo("Menu");
					});
					break;
				case "MESSAGE":
					if(packet.receptor == undefined){
						that.ponerMensaje(packet.msg);
					}else if(packet.receptor == pos_ingame){
						that.ponerMensaje(packet.msg);
					}
					break;
				default: 
					console.log("Error receiving message.");
					break;
			}
		}
		
		//Botón empezar para el coordinador de la partida
		if(pos_ingame==0){
			var texto_empezar = this.add.text(this.world.centerX, this.world.centerY+150,'Empezar',{fill: "#ffffff"});
			texto_empezar.anchor.x = 0.5;
			texto_empezar.inputEnabled = true;
			texto_empezar.events.onInputDown.add(this.empezar, this, texto_empezar);
		}
	},
	
	ponerMensaje: function(msg){
		textoEventosPartida.shift();
		textoEventosPartida.push(msg);
		
		textoPartida.setText(textoEventosPartida[0]+"\n"+textoEventosPartida[1]+"\n"+textoEventosPartida[2]);
	},
	
	empezar: function(texto_empezar){  
		texto_empezar.destroy();
		console.log("Doy comienzo al juego.");
		that.inicializarVars();
		game.sendMessage("PASAR_VARIABLES_GLOBALES", {partida: partida_actual, mazo: global_mazo});
		game.sendMessage("CONECTAR", {partida: partida_actual});
		
		that.hacerJugada();
	},
	
	// FIN SECCION 1
	/////////////////////////////////////////////
	
	/////////////////////////////////////////////
	// SECCION 2: INICIALIZACION DE VARIABLES Y ASPECTO GRÁFICO
	
	inicializarVars: function(){
		gameOptions = {
		gameWidth: 1280,
		gameHeight: 720,
		cardSheetWidth: 178,
		cardSheetHeight: 208
		}
		
		//variables globales
		global_indiceMazo = 0; //Para ir sacando las cartas del mazo, recorre todas las cartas
		//Phaser.ArrayUtils.shuffle(mazo);
		global_turnos = 0; //Aumenta cada vez que juega un jugador
		numeroJugadores = partida_actual.numJug; //Número entre 2 y 4.	
		//turnoJugador; //A qué jugador le toca jugar
		corazonesParaGanar = 1;
		cartasDePosiblesGanadores = [];
		
		
		cartasManoJugadores = []; //Las cartas que tienen los jugadores en mano
		cartasMesaJugadores = []; //Las cartas que han ido descartando los jugadores
		cartaDescarteJugadores = []; //Objeto para interactuar con los demás jugadores y mostrar la última carta descartada

		necesarioElegir = false;
		jugadorElegido = false; //Para los efectos de las cartas

		jugadoresVivos = numeroJugadores;
		personajesOrden = ["Asesino", "Guardia", "Timador", "Cura", "Baron", "Baronesa", "Mayordomo", "Criada", "Principe", "Rey", "Condesa", "Princesa"];
		guardiaActivo = false;

		/*******CHECK**********/
		//Posiciones para repartir las cartas. Facilita la lectura del código
		posManoJ1 = [gameOptions.gameWidth-gameOptions.cardSheetWidth/2, gameOptions.gameHeight-gameOptions.cardSheetHeight/2];
		posManoJ2 = [gameOptions.gameWidth*2/3, -gameOptions.cardSheetHeight/2];
		posManoJ3 = [gameOptions.gameWidth/2, -gameOptions.cardSheetHeight/2];
		posManoJ4 = [gameOptions.gameWidth/3, -gameOptions.cardSheetHeight/2];

		posManoJugadores = [posManoJ1, posManoJ2, posManoJ3, posManoJ4];
		posMesaJugadores = [   [ posManoJ1[0]-32-512, posManoJ1[1] ],   
								   [ posManoJ2[0], posManoJ2[1]+gameOptions.cardSheetHeight+32],   
								   [ posManoJ3[0], posManoJ3[1]+gameOptions.cardSheetHeight+32],   
								   [ posManoJ4[0], posManoJ4[1]+gameOptions.cardSheetHeight+32]   ];
	

		botones = [];
		posBoton1 = [gameOptions.gameWidth-300, 32];

		tweenAyuda = null;
		textoAyudaOrden = ["Asesino(2):\nSi ganas con él, tus corazones se pondrán a 0. ¡La princesa cree que quieres matarla!\nValor: 0.", "Guardia(8):\nAcusa a otro jugador. Si tu acusación es correcta, ese jugador pierde.\nNo puedes acusar de Guardia.\nValor: 1.", "Timador(2):\nIntercambia tu mano con la de otro jugador.\nValor: 2.", "Cura(4):\nMira la mano de otro jugador.\nValor: 2.", 
								"Baron(2):\nReta a otro jugador. Aquel con el valor de carta MÁS BAJO PIERDE.\nValor: 3", "Baronesa(1):\nReta a otro jugador. Aquel con el valor de carta MÁS ALTO PIERDE.\nValor: 3", "Mayordomo(1):\nIgual que la Criada.\nSi ganas con él al final de la ronda, ganarás 2 CORAZONES.\nValor: 4", "Criada(2):\nDurante una ronda nadie podrá realizar acciones sobre ti.\nValor: 4.", 
								"Principe(3):\nElige a un jugador para que descarte su carta, incluso a ti mismo.\nValor: 5", "Rey(1):\nIntercambia TU mano con la de otro jugador.\nValor: 6", "Condesa(1):\nSe descartará automáticamente si en tu mano hay además un Príncipe o un Rey.\nValor: 7", "Princesa(1):\nEl jugador que la descarte pierde.\nValor: 8"];
		
		textoEventosPartida = ["NUEVA PARTIDA", " ", "Empieza "+ nombresEnOrden[0]+"."];

		this.createGame();
	},
	
	over: function(item){
		item.fill = ("#AAAAAA");
	},
	out: function(item){
		item.fill = ("#000000");
	},
	
	createGame: function(){
		game.add.tileSprite(0, 0, gameOptions.gameWidth, gameOptions.gameHeight, 'background');
		//Centrar el juego en la pantalla
		//this.game.scale.pageAlignHorizontally = true;this.game.scale.pageAlignVertically = true;this.game.scale.refresh();
		
		//Imagen que simula el mazo
		global_cartaMazo = game.add.image(game.world.centerX, game.world.centerY, 'carta');
		global_cartaMazo.anchor.setTo(0.5, 0.5);
		global_cartaMazo.angle=90;

		//Creación del mazo. Sólo el líder.
		if(pos_ingame == 0){
			global_mazo = Phaser.ArrayUtils.numberArray(0,27);
			Phaser.ArrayUtils.shuffle(global_mazo);
		}

		//Creación de los objetos mesa. Para elegir a los demás jugadores y donde se posicionan sus cartas descartadas
		//De hecho, representa al jugador
		var pos;
		for(var i=0; i<numeroJugadores; i++){
			
			pos = i - pos_ingame;
			if(pos<0) pos+=numeroJugadores;
			
			cartaDescarteJugadores[i] = game.add.sprite(posMesaJugadores[pos][0], posMesaJugadores[pos][1],'descarte');
			cartaDescarteJugadores[i].anchor.setTo(0.5, 0.5);
			cartaDescarteJugadores[i].inputEnabled=true;
			cartaDescarteJugadores[i].vivo = true;
			cartaDescarteJugadores[i].protegido = false;
			cartaDescarteJugadores[i].corazones = 0;
			
			cartaDescarteJugadores[i].events.onInputUp.add(that.seleccionJugador, this, 0, i);
			
			if(pos==0)
				game.add.text(posMesaJugadores[pos][0]+gameOptions.cardSheetWidth/2 + 5, posMesaJugadores[pos][1]+gameOptions.cardSheetHeight/2-25,"J"+(i+1)+": "+nombresEnOrden[i],{fill: "#ffffff", fontSize: 16});
			else
				game.add.text(posMesaJugadores[pos][0], posMesaJugadores[pos][1]-gameOptions.cardSheetHeight/2-22,"J"+(i+1)+": "+nombresEnOrden[i],{fill: "#ffffff", fontSize: 16}).anchor.x = 0.5;
		 }

		 var estiloBoton;
		 
		//Botones para el guardia y para la ayuda
		for(var btn=0; btn<12; btn++){
			botones[btn] = game.add.button(posBoton1[0]+(140)*Math.floor(btn/6), posBoton1[1]+(60)*btn-(60*6)*Math.floor(btn/6), 'boton', undefined, undefined, 1, 0);
			botones[btn].events.onInputDown.add(this.abrirAyuda, this, 0, btn);
			botones[btn].useHandCursor = true;
			estiloBoton = { font: "bold 17px Waverly", fill:"#AAAAAA", wordWrap: true, wordWrapWidth: botones[btn].width-15, align: "center"};
			var textoBoton = game.add.text(botones[btn].width/2, botones[btn].height/2+3, personajesOrden[btn], estiloBoton);
			textoBoton.anchor.set(0.5);
			botones[btn].addChild(textoBoton);
		}


		//Para la ventana de ayuda
		popupAyuda = game.add.sprite(20, 20, 'cuadro');
		popupAyuda.alpha = 0.8;

		//Boton de cerrar ayuda
		var pw = (popupAyuda.width) - 70;
		var ph = popupAyuda.y;

		//Clicar el boton para cerrar la ayuda
		var cerrar = game.make.sprite(pw, ph, 'cerrar');
		cerrar.inputEnabled = true;
		cerrar.input.priorityID = 1;
		cerrar.input.useHandCursor = true;
		cerrar.events.onInputDown.add(this.cerrarAyuda, this);

		//Se añade el botón de cerrar a la popupAyuda
		popupAyuda.addChild(cerrar);
		
		//Se añade el texto
		var style = { font: "18px Waverly", fill:"#FFFFFF", wordWrap: true, wordWrapWidth: popupAyuda.width-75, align: "center"};
		textoAyuda = game.add.text(popupAyuda.width/2, popupAyuda.height/2, " ", style);
		textoAyuda.anchor.set(0.5);
		popupAyuda.addChild(textoAyuda);

		//Se esconde
		popupAyuda.scale.set(0.1);

		//Para la ventana de eventos de partida
		cuadroPartida = game.add.sprite(20, 375, 'eventos');
		cuadroPartida.alpha = 0.8;
		//cuadroPartida.scale.setTo(1.2, 1.2);

		var style2 = { font: "bold 17px Waverly", fill:"#FFFFFF", wordWrap: true, wordWrapWidth: cuadroPartida.width-75, align: "left"};
		textoPartida = game.add.text(cuadroPartida.width/2, cuadroPartida.height/2, textoEventosPartida[0]+"\n"+textoEventosPartida[1]+"\n"+textoEventosPartida[2], style2);
		textoPartida.anchor.set(0.5);
		cuadroPartida.addChild(textoPartida);
	}, 
	
	abrirAyuda: function(a, b, indice){
		
		//La ventana se abre sólo si no está abierta o abriéndose
		if ((tweenAyuda !== null && tweenAyuda.isRunning) || popupAyuda.scale.x === 1)
		{
			return;
		}
		textoAyuda.setText(textoAyudaOrden[indice]);
		
		tweenAyuda = game.add.tween(popupAyuda.scale).to( { x: 0.8, y: 0.8 }, 1000, Phaser.Easing.Elastic.Out, true);
		
	}, 
	
	cerrarAyuda: function(){
		//La ventana se cierra sólo si no se está cerrando/está cerrada
		if (tweenAyuda && tweenAyuda.isRunning || popupAyuda.scale.x === 0.1)
		{
			return;
		}
		tweenAyuda = game.add.tween(popupAyuda.scale).to( { x: 0.1, y: 0.1 }, 500, Phaser.Easing.Elastic.In, true);
	}, 
	
	// FIN SECCION 2
	/////////////////////////////////////////////
	
	/////////////////////////////////////////////
	// SECCIÓN 3: LÓGICA DEL JUEGO
	
	hacerJugada: function(){
		
		console.log("Turno del jugador "+ (pos_ingame + 1));
		
		msg = "Turno de "+nombresEnOrden[pos_ingame];
		that.ponerMensaje(msg);
		game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
		
		
		//Comprobar si el juego ha llegado a su fin
		if(!that.isFinRonda()){
			if(cartaDescarteJugadores[pos_ingame].vivo){
				
				//Al inicio de cada ronda me desprotejo
				if(cartaDescarteJugadores[pos_ingame].protegido){
					cartaDescarteJugadores[pos_ingame].protegido = false;
					game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: pos_ingame, vivo: cartaDescarteJugadores[pos_ingame].vivo, protegido: cartaDescarteJugadores[pos_ingame].protegido, corazones: cartaDescarteJugadores[pos_ingame].corazones});
				}
				
				//Se hace el reparto si quedan cartas, si no, se calcula el ganador
				console.log("Me reparten una carta.");
				
				if(global_indiceMazo<global_mazo.length){
					//if(global_indiceMazo<5){
					that.sacarCartaMazo(pos_ingame);
					
					if(global_turnos>=numeroJugadores){
						console.log("Ahora elijo una carta y en el callback paso el turno.");
					}else{
						console.log("Repartiendo...");
						global_turnos++;
						game.time.events.add(750, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
					}
				}else{
					//Solicito las cartas al resto de jugadores
					console.log("No puedo robar carta, no quedan. Calculo el ganador.");
					
					msg = "Se han acabado las cartas.";
					that.ponerMensaje(msg);
					game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
					
					
					//Añado mi carta al array de posibles ganadores
					var carta;
					if(cartasManoJugadores[0] != undefined) {
						carta = cartasManoJugadores[0];
					}else {
						carta = cartasManoJugadores[1];
					}
					cartasDePosiblesGanadores.push(pos_ingame); 
					cartasDePosiblesGanadores.push(carta.valor);
					
					for(var i=0; i<cartaDescarteJugadores.length; i++){
						if(pos_ingame != i && cartaDescarteJugadores[i].vivo)
							game.sendMessage("SOLICITAR_CARTAS", {partida: partida_actual, solicitante: pos_ingame, solicitado: i, valor: undefined});
					}
				}
			}else{
				console.log("Al estar muerto no puedes jugar.");
				
				msg = "El J"+(pos_ingame+1)+" está muerto, no puede jugar.";
				that.ponerMensaje("Al estar muerto no puedes jugar.");
				game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
					
				
				global_turnos++;
				game.time.events.add(500, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
			}
		}
	},
	
	sacarCartaMazo: function(jugadorReceptor){
		
		//Según el índice se accede al tipo de carta
		var tipo = global_mazo[global_indiceMazo];
		
		//Desplazamiento de la carta hacia la mano del jugador.
		that.animacionRepartir(tipo,jugadorReceptor);
		game.sendMessage("REPARTIR", {partida: partida_actual, tipo: tipo, jugadorReceptor: jugadorReceptor});
		
		//Se actualiza el índice del mazo
		global_indiceMazo++;
		game.sendMessage("SEND_DECK_INDEX", {partida: partida_actual, id: global_indiceMazo});
					
	}, 
	
	animacionRepartir: function(tipo, jugadorReceptor){
		
		//Se crea la carta para poder hacer la animación
		var carta = game.add.sprite(game.world.centerX, game.world.centerY, 'carta');
		carta.anchor.setTo(0.5,0.5);
		carta.angle = 0; 
		
		//Se definen los atributos de la carta para añadirla a la mano del jugador correspondiente
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
		/*************POR QUÉ -2??? ******************/
		if(global_indiceMazo>global_mazo.length-2){
			global_cartaMazo.destroy();
		}
		
		//Se "da la vuelta" a la carta, revelando el personaje. Sólo para el jugador al que reparten                
		if(jugadorReceptor == pos_ingame) carta.loadTexture('cartas1', tipo); 
		
		//Se determina hacia qué lado mover la carta
		var pos = jugadorReceptor - pos_ingame;
		if(pos<0) pos+=numeroJugadores;
		
		var tween;
		
		//Si es "mi" turno
		if(pos == 0){
			if (cartasManoJugadores[0] == undefined){
				tween = game.add.tween(carta).to({
					x: posManoJugadores[pos][0], 
					y: posManoJugadores[pos][1]
				},750,Phaser.Easing.Cubic.Out, true);
			}
			else{
				tween = game.add.tween(carta).to({
					x: posManoJugadores[pos][0]-gameOptions.cardSheetWidth-32,
					y: posManoJugadores[pos][1]
				},750,Phaser.Easing.Cubic.Out, true);
			}
			
			//Me permite hacer clic sobre mis cartas
			carta.inputEnabled=true;
			
			if(cartasManoJugadores[0] == undefined) {
				cartasManoJugadores[0] = carta;
				cartasManoJugadores[0].events.onInputUp.addOnce(that.elegirCarta, this, 0, 0);
			}else {
				cartasManoJugadores[1] = carta;
				cartasManoJugadores[1].events.onInputUp.addOnce(that.elegirCarta, this, 0, 1);
			}
		
		//Si el turno no es "mio"
		}else{
			tween = game.add.tween(carta).to({
				x: posManoJugadores[pos][0], 
				y: posManoJugadores[pos][1]
			},750,Phaser.Easing.Cubic.Out, true);
			
			tween.onComplete.add(function() {
				//Se elimina la carta
				carta.destroy();
			}); 
		}
	}, 
	
	crearCarta: function(posX, posY, personaje, valor, tipoframe, iEnabled, visible){
		var cartaAux;
		
		cartaAux = game.add.sprite(posX, posY, 'carta');
		cartaAux.anchor.setTo(0.5,0.5);
		cartaAux.angle = 0; 
		
		cartaAux.personaje = personaje;
		cartaAux.valor = valor;
		cartaAux.tipoframe = tipoframe;
		
		if(visible) cartaAux.loadTexture('cartas1', cartaAux.tipoframe);
		
		cartaAux.inputEnabled = iEnabled;
		
		return cartaAux;
	},
	
	elegirCarta: function(carta, a, b, indice, condesa){
		
		//Solo puedo elegir carta si es mi turno
		if(global_turnos>=numeroJugadores && pos_ingame == global_turnos%numeroJugadores){
			
			//Se hace la comprobación de la condesa
			var cartaCorrecta;
			
			var cartaMano;
			if(cartasManoJugadores[0].personaje == carta.personaje){
				cartaMano = cartasManoJugadores[1];
			}else{
				cartaMano = cartasManoJugadores[0];
			}
			
			if((carta.personaje == "Rey" || carta.personaje == "Principe") && cartaMano.personaje == "Condesa"){
				console.log("NOOOOOOOOOO! Tienes que echar la condesa");
				
				msg = "¡¡¡Tienes que echar la condesa!!!";
				that.ponerMensaje(msg);
				
				
			}else{
				cartasMesaJugadores.push(carta);
			
				if(carta.personaje == "Princesa"){
					that.animacionDescartar(carta.tipoframe, indice, pos_ingame, true, true);
					game.sendMessage("DESCARTAR", {partida: partida_actual, tipo: carta.tipoframe, indice: indice, jugadorReceptor: pos_ingame, hacerEfecto: true, muerto: true});
				
				}else{
					that.animacionDescartar(carta.tipoframe, indice, pos_ingame, true, false);
					game.sendMessage("DESCARTAR", {partida: partida_actual, tipo: carta.tipoframe, indice: indice, jugadorReceptor: pos_ingame, hacerEfecto: true, muerto: false});
				
				}
				
				//Una vez elijo la carta, paso el turno al siguiente
				//El turno al resto lo paso una vez se haya cumplido el efecto de la carta
				global_turnos++;
				
				//Se hace el efecto de la carta
				console.log("Ahora la carta debería hacer algún efecto...");
				game.time.events.add(1000,that.accionCarta, this, carta, indice);
			}
		}else{
			console.log("No puedes echar carta, todavía no se ha terminado de repartir o es el turno del jugador "+ (global_turnos%numeroJugadores + 1));
			
			if(pos_ingame != global_turnos%numeroJugadores){
				msg = "No puedes jugar, es el turno de "+nombresEnOrden[global_turnos%numeroJugadores];
				that.ponerMensaje(msg);
			}else{
				msg = "No puedes jugar aún, no se ha terminado de repartir.";
				that.ponerMensaje(msg);
			}
		}
	}, 
	
	animacionDescartar: function(tipo, indice, jugadorReceptor, hacerEfecto, muerto){
		
		var tween;
		var pos = jugadorReceptor - pos_ingame;
		if(pos<0) pos+=numeroJugadores;
		
		var carta;
		if(indice == 0)
			carta = that.crearCarta(posManoJugadores[pos][0], posManoJugadores[pos][1], undefined, undefined, tipo, false, true);
		else if(indice ==1)
			carta = that.crearCarta(posManoJugadores[pos][0]-gameOptions.cardSheetWidth-32, posManoJugadores[pos][1], undefined, undefined, tipo, false, true);
		
		tween = game.add.tween(carta).to({
			x: posMesaJugadores[pos][0], 
			y: posMesaJugadores[pos][1]
		},750,Phaser.Easing.Cubic.Out, true);
		
		
		//Al terminar la animación, se cambia la imagen de descarte de jugadores.
		tween.onComplete.add(function() {
			//Se añade la imagen encima
			var im_temp = game.add.image(posMesaJugadores[pos][0], posMesaJugadores[pos][1], 'cartas1', carta.tipoframe);
			im_temp.anchor.setTo(0.5, 0.5);
			
			//Habrá veces en las que no se quiere que se vea la animación, como cuando muere alguien o le hacen descartarse
			if(hacerEfecto){
				game.time.events.add(700, function(){
					im_temp = game.add.image(posMesaJugadores[pos][0], posMesaJugadores[pos][1], 'cartas2', carta.tipoframe);
					im_temp.anchor.setTo(0.5, 0.5);
					
					//if(carta.personaje == "Criada" || carta.personaje == "Mayordomo"){
					if(carta.tipoframe == 19 || carta.tipoframe == 21){
						var img_tp = game.add.image(posMesaJugadores[pos][0], posMesaJugadores[pos][1], 'protegido');
						img_tp.alpha = 0;
						img_tp.anchor.setTo(0.5, 0.5);
						game.add.tween(img_tp).to( { alpha: 0.7 }, 2000, Phaser.Easing.Linear.None, true);
					}
				});
			}
			if(muerto){
				game.time.events.add(800, function(){
					capaOscura = game.add.graphics(0,0);
					capaOscura.beginFill("#000000", 0.6);
					capaOscura.drawRect(posMesaJugadores[pos][0]-gameOptions.cardSheetWidth/2, posMesaJugadores[pos][1]-gameOptions.cardSheetHeight/2, gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
					capaOscura.endFill();
				});
			}
			carta.destroy();
			delete carta;
		}); 

		//Se elimina la carta de la pantalla y del array.
		if(pos==0) {
			cartasManoJugadores[indice].destroy();
			delete cartasManoJugadores[indice];
		}

	}, 
	
	accionCarta: function(carta, indice){
		
		switch(carta.personaje){
			
			case "Asesino":
			case "Condesa":
				game.time.events.add(750, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
			break;
			
			case "Mayordomo":
			case "Criada":
				console.log("Me protejo y le paso mi estado al resto.");
				
				msg = "El J"+(pos_ingame+1)+" se ha protegido.";
				that.ponerMensaje(msg);
				game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
				
				
				cartaDescarteJugadores[pos_ingame].protegido = true;
				game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: pos_ingame, vivo: cartaDescarteJugadores[pos_ingame].vivo, protegido: cartaDescarteJugadores[pos_ingame].protegido, corazones: cartaDescarteJugadores[pos_ingame].corazones});
				
				game.time.events.add(750, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
			break;
			
			case "Princesa":
				console.log("Me muero y le paso mi estado al resto.");
				
				msg = "El J"+(pos_ingame+1)+" ha muerto.";
				that.ponerMensaje("Has muerto.");
				game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
				
				
				cartaDescarteJugadores[pos_ingame].vivo = false;
				game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: pos_ingame, vivo: cartaDescarteJugadores[pos_ingame].vivo, protegido: cartaDescarteJugadores[pos_ingame].protegido, corazones: cartaDescarteJugadores[pos_ingame].corazones});
				
				game.time.events.add(750, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
			break;
			
			case "Principe": 
				necesarioElegir = true;
			break;
			
			default: //Guardia, cura, timador, baron, baronesa y rey
				
				//Se comprueba si hay al menos uno vivo y desprotegido que no sea yo mismo
				for(var i = 0; i< cartaDescarteJugadores.length; i++){
					if( i != pos_ingame && cartaDescarteJugadores[i].vivo && !cartaDescarteJugadores[i].protegido){
						necesarioElegir = true;
					}
				}
				if(!necesarioElegir){
					console.log("No puedes hacer nada. Pierdes el turno.");
					
					msg = "No puedes hacer nada. Pierdes el turno.";
					that.ponerMensaje(msg);

					game.time.events.add(750, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
				}
				
			break;
		}
	}, 
	
	seleccionJugador: function(p, a, b, jugador){ 
		
		console.log("HAS CLICADO SOBRE EL JUGADOR "+(jugador+1));
		
		if(necesarioElegir){
			necesarioElegir = false;
			
			if(cartaDescarteJugadores[jugador].vivo && !cartaDescarteJugadores[jugador].protegido){
			
				// Tomo el último elemento, que es la carta se acaba de descartar, la que realiza el efecto
				var carta1 = cartasMesaJugadores[cartasMesaJugadores.length-1];
				
				//Tomo la carta que tiene el jugador en mano
				var carta2;
				var indice;
				if(cartasManoJugadores[0] != undefined) {
					carta2 = cartasManoJugadores[0];
					indice = 0;
				}else {
					carta2 = cartasManoJugadores[1];
					indice = 1;
				}
			
				var autoDescarte = false;
				var acusacionGuardia = undefined;
				switch(carta1.personaje){
					
					case "Guardia":
						if(jugador == pos_ingame){
							console.log("No te puedes acusar a ti mismo. Elige a otro jugador.");
							
							msg = "No te puedes acusar a ti mismo. Vuelve a elegir.";
							that.ponerMensaje(msg);
			
							
							necesarioElegir = true;
						}else{
							var acu;
							do{
								acu = prompt("¿De qué quieres acusar al jugador "+(jugador+1)+"? Escribe la primera letra con mayúscula. (Asesino / Cura / Timador / Baron / Baronesa / Mayordomo / Criada / Principe / Rey / Condesa / Princesa)");
								acusacionGuardia = personajesOrden.find(function(acusacion){ return acusacion==acu});
								if(acusacionGuardia == "Guardia") {
									msg = "No puedes acusar de Guardia.";
									that.ponerMensaje(msg);
									
									console.log("No puedes acusar de Guardia.");
								}
								else if(acusacionGuardia == undefined) {
									console.log("Lo has escrito mal.");
									
									msg = "Lo has escrito mal.";
									that.ponerMensaje(msg);
									
								}
							}while(acusacionGuardia == "Guardia" || acusacionGuardia == undefined);
							
							console.log("Ahora mando un desafío al jugador "+(jugador+1)+" con mi "+carta1.personaje+ " y acuso de " + acusacionGuardia);
						}
						break;
						
					case "Cura":
						if(jugador == pos_ingame){
							console.log("No te puedes ver las cartas a ti mismo. Elige a otro jugador.");
							msg = "No te puedes atacar a ti mismo. Elige a otro.";
							that.ponerMensaje(msg);
							necesarioElegir = true;
						}
					break;
					
					case "Baron":
					case "Baronesa":
						if(jugador == pos_ingame){
							console.log("No te puedes retar a ti mismo. Elige a otro jugador.");
							msg = "No te puedes atacar a ti mismo. Elige a otro.";
							that.ponerMensaje(msg);
							necesarioElegir = true;
						}else{
							//Ojo, la carta que le mando es el baron o baronesa
							console.log("Ahora mando un desafío al jugador "+(jugador+1)+" con mi "+carta1.personaje);
						}
					break;
					
					case "Principe":
						if(jugador == pos_ingame){
							console.log("Te descartas a ti mismo");
							
							msg = "El J"+(pos_ingame+1)+" se ha descartado a sí mismo.";
							that.ponerMensaje("Te descartas a ti mismo.");
							game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
							
							autoDescarte = true;
							
							//Se descarta
							cartasMesaJugadores.push(carta2);
							
							if(carta2.personaje == "Princesa"){
								that.animacionDescartar(carta2.tipoframe, indice, pos_ingame, true, true);
								game.sendMessage("DESCARTAR", {partida: partida_actual, tipo: carta2.tipoframe, indice: indice, jugadorReceptor: pos_ingame, hacerEfecto: true, muerto: true});
							
								cartaDescarteJugadores[pos_ingame].vivo = false;
								game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: pos_ingame, vivo: cartaDescarteJugadores[pos_ingame].vivo, protegido: cartaDescarteJugadores[pos_ingame].protegido, corazones: cartaDescarteJugadores[pos_ingame].corazones});
							
							}else{
								that.animacionDescartar(carta2.tipoframe, indice, pos_ingame, false, false);
								game.sendMessage("DESCARTAR", {partida: partida_actual, tipo: carta2.tipoframe, indice: indice, jugadorReceptor: pos_ingame, hacerEfecto: false, muerto: false});
							
								/************* Y SI ES LA ÚLTIMA CARTA???  *****************/
								//Se roba una nueva
								that.sacarCartaMazo(pos_ingame);
								global_indiceMazo++;
								game.sendMessage("SEND_DECK_INDEX", {partida: partida_actual, id: global_indiceMazo});
							}
							//Se pasa el turno 
							game.time.events.add(750, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
						}else{
							console.log("Ahora mando descartar al jugador "+(jugador+1)+" con mi "+carta1.personaje);
						}
					break;
					
					case "Timador":
					case "Rey":
						if(jugador == pos_ingame){
							console.log("No te puedes cambiar las cartas contigo mismo. Elige a otro jugador.");
							
							that.ponerMensaje("No te puedes cambiar las cartas contigo mismo.\nElige a otro jugador.");
							necesarioElegir = true;
						}else{
							console.log("Ahora le cambio las cartas al jugador "+(jugador+1)+" con mi "+carta1.personaje);
						}
					break;
					default:
					break;
				}
				
				if(!necesarioElegir && !autoDescarte)
					game.sendMessage("HACER_DESAFIO", {partida: partida_actual, jugadorA: pos_ingame, jugadorB: jugador, personaje1: carta1.personaje, valor1: carta1.valor, tipoframe1: carta1.tipoframe, personaje2: carta2.personaje, valor2: carta2.valor, tipoframe2: carta2.tipoframe, acusacion: acusacionGuardia});
				
			}else{
				console.log("El jugador "+(jugador+1)+ " ta muerto o protegido. Vuelve a elegir.");
				msg = "El J"+(jugador+1)+" está muerto o protegido, vuelve a elegir.";
				that.ponerMensaje(msg);
				necesarioElegir = true;
			}
		}
	},
	
	resolverDesafio: function(jugadorA, jugadorB, acusacion, personajeB, valorB, tipoframeB){
		
		//Tomo la carta descartada
		var cartaMesa = cartasMesaJugadores[cartasMesaJugadores.length-1];
			
		//Tomo la carta que tiene el jugador desafiante en mano
		var cartaMano;
		var indice;
		if(cartasManoJugadores[0] != undefined) {
			cartaMano = cartasManoJugadores[0];
			indice = 0;
		}else {
			cartaMano = cartasManoJugadores[1];
			indice = 1;
		}
		
		switch(cartaMesa.personaje){
			case "Guardia":
				if(acusacion == personajeB){
					console.log("OMG coincide!!!!!");
					cartaDescarteJugadores[jugadorB].vivo = false;
					game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: jugadorB, vivo: cartaDescarteJugadores[jugadorB].vivo, protegido: cartaDescarteJugadores[jugadorB].protegido, corazones: cartaDescarteJugadores[jugadorB].corazones});
					
					game.sendMessage("DERROTADO", {partida: partida_actual, jugador: jugadorB});	
				}else{
					console.log("JOP... :( no la mato");
					msg = "El J"+(jugadorB+1)+" no tiene un/a "+acusacion;
					that.ponerMensaje("No has acertado.");
					game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
				}
			break;
			case "Timador":
			case "Rey":
			
				//Creo una carta con las propiedades de la carta del otro jugador
				var cartaAux;
			
				//Modifico mi carta
				//Se elimina la carta de la pantalla y del array.
				if(cartasManoJugadores[0] != undefined) {
					
					cartaAux = that.crearCarta(posManoJugadores[0][0], posManoJugadores[0][1], personajeB, valorB, tipoframeB, true, true);
					
					cartasManoJugadores[0].destroy();
					delete cartasManoJugadores[0];
					cartasManoJugadores[0] = cartaAux;
					cartasManoJugadores[0].events.onInputUp.addOnce(that.elegirCarta, this, 0, 0);
				}else {
					
					cartaAux = that.crearCarta(posManoJugadores[0][0]-gameOptions.cardSheetWidth-32, posManoJugadores[0][1], personajeB, valorB, tipoframeB, true, true);
					
					cartasManoJugadores[1].destroy();
					delete cartasManoJugadores[1];
					cartasManoJugadores[1] = cartaAux;
					cartasManoJugadores[1].events.onInputUp.addOnce(that.elegirCarta, this, 0, 1);
				}
			
			break;
			case "Cura":
				console.log("MUAJAJAJA, le he visto la carta al jugador "+ (jugadorB+1) + " y ahora sé que tiene un " +personajeB);
				msg = "El J"+(jugadorB+1)+" tiene un/a "+personajeB;
				that.ponerMensaje(msg);
			break;
			case "Baron":
				if(cartaMano.valor > valorB){
					console.log(cartaMano.personaje +" vs "+  personajeB + ". Le matao con mi barón!");
					
					msg = "El J"+(pos_ingame+1)+" ha matado al J"+(jugadorB+1);
					that.ponerMensaje(msg);
					game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
					
					cartaDescarteJugadores[jugadorB].vivo = false;
					game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: jugadorB, vivo: cartaDescarteJugadores[jugadorB].vivo, protegido: cartaDescarteJugadores[jugadorB].protegido, corazones: cartaDescarteJugadores[jugadorB].corazones});
					
					game.sendMessage("DERROTADO", {partida: partida_actual, jugador: jugadorB});
				}else if(cartaMano.valor < valorB){
					console.log(cartaMano.personaje +" vs "+  personajeB + ". Me muero :(");
					
					msg = "El J"+(pos_ingame+1)+" ha caido ante el J"+(jugadorB+1);
					that.ponerMensaje(msg);
					game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
					
					cartaDescarteJugadores[jugadorA].vivo = false;
					game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: jugadorA, vivo: cartaDescarteJugadores[jugadorA].vivo, protegido: cartaDescarteJugadores[jugadorA].protegido, corazones: cartaDescarteJugadores[jugadorA].corazones});
				
					that.animacionDescartar(cartaMano.tipoframe, indice, pos_ingame, false, true);
					game.sendMessage("DESCARTAR", {partida: partida_actual, tipo: cartaMano.tipoframe, indice: indice, jugadorReceptor: pos_ingame, hacerEfecto: false, muerto: true});		
				
				}else if(cartaMano.valor == valorB){
					console.log(cartaMano.personaje +" vs "+  personajeB + ". Empate!");
					
					msg = "¡Ha habido un empate!";
					that.ponerMensaje(msg);
					game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
				}
			break;
			
			case "Baronesa":
				if(cartaMano.valor < valorB){
					console.log(cartaMano.personaje +" vs "+  personajeB + ". Le matao con mi baronesa!");
					
					msg = "El J"+(pos_ingame+1)+" ha matado al J"+(jugadorB+1);
					that.ponerMensaje(msg);
					game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
					
					cartaDescarteJugadores[jugadorB].vivo = false;
					game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: jugadorB, vivo: cartaDescarteJugadores[jugadorB].vivo, protegido: cartaDescarteJugadores[jugadorB].protegido, corazones: cartaDescarteJugadores[jugadorB].corazones});
					
					game.sendMessage("DERROTADO", {partida: partida_actual, jugador: jugadorB});
				}else if(cartaMano.valor > valorB){
					console.log(cartaMano.personaje +" vs "+  personajeB + ". Me muero :(");
					
					msg = "El J"+(pos_ingame+1)+" ha caido ante el J"+(jugadorB+1);
					that.ponerMensaje(msg);
					game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
					
					cartaDescarteJugadores[jugadorA].vivo = false;
					game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: jugadorA, vivo: cartaDescarteJugadores[jugadorA].vivo, protegido: cartaDescarteJugadores[jugadorA].protegido, corazones: cartaDescarteJugadores[jugadorA].corazones});
					
					that.animacionDescartar(cartaMano.tipoframe, indice, pos_ingame, false, true);
					game.sendMessage("DESCARTAR", {partida: partida_actual, tipo: cartaMano.tipoframe, indice: indice, jugadorReceptor: pos_ingame, hacerEfecto: false, muerto: true});		
			
				}else if(cartaMano.valor == valorB){
					console.log(cartaMano.personaje +" vs "+  personajeB + ". Empate!");
					
					msg = "¡Ha habido un empate!";
					that.ponerMensaje(msg);
					game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
				}
			break;
			default: 
			break;
		}
		
		if(cartaMesa.personaje != "Cura")
		game.time.events.add(750, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
		
	},
	
	//FIN SECCION 3
	/////////////////////////////////////////////
	
	/////////////////////////////////////////////
	//SECCION 4: ANIMACIONES
	
	animEnsenarCarta: function(carta, jugadorA, jugadorB, personajeA, acusacion, personajeB, valorB, tipoframeB){
		var xPrev = carta.position.x;
		var yPrev = carta.position.y;
		
		var pos = jugadorA - pos_ingame;
		if(pos<0) pos+=numeroJugadores;
		
		var tween = game.add.tween(carta).to({
			x: posManoJugadores[pos][0], 
			y: posManoJugadores[pos][1]
		},750,Phaser.Easing.Cubic.Out, true);

		//Le digo al resto que repitan la animación
		game.sendMessage("DO_ANIM", {partida: partida_actual, jugadorA: jugadorA, cartaA: personajeA, jugadorB: jugadorB, tipoframeB: tipoframeB})
		
		//Cuando acaba, resuelvo desafío
		
		tween.onComplete.add(function() {
			game.time.events.add(1000, function(){
				var tween2 = game.add.tween(carta).to({
					x: xPrev, 
					y: yPrev
				},750,Phaser.Easing.Cubic.Out, true);
				
				tween2.onComplete.add(function() {
					game.sendMessage("RESOLVER_DESAFIO", {partida: partida_actual, jugadorA: jugadorA, jugadorB: jugadorB, acusacion: acusacion, personajeB: personajeB, valorB: valorB, tipoframeB: tipoframeB});
				});
			});
		});
	},
	
	animRecibirCarta: function(jugadorA, personajeA, jugadorB, tipoframeB){
		var pos = jugadorB - pos_ingame;
		if(pos<0) pos+=numeroJugadores;
		
		var tween;
		var carta = that.crearCarta(posManoJugadores[pos][0], posManoJugadores[pos][1], undefined, undefined, tipoframeB, false, true);
		
		tween = game.add.tween(carta).to({
			x: posManoJugadores[pos][0], 
			y: game.world.centerY
		},750,Phaser.Easing.Cubic.Out, true);
		
		tween.onComplete.add(function() {
			game.time.events.add(1000, function(){
				tween = game.add.tween(carta).to({
					x: posManoJugadores[pos][0], 
					y: posManoJugadores[pos][1]
				},750,Phaser.Easing.Cubic.Out, true);
				
				tween.onComplete.add(function() {
					carta.destroy();
					game.time.events.add(750, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
				});
			});
		});
	},
	
	animCambiarCarta: function(jugadorA, cartaA, jugadorB, tipoframeB){
		var posA = jugadorA - pos_ingame;
		if(posA<0) posA+=numeroJugadores;
		
		var posB = jugadorB - pos_ingame;
		if(posB<0) posB+=numeroJugadores;
		
		var tween1, tween2, tween3, tween4, tween5, tween6, tween7;
		var carta = that.crearCarta(posManoJugadores[posB][0], posManoJugadores[posB][1], undefined, undefined, tipoframeB, false, false);
		
		//La carta se moverá abajo, hacia un lado, y arriba (dura en total 750)
		tween1 = game.add.tween(carta).to({ y: game.world.centerY },250,Phaser.Easing.Cubic.Out);
		tween2 = game.add.tween(carta).to({ x: posManoJugadores[posA][0]},250,Phaser.Easing.Cubic.Out);
		tween3 = game.add.tween(carta).to({ y: posManoJugadores[posA][1] },250,Phaser.Easing.Cubic.Out);
		
		//Espera
		tween4 = game.add.tween(carta).to({ y: posManoJugadores[posA][1] },1000,Phaser.Easing.Cubic.Out);
		
		//Devuelve la carta a su sitio
		tween5 = game.add.tween(carta).to({ y: game.world.centerY },250,Phaser.Easing.Cubic.Out);
		tween6 = game.add.tween(carta).to({ x: posManoJugadores[posB][0]},250,Phaser.Easing.Cubic.Out);
		tween7 = game.add.tween(carta).to({ y: posManoJugadores[posB][1] },250,Phaser.Easing.Cubic.Out);
		
		//Se encadenan
		tween6.chain(tween7);
		tween5.chain(tween6);
		tween4.chain(tween5);
		tween3.chain(tween4);
		tween2.chain(tween3);
		tween1.chain(tween2);
		
		tween1.start();
		
	},
	
	
	//FIN SECCION 4
	/////////////////////////////////////////////
	
	/////////////////////////////////////////////
	//SECCION 5: LOGICA DE FIN DE JUEGO
	
	isFinRonda: function(){
	
		var ganador;
		
		//Recuenta el número de jugadores vivos
		var contador = 0;
		for(var i=0; i< cartaDescarteJugadores.length; i++){
			if(cartaDescarteJugadores[i].vivo){
				contador++;
				ganador = i;
			}
		}
		
		//Si quedan menos de 2 vivos, el juego ha finalizado
		if(contador < 2) {
			that.finRonda(ganador);
			return true;
		}else{
			return false;
		}
		
	},
	
	finRonda: function(ganador){
		
		console.log("La ronda ha finalizado!!! El ganador de la ronda es el jugador " + (ganador+1));
		
		msg = "La ronda ha finalizado!!!\nEl ganador de la ronda es "+nombresEnOrden[ganador];
		that.ponerMensaje(msg);
		game.sendMessage("MESSAGE", {partida: partida_actual, msg: msg, receptor: undefined});
		
		/************SI ES MAYORDOMO GANA 2***************/
		cartaDescarteJugadores[ganador].corazones += 1;
		game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: ganador, vivo: cartaDescarteJugadores[ganador].vivo, protegido: cartaDescarteJugadores[ganador].protegido, corazones: cartaDescarteJugadores[ganador].corazones});
		
		//Actualizo la puntuación del jugador en el servidor
		var jugador_tmp;
		jugador_tmp = partida_actual.jugsPartida[ganador];
		jugador_tmp.partidasGanadas +=1;
		that.putJugador(jugador_tmp);
		
		
		//Se pintan los corazones del jugador ganador
		that.pintarCorazones(ganador);
		game.sendMessage("FIN_RONDA", {partida: partida_actual, jugador: ganador});
		
		
		/***********ESTO SERIA UN FIN PARTIDA*******/
		//Si algún jugador ha conseguido todos los corazones, es el ganador definitivo
		for(var idx=0; idx<numeroJugadores; idx++){
			if(cartaDescarteJugadores[idx].corazones>=corazonesParaGanar){
				ganadorJuego = idx;
				console.log("YA TENEMOS GANADOR DE PARTIDA, es "+ (idx+1));
			}
		}
		
		/**********SI SOLO HACE FALTA GANAR UN CORAZON EN LA RONDA***********/
		game.sendMessage("END_GAME", {partida: partida_actual});
		that.deletePartida(partida_actual.id);
		game.time.events.add(6000,function(){
			game.goTo("Menu");
		});
		
		//("Se pasará a la siguiente ronda en 5 segundos.");
		//game.time.events.add(5000, LoveLetterOnline.Jugar.prototype.resetear);
	}, 
	
	getNumJugsVivos: function(){
		//Recuenta el número de jugadores vivos
		var contador = 0;
		for(var i=0; i< cartaDescarteJugadores.length; i++){
			if(cartaDescarteJugadores[i].vivo){
				contador++;
			}
		}
		return contador;
	},
	
	pintarCorazones: function(ganador){
		
		var pos;
		var cor;
		
		pos = ganador - pos_ingame;
		if(pos<0) pos+=numeroJugadores;
		
		for(var j=0; j<cartaDescarteJugadores[ganador].corazones; j++){
			if(pos===0){
				cor = game.add.image(posMesaJugadores[pos][0]-50+40*j,posMesaJugadores[pos][1]-gameOptions.cardSheetHeight/2-15, 'corazon');
			}else{
				cor = game.add.image(posMesaJugadores[pos][0]-50+40*j,posMesaJugadores[pos][1]+gameOptions.cardSheetHeight/2+15, 'corazon');
			}
			cor.anchor.setTo(0.5,0.5);
			cor.scale.setTo(0.8,0.8);
		}
		
		/*
		
		//Si ganaran varios jugadores a la vez
		
		for(var i=0; i<numeroJugadores; i++) {
			pos = i - pos_ingame;
			if(pos<0) pos+=numeroJugadores;
			for(var j=0; j<cartaDescarteJugadores[i].corazones;j++){
				if(pos===0){
					cor = game.add.image(posMesaJugadores[pos][0]-50+40*j,posMesaJugadores[pos][1]-gameOptions.cardSheetHeight/2-15, 'corazon');
				}else{
					cor = game.add.image(posMesaJugadores[pos][0]-50+40*j,posMesaJugadores[pos][1]+gameOptions.cardSheetHeight/2+15, 'corazon');
				}
				cor.anchor.setTo(0.5,0.5);
				cor.scale.setTo(0.8,0.8);
			}
		}
		*/
	},
	
	//FIN SECCION 5
	/////////////////////////////////////////////
	
	/////////////////////////////////////////////
	//REST
	
	deletePartida: function(id_tmp){
		$.ajax({
			method: "DELETE",
			url: 'http://localhost:8080/partidas/' + id_tmp,
			headers: {
				"Content-Type": "application/json"
			}
		}).done(function (partida_tmp) {
			console.log("Partida deleted: " + JSON.stringify(partida_tmp));
		});
	},
	
	putJugador: function(jugador_tmp){
		$.ajax({
			method: "PUT",
			url: 'http://localhost:8080/jugadores/' + jugador_tmp.id,
			data: JSON.stringify(jugador_tmp),
			processData: false,
			headers: {
				"Content-Type": "application/json"
			}
		}).done(function (jugador_tmp) {
			console.log("Jugador updated: " + JSON.stringify(jugador_tmp));
		});
	},
	
	//FIN REST
	/////////////////////////////////////////////
}
