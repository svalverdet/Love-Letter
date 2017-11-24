package LoveLetter;

import java.util.List;

public class Partida {
	private long id = -1;
	private String nomPartida;
	private int numJug;
	private int numJugMax;
	private List<Jugador> jugsPartida;
	
	
	//CONSTRUCTORES
	
	 public Partida() {}
	 
	 public Partida(String nombre, int numJugMax, List<Jugador> jugadores) {
		 this.nomPartida = nombre;
		 this.numJug = 0;
		 this.numJugMax = numJugMax;
		 this.jugsPartida = jugadores;
	 }
	
	
	//GETTERS Y SETTERS
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getNomPartida() {
		return nomPartida;
	}
	public void setNomPartida(String nomPartida) {
		this.nomPartida = nomPartida;
	}
	public int getNumJug() {
		return numJug;
	}
	public void setNumJug(int numJug) {
		this.numJug = numJug;
	}
	public int getNumJugMax() {
		return numJugMax;
	}
	public void setNumJugMax(int numJugMax) {
		this.numJugMax = numJugMax;
	}
	public List<Jugador> getJugsPartida() {
		return jugsPartida;
	}
	public void setJugsPartida(List<Jugador> jugsPartida) {
		this.jugsPartida = jugsPartida;
	}
	
	
	@Override
	public String toString() {
		return "Partida [id=" + id + ",nombre=" + nomPartida + ", numero Jugadores=" + numJug + ",numero Jugadores máximo=" +numJugMax+"]";
	}
	
}
