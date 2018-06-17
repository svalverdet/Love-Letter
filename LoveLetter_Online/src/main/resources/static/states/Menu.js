LoveLetterOnline.Menu = function(game){
	var text1, text2, text3;
	var that;
};

LoveLetterOnline.Menu.prototype = {
	
	create: function(){
		that=this;
		
		text1 = this.add.text(this.world.centerX, this.world.centerY-250,'L O V E   L E T T E R   O N L I N E',{fill: "#ffffff"});
		text1.anchor.x = 0.5;
		text1 = this.add.text(this.world.centerX, this.world.centerY-20,'Jugar',{fill: "#ffffff"});
		text1.anchor.x = 0.5;
		text2 = this.add.text(this.world.centerX, this.world.centerY+20,'Ranking',{fill: "#ffffff"});
		text2.anchor.x = 0.5;
		text3 = this.add.text(this.world.centerX, this.world.centerY+150,'Volver',{fill: "#ffffff"});
		text3.anchor.x = 0.5;
		
		text1.inputEnabled = true;
		text1.events.onInputDown.add(function(){game.goTo('Lobby')}, this);
		text2.inputEnabled = true;
		text2.events.onInputDown.add(function(){game.goTo('Ranking')}, this);
		text3.inputEnabled = true;
		text3.events.onInputDown.add(function(){game.goTo('Login')}, this);
		
		this.mostrarJug();
	},
	
	obtenerJugador: function(callback){
		$.ajax({
			url: 'http://localhost:8080/jugadores/' + game.id_jugador
		}).done(function (jugador) {
			console.log('Jugador loaded: ' + JSON.stringify(jugador));
			callback(jugador);
		});
	},
	
	mostrarJug: function(){
		let tmp;
		that.obtenerJugador(function(jugador){
			tmp = that.add.text(that.world.centerX, that.world.centerY+250, 'Estás registrado como: '+jugador.nombre, {fill: "#ffffff"});
			tmp.anchor.x = 0.5;
		});
	}

};