
LoveLetterOnline.Lobby = function(game){
	var texto;
	var texto_AddPartida;
	var that;
	var texto_partidasEnJuego = [];
	var partidasEnJuego = [];
	var jugActual;
	var partida;
	
};

LoveLetterOnline.Lobby.prototype = {
	
	create: function(){
		that = this;
		texto_partidasEnJuego = [];
		partidasEnJuego = [];
		
		this.obtenerJugador(function(jugador){
			jugActual = jugador;
		});
		
		//$(document).ready(function(){})
		 this.loadPartidas(function(partidas){
			
			that.mostrarTexto();
			
			//Cuando las partidas se han cargado desde el servidor
			for(var i=0; i<partidas.length; i++){
				partidasEnJuego.push(partidas[i]);
			}
			
			that.mostrarPartidas();
		});
	},
	
	volver: function(){
		this.state.start('Menu');
	},
	
	loadPartidas: function(callback){
		$.ajax({
			url: 'http://localhost:8080/partidas'
		}).done(function (partidas) {
			//console.log('Partidas loaded: ' + JSON.stringify(partidas));
			callback(partidas);
		});
		
	},
	
	mostrarPartidas: function(){
		var offset, p_i;
		for(var i=0; i<5; i++){
			p_i = partidasEnJuego[i];
			offset = texto_partidasEnJuego.length;
			if(p_i!==undefined){
				var linea = {
					texto: that.add.text(that.world.centerX-150, (that.world.centerY-150)+50*offset, p_i.nomPartida+': para '+p_i.numJugMax+' jugadores. ('+p_i.numJug+'/'+p_i.numJugMax+')',{fill: "#ffffff"}),
					id: p_i.id
				};
				linea.texto.inputEnabled = true;
				linea.texto.events.onInputDown.add(that.unirsePartida, this, 0, linea);
				texto_partidasEnJuego.push(linea);
			}
		}
		
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
	
	unirsePartida: function(a,b, linea){
		var id_tmp = linea.id;
		var partida_tmp;
		
		that.obtenerPartida(function(partida){
			partida_tmp = partida;
			var jugs = partida_tmp.jugsPartida;
			var canJoin = true;
			for(id in jugs){
				if(game.id_jugador == id){
					canJoin=false;
				}
			}
			if(canJoin && (partida_tmp.numJug < partida_tmp.numJugMax)){
				partida_tmp.jugsPartida.push(jugActual);
				partida_tmp.numJug++;
				that.putPartida(partida_tmp);
				game.state.start('Lobby');
			}else{
				alert("No puedes unirte porque ya estás unido. Sería demasiado meta. O simplemente porque no cabes.");
			}
			
		}, id_tmp);
		
		
		
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
	
	postPartida: function(){
		$.ajax({
			method: "POST",
			url: 'http://localhost:8080/partidas',
			data: JSON.stringify(partida),
			processData: false,
			headers: {
				"Content-Type": "application/json"
			}
		}).done(function (partida) {
			console.log("Partida created: " + JSON.stringify(partida));
		});
	},
	
	addPartida: function(){
			
		var nomPartida = prompt("Introduce aquí el nombre de la partida", "Default_Game");
		var numJugs = prompt("Introduce aquí el número de jugadores", "4");
			
		partida = {
					nomPartida: nomPartida,
					numJugMax: numJugs,
					numJug: 1,
					jugsPartida: [jugActual]
		};
			
		that.postPartida();
		game.state.start('Lobby');
		
	},
	
	mostrarTexto: function(){
		texto = that.add.text(that.world.centerX, that.world.centerY-250,'L O V E   L E T T E R   O N L I N E',{fill: "#ffffff"});
		texto.anchor.x = 0.5;
		
		texto = that.add.text(that.world.centerX, that.world.centerY+150,'Volver',{fill: "#ffffff"});
		texto.anchor.x = 0.5;
		texto.inputEnabled = true;
		texto.events.onInputDown.add(that.volver, this);
		
		texto_AddPartida = that.add.text(that.world.centerX-150, that.world.centerY-200,'Crear partida',{fill: "#ffffff"});
		texto_AddPartida.anchor.x = 0.5;
		texto_AddPartida.inputEnabled = true;
		texto_AddPartida.events.onInputDown.add(that.addPartida, this);
	}
};