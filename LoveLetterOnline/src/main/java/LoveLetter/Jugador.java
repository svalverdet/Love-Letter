package LoveLetter;

public class Jugador {
	private long id = -1;
	private String nombre;
	private int partidasGanadas;
	
	public Jugador() {}
	
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
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	@Override
	public String toString() {
		return "Jugador [id=" + id + ",nombre=" + nombre + ", partidas ganadas=" + partidasGanadas +"]";
	}

}
