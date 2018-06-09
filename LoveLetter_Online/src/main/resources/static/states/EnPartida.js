
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
		
		
		//WEBSOCKETS
	
		game.connection.onmessage = function(msg) {
			/*
			var msg = JSON.parse(event.data);
			console.log("WS message en la partida: " + msg.data);
			var message = JSON.parse(msg.data)
			$('#chat').val=($('#chat').val() + "\n" + message.name + ": " + message.message);*/
			
			console.log("WS message en la partida: " + msg.data);
			var packet = JSON.parse(msg.data);
			
			switch (packet.action) {
				case WS_actions.incoming.JOIN_GAME:
					console.log("Se ha unido: " + packet.data.name);
					that.obtenerPartida(function(partida){
						game.state.start('EnPartida', true, false, partida);
					},partida_actual.id);
					break;
				case WS_actions.incoming.LEAVE_GAME:
					console.log(packet.data.name + " salió de la partida.");
					that.obtenerPartida(function(partida){
						game.state.start('EnPartida', true, false, partida);
					},partida_actual.id);
					break;
				case WS_actions.incoming.LEAVE_GAME_LAST:
					console.log(packet.data.name + " salió de la partida.");
					break;
				case WS_actions.incoming.START_GAME:
					game.goTo('Jugar');
					break;
				default: 
					console.log("Error receiving message.");
					break;
			}
		}
		
		
		
	},
	
	//Se elimina al jugador de la partida
	volver: function(){
		
		that.obtenerJugador(function(jugador){
			that.obtenerPartida(function(partida){
				var partidaAct = partida;
				var index = -1;
				for(var i=0; i<partidaAct.jugsPartida.length; i++){
					if(partidaAct.jugsPartida[i].id == jugador.id){
						index = i;
					}
				}
				if (index > -1) {
					partidaAct.jugsPartida.splice(index, 1);
					partidaAct.numJug--;
					that.putPartida(partidaAct);
					
					//Se comprueba si es el último en salir
					if(partidaAct.numJug < 1){
						that.deletePartida(function(){
							game.sendMessage(WS_actions.outgoing.LEAVE_GAME_LAST, { name: jugador.nombre });
							game.goTo('Lobby');
						}, partidaAct.id);
					}else{
						game.sendMessage(WS_actions.outgoing.LEAVE_GAME, { name: jugador.nombre });
						game.goTo('Lobby');
					}
					
					
					
				}
				
				
			}, partida_actual.id);
		});
	},
	
	
	
	//REST
	
	obtenerPartida: function(callback, id_tmp){
		$.ajax({
			url: 'http://localhost:8080/partidas/' + id_tmp
		}).done(function (partida) {
			console.log('Partida loaded: ' + JSON.stringify(partida));
			callback(partida);
		});
	},
	
	putPartida: function(partida_tmp){
		$.ajax({
			method: "PUT",
			url: 'http://localhost:8080/partidas/' + partida_tmp.id,
			data: JSON.stringify(partida_tmp),
			processData: false,
			headers: {
				"Content-Type": "application/json"
			}
		}).done(function (partida_tmp) {
			console.log("Partida updated: " + JSON.stringify(partida_tmp));
		});
	}, 
	
	deletePartida: function(callback, id_tmp){
		$.ajax({
			method: "DELETE",
			url: 'http://localhost:8080/partidas/' + id_tmp,
			headers: {
				"Content-Type": "application/json"
			}
		}).done(function (partida_tmp) {
			console.log("Partida deleted: " + JSON.stringify(partida_tmp));
			callback();
		});
	},
	
	
	obtenerJugador: function(callback){
		$.ajax({
			url: 'http://localhost:8080/jugadores/' + game.id_jugador
		}).done(function (jugador) {
			console.log('Jugador loaded: ' + JSON.stringify(jugador));
			callback(jugador);
		});
	}
	
	
		
};