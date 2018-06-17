var LoveLetterOnline = {};

LoveLetterOnline.Login = function(game){
	var texto, jugador;
	var that;
};

LoveLetterOnline.Login.prototype = {
	
	create: function(){
		
		that = this;
		
		texto = this.add.text(this.world.centerX, this.world.centerY,'Entrar',{fill: "#ffffff"});
		texto.anchor.x = 0.5;
		texto.inputEnabled = true;
		//Al darle clic a entrar se comprueba si ya existe el jugador
		texto.events.onInputDown.add(this.entrar, this);
		
		//Se inserta el nombre del jugador.
		let nomJugador = prompt("Introduce aquí tu nombre", "Guest");
		jugador = {
            nombre: nomJugador
        };
	},
	
	//Hacer el login
	entrar: function(){
		that.loadJugadores(function(jugadores){
			var nuevo = true;
			var id_tmp;
			for(var i=0; i<jugadores.length; i++){
				if(jugadores[i].nombre == jugador.nombre){
					nuevo = false;
					id_tmp = jugadores[i].id;
				}
			}
			
			if(nuevo == false){
				console.log("no se crea");
				game.id_jugador = id_tmp;
				game.sendMessage(WS_actions.outgoing.LOGIN, { id: game.id_jugador });
			}else{
				console.log("se crea");
				that.createJugador(function(){
					game.sendMessage(WS_actions.outgoing.LOGIN, { id: game.id_jugador });
				},jugador);
			}
			
			game.goTo('Menu');
			
		});
		
	},
	
	//Create jugador in server
	createJugador: function(callback, jugador) {
		$.ajax({
			method: "POST",
			url: 'http://localhost:8080/jugadores',
			data: JSON.stringify(jugador),
			processData: false,
			headers: {
				"Content-Type": "application/json"
			}
		}).done(function (jugador) {
			//Una vez ha creado el jugador, asigna el id al juego
			console.log("Jugador created: " + JSON.stringify(jugador));
			game.id_jugador = jugador.id;
			callback();
		});
	},
	
	loadJugadores: function(callback){
		$.ajax({
			url: 'http://localhost:8080/jugadores'
		}).done(function (jugadores) {
			console.log('Jugadores loaded: ' + JSON.stringify(jugadores));
			callback(jugadores);
		});
	}
};