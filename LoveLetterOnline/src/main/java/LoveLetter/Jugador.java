package LoveLetter;

//import java.util.Random;

public class Jugador {
	private long id = -1;
	private String nombre;
	private int partidasGanadas;
	
	
	//CONSTRUCTORES
	
	public Jugador() {}
	
	public Jugador(String nombre) {
		
		//Random rand = new Random();
		//int  n = rand.nextInt(3);
		
		this.nombre = "Juan";
		//this.partidasGanadas = 0;
		this.partidasGanadas = 50;
	}
	
	
	//GETTERS Y SETTERS
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public int getPartidasGanadas() {
		return partidasGanadas;
	}
	public void setPartidasGanadas(int partidasGanadas) {
		this.partidasGanadas = partidasGanadas;
	}


	@Override
	public String toString() {
		return "Jugador [id=" + id + ",nombre=" + nombre + ", partidas ganadas=" + partidasGanadas +"]";
	}

}
