var LoveLetterOnline = {};

LoveLetterOnline.Login = function(game){
	var texto;
};

LoveLetterOnline.Login.prototype = {
	create: function(){
		texto = this.add.text(this.world.centerX, this.world.centerY,'Entrar',{fill: "#ffffff"});
		texto.inputEnabled = true;
		texto.events.onInputDown.add(this.entrar, this);
		
		//Se crea el cuadro para poner el nombre del jugador
		$('#info').append(
        '<div id="input-value"><input type="text"></div>');
		
	},
	entrar: function(){
		this.state.start('Menu');
	}
};