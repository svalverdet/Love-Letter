
LoveLetterOnline.Ranking = function(game){
	var jugsRanking = [];
	var jugsRankingOrd = [];
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
			
			that.ordenarJugadores(jugadores);
			that.mostrarJugadores();
			
		});
		
		
		
				
	},
	volver: function(){
		this.state.start('Menu');
	},
	
	ordenarJugadores: function(jugadores){
		
		jugsRankingOrd = jugadores;
		
		var temp;
		for(var i=0; i<jugsRankingOrd.length; i++){
			for(var j=0; j<jugsRankingOrd.length; j++){
				if(jugsRankingOrd[j].partidasGanadas>jugsRankingOrd[j+1].partidasGanadas){
					temp = jugsRankingOrd[j];
					jugsRankingOrd[j] = jugsRankingOrd[j+1];
					jugsRankingOrd[j+1] = temp;
				}
			}
		}
	}
	
	
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
	
	mostrarTexto: function(){
		texto = that.add.text(that.world.centerX, that.world.centerY-250,'RANKING',{fill: "#ffffff"});
		texto.anchor.x = 0.5;
		texto = that.add.text(that.world.centerX, that.world.centerY+150,'Volver',{fill: "#ffffff"});
		texto.anchor.x = 0.5;
		texto.inputEnabled = true;
		texto.events.onInputDown.add(that.volver, this);
	}
};