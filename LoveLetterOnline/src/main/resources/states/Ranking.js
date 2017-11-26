LoveLetterOnline.Ranking = function(game){};

LoveLetterOnline.Ranking = function(game){
	var texto;
};

LoveLetterOnline.Ranking.prototype = {
	create: function(){
		texto = this.add.text(this.world.centerX, this.world.centerY,'Entrar',{fill: "#ffffff"});
		texto.inputEnabled = true;
		texto.events.onInputDown.add(this.entrar, this);
	},
	entrar: function(){
		this.state.start('Menu');
	}
};