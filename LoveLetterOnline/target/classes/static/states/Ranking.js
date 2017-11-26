LoveLetterOnline.Ranking = function(game){};

LoveLetterOnline.Ranking = function(game){
	var jugadores = [];
	var texto;
	
};

LoveLetterOnline.Ranking.prototype = {
	create: function(){
		
		//TODO Hacer un load de los jugadores del servidor y mostrarlos por pantalla
		
		texto = this.add.text(this.world.centerX, this.world.centerY-250,'RANKING',{fill: "#ffffff"});
		texto = this.add.text(this.world.centerX, this.world.centerY+150,'Volver',{fill: "#ffffff"});
		texto.inputEnabled = true;
		texto.events.onInputDown.add(this.volver, this);
	},
	volver: function(){
		this.state.start('Menu');
	}
};