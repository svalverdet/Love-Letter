
LoveLetterOnline.Lobby = function(game){
	var texto;
	var texto_AddPartida;
	var texto_refrescar;
	var that;
	var texto_partidasEnJuego = [];
	var jugActual;
	
};

LoveLetterOnline.Lobby.prototype = {
	
	create: function(){
		that = this;
		texto_partidasEnJuego = [];
		
		this.obtenerJugador(function(jugador){
			jugActual = jugador;
		});
		
		this.loadPartidas(function(partidas){
			that.mostrarTexto();
			that.mostrarPartidas(partidas);
		});
	},
	
	addPartida: function(){
		this.loadPartidas(function(partidas){
			if (partidas.length<5){
				var nomPartida = prompt("Introduce aquí el nombre de la partida", "Default_Game");
				var numJugs = prompt("Introduce aquí el número de jugadores [2,4]", "3");
					
				var partida = {
					nomPartida: nomPartida,
					numJugMax: numJugs,
					numJug: 1,
					jugsPartida: [jugActual]
				};
					
				that.postPartida(function(partidaAct){
					game.state.start('EnPartida',true, false, partidaAct);
				}, partida);
				
			}else{
				alert("No se pueden crear más partidas.");
			}
		});
	},
	
	mostrarPartidas: function(partidas){
		var offset, p_i;
		//Máximo de 5 partidas
		for(var i=0; i<partidas.length; i++){
			p_i = partidas[i];
			offset = texto_partidasEnJuego.length;
			if(p_i!==undefined){												// INNECESARIO??
				var linea = {
					texto: that.add.text(that.world.centerX-150, (that.world.centerY-150)+50*offset, p_i.nomPartida+': para '+p_i.numJugMax+' jugadores. ('+p_i.numJug+'/'+p_i.numJugMax+')',{fill: "#ffffff"}),
					id: p_i.id
				};
				linea.texto.inputEnabled = true;
				//Al clicar en una partida, se ejecuta el código para unirse a esa partida
				linea.texto.events.onInputDown.add(that.unirsePartida, this, 0, linea);
				texto_partidasEnJuego.push(linea);
			}
		}
		
	},
	
	unirsePartida: function(a,b, linea){
		var id_tmp = linea.id;
		var partida_tmp;
		
		that.obtenerPartida(function(partida){
			partida_tmp = partida;
			var jugs = partida_tmp.jugsPartida;
			var canJoin = true;
			
			//Se comprueba si el jugador ya está en la partida
			for(var i=0; i<jugs.length; i++){
				if(game.id_jugador == jugs[i].id){
					canJoin=false;
				}
			}
			
			//Si el jugador no está dentro de la partida
			if(canJoin){
				if(partida_tmp.numJug == partida_tmp.numJugMax){
					alert("Esta partida ya está llena.");
				}else{
					partida_tmp.jugsPartida.push(jugActual);
					partida_tmp.numJug++;
					that.putPartida(partida_tmp);
					if(partida_tmp.numJug == partida_tmp.numJugMax){
						game.sendMessage(WS_actions.outgoing.START_GAME);
						game.goTo('Jugar'); 		
					//Cuando la partida aun no esta a punto de llenarse
					}else{
						game.sendMessage(WS_actions.outgoing.JOIN_GAME, { name: jugActual.nombre });
						game.state.start('EnPartida', true, false, partida_tmp);
					}
				}
			}else{
				alert("No puedes unirte porque ya estás unido. (Sería demasiado meta.)");
			}
		}, id_tmp);
	},
	
	
	//REST
	loadPartidas: function(callback){
		$.ajax({
			url: 'http://localhost:8080/partidas'
		}).done(function (partidas) {
			//console.log('Partidas loaded: ' + JSON.stringify(partidas));
			callback(partidas);
		});
		
	},
	
	obtenerPartida: function(callback, id_tmp){
		$.ajax({
			url: 'http://localhost:8080/partidas/' + id_tmp
		}).done(function (partida) {
			console.log('Partida loaded: ' + JSON.stringify(partida));
			callback(partida);
		});
	},
	
	obtenerJugador: function(callback){
		$.ajax({
			url: 'http://localhost:8080/jugadores/' + game.id_jugador
		}).done(function (jugador) {
			console.log('Jugador loaded: ' + JSON.stringify(jugador));
			callback(jugador);
		});
	},
	
	postPartida: function(callback, partida){
		$.ajax({
			method: "POST",
			url: 'http://localhost:8080/partidas',
			data: JSON.stringify(partida),
			processData: false,
			headers: {
				"Content-Type": "application/json"
			}
		}).done(function (partidaAct) {
			console.log("Partida created: " + JSON.stringify(partidaAct));
			callback(partidaAct);
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
	
	
	
	//MOSTRAR EL TEXTO INICIAL
	mostrarTexto: function(){
		texto = that.add.text(that.world.centerX, that.world.centerY-250,'L O V E   L E T T E R   O N L I N E',{fill: "#ffffff"});
		texto.anchor.x = 0.5;
		
		texto = that.add.text(that.world.centerX, that.world.centerY+150,'Volver',{fill: "#ffffff"});
		texto.anchor.x = 0.5;
		texto.inputEnabled = true;
		texto.events.onInputDown.add(function(){game.goTo('Menu')}, this);
		
		texto_AddPartida = that.add.text(that.world.centerX-150, that.world.centerY-200,'Crear partida',{fill: "#ffffff"});
		texto_AddPartida.anchor.x = 0.5;
		texto_AddPartida.inputEnabled = true;
		texto_AddPartida.events.onInputDown.add(that.addPartida, this);
		
		//Para refrescar 
		texto_refrescar = that.add.text(that.world.centerX+150, that.world.centerY-200,'Actualizar',{fill: "#ffffff"});
		texto_refrescar.anchor.x = 0.5;
		texto_refrescar.inputEnabled = true;
		texto_refrescar.events.onInputDown.add(function(){game.goTo('Lobby')}, this);
	}
};