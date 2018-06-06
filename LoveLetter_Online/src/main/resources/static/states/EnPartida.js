
LoveLetterOnline.EnPartida = function(game){
	var that;
	var partida_actual;
	var jugadoresEnJuego = [];
	var texto_volver;
	
};

LoveLetterOnline.EnPartida.prototype = {
	
	init: function(partida){
		partida_actual = partida;
	},
		
	create: function(){
		that = this;
		jugadoresEnJuego = [];
		
		//Se muestra el nombre de la partida y los jugadores
		that.add.text(that.world.centerX-150, (that.world.centerY-250),  
				partida_actual.nomPartida+': para '+partida_actual.numJugMax+' jugadores.    '+partida_actual.numJug+'/'+partida_actual.numJugMax,{fill: "#ffffff"});
		
		//Boton de volver
		texto_volver = this.add.text(this.world.centerX, this.world.centerY+150,'Volver',{fill: "#ffffff"});
		texto_volver.anchor.x = 0.5;
		texto_volver.inputEnabled = true;
		texto_volver.events.onInputDown.add(this.volver, this);
		
		
		
		//Se muestran los jugadores de la partida
		//WEBSOCKETS
		
		game.connection.onmessage = function(msg) {
			console.log("WS message en la partida: " + msg.data);
			/*var message = JSON.parse(msg.data)
			$('#chat').val($('#chat').val() + "\n" + message.name + ": " + message.message);*/
		}
		
		
	},
	
	//Se elimina al jugador de la partida
	volver: function(){
		this.state.start('Lobby');
	}
		
};