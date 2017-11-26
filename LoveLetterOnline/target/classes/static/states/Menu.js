LoveLetterOnline.Menu = function(game){
	var text1, text2, text3;
};

LoveLetterOnline.Menu.prototype = {
	create: function(){
		text1 = this.add.text(this.world.centerX, this.world.centerY-20,'Jugar',{fill: "#ffffff"});
		text2 = this.add.text(this.world.centerX, this.world.centerY+20,'Ranking',{fill: "#ffffff"});
		text3 = this.add.text(this.world.centerX, this.world.centerY+150,'Volver',{fill: "#ffffff"});
		
		text1.inputEnabled = true;
		text1.events.onInputDown.add(this.jugar, this);
		text2.inputEnabled = true;
		text2.events.onInputDown.add(this.ranking, this);
		text3.inputEnabled = true;
		text3.events.onInputDown.add(this.volver, this);
		
	},
	jugar: function(){
		//this.state.start('Lobby');
		this.state.start('Jugar');
		
	},
	ranking: function(){
		this.state.start('Ranking');
	},
	volver: function(){
		this.state.start('Login');
	}
};