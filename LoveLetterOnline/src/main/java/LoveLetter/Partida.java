package LoveLetter;

public class Partida {
	private long id = -1;
	private String nomPartida;
	private int numJug;
	private int numJugMax;
	
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
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	@Override
	public String toString() {
		return "Partida [id=" + id + ",nombre=" + nomPartida + ", numero Jugadores=" + numJug + ",numero Jugadores máximo=" +numJugMax+"]";
	}
}