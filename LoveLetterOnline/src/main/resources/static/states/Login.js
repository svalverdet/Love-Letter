var LoveLetterOnline = {};

LoveLetterOnline.Login = function(game){
	var texto, jugador;
	var method, url, data, processData, headers;
};

LoveLetterOnline.Login.prototype = {
	create: function(){
		texto = this.add.text(this.world.centerX, this.world.centerY,'Entrar',{fill: "#ffffff"});
		texto.inputEnabled = true;
		texto.events.onInputDown.add(this.entrar, this);
		
		//Se inserta el nombre del jugador. Tal vez se le pueda añadir un temporizador
		var nomJugador = prompt("Introduce aquí tu nombre", "Player01");
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
				'Access-Control-Allow-Origin': 'http://127.0.0.1:8887',
				'Access-Control-Allow-Origin': '127.0.0.1/:1',
				'Access-Control-Allow-Origin': 'http://localhost:8080/jugadores',
				'Access-Control-Allow-Origin': '*',
				"Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS, HEAD",
				"Content-Type": "application/json"
				
			}
		}).done(function (jugador) {
			console.log("Jugador created: " + JSON.stringify(jugador));
		});
	}
};