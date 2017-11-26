
LoveLetterOnline.Lobby = function(game){
	var texto;
	var texto_AddPartida;
	var that;
	var texto_partidasEnJuego = [];
	var partidasEnJuego = [];
};

LoveLetterOnline.Lobby.prototype = {
	
	create: function(){
		that = this;
		texto_partidasEnJuego = [];
		partidasEnJuego = [];
		this.mostrarTexto();
		
		//$(document).ready(function(){})
		/*
		 
		 this.loadPartidas(function(partidas){
			
			that.mostrarTexto();
			
			//Cuando las partidas se han cargado desde el servidor
			/*
			for(var i=0; i<partidas.length; i++){
				jugsRanking.push(jugadores[i].partidasGanadas);
				
			}
			
			//that.mostrarJugadores();
			
		});
		*/
		
		
		
				
	},
	volver: function(){
		this.state.start('Menu');
	},
	
	loadPartidas: function(callback){
		$.ajax({
			url: 'http://localhost:8080/partidas'
		}).done(function (partidas) {
			console.log('Partidas loaded: ' + JSON.stringify(partidas));
			callback(partidas);
		});
	},
	
	mostrarJugadores: function(){
		var textoNombre;
		for(var i=0; i<5; i++){
			if(jugsRanking[i]!==undefined){
				textoNombre = jugsRanking[i];
			}else textoNombre = '-';
			that.add.text(that.world.centerX, (that.world.centerY-200)+50*i, (i+1) + '. '+textoNombre, {fill: "#ffffff"});
		}
	},
	
	addPartida: function(a, b, nombrePartida){
		
		var nomPartida = prompt("Introduce aquí el nombre de la partida", "Partida");
		var numJugs = prompt("Introduce aquí el número de jugadores", "2");
		
		var p_jav = {
				nombre: nomPartida,
				numJugMax: numJugs,
				jugsPartida: []
		}
		
		partidasEnJuego.push(p_jav);
		
		var offset = texto_partidasEnJuego.length;
		var p = that.add.text(that.world.centerX-150, (that.world.centerY-150)+50*offset,nomPartida+': para '+numJugs+' jugadores',{fill: "#ffffff"});
		p.inputEnabled = true;
		texto_partidasEnJuego.push(p);
		
		
		
	},
	
	mostrarTexto: function(){
		texto = that.add.text(that.world.centerX, that.world.centerY-250,'L O V E  L E T T E R  O N L I N E',{fill: "#ffffff"});
		texto.anchor.x = 0.5;
		texto = that.add.text(that.world.centerX, that.world.centerY+150,'Volver',{fill: "#ffffff"});
		texto.anchor.x = 0.5;
		texto.inputEnabled = true;
		texto.events.onInputDown.add(that.volver, this);
		
		texto_AddPartida = that.add.text(that.world.centerX-150, that.world.centerY-200,'Crear partida',{fill: "#ffffff"});
		texto_AddPartida.anchor.x = 0.5;
		texto_AddPartida.inputEnabled = true;
		texto_AddPartida.events.onInputDown.add(that.addPartida, this, 0, "Partida 1");
	}
};