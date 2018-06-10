LoveLetterOnline.Jugar = function(game){

	var comienzo;
	
	var gameOptions = {
    gameWidth: 1280,
    gameHeight: 720,
    cardSheetWidth: 178,
    cardSheetHeight: 208
	}
	
	//variables globales
	var mazo; //El mazo en sí
	var cartaMazo; //Representa la imagen del mazo.
	var indiceMazo = 0; //Para ir sacando las cartas del mazo, recorre todas las cartas
	var turnos = 0; //Aumenta cada vez que juega un jugador
	var numeroJugadores = 3; //Número entre 2 y 4.
	var turnoJugador; //A qué jugador le toca jugar
	var corazonesParaGanar = 1;
	var ganadorJuego;

	var cartasManoJugadores = []; //Las cartas que tienen los jugadores en mano
	var cartasMesaJugadores = []; //Las cartas que han ido descartando los jugadores
	var cartaDescarteJugadores = []; //Objeto para interactuar con los demás jugadores y mostrar la última carta descartada

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
	var textoInstrucciones;

	var jugar = false; 

};

LoveLetterOnline.Jugar.prototype = {
	
	preload: function(){
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
	
	create: function(){
		
		//Cargar como fondo
		game.stage.backgroundColor = "#000000";
		/*
		game.add.tileSprite(0, 0, gameOptions.gameWidth, gameOptions.gameHeight, 'menu');
		//Centrar el juego en la pantalla
		//this.game.scale.pageAlignHorizontally = true;this.game.scale.pageAlignVertically = true;this.game.scale.refresh();

		textoJugar = game.add.text(gameOptions.gameWidth-220, 100,"Jugar", { font: "bold 72px Waverly", fill:"#000000"});
		//textoInstrucciones = game.add.text(gameOptions.gameWidth-220, 190,"Instrucciones", { font: "bold 36px Waverly", fill:"#000000"});
		textoJugar.anchor.setTo(0.5, 0.5);
		//textoInstrucciones.anchor.setTo(0.5, 0.5);


		textoJugar.inputEnabled = true;
		//textoInstrucciones.inputEnabled = true;

		textoJugar.events.onInputOver.add(this.over, this);
		//textoInstrucciones.events.onInputOver.add(this.over, this);
		textoJugar.events.onInputOut.add(this.out, this);
		//textoInstrucciones.events.onInputOut.add(this.out, this);
		
		textoJugar.events.onInputUp.add(this.elegirNumeroJugadores, this);
		//textoInstrucciones.events.onInputUp.add(this.instrucciones);
		
		*/
	},
	
	update: function(){
		
		if(!comienzo){
			comienzo = true;
			this.inicializarVars();
		}
		if(jugar){
			textoPartida.setText(textoEventosPartida[0]+"\n"+textoEventosPartida[1]+"\n"+textoEventosPartida[2]);
			//Si es el turno del siguiente jugador, se comprueba qué hacer
			if(canPlay){
				canPlay = false;
				
				//Se añade un retardo al reparto inicial
				if(turnos<=numeroJugadores){  
					game.time.events.add(450, LoveLetterOnline.Jugar.prototype.manejadorTurnos);
				}else{
					LoveLetterOnline.Jugar.prototype.manejadorTurnos();
				}
				
			}
		}
	}, 
	
	inicializarVars: function(){
		gameOptions = {
		gameWidth: 1280,
		gameHeight: 720,
		cardSheetWidth: 178,
		cardSheetHeight: 208
		}
		
		//variables globales
		indiceMazo = 0; //Para ir sacando las cartas del mazo, recorre todas las cartas
		//Phaser.ArrayUtils.shuffle(mazo);
		turnos = 0; //Aumenta cada vez que juega un jugador
		numeroJugadores = 3; //Número entre 2 y 4.
		//turnoJugador; //A qué jugador le toca jugar
		corazonesParaGanar = 1;
		
		cartasManoJugadores = []; //Las cartas que tienen los jugadores en mano
		cartasMesaJugadores = []; //Las cartas que han ido descartando los jugadores
		cartaDescarteJugadores = []; //Objeto para interactuar con los demás jugadores y mostrar la última carta descartada

		jugadorElegido = false; //Para los efectos de las cartas
		canPlay = true; //Determina si es el turno del siguiente jugador
		finReparto = false; //Utilizada para hacer el reparto inicial automático.

		jugadoresVivos = numeroJugadores;
		personajesOrden = ["Asesino", "Guardia", "Timador", "Cura", "Baron", "Baronesa", "Mayordomo", "Criada", "Principe", "Rey", "Condesa", "Princesa"];
		guardiaActivo = false;

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
	
	over: function(item){
		item.fill = ("#AAAAAA");
	},
	out: function(item){
		item.fill = ("#000000");
	},
	/*
	elegirNumeroJugadores: function(item){
		item.inputEnabled = false;
		var botonesElegirJugadores = [];
		for(var j=0; j<3; j++){
			botonesElegirJugadores[j] = game.add.button((item.x-140)+j*140, item.y, 'boton', function(btn){
				numeroJugadores = botonesElegirJugadores.indexOf(btn)+2;
				jugadoresVivos = numeroJugadores;
				delete botonesElegirJugadores;
				this.createGame();
			}, this, 1, 0);
			botonesElegirJugadores[j].anchor.setTo(0.5, 0.5);
			botonesElegirJugadores[j].useHandCursor = true;

			estiloBoton = { font: "bold 25px Waverly", fill:"#AAAAAA", wordWrap: true, wordWrapWidth: botonesElegirJugadores[j].width, align: "center"};
			var textoBotonMenu = game.add.text(botonesElegirJugadores[j].width/2-65, botonesElegirJugadores[j].height/2-23, (j+2), estiloBoton);
			textoBotonMenu.anchor.set(0.5);
			botonesElegirJugadores[j].addChild(textoBotonMenu);       
		}
		var txt_j = game.add.text(botonesElegirJugadores[1].x, botonesElegirJugadores[1].y+50, "JUGADORES", estiloBoton);
		txt_j.anchor.set(0.5);
		

		item.kill();
	},
	*/
	/*
	instrucciones: function(){
		var contador = 0;
		var img = game.add.image(0,0,'instru1');
		var img2;
		var btn = game.add.button(gameOptions.gameWidth-240, gameOptions.gameHeight-120, 'flecha', function(){
			contador++;
			if(contador===1){
				img.kill();
				img = game.add.image(0,0,'instru2');
				img2 = game.add.image(gameOptions.gameWidth-240, gameOptions.gameHeight-120,'flecha');
				img2.scale.setTo(0.25);
			}else if(contador===2){
				img.kill();
				img2.kill();
				img = game.add.image(0,0,'instru3');
				img2 = game.add.image(gameOptions.gameWidth-240, gameOptions.gameHeight-120,'flecha');
				img2.scale.setTo(0.25);
			}else if(contador===3){
				img.kill();
				img2.kill();
				btn.kill();
				contador=0;
			}
			
		}, this, 1, 0);
		btn.scale.setTo(0.25,0.25);
	}, */
	
	createGame: function(){
		jugar = true;
		game.add.tileSprite(0, 0, gameOptions.gameWidth, gameOptions.gameHeight, 'background');
		//Centrar el juego en la pantalla
		//this.game.scale.pageAlignHorizontally = true;this.game.scale.pageAlignVertically = true;this.game.scale.refresh();
		
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
			cartaDescarteJugadores[i].corazones = 0;
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
		if(!(guardiaActivo && turnoJugador===0)){
        //La ventana se abre sólo si no está abierta o abriéndose
        if ((tweenAyuda !== null && tweenAyuda.isRunning) || popupAyuda.scale.x === 1)
        {
            return;
        }
        textoAyuda.setText(textoAyudaOrden[indice]);
        
        tweenAyuda = game.add.tween(popupAyuda.scale).to( { x: 0.8, y: 0.8 }, 1000, Phaser.Easing.Elastic.Out, true);
		} 
	}, 
	
	cerrarAyuda: function(){
		//La ventana se cierra sólo si no se está cerrando/está cerrada
		if (tweenAyuda && tweenAyuda.isRunning || popupAyuda.scale.x === 0.1)
		{
			return;
		}
		tweenAyuda = game.add.tween(popupAyuda.scale).to( { x: 0.1, y: 0.1 }, 500, Phaser.Easing.Elastic.In, true);
	}, 
	
	sacarCartaMazo: function(jugadorReceptor){
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
		LoveLetterOnline.Jugar.prototype.animacionRepartir(carta,tipo,jugadorReceptor);

		//Reparto automático de la primera ronda
		if(turnos<numeroJugadores) canPlay = true;

		
		return carta;
	}, 
	
	animacionRepartir: function(carta, tipo, jugadorReceptor){
		carta.angle = 0; 
		//Se "da la vuelta" a la carta, revelando el personaje. Sólo para el J1
		if(turnoJugador===0 || jugadorReceptor===0)                    
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
	}, 
	
	
	
	elegirCarta: function(carta, a, b, indice, condesa){
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
				//Evita que puedas clicar dos veces.
				if(cartasManoJugadores[0][0] != undefined && cartasManoJugadores[0][0].inputEnabled==true)
				cartasManoJugadores[0][0].inputEnabled=false;
				if(cartasManoJugadores[0][1] != undefined && cartasManoJugadores[0][1].inputEnabled==true)
				cartasManoJugadores[0][1].inputEnabled=false;
			}

			if(cartasMesaJugadores[0]==null)    cartasMesaJugadores[0]=[carta];
			else    cartasMesaJugadores[0].push(carta);
		}
		LoveLetterOnline.Jugar.prototype.animacionDescartar(carta, indice);
	}, 
	
	animacionDescartar: function(carta, indice){
		 var tween;
		tween = game.add.tween(carta).to({
			x: posMesaJugadores[turnoJugador][0], 
			y: posMesaJugadores[turnoJugador][1]
		},750,Phaser.Easing.Cubic.Out, true);
		//Al terminar la animación, se cambia la imagen de descarte de jugadores.
		tween.onComplete.add(function() {
			//Se añade la imagen encima
			var im_temp = game.add.image(posMesaJugadores[turnoJugador][0], posMesaJugadores[turnoJugador][1], 'cartas1', carta.tipoframe);
			im_temp.anchor.setTo(0.5, 0.5);
		}); 

		//No ha habido otro modo de eliminar la carta
		delete cartasManoJugadores[turnoJugador][indice];

		game.time.events.add(1500, LoveLetterOnline.Jugar.prototype.accionCarta, this, carta, indice);
	}, 
	
	accionCarta: function(carta, indice){
		//.loadTexture('cartas2', cartaDescarteJugadores[turnoJugador].tipoframe);
		var im_temp = game.add.image(posMesaJugadores[turnoJugador][0], posMesaJugadores[turnoJugador][1], 'cartas2', carta.tipoframe);
		im_temp.anchor.setTo(0.5, 0.5);

		switch(carta.personaje){
			case "Guardia":
				guardiaActivo = true;    
				if(turnoJugador === 0){
					textoEventosPartida.shift();
					textoEventosPartida.push("Pincha sobre el jugador al que quieras acusar.");
					//No puede realizar la accion sobre sí mismo
					for(var jugador=1; jugador<numeroJugadores; jugador++){
						if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
							cartaDescarteJugadores[jugador].events.onInputUp.add(LoveLetterOnline.Jugar.prototype.eleccionGuardia, this, 0, jugador);
					}
				}else{
					var jugador = LoveLetterOnline.Jugar.prototype.jugadorVivoAlAzar(false);
					LoveLetterOnline.Jugar.prototype.accionGuardia(undefined, undefined, undefined, jugador);
				}
				break;

			case "Timador":
				if(turnoJugador === 0){
					textoEventosPartida.shift();
					textoEventosPartida.push("Pincha sobre un jugador al que quieras cambiarle la carta.");
					//Puede realizar la accion sobre sí mismo
					for(var jugador=0; jugador<numeroJugadores; jugador++){
						if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
							cartaDescarteJugadores[jugador].events.onInputUp.add(LoveLetterOnline.Jugar.prototype.accionTimador, this, 0, carta.personaje, jugador);
					}
				}else{
					var jugador1 = LoveLetterOnline.Jugar.prototype.jugadorVivoAlAzar(true);
					//No puede elegir al mismo jugador las dos veces
					do{
						var jugador2 = LoveLetterOnline.Jugar.prototype.jugadorVivoAlAzar(true);
					}while(jugador1===jugador2);

					LoveLetterOnline.Jugar.prototype.accionTimaRey(undefined, undefined, undefined, carta.personaje, jugador1, jugador2);
				}
				break;
			case "Cura":
				if(turnoJugador === 0){
					textoEventosPartida.shift();
					textoEventosPartida.push("Pincha sobre el jugador al que quieras verle las cartas.");
					//No puede realizar la accion sobre sí mismo
					for(var jugador=1; jugador<numeroJugadores; jugador++){
						if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
							cartaDescarteJugadores[jugador].events.onInputUp.add(LoveLetterOnline.Jugar.prototype.accionCura, this, 0, jugador);
					}
				}else{
					var jugador = LoveLetterOnline.Jugar.prototype.jugadorVivoAlAzar(false);
					LoveLetterOnline.Jugar.prototype.accionCura(undefined, undefined, undefined, jugador);
				}
				break;
			
			case "Baron":
			case "Baronesa":
				if(turnoJugador === 0){
					textoEventosPartida.shift();
					textoEventosPartida.push("Pincha sobre el jugador al que quieras retar.");
					//No puede realizar la accion sobre sí mismo
					for(var jugador=1; jugador<numeroJugadores; jugador++){
						if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
							cartaDescarteJugadores[jugador].events.onInputUp.add(LoveLetterOnline.Jugar.prototype.accionBaronBaronesa, this, 0, jugador, carta.personaje);
					}
				}else{
					var jugador = LoveLetterOnline.Jugar.prototype.jugadorVivoAlAzar(false);
					LoveLetterOnline.Jugar.prototype.accionBaronBaronesa(undefined, undefined, undefined, jugador, carta.personaje);
				}
				break;

			case "Criada":
			case "Mayordomo":
				cartaDescarteJugadores[turnoJugador].protegido = true;
				//cartaDescarteJugadores[turnoJugador].inputEnabled = false;
				var img_tp = game.add.image(posMesaJugadores[turnoJugador][0], posMesaJugadores[turnoJugador][1], 'protegido');
				img_tp.alpha = 0;
				img_tp.anchor.setTo(0.5, 0.5);
				game.add.tween(img_tp).to( { alpha: 0.7 }, 2000, Phaser.Easing.Linear.None, true);
				console.log("El jugador "+(turnoJugador+1) + " se ha protegido.");
				textoEventosPartida.shift();
				textoEventosPartida.push("El jugador "+(turnoJugador+1) + " se ha protegido.");
				game.time.events.add(1000, LoveLetterOnline.Jugar.prototype.finTurno);
				break;

			case "Principe":
				if(turnoJugador === 0){
					textoEventosPartida.shift();
					textoEventosPartida.push("Pincha sobre el jugador que quieres que se descarte.");
					//Sí puede realizar la accion sobre sí mismo
					for(var jugador=0; jugador<numeroJugadores; jugador++){
						if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
							cartaDescarteJugadores[jugador].events.onInputUp.add(LoveLetterOnline.Jugar.prototype.accionPrincipe, this, 0, jugador);
					}
				}else{
					var jugador = LoveLetterOnline.Jugar.prototype.jugadorVivoAlAzar(true);
					LoveLetterOnline.Jugar.prototype.accionPrincipe(undefined, undefined, undefined, jugador);
				}
				break;

			case "Rey":
				if(turnoJugador === 0){
					textoEventosPartida.shift();
					textoEventosPartida.push("Pincha sobre el jugador con el que quieres cambiarte la carta.");
					//No puede realizar la accion sobre sí mismo
					for(var jugador=1; jugador<numeroJugadores; jugador++){
						if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
							cartaDescarteJugadores[jugador].events.onInputUp.add(LoveLetterOnline.Jugar.prototype.accionTimaRey, this, 0, carta.personaje, jugador);
					}
				}else{
					var jugador = LoveLetterOnline.Jugar.prototype.jugadorVivoAlAzar(false);
					LoveLetterOnline.Jugar.prototype.accionTimaRey(undefined, undefined, undefined, carta.personaje, jugador);
				}
				break;

			case "Princesa":
				cartaDescarteJugadores[turnoJugador].vivo = false;
				jugadoresVivos--;

				if(indice===0)
					game.time.events.add(750, LoveLetterOnline.Jugar.prototype.echarCartaDerrotados, this, cartasManoJugadores[turnoJugador][1], turnoJugador);
				else
					game.time.events.add(750, LoveLetterOnline.Jugar.prototype.echarCartaDerrotados, this, cartasManoJugadores[turnoJugador][0], turnoJugador);
				
				console.log("El jugador "+(turnoJugador+1) + " ha perdido tras descartar a la princesa.");
				textoEventosPartida.shift();
				textoEventosPartida.push("El jugador "+(turnoJugador+1) + " ha perdido tras descartar a la princesa.");
				game.time.events.add(3250, LoveLetterOnline.Jugar.prototype.finTurno);
				break;

			default: game.time.events.add(50, LoveLetterOnline.Jugar.prototype.finTurno);
		}
	}, 
	
	//Self indica si en un principio el jugador puede elegirse a sí mismo.
	//Tal vez pueda simplificarse si está especificado en las acciones de cada uno   
	jugadorVivoAlAzar: function(self){
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
				else return LoveLetterOnline.Jugar.prototype.jugadorVivoAlAzar(self);
			}
			else return numJug;
		else
			return LoveLetterOnline.Jugar.prototype.jugadorVivoAlAzar(self);
	}, 
	
	finTurno: function(){
		if(indiceMazo<mazo.length && jugadoresVivos>1){ 
			//canPlay se pone a true cuando le toca al siguiente jugador y si no se ha acabado el mazo y si queda más de un jugador vivo.   
			turnos++;
			jugadorElegido = false;
			//guardiaActivo = false;
			canPlay = true;
		}else{
			//Se determina quién ha ganado
			LoveLetterOnline.Jugar.prototype.finPartida(); 
		}
	}, 
	
	finPartida: function(){
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
	
	obtenerJugador: function(callback){
		$.ajax({
			url: 'http://localhost:8080/jugadores/' + game.id_jugador
		}).done(function (jugador) {
			console.log('Jugador loaded: ' + JSON.stringify(jugador));
			callback(jugador);
		});
	},
	
	finJuego: function(){
		
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
	
	manejadorTurnos: function(){
		//Con el resto se calcula hacia quién va la carta.
		turnoJugador = turnos%numeroJugadores;
	
		if(cartaDescarteJugadores[turnoJugador].vivo==true){
			//if-else evita el error de undefined porque al pricipio el array está vacío.
			if(turnos<numeroJugadores){ 
				
				cartasManoJugadores[turnoJugador] = [LoveLetterOnline.Jugar.prototype.sacarCartaMazo(turnoJugador)];			// POR ALGÚN MOTIVO ESTO LO DETECTA COMO FUNCIÓN NO DEFINIDA
				if(turnoJugador===0) {																//se puede quitar los argumentos para que al menos no salte error
					if(cartasManoJugadores[0][0] != undefined)										//Solución: sacar todas las funciones fuera...
					cartasManoJugadores[0][0].inputEnabled=true;
				}
			}else {
				//Si la posicion x está vacía, rellenala al robar carta
				if(cartasManoJugadores[turnoJugador][0]==undefined){
					cartasManoJugadores[turnoJugador][0] = LoveLetterOnline.Jugar.prototype.sacarCartaMazo(turnoJugador);
				}else{
					cartasManoJugadores[turnoJugador][1] = LoveLetterOnline.Jugar.prototype.sacarCartaMazo(turnoJugador);
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
						//cartaDescarteJugadores[i].inputEnabled = true;
						console.log("El jugador "+(turnoJugador+1) +" ya no está protegido.");
						textoEventosPartida.shift();
						textoEventosPartida.push("El jugador "+(turnoJugador+1) +" ya no está protegido.");
					}
				}

				//El jugador está obligado a descartar la condesa si tiene un príncipe o un rey
				if((cartasManoJugadores[turnoJugador][0].personaje === "Condesa") && (cartasManoJugadores[turnoJugador][1].personaje === "Principe" || cartasManoJugadores[turnoJugador][1].personaje === "Rey"))
				{
					game.time.events.add(1500, LoveLetterOnline.Jugar.prototype.elegirCarta, undefined, cartasManoJugadores[turnoJugador][0], undefined, undefined, 0, true);              
				}else if((cartasManoJugadores[turnoJugador][1].personaje === "Condesa") && (cartasManoJugadores[turnoJugador][0].personaje === "Principe" || cartasManoJugadores[turnoJugador][0].personaje === "Rey"))
				{
					game.time.events.add(1500, LoveLetterOnline.Jugar.prototype.elegirCarta, undefined, cartasManoJugadores[turnoJugador][1], undefined, undefined, 1, true);
				}
				else{
					if(turnoJugador!==0){game.time.events.add(800, LoveLetterOnline.Jugar.prototype.elegirCarta, undefined, undefined, undefined, undefined, undefined, false)}
					else {
						if(cartasManoJugadores[0][0] !== undefined) {cartasManoJugadores[0][0].events.onInputUp.add(LoveLetterOnline.Jugar.prototype.elegirCarta, this, 0, 0, false);}
						if(cartasManoJugadores[0][1] !== undefined) {cartasManoJugadores[0][1].events.onInputUp.add(LoveLetterOnline.Jugar.prototype.elegirCarta, this, 0, 1, false);}
					}
					
				}
			}
			else{
				turnos++;
			}

			indiceMazo++;
		}else{
			LoveLetterOnline.Jugar.prototype.finTurno();
		}
	}, 
	
	
	
	echarCartaDerrotados: function(carta, jugador){
		var tween;
		var tweenOsc;
		var capaOscura;
		
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
	
	accionAsesino: function(){
		
	}, 
	
	eleccionGuardia: function(carta, a, b, jugador){
		console.log("Elige de qué quieres acusar al jugador "+(jugador+1));
		textoEventosPartida.shift();
		textoEventosPartida.push("Elige de qué quieres acusar al jugador "+(jugador+1) + " pulsando un botón.");
		
		//Puede realizar la accion sobre sí mismo
		for(var btn=0; btn<botones.length;btn++)
			botones[btn].onInputDown.add(LoveLetterOnline.Jugar.prototype.accionGuardia, carta, this, 0, jugador, btn);
	}, 
	
	accionGuardia: function(carta, a, b, jugador, btn){
		if(guardiaActivo){
			jugadorElegido = true;
			
			cartaDescarteJugadores[jugador].events.destroy();
			//No puede acusarse a sí mismo
			//if(cartaDescarteJugadores[jugador].vivo && !cartaDescarteJugadores[jugador].protegido){
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
							game.time.events.add(750, LoveLetterOnline.Jugar.prototype.echarCartaDerrotados, this, cartaAcusada, jugador);
						else
							game.time.events.add(750, LoveLetterOnline.Jugar.prototype.echarCartaDerrotados, this, cartaAcusada, jugador);
					
						console.log("El jugador " + (turnoJugador+1)+" ha acusado al jugador " + (jugador+1)+" de tener un/a "+acusacion+" y ha acertado.\nEl jugador "+(jugador+1)+" ha sido eliminado.");
						textoEventosPartida.shift();
						textoEventosPartida.push("El jugador " + (turnoJugador+1)+" ha acusado al jugador " + (jugador+1)+" de tener un/a "+acusacion+" y ha acertado.");
						textoEventosPartida.shift();
						textoEventosPartida.push("El jugador "+(jugador+1)+" ha sido eliminado.");
						
					}
					else {
						console.log("El jugador " + (turnoJugador+1)+" ha acusado al jugador " + (jugador+1)+" de tener un/a "+acusacion+" y ha fallado.");
						textoEventosPartida.shift();
						textoEventosPartida.push("El jugador " + (turnoJugador+1)+" ha acusado al jugador " + (jugador+1)+" de tener un/a "+acusacion+" y ha fallado.");
					}
				}else{
					console.log("No puedes acusar de Guardia a otro jugador.");
					textoEventosPartida.shift();
					textoEventosPartida.push("No puedes acusar de Guardia a otro jugador.");
				}

			}else{
				console.log("El jugador " + (turnoJugador+1)+" no ha podido acusar al jugador " + (jugador+1));
				textoEventosPartida.shift();
				textoEventosPartida.push("El jugador " + (turnoJugador+1)+" no ha podido acusar al jugador " + (jugador+1));
			}
			
			game.time.events.add(100, function(){
				guardiaActivo = false;
			});

			game.time.events.add(2750, LoveLetterOnline.Jugar.prototype.finTurno);
		}
	}, 
	
	accionTimador: function(carta, a, b, person, jugador1){
		textoEventosPartida.shift();
		textoEventosPartida.push("Elige al segundo jugador.");
		console.log("Elige al segundo jugador");
		
		//Puede realizar la accion sobre sí mismo
		for(var jugador2=0; jugador2<numeroJugadores; jugador2++){
			if(cartaDescarteJugadores[jugador2].vivo)
				cartaDescarteJugadores[jugador2].events.onInputUp.add(LoveLetterOnline.Jugar.prototype.accionTimaRey, this, 0, person, jugador1, jugador2);
		}
	}, 
	
	accionTimaRey: function(carta, a, b, person, jugador1, jugador2){
		jugadorElegido = true;
		cartaDescarteJugadores[jugador1].events.destroy();

		if(person==="Rey")  jugador2 = turnoJugador;
		else if(turnoJugador===0){

			if(jugador1===jugador2){
				console.log("Elige a otro jugador");
				textoEventosPartida.shift();
				textoEventosPartida.push("Elige a otro jugador.");

				//Puede realizar la accion sobre sí mismo
				for(var jugador=0; jugador<numeroJugadores; jugador++){                                     //Podría interferir con la llamada a siguiente turno de abajo
					if(cartaDescarteJugadores[jugador].vivo && !jugadorElegido)
						cartaDescarteJugadores[jugador].events.onInputUp.add(LoveLetterOnline.Jugar.prototype.accionTimador, this, 0, carta.personaje, jugador);
				}
			}

			cartaDescarteJugadores[jugador2].events.destroy();
		}



		if(cartaDescarteJugadores[jugador1].vivo && jugador1!==jugador2 && !cartaDescarteJugadores[jugador1].protegido){
			console.log("El jugador " + (jugador2+1)+" se ha cambiado las cartas con el jugador " + (jugador1+1)+".");
			textoEventosPartida.shift();
			textoEventosPartida.push("El jugador " + (jugador2+1)+" se ha cambiado las cartas con el jugador " + (jugador1+1)+".");
			
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
			textoEventosPartida.shift();
			textoEventosPartida.push("El jugador " + (jugador2+1)+" no ha podido cambiarle la mano al jugador " + (jugador1+1)+".");
		}
		

		game.time.events.add(3500, LoveLetterOnline.Jugar.prototype.finTurno);                    
	}, 
	
	accionCura: function(carta, a, b, jugador){
		jugadorElegido = true;
		cartaDescarteJugadores[jugador].events.destroy();
		//No puede verse la carta a sí mismo
		if(cartaDescarteJugadores[jugador].vivo && jugador!==turnoJugador && !cartaDescarteJugadores[jugador].protegido){
			var pvisto;
			if(cartasManoJugadores[jugador][0]!=undefined)
				pvisto = cartasManoJugadores[jugador][0].personaje;
			else
				pvisto = cartasManoJugadores[jugador][1].personaje;

			if(turnoJugador===0) {
				console.log("El jugador " + (jugador+1) + " tiene un/a: " + pvisto);
				textoEventosPartida.shift();
				textoEventosPartida.push("El jugador " + (jugador+1) + " tiene un/a: " + pvisto);
			}
			else {
				console.log("El jugador " + (turnoJugador+1)+" le ha visto la mano al jugador " + (jugador+1));
				textoEventosPartida.shift();
				textoEventosPartida.push("El jugador " + (turnoJugador+1)+" le ha visto la mano al jugador " + (jugador+1));
			}
		}else{
			console.log("El jugador " + (turnoJugador+1)+" no ha podido verle la mano al jugador " + (jugador+1));
			textoEventosPartida.shift();
			textoEventosPartida.push("El jugador " + (turnoJugador+1)+" no ha podido verle la mano al jugador " + (jugador+1));
		}
		
		game.time.events.add(1000, LoveLetterOnline.Jugar.prototype.finTurno);
	}, 
	
	accionBaronBaronesa: function(carta, a, b, jugador, person){
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
			textoEventosPartida.shift();
			textoEventosPartida.push("El jugador " + (turnoJugador+1)+" ha retado al jugador " + (jugador+1)+ " usando el/la "+person+".");


			//Gana el retado
			if((retado.valor>retadoR.valor && person==="Baron") || (retado.valor<retadoR.valor && person==="Baronesa")){
				jugadoresVivos--;
				
				game.time.events.add(750, LoveLetterOnline.Jugar.prototype.echarCartaDerrotados, this, retadoR, turnoJugador);
				
				cartaDescarteJugadores[turnoJugador].vivo = false;
				console.log("El jugador " + (jugador+1)+" ha salido victorioso."); 
				textoEventosPartida.shift();
				textoEventosPartida.push("El jugador " + (jugador+1)+" ha salido victorioso.");
				
			//Gana el retador
			}else if((retado.valor<retadoR.valor && person==="Baron") || (retado.valor>retadoR.valor && person==="Baronesa")){
				jugadoresVivos--;
				
				game.time.events.add(750, LoveLetterOnline.Jugar.prototype.echarCartaDerrotados, this, retado, jugador);

				cartaDescarteJugadores[jugador].vivo = false;
				console.log("El jugador " + (turnoJugador+1)+" ha salido victorioso.");
				textoEventosPartida.shift();
				textoEventosPartida.push("El jugador " + (turnoJugador+1)+" ha salido victorioso.");

			//Hay empate
			}else{
			   console.log("¡Parece que ha habido un empate!");
			   textoEventosPartida.shift();
			   textoEventosPartida.push("¡Parece que ha habido un empate!");
			}

		}else{
			console.log("El jugador " + (turnoJugador+1)+" no ha podido compararse con el jugador " + (jugador+1));
			textoEventosPartida.shift();
			textoEventosPartida.push("El jugador " + (turnoJugador+1)+" no ha podido compararse con el jugador " + (jugador+1));
		}
		
		game.time.events.add(3250, LoveLetterOnline.Jugar.prototype.finTurno);
	}, 
	
	accionPrincipe: function(carta, a, b, jugador){
		jugadorElegido = true;
		cartaDescarteJugadores[jugador].events.destroy();

		if(cartaDescarteJugadores[jugador].vivo && !cartaDescarteJugadores[jugador].protegido){
			var carta_bis; //La carta de la que se tiene que descartar
			var indice;
			
			if(cartasManoJugadores[jugador][0]==undefined){
				carta_bis = cartasManoJugadores[jugador][1];
				indice = 1;
				if(carta_bis.personaje!=="Princesa"){cartasManoJugadores[jugador][0]=LoveLetterOnline.Jugar.prototype.sacarCartaMazo(jugador);}
			}
			else{
				carta_bis = cartasManoJugadores[jugador][0];
				indice = 0;
				if(carta_bis.personaje!=="Princesa"){cartasManoJugadores[jugador][1]=LoveLetterOnline.Jugar.prototype.sacarCartaMazo(jugador);}
			}

			game.time.events.add(150, LoveLetterOnline.Jugar.prototype.principeDescartar, this, carta_bis, jugador, indice);

			
		}else{
			console.log("El jugador " + (turnoJugador+1)+" no ha podido hacer descartarse al jugador " + (jugador+1));
			textoEventosPartida.shift();
			textoEventosPartida.push("El jugador " + (turnoJugador+1)+" no ha podido hacer descartarse al jugador " + (jugador+1));
		}
		game.time.events.add(2500, LoveLetterOnline.Jugar.prototype.finTurno);
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

		indiceMazo++;
	}, 
	
	resetear: function(){
		//variables globales
		indiceMazo = 0; //Para ir sacando las cartas del mazo, recorre todas las cartas
		turnos = 0; //Aumenta cada vez que juega un jugador

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

		cartaMazo = game.add.image(game.world.centerX, game.world.centerY, 'carta');
		cartaMazo.anchor.setTo(0.5, 0.5);
		cartaMazo.angle=90;

		//Creación del mazo 
		Phaser.ArrayUtils.shuffle(mazo);

		//Creación de los objetos mesa. Para elegir a los demás jugadores y donde se posicionan sus cartas descartadas
		//De hecho, representa al jugador
		for(var i=0; i<numeroJugadores; i++){
			cartaDescarteJugadores[i].inputEnabled=true;
			cartaDescarteJugadores[i].vivo = true;
			cartaDescarteJugadores[i].protegido = false;
		 }

		 
	}
}
