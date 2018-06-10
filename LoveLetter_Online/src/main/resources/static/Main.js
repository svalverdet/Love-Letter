
//$(document).ready(function() {

	//JUEGO
	var gameOptions = {
		    gameWidth: 1280,
		    gameHeight: 720,
		    cardSheetWidth: 178,
		    cardSheetHeight: 208
	};
	
	const WS_actions = {
		incoming: {
			JOIN_GAME: "JOIN_GAME",
			LEAVE_GAME: "LEAVE_GAME",
			LEAVE_GAME_LAST: "LEAVE_GAME_LAST",
			START_GAME: "START_GAME"
		},
		outgoing: {
			JOIN_GAME: "JOIN_GAME",
			LEAVE_GAME: "LEAVE_GAME",
			LEAVE_GAME_LAST: "LEAVE_GAME_LAST",
			START_GAME: "START_GAME",
			LOGIN: "LOGIN"
		}
	};

	var game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.AUTO);
	game.id_jugador=-1;

	game.state.add('Menu', LoveLetterOnline.Menu);
	game.state.add('Login', LoveLetterOnline.Login);
	game.state.add('Lobby', LoveLetterOnline.Lobby);
	game.state.add('Jugar', LoveLetterOnline.Jugar);
	game.state.add('Ranking', LoveLetterOnline.Ranking);
	game.state.add('EnPartida', LoveLetterOnline.EnPartida);

	game.state.start('Login');
	
	//Cambiar entre las distintas pantallas del juego
	game.goTo = function(estado){
		game.state.start(estado);
	}
	
	//WEBSOCKETS
	game.connection = new WebSocket('ws://localhost:8080/game');
	game.connection.onerror = function(e) {
		console.log("WS error: " + e);
	}
	game.connection.onmessage = function(msg) {
		console.log("WS message: " + msg.data);
	}
	game.connection.onclose = function() {
		console.log("Closing socket");
	}
	
	game.sendMessage = function(action, data) {
		let resp = {
			action: action,
			data: data
		};
		game.connection.send( JSON.stringify(resp) );
	}
		

//})