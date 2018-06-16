LoveLetterOnline.Jugar = function(game){

	var comienzo;
	var partida_actual;
	var pos_ingame;
	var that;
	
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
	var turnoJugador; //A qué jugador le toca jugar
	var corazonesParaGanar = 1;
	var ganadorJuego;

	var cartasManoJugadores = []; //Las cartas que tiene el jugador en concreto en mano
	var cartasMesaJugadores = []; //Las cartas que ha ido descartando el jugador en concreto
	var cartaDescarteJugadores = []; //Objeto para interactuar con los demás jugadores y mostrar la última carta descartada

	var necesarioElegir = false; //¿Le toca al jugador elegir un jugador al que atacar?
	var jugadorElegido = false; //Para los efectos de las cartas
	var canPlay = true; //Determina si es el turno del siguiente jugador
	var finReparto = false; //Utilizada para hacer el reparto inicial automático.

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
	var textoAyudaOrden = ["Asesino(2):\nSi ganas con él, tus corazones se pondrán a 0. ¡La princesa cree que quieres matarla!\nValor: 0.", "Guardia(8):\nAcusa a otro jugador. Si tu acusación es correcta, ese jugador pierde.\nNo puedes acusar de Guardia.\nValor: 1.", "Timador(2):\nElige a dos jugadores. Estos se cambiarán las cartas.\nPuedes elegirte a ti mismo.\nValor: 2.", "Cura(4):\nMira la mano de otro jugador.\nValor: 2.", 
							"Baron(2):\nReta a otro jugador. Aquel con el valor de carta MÁS BAJO PIERDE.\nValor: 3", "Baronesa(1):\nReta a otro jugador. Aquel con el valor de carta MÁS ALTO PIERDE.\nValor: 3", "Mayordomo(1):\nIgual que la Criada.\nSi ganas con él al final de la ronda, ganarás 2 CORAZONES.\nValor: 4", "Criada(2):\nDurante una ronda nadie podrá realizar acciones sobre ti.\nValor: 4.", 
							"Principe(3):\nElige a un jugador para que descarte su carta, incluso a ti mismo.\nValor: 5", "Rey(1):\nIntercambia TU mano con la de otro jugador.\nValor: 6", "Condesa(1):\nSe descartará automáticamente si en tu mano hay además un Príncipe o un Rey.\nValor: 7", "Princesa(1):\nEl jugador que la descarte pierde.\nValor: 8"];
	var textoAyuda;

	var cuadroPartida;
	var textoPartida;
	var textoEventosPartida = ["NUEVA PARTIDA\nJugador 1, te toca empezar.", "Descarta una de tus cartas.", " "];

	var textoJugar;

	var jugar = false; 

};
	/********TAL VEZ QUITAR COSAS DE AHI ARRIBA (CARTAS-JUGADORES COMO ARRAYS BID.)********/
	/*******VARIABLES COMUNES: CARTADESCARTE, INDICEMAZO, TURNOS **********/
		/*****************/
LoveLetterOnline.Jugar.prototype = {
	
	
	preload: function(){	/********CHECK - SOBRA COMIENZO?*********/
	
		game.stage.backgroundColor = "#000000";
	
		game.load.image('menu', 'assets/prueba/menu.png');
		//game.load.image('instru1', 'assets/prueba/instru1.png');
		//game.load.image('instru2', 'assets/prueba/instru2.png');
		//game.load.image('instru3', 'assets/prueba/instru3.png');
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
		
		comienzo = false;
	},
	
	// SECCION 1: INICIALIZACIÓN DEL JUEGO Y MENSAJES WS (EN INIT)
	
	init: function(partida){
		
		partida_actual = partida;
		that = this;
		
		//Toma el nombre del jugador actual y su posición en el juego
		var name;
		for(var i=0; i<partida_actual.jugsPartida.length; i++){
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
				//case WS_actions.incoming.START_GAME_INGAME:
				case "CONECTAR":
					console.log("Que comience el juego.");
					comienzo = true;
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
					that.animacionDescartar(packet.tipo, packet.indice, packet.jugadorReceptor);
					break;
				case "HACER_DESAFIO":
					if(pos_ingame == packet.jugadorB){
						
						console.log("OMG el jugador " + (packet.jugadorA+1) + " me está retando con un " + packet.personaje1);
						
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
									cartasManoJugadores[0].events.onInputUp.add(that.elegirCarta, this, 0, 0);
								}else {
									
									cartaAux = that.crearCarta(posManoJugadores[0][0]-gameOptions.cardSheetWidth-32, posManoJugadores[0][1], packet.personaje2, packet.valor2, packet.tipoframe2, true, true);
									
									cartasManoJugadores[1].destroy();
									delete cartasManoJugadores[1];
									cartasManoJugadores[1] = cartaAux;
									cartasManoJugadores[1].events.onInputUp.add(that.elegirCarta, this, 0, 1);
								}
						
							break;
							case "Principe":
								console.log("Ma hecho dejcartarme el mu kbron");
								
								//Se descarta
								cartasMesaJugadores.push(carta);
								that.animacionDescartar(carta.tipoframe, indice, packet.jugadorB);
								game.sendMessage("DESCARTAR", {partida: partida_actual, tipo: carta.tipoframe, indice: indice, jugadorReceptor: packet.jugadorB});
								
								/**************NO COMPROBADO******************/
								if(carta.personaje == "Princesa"){
									cartaDescarteJugadores[pos_ingame].vivo = false;
									game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: pos_ingame, vivo: cartaDescarteJugadores[pos_ingame].vivo, protegido: cartaDescarteJugadores[pos_ingame].protegido, corazones: cartaDescarteJugadores[pos_ingame].corazones});
								}else{
									/************* Y SI ES LA ÚLTIMA CARTA??? - sí, hay fallo  *****************/
									//Se roba una nueva
									that.sacarCartaMazo(packet.jugadorB);
									global_indiceMazo++;
									game.sendMessage("SEND_DECK_INDEX", {partida: partida_actual, id: global_indiceMazo});
								}
								
							break;
							
							default: //Guardia, cura, barón y baronesa
							break;
						}
						
						//Siempre se le va a devolver el mando al jugador desafiante para que pase él el turno
						game.sendMessage("RESOLVER_DESAFIO", {partida: partida_actual, jugadorA: packet.jugadorA, jugadorB: packet.jugadorB, acusacion: packet.acusacion, personajeB: carta.personaje, valorB: carta.valor, tipoframeB: carta.tipoframe});
					}
					break;
				case "RESOLVER_DESAFIO":
					if(pos_ingame == packet.jugadorA){
						that.resolverDesafio(packet.jugadorA, packet.jugadorB, packet.acusacion, packet.personajeB, packet.valorB, packet.tipoframeB);
					}
					break;
				
				case "PASAR_ESTADO_JUGADOR":
					cartaDescarteJugadores[packet.jugador].vivo = packet.vivo;
					cartaDescarteJugadores[packet.jugador].protegido = packet.protegido;
					cartaDescarteJugadores[packet.jugador].corazones = packet.corazones;
					break;
					
				case "PASAR_TURNO":									///////PARA COSAS QUE SE PASAN CUANDO ACABA UN TURNO, INDICE MAZO TAMBIEN o pasar objeto / pasar numero
					console.log("El turno "+ packet.turno + " ha finalizado.\nAhora es el turno del jugador "+(packet.turno%numeroJugadores + 1));
					global_turnos = packet.turno;
					//Si se refiere a mi, juego
					if(pos_ingame == packet.turno%numeroJugadores){
						that.hacerJugada();
					}
					break;
				case "END_GAME": 
					console.log("Se acabó el juego.");
					game.time.events.add(3000,function(){
						game.goTo("Menu");
					});
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
	
	empezar: function(texto_empezar){  /********CHECK - COMIENZO SOBRA?*********/
		texto_empezar.destroy();
		console.log("Doy comienzo al juego.");
		comienzo = true;
		that.inicializarVars();
		game.sendMessage("PASAR_VARIABLES_GLOBALES", {partida: partida_actual, mazo: global_mazo});
		game.sendMessage("CONECTAR", {partida: partida_actual});
		
		that.hacerJugada();
	},
	
	// FIN SECCION 1
	// SECCION 2: INICIALIZACION DE VARIABLES
	
	inicializarVars: function(){/*******CHECK**********/
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
		
		cartasManoJugadores = []; //Las cartas que tienen los jugadores en mano
		cartasMesaJugadores = []; //Las cartas que han ido descartando los jugadores
		cartaDescarteJugadores = []; //Objeto para interactuar con los demás jugadores y mostrar la última carta descartada

		necesarioElegir = false;
		jugadorElegido = false; //Para los efectos de las cartas
		/*******delete?**********/
		canPlay = true; //Determina si es el turno del siguiente jugador
		finReparto = false; //Utilizada para hacer el reparto inicial automático.

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
		textoAyudaOrden = ["Asesino(2):\nSi ganas con él, tus corazones se pondrán a 0. ¡La princesa cree que quieres matarla!\nValor: 0.", "Guardia(8):\nAcusa a otro jugador. Si tu acusación es correcta, ese jugador pierde.\nNo puedes acusar de Guardia.\nValor: 1.", "Timador(2):\nElige a dos jugadores. Estos se cambiarán las cartas.\nPuedes elegirte a ti mismo.\nValor: 2.", "Cura(4):\nMira la mano de otro jugador.\nValor: 2.", 
								"Baron(2):\nReta a otro jugador. Aquel con el valor de carta MÁS BAJO PIERDE.\nValor: 3", "Baronesa(1):\nReta a otro jugador. Aquel con el valor de carta MÁS ALTO PIERDE.\nValor: 3", "Mayordomo(1):\nIgual que la Criada.\nSi ganas con él al final de la ronda, ganarás 2 CORAZONES.\nValor: 4", "Criada(2):\nDurante una ronda nadie podrá realizar acciones sobre ti.\nValor: 4.", 
								"Principe(3):\nElige a un jugador para que descarte su carta, incluso a ti mismo.\nValor: 5", "Rey(1):\nIntercambia TU mano con la de otro jugador.\nValor: 6", "Condesa(1):\nSe descartará automáticamente si en tu mano hay además un Príncipe o un Rey.\nValor: 7", "Princesa(1):\nEl jugador que la descarte pierde.\nValor: 8"];
		
		textoEventosPartida = ["NUEVA PARTIDA\nJugador 1, te toca empezar.", "Descarta una de tus cartas.", " "];

		jugar = false; 
		this.createGame();
		
	},
	
	over: function(item){/*******OK**********/
		item.fill = ("#AAAAAA");
	},
	out: function(item){/*******OK**********/
		item.fill = ("#000000");
	},
	
	createGame: function(){/*******CHECK**********/
		jugar = true;
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

		/*******DEPENDE DEL CLIENTE, AUNQUE SÍ TENGO LA INFORMACION DE TODOS (PARA PODER CLICAR SOBRE ELLOS)**********/
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
	
	abrirAyuda: function(a, b, indice){/*******CHECK**********/
		
		//La ventana se abre sólo si no está abierta o abriéndose
		if ((tweenAyuda !== null && tweenAyuda.isRunning) || popupAyuda.scale.x === 1)
		{
			return;
		}
		textoAyuda.setText(textoAyudaOrden[indice]);
		
		tweenAyuda = game.add.tween(popupAyuda.scale).to( { x: 0.8, y: 0.8 }, 1000, Phaser.Easing.Elastic.Out, true);
		
	}, 
	
	cerrarAyuda: function(){/*******OK**********/
		//La ventana se cierra sólo si no se está cerrando/está cerrada
		if (tweenAyuda && tweenAyuda.isRunning || popupAyuda.scale.x === 0.1)
		{
			return;
		}
		tweenAyuda = game.add.tween(popupAyuda.scale).to( { x: 0.1, y: 0.1 }, 500, Phaser.Easing.Elastic.In, true);
	}, 
	
	// FIN SECCION 2
	// SECCIÓN 3: LÓGICA DEL JUEGO
	
	hacerJugada: function(){
		
		console.log("Turno del jugador "+ (pos_ingame + 1));
		
		//Comprobar si el juego ha llegado a su fin
		if(!that.isFinJuego()){
			if(cartaDescarteJugadores[pos_ingame].vivo){
				
				//Al inicio de cada ronda me desprotejo
				if(cartaDescarteJugadores[pos_ingame].protegido){
					cartaDescarteJugadores[pos_ingame].protegido = false;
					game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: pos_ingame, vivo: cartaDescarteJugadores[pos_ingame].vivo, protegido: cartaDescarteJugadores[pos_ingame].protegido, corazones: cartaDescarteJugadores[pos_ingame].corazones});
				}
				
				console.log("Me reparten una carta.");
				if(global_indiceMazo<global_mazo.length){
					that.sacarCartaMazo(pos_ingame);
					global_indiceMazo++;
					game.sendMessage("SEND_DECK_INDEX", {partida: partida_actual, id: global_indiceMazo});
					
					if(global_turnos>=numeroJugadores){
						console.log("Ahora elijo una carta y en el callback paso el turno.");
					}else{
						console.log("Repartiendo...");
						global_turnos++;
						game.time.events.add(750, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
					}
				}
			}else{
				console.log("Al estar muerto no puedes jugar.");
				global_turnos++;
				game.time.events.add(500, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
			}
		}
	},
	
	sacarCartaMazo: function(jugadorReceptor){/*******CHECK - SOLO LA SACA EL CLIENTE AL QUE LE HAN DICHO QUE LA SAQUE, SIN EMBARGO LA ANIMACION LA DEBEN HACER TODOS DESPUES**********/
		
		//Según el índice se accede al tipo de carta
		var tipo = global_mazo[global_indiceMazo];
		
		//Desplazamiento de la carta hacia la mano del jugador.
		that.animacionRepartir(tipo,jugadorReceptor);
		game.sendMessage("REPARTIR", {partida: partida_actual, tipo: tipo, jugadorReceptor: jugadorReceptor});

		//Reparto automático de la primera ronda
		/*******SE ENCARGARÍA EL SERVIDOR - CANPLAY VA A SER ELIMINADO**********/
		//if(global_turnos<numeroJugadores) canPlay = true;
	}, 
	
	animacionRepartir: function(tipo, jugadorReceptor){/*******CHECK**********/
		
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
				cartasManoJugadores[0].events.onInputUp.add(that.elegirCarta, this, 0, 0);
			}else {
				cartasManoJugadores[1] = carta;
				cartasManoJugadores[1].events.onInputUp.add(that.elegirCarta, this, 0, 1);
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
	
	elegirCarta: function(carta, a, b, indice, condesa){/*******CHECK**********/
		
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
			}else{
				cartasMesaJugadores.push(carta);
			
				that.animacionDescartar(carta.tipoframe, indice, pos_ingame);
				game.sendMessage("DESCARTAR", {partida: partida_actual, tipo: carta.tipoframe, indice: indice, jugadorReceptor: pos_ingame});
				
				//Una vez elijo la carta, paso el turno al siguiente
				//El turno al resto lo paso una vez se haya cumplido el efecto de la carta
				global_turnos++;
				
				//Se hace el efecto de la carta
				console.log("Ahora la carta debería hacer algún efecto...");
				game.time.events.add(1250,that.accionCarta, this, carta, indice);
			}
		}else{
			console.log("No puedes echar carta, todavía no se ha terminado de repartir o es el turno del jugador "+ (global_turnos%numeroJugadores + 1));
		}
	}, 
	
	animacionDescartar: function(tipo, indice, jugadorReceptor){/*******CHECK - CUIDADO CON EL DELETE CARTAS MANO**********/
		
		var tween;
		var pos = jugadorReceptor - pos_ingame;
		if(pos<0) pos+=numeroJugadores;
		
		var carta = game.add.sprite(posManoJugadores[pos][0], posManoJugadores[pos][1], 'carta');
		carta.anchor.setTo(0.5,0.5);
		carta.angle = 0; 
		carta.tipoframe = tipo;
		carta.loadTexture('cartas1', tipo); 
		
		/********SI POS=0 HAY QUE TENER EN CUENTA EL INDICE*********/
		
		tween = game.add.tween(carta).to({
			x: posMesaJugadores[pos][0], 
			y: posMesaJugadores[pos][1]
		},750,Phaser.Easing.Cubic.Out, true);
		
		
		//Al terminar la animación, se cambia la imagen de descarte de jugadores.
		tween.onComplete.add(function() {
			//Se añade la imagen encima
			var im_temp = game.add.image(posMesaJugadores[pos][0], posMesaJugadores[pos][1], 'cartas1', carta.tipoframe);
			im_temp.anchor.setTo(0.5, 0.5);
			carta.destroy();
		}); 

		//Se elimina la carta de la pantalla y del array.
		if(pos==0) {
			cartasManoJugadores[indice].destroy();
			delete cartasManoJugadores[indice];
		}

	}, 
	
	accionCarta: function(carta, indice){/*******CHECK**********/
		
		/*******DECIRLE AL RESTO QUE CAMBIEN COMO SE VE LA MIA EN SU PANTALLA**********/
		var im_temp = game.add.image(posMesaJugadores[0][0], posMesaJugadores[0][1], 'cartas2', carta.tipoframe);
		im_temp.anchor.setTo(0.5, 0.5);

		switch(carta.personaje){
			
			case "Asesino":
			case "Condesa":
			game.time.events.add(750, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
			break;
			
			case "Mayordomo":
			case "Criada":
			console.log("Me protejo y le paso mi estado al resto.");
			
			cartaDescarteJugadores[pos_ingame].protegido = true;
			game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: pos_ingame, vivo: cartaDescarteJugadores[pos_ingame].vivo, protegido: cartaDescarteJugadores[pos_ingame].protegido, corazones: cartaDescarteJugadores[pos_ingame].corazones});
			
			game.time.events.add(750, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
			break;
			
			case "Princesa":
			console.log("Me muero y le paso mi estado al resto.");
			
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
					game.time.events.add(750, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
				}
				
			break;
		}
	}, 
	
	/*************   DETERMINAR     SIEMPRE      SI      PUEDO      HACER        ALGO        PARA       EVITAR     BLOQUEOS !!!!!!!  ************/
	seleccionJugador: function(p, a, b, jugador){ /*******CHECK**********/
		
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
							necesarioElegir = true;
						}else{
							var acu;
							do{
								acu = prompt("¿De qué quieres acusar al jugador "+(jugador+1)+"? Escribe la primera letra con mayúscula. (Asesino / Cura / Timador / Baron / Baronesa / Mayordomo / Criada / Principe / Rey / Condesa / Princesa)");
								acusacionGuardia = personajesOrden.find(function(acusacion){ return acusacion==acu});
								if(acusacionGuardia == "Guardia") console.log("No puedes acusar de Guardia.");
								else if(acusacionGuardia == undefined) console.log("Lo has escrito mal.");
							}while(acusacionGuardia == "Guardia" || acusacionGuardia == undefined);
							
							console.log("Ahora mando un desafío al jugador "+(jugador+1)+" con mi "+carta1.personaje+ " y acuso de " + acusacionGuardia);
						}
						break;
						
					case "Cura":
						if(jugador == pos_ingame){
							console.log("No te puedes ver las cartas a ti mismo. Elige a otro jugador.");
							necesarioElegir = true;
						}
					break;
					
					case "Baron":
					case "Baronesa":
						if(jugador == pos_ingame){
							console.log("No te puedes retar a ti mismo. Elige a otro jugador.");
							necesarioElegir = true;
						}else{
							//Ojo, la carta que le mando es el baron o baronesa
							console.log("Ahora mando un desafío al jugador "+(jugador+1)+" con mi "+carta1.personaje);
						}
					break;
					
					case "Principe":
						if(jugador == pos_ingame){
							console.log("Te descartas a tí mismo");
							autoDescarte = true;
							
							//Se descarta
							cartasMesaJugadores.push(carta2);
							that.animacionDescartar(carta2.tipoframe, indice, pos_ingame);
							game.sendMessage("DESCARTAR", {partida: partida_actual, tipo: carta2.tipoframe, indice: indice, jugadorReceptor: pos_ingame});
							
							if(carta2.personaje == "Princesa"){
								cartaDescarteJugadores[pos_ingame].vivo = false;
								game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: pos_ingame, vivo: cartaDescarteJugadores[pos_ingame].vivo, protegido: cartaDescarteJugadores[pos_ingame].protegido, corazones: cartaDescarteJugadores[pos_ingame].corazones});
							}else{
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
							necesarioElegir = true;
						}else{
							console.log("Ahora le cambio las cartas al jugador "+(jugador+1)+" con mi "+carta1.personaje);
						}
					break;
					default:
					break;
				}
				
				if(!necesarioElegir && !autoDescarte && !guardiaActivo)
					game.sendMessage("HACER_DESAFIO", {partida: partida_actual, jugadorA: pos_ingame, jugadorB: jugador, personaje1: carta1.personaje, valor1: carta1.valor, tipoframe1: carta1.tipoframe, personaje2: carta2.personaje, valor2: carta2.valor, tipoframe2: carta2.tipoframe, acusacion: acusacionGuardia});
				
			}else{
				console.log("El jugador "+(jugador+1)+ " ta muerto o protegido. Vuelve a elegir.");
				necesarioElegir = true;
			}
		}
	},
	
	resolverDesafio: function(jugadorA, jugadorB, acusacion, personajeB, valorB, tipoframeB){
		
		//Tomo la carta descartada
		var cartaMesa = cartasMesaJugadores[cartasMesaJugadores.length-1];
			
		//Tomo la carta que tiene el jugador desafiante en mano
		var cartaMano;
		if(cartasManoJugadores[0] != undefined) {
			cartaMano = cartasManoJugadores[0];
		}else {
			cartaMano = cartasManoJugadores[1];
		}
		
		switch(cartaMesa.personaje){
			case "Guardia":
				if(acusacion == personajeB){
					console.log("OMG coincide!!!!!");
					cartaDescarteJugadores[jugadorB].vivo = false;
					game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: jugadorB, vivo: cartaDescarteJugadores[jugadorB].vivo, protegido: cartaDescarteJugadores[jugadorB].protegido, corazones: cartaDescarteJugadores[jugadorB].corazones});
			
				}else{
					console.log("JOP... :( no la mato");
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
					cartasManoJugadores[0].events.onInputUp.add(that.elegirCarta, this, 0, 0);
				}else {
					
					cartaAux = that.crearCarta(posManoJugadores[0][0]-gameOptions.cardSheetWidth-32, posManoJugadores[0][1], personajeB, valorB, tipoframeB, true, true);
					
					cartasManoJugadores[1].destroy();
					delete cartasManoJugadores[1];
					cartasManoJugadores[1] = cartaAux;
					cartasManoJugadores[1].events.onInputUp.add(that.elegirCarta, this, 0, 1);
				}
			
			break;
			case "Cura":
				console.log("MUAJAJAJA, le he visto la carta al jugador "+ (jugadorB+1) + " y ahora sé que tiene un " +personajeB);
			break;
			case "Baron":
				if(cartaMano.valor > valorB){
					//INFORMAR DEL ESTADO AL RESTO
					console.log(cartaMano.personaje +" vs "+  personajeB + ". Le matao con mi barón!");
					cartaDescarteJugadores[jugadorB].vivo = false;
					game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: jugadorB, vivo: cartaDescarteJugadores[jugadorB].vivo, protegido: cartaDescarteJugadores[jugadorB].protegido, corazones: cartaDescarteJugadores[jugadorB].corazones});
			
				}else if(cartaMano.valor < valorB){
					console.log(cartaMano.personaje +" vs "+  personajeB + ". Me muero :(");
					cartaDescarteJugadores[jugadorA].vivo = false;
					game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: jugadorA, vivo: cartaDescarteJugadores[jugadorA].vivo, protegido: cartaDescarteJugadores[jugadorA].protegido, corazones: cartaDescarteJugadores[jugadorA].corazones});
			
				}else if(cartaMano.valor == valorB){
					console.log(cartaMano.personaje +" vs "+  personajeB + ". Empate!");
				}
			break;
			
			case "Baronesa":
				if(cartaMano.valor < valorB){
					//INFORMAR DEL ESTADO AL RESTO
					console.log(cartaMano.personaje +" vs "+  personajeB + ". Le matao con mi baronesa!");
					cartaDescarteJugadores[jugadorB].vivo = false;
					game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: jugadorB, vivo: cartaDescarteJugadores[jugadorB].vivo, protegido: cartaDescarteJugadores[jugadorB].protegido, corazones: cartaDescarteJugadores[jugadorB].corazones});
			
				}else if(cartaMano.valor > valorB){
					console.log(cartaMano.personaje +" vs "+  personajeB + ". Me muero :(");
					cartaDescarteJugadores[jugadorA].vivo = false;
					game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: jugadorA, vivo: cartaDescarteJugadores[jugadorA].vivo, protegido: cartaDescarteJugadores[jugadorA].protegido, corazones: cartaDescarteJugadores[jugadorA].corazones});
			
				}else if(cartaMano.valor == valorB){
					console.log(cartaMano.personaje +" vs "+  personajeB + ". Empate!");
				}
			break;
			default: 
			break;
		}
		
		game.time.events.add(750, game.sendMessage, this, "PASAR_TURNO", {partida: partida_actual, turno: global_turnos});
		
	},
	
	//Recuenta el número de jugadores vivos
	isFinJuego: function(){
		
		var ganador;
		var contador = 0;
		for(var i=0; i< cartaDescarteJugadores.length; i++){
			if(cartaDescarteJugadores[i].vivo){
				contador++;
				ganador = i;
			}
		}
		
		if(contador < 2) {
			that.finJuego(ganador);
			return true;
		}else{
			return false;
		}
	},
	
	finJuego: function(ganador){/*******CHECK**********/
		
		console.log("El juego ha finalizado!!! El ganador es el jugador " + (ganador+1));
		
		cartaDescarteJugadores[ganador].corazones += 1;
		game.sendMessage("PASAR_ESTADO_JUGADOR", {partida: partida_actual, jugador: ganador, vivo: cartaDescarteJugadores[ganador].vivo, protegido: cartaDescarteJugadores[ganador].protegido, corazones: cartaDescarteJugadores[ganador].corazones});
		
		game.sendMessage("END_GAME", {partida: partida_actual});
		that.deletePartida(partida_actual.id);
		
		game.time.events.add(3000,function(){
			game.goTo("Menu");
		});
		
		
		/************MAL PINTAOS **************/
		//Se pintan los corazones de cada jugador
		for(var i=0; i<numeroJugadores; i++) {
			for(var j=0; j<cartaDescarteJugadores[i].corazones;j++){
				if(i===0){
					var cor = game.add.image(posMesaJugadores[i][0]-50+40*j,posMesaJugadores[i][1]-gameOptions.cardSheetHeight/2-15, 'corazon');
				}else{
					var cor = game.add.image(posMesaJugadores[i][0]-50+40*j,posMesaJugadores[i][1]+gameOptions.cardSheetHeight/2+15, 'corazon');
				}
				cor.anchor.setTo(0.5,0.5);
				cor.scale.setTo(0.8,0.8);
			}
		}
		
		//Si algún jugador ha conseguido todos los corazones, es el ganador definitivo
		for(var idx=0; idx<numeroJugadores; idx++){
			if(cartaDescarteJugadores[idx].corazones>=corazonesParaGanar){
				ganadorJuego = idx;
				console.log("YA TENEMOS GANADOR, es "+ (idx+1));
				//return true;
			}
		}
		
		
		//return false;
		//textoEventosPartida.shift();
		//textoEventosPartida.push("Se pasará a la siguiente ronda en 5 segundos.");

		//game.time.events.add(5000, LoveLetterOnline.Jugar.prototype.resetear);
	}, 
	
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	finTurno: function(){/*******CHECK/DELETE - SE ENCARGA SERVIDOR**********/
		if(global_indiceMazo<global_mazo.length && jugadoresVivos>1){ 
			//canPlay se pone a true cuando le toca al siguiente jugador y si no se ha acabado el mazo y si queda más de un jugador vivo.   
			global_turnos++;
			jugadorElegido = false;
			//guardiaActivo = false;
			canPlay = true;
		}else{
			//Se determina quién ha ganado
			LoveLetterOnline.Jugar.prototype.finPartida(); 
		}
	}, 
	
	finPartida: function(){/*******CHECK**********/
		/*******MODIFICAR PARA TODOS**********/
		textoEventosPartida.shift();
		textoEventosPartida.push("La partida ha terminado. ¡El ganador es...");

		if(jugadoresVivos>1){
			var cartaMasAlta=0;
			var jGanador;

			//Busca la carta más alta
			for(var i=0; i<numeroJugadores; i++){
				var carta;
				if(cartaDescarteJugadores[i].vivo){
					//Busca la carta que tiene el jugador "i" para poder comparar su valor
					if(cartasManoJugadores[i][0]!=undefined){
						carta = cartasManoJugadores[i][0];
					}
					else{
						carta = cartasManoJugadores[i][1];
					}
				
					if(carta.valor>cartaMasAlta){
						cartaMasAlta = carta.valor;
						jGanador = i;
					}
				}
			}

			if(carta.personaje==="Mayordomo") cartaDescarteJugadores[jGanador].corazones +=2;
			else if(carta.personaje==="Asesino")  cartaDescarteJugadores[jGanador].corazones=0;
			else cartaDescarteJugadores[jGanador].corazones++;

			textoEventosPartida.shift();
			textoEventosPartida.push("...el jugador "+(jGanador+1)+" !");

			game.time.events.add(1000, function(){
				LoveLetterOnline.Jugar.prototype.echarCartaDerrotados(carta, jGanador);
			});
		}
		else{
			var jVivo;
			var carta;
			//Se busca quien es el jugador vivo
			for(var i=0; i<numeroJugadores; i++){
				if(cartaDescarteJugadores[i].vivo){
					jVivo=i;
				}
			}

			//Se busca su carta
			if(cartasManoJugadores[jVivo][0]!=undefined){
				carta = cartasManoJugadores[jVivo][0];
			}
			else{
				carta = cartasManoJugadores[jVivo][1];
			}
			
			if(carta.personaje==="Mayordomo") cartaDescarteJugadores[jVivo].corazones +=2;
			else if(carta.personaje==="Asesino")  cartaDescarteJugadores[jVivo].corazones=0;
			else cartaDescarteJugadores[jVivo].corazones++;

			textoEventosPartida.shift();
			textoEventosPartida.push("...el jugador "+(jVivo+1)+" !");
			
			game.time.events.add(1000, function(){
				LoveLetterOnline.Jugar.prototype.echarCartaDerrotados(carta, jVivo);
			});
		}


		if(LoveLetterOnline.Jugar.prototype.finJuego()){
			canPlay = false;
			textoEventosPartida.shift();
			textoEventosPartida.push("Parece que alguien ha conseguido todos los corazones.");
			textoEventosPartida.shift();
			textoEventosPartida.push("¡El ganador del juego es el jugador "+(ganadorJuego+1)+"!");
			
			//Si ha ganado la persona que juega, esto es, el jugador 1 (del indice 0)
			//Se actualizan las puntuaciones del servidor
			if(ganadorJuego === 0){
				LoveLetterOnline.Jugar.prototype.obtenerJugador(function(jugador){
					jugador.partidasGanadas++;
					
					$.ajax({
						method: "PUT",
						url: 'http://localhost:8080/jugadores/' + jugador.id,
						data: JSON.stringify(jugador),
						processData: false,
						headers: {
							"Content-Type": "application/json"
						}
					}).done(function (jugador) {
						console.log("Jugador updated: " + JSON.stringify(jugador));
					});
					
				});
			}
			
			//Se vuelve al menu
			game.time.events.add(2000, function(){
				game.state.start('Menu');
			});
			
		}
	}, 
	
	finJuedfghgo: function(){/*******OK/CHECK**********/
		
		//Se pintan los corazones de cada jugador
		for(var i=0; i<numeroJugadores; i++) {
			for(var j=0; j<cartaDescarteJugadores[i].corazones;j++){
				if(i===0){
					var cor = game.add.image(posMesaJugadores[i][0]-50+40*j,posMesaJugadores[i][1]-gameOptions.cardSheetHeight/2-15, 'corazon');
				}else{
					var cor = game.add.image(posMesaJugadores[i][0]-50+40*j,posMesaJugadores[i][1]+gameOptions.cardSheetHeight/2+15, 'corazon');
				}
				cor.anchor.setTo(0.5,0.5);
				cor.scale.setTo(0.8,0.8);
			}
		}
		
		//Si algún jugador ha conseguido todos los corazones, es el ganador definitivo
		for(var idx=0; idx<numeroJugadores; idx++){
			if(cartaDescarteJugadores[idx].corazones>=corazonesParaGanar){
				ganadorJuego = idx;
				return true;
			}
		}
		textoEventosPartida.shift();
		textoEventosPartida.push("Se pasará a la siguiente ronda en 5 segundos.");

		game.time.events.add(5000, LoveLetterOnline.Jugar.prototype.resetear);
	}, 
	
	echarCartaDerrotados: function(carta, jugador){/*******CHECK**********/
		var tween;
		var tweenOsc;
		var capaOscura;
		
		/*******HACER ANIMACION PARA TODOS**********/
		
		tween = game.add.tween(carta).to({
			x: posMesaJugadores[jugador][0], 
			y: posMesaJugadores[jugador][1]
		},1000,Phaser.Easing.Cubic.Out, true);
		//Al terminar la animación, se cambia la imagen de descarte de jugadores.
		tween.onComplete.add(function() {
			//Se añade la imagen encima
			var im_temp = game.add.image(posMesaJugadores[jugador][0], posMesaJugadores[jugador][1], 'cartas1', carta.tipoframe);
			im_temp.anchor.setTo(0.5, 0.5);
			
			capaOscura = game.add.graphics(0,0);
			capaOscura.beginFill("#000000", 0.6);
			capaOscura.drawRect(posMesaJugadores[jugador][0]-gameOptions.cardSheetWidth/2, posMesaJugadores[jugador][1]-gameOptions.cardSheetHeight/2, gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
			capaOscura.endFill();
		});
	}, 
	
	principeDescartar: function(carta_bis, jugador, indice){
		var tween;
    
		tween = game.add.tween(carta_bis).to({
			x: posMesaJugadores[jugador][0], 
			y: posMesaJugadores[jugador][1]
		},1000,Phaser.Easing.Cubic.Out, true);
		//Al terminar la animación, se cambia la imagen de descarte de jugadores.
		tween.onComplete.add(function() {
			//Se añade la imagen encima
			if(carta_bis.personaje==="Princesa"){
				var im_temp = game.add.image(posMesaJugadores[jugador][0], posMesaJugadores[jugador][1], 'cartas2', carta_bis.tipoframe);
				var capaOscura = game.add.graphics(0,0);
				capaOscura.beginFill("#000000", 0.6);
				capaOscura.drawRect(posMesaJugadores[jugador][0]-gameOptions.cardSheetWidth/2, posMesaJugadores[jugador][1]-gameOptions.cardSheetHeight/2, gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
				capaOscura.endFill();
			}
			else
				var im_temp = game.add.image(posMesaJugadores[jugador][0], posMesaJugadores[jugador][1], 'cartas1', carta_bis.tipoframe);
			im_temp.anchor.setTo(0.5, 0.5);
		}); 
	   

		console.log("El jugador " + (turnoJugador+1)+" ha hecho descartarse al jugador " + (jugador+1));
		textoEventosPartida.shift();
		textoEventosPartida.push("El jugador " + (turnoJugador+1)+" ha hecho descartarse al jugador " + (jugador+1));

		if(carta_bis.personaje==="Princesa"){
			cartaDescarteJugadores[jugador].vivo = false;
			jugadoresVivos--;
			console.log("El jugador "+(jugador+1) + " ha perdido tras descartar a la princesa.");
			textoEventosPartida.shift();
			textoEventosPartida.push("El jugador "+(jugador+1) + " ha perdido tras descartar a la princesa.");
		}

		if(cartasMesaJugadores[jugador]==null)    cartasMesaJugadores[jugador]=[carta_bis];
		else    cartasMesaJugadores[jugador].push(carta_bis);

		//No ha habido otro modo de eliminar la carta
		if(indice===0){
			cartasManoJugadores[jugador][0] = undefined;
		}
		else {
			cartasManoJugadores[jugador][1] = undefined;
		}

		global_indiceMazo++;
	}, 
	
	resetear: function(){
		//variables globales
		global_indiceMazo = 0; //Para ir sacando las cartas del mazo, recorre todas las cartas
		global_turnos = 0; //Aumenta cada vez que juega un jugador

		//delete cartasManoJugadores; //Las cartas que tienen los jugadores en mano
		//delete cartasMesaJugadores; //Las cartas que han ido descartando los jugadores
		//delete cartaDescarteJugadores; //Objeto para interactuar con los demás jugadores y mostrar la última carta descartada
		cartasManoJugadores = [];
		cartasMesaJugadores = [];
		
		jugadorElegido = false; //Para los efectos de las cartas
		canPlay = true; //Determina si es el turno del siguiente jugador
		finReparto = false; //Utilizada para hacer el reparto inicial automático.

		jugadoresVivos = numeroJugadores;
		guardiaActivo = false;

		textoEventosPartida = ["NUEVA PARTIDA\nJugador 1, te toca empezar.", "Descarta una de tus cartas.", " "];

		global_cartaMazo = game.add.image(game.world.centerX, game.world.centerY, 'carta');
		global_cartaMazo.anchor.setTo(0.5, 0.5);
		global_cartaMazo.angle=90;

		//Creación del mazo 
		Phaser.ArrayUtils.shuffle(global_mazo);

		//Creación de los objetos mesa. Para elegir a los demás jugadores y donde se posicionan sus cartas descartadas
		//De hecho, representa al jugador
		for(var i=0; i<numeroJugadores; i++){
			cartaDescarteJugadores[i].inputEnabled=true;
			cartaDescarteJugadores[i].vivo = true;
			cartaDescarteJugadores[i].protegido = false;
		 }

		 
	}
}
