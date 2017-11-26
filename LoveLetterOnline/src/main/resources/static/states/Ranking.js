
LoveLetterOnline.Ranking = function(game){
	var jugsRanking = [];
	var texto;
	var that;
	
};

var jugsRanking = [];
var texto;
var juego;

LoveLetterOnline.Ranking.prototype = {
	
	create: function(){
		juego = LoveLetterOnline.Ranking.prototype;
		that = this;
		
		//$(document).ready(function(){})
		this.loadJugadores(function(jugadores){
			
			that.mostrarTexto();
			
			//Cuando los jugadores se han cargado desde el servidor
			for(var i=0; i<jugadores.length; i++){
				jugsRanking.push(jugadores[i].partidasGanadas);
				
			}
			
			that.mostrarJugadores();
			
		});
		
		
		
				
	},
	volver: function(){
		this.state.start('Menu');
	},
	
	loadJugadores: function(callback){
		$.ajax({
			url: 'http://localhost:8080/jugadores'
		}).done(function (jugadores) {
			console.log('Jugadores loaded: ' + JSON.stringify(jugadores));
			callback(jugadores);
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
	
	mostrarTexto(){
		texto = that.add.text(that.world.centerX, that.world.centerY-250,'RANKING',{fill: "#ffffff"});
		texto = that.add.text(that.world.centerX, that.world.centerY+150,'Volver',{fill: "#ffffff"});
		texto.inputEnabled = true;
		texto.events.onInputDown.add(that.volver, this);
	}
};