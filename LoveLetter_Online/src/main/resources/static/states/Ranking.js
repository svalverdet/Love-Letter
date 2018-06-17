LoveLetterOnline.Ranking = function(game){
	var texto;
	var that;
	var MAX_HALL_OF_FAME_PLAYERS;
};

var texto;
var juego;

LoveLetterOnline.Ranking.prototype = {
	
	create: function(){
		juego = LoveLetterOnline.Ranking.prototype;
		MAX_HALL_OF_FAME_PLAYERS = 5;
		that = this;
		
		this.loadJugadoresOrd(function(jugadores){
			that.mostrarTexto();
			that.mostrarJugadores(jugadores);
			that.mostrarPtsJugActual();
			that.mostrarJug();
		});	
	},
	
	loadJugadoresOrd: function(callback){
		$.ajax({
			url: 'http://localhost:8080/jugadores/sorted'
		}).done(function (jugadores) {
			console.log('Jugadores loaded: ' + JSON.stringify(jugadores));
			callback(jugadores);
		});
	},
	
	mostrarJugadores: function(jugadores){
		let textoNombre, tmp;
		for(let i=0; i<MAX_HALL_OF_FAME_PLAYERS; i++){
			if(jugadores[i]!==undefined){
				textoNombre = jugadores[i].nombre+' con '+ jugadores[i].partidasGanadas+' punto/s.';
			}else textoNombre = '-';
			
			tmp = that.add.text(that.world.centerX, (that.world.centerY-200)+50*i, (i+1) + '. '+textoNombre, {fill: "#ffffff"});
			tmp.anchor.x = 0.5;
		}
	},
	
	obtenerJugador: function(callback){
		$.ajax({
			url: 'http://localhost:8080/jugadores/' + game.id_jugador
		}).done(function (jugador) {
			console.log('Jugador loaded: ' + JSON.stringify(jugador));
			callback(jugador);
		});
	},
	
	mostrarPtsJugActual: function(){
		let tmp;
		that.obtenerJugador(function(jugador){
			tmp = that.add.text(that.world.centerX, (that.world.centerY-200)+300, 'Tu puntuación: '+jugador.partidasGanadas, {fill: "#ffffff"});
			tmp.anchor.x = 0.5;
		});
	},
	
	mostrarJug: function(){
		let tmp;
		that.obtenerJugador(function(jugador){
			tmp = that.add.text(that.world.centerX, that.world.centerY+250, 'Estás registrado como: '+jugador.nombre, {fill: "#ffffff"});
			tmp.anchor.x = 0.5;
		});
	},
	
	mostrarTexto: function(){
		texto = that.add.text(that.world.centerX, that.world.centerY-250,'RANKING',{fill: "#ffffff"});
		texto.anchor.x = 0.5;
		texto = that.add.text(that.world.centerX, that.world.centerY+150,'Volver',{fill: "#ffffff"});
		texto.anchor.x = 0.5;
		texto.inputEnabled = true;
		texto.events.onInputDown.add(function(){game.goTo('Menu')}, this);
	}
};