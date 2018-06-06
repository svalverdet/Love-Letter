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
			}else{
				console.log("se crea");
				that.createJugador(jugador);
			}
			
			/*
			var msg = {
					name : "Ayyy"
				}
			game.connection.send(JSON.stringify(msg));
			console.log("Mensaje enviado: "+msg);			
			*/
			
			game.goTo('Menu');
			
		});
		
	},
	
	//Create jugador in server
	createJugador: function(jugador) {
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