package es.codeurjc.em.LLO;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Component;

@Component
public class JugadoresService {
	private static Map<Long, Jugador> jugadores = new HashMap<Long, Jugador>();
	private static AtomicLong lastId = new AtomicLong();
	
	
	public JugadoresService() {}
	
	
	//GET
	public static Collection<Jugador> getJugadores(){
		return jugadores.values();
	}
	
	//POST
	public static Jugador postJugador(Jugador jugador) {

		long id = lastId.incrementAndGet();//saca cual sería el siguiente id que habría que ponerle
		jugador.setId(id);//le da el id a la jugador nueva
		jugadores.put(id, jugador);//se añade a la lista de jugadores

		return jugador;//te devuelve todos los datos de la jugador que has añadido
	}

	//GET {id}
	public static Jugador getJugador(Long id) {
		return jugadores.get(id);
	}
	
	//PUT
	public static Jugador actualizaJugador(Long id, Jugador jugadorAct) {
		jugadorAct.setId(id);
		jugadores.put(id, jugadorAct);
		return jugadorAct;
	}
	
	//DELETE
	public static Jugador deleteJugador(Long id) {
		return jugadores.remove(id);
	}
}


