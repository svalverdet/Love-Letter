package LoveLetter;

public class Partidas {
	private String nomPartida;
	private int numJug;//numero de Jugadores en la partida
	private int numJugMax;//numero de jugadores máximo en una partida
	
	public String getnomPartida() {
		return nomPartida;
	}

	public void setnomPartida(String nomPartida) {
		this.nomPartida = nomPartida;
	}
	
	public int getnumJug() {
		return numJug;
	}

	public void setnumJug(int numJug) {
		this.numJug = numJug;
	}
	
	public int getnumJugMax() {
		return numJugMax;
	}

	public void setnumJugMax(int numJugMax) {
		this.numJugMax = numJugMax;
	}
}
