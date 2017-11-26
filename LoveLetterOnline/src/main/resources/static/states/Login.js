var LoveLetterOnline = {};

LoveLetterOnline.Login = function(game){
	var texto, jugador;
	var method, url, data, processData, headers;
	var that;
};

LoveLetterOnline.Login.prototype = {
	create: function(){
		that = this;
		texto = this.add.text(this.world.centerX, this.world.centerY,'Entrar',{fill: "#ffffff"});
		texto.anchor.x = 0.5;
		texto.inputEnabled = true;
		texto.events.onInputDown.add(this.entrar, this);
		
		//Se inserta el nombre del jugador. Tal vez se le pueda añadir un temporizador
		var nomJugador = prompt("Introduce aquí tu nombre", "Guest");
		jugador = {
            nombre: nomJugador
        };
	},
	entrar: function(){
		
		LoveLetterOnline.Login.prototype.createJugador(jugador);
		this.state.start('Menu');
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
			console.log("Jugador created: " + JSON.stringify(jugador));
			game.id_jugador = jugador.id;
		});
	}
};