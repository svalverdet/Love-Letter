var gameOptions = {
    gameWidth: 1280,
    gameHeight: 720,
    cardSheetWidth: 178,
    cardSheetHeight: 208
};

var game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.AUTO);
game.id_jugador=-1;


game.state.add('Menu', LoveLetterOnline.Menu);
game.state.add('Login', LoveLetterOnline.Login);
game.state.add('Lobby', LoveLetterOnline.Lobby);
game.state.add('Jugar', LoveLetterOnline.Jugar);
game.state.add('Ranking', LoveLetterOnline.Ranking);

game.state.start('Login');
