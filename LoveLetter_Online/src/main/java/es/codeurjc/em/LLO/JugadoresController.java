package es.codeurjc.em.LLO;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/jugadores")
public class JugadoresController {

	//private Map<Long, Jugador> jugadores = new HashMap<Long, Jugador>();
	//private AtomicLong lastId = new AtomicLong();
	private final int MAX_HALL_OF_FAME_PLAYERS = 5;

	
	//GET
	@RequestMapping(method = RequestMethod.GET)
	public Collection<Jugador> jugadores() {
		return JugadoresService.getJugadores();
	}
	
	//GET SORTED
	@RequestMapping(value = "/sorted", method = RequestMethod.GET)
	public Collection<Jugador> jugadoresOrd() {
		List<Jugador> jugadoresAux = new ArrayList<>();
		for(Jugador jugador : JugadoresService.getJugadores()) {
			jugadoresAux.add(jugador);
		}
		Collections.sort(jugadoresAux,(o1, o2)-> o2.getPartidasGanadas()-o1.getPartidasGanadas());
		
		if(jugadoresAux.size()>MAX_HALL_OF_FAME_PLAYERS) {
			return jugadoresAux.subList(0, MAX_HALL_OF_FAME_PLAYERS);
		}
		
		return jugadoresAux;
	}
	

	//POST
	@RequestMapping(method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public Jugador nuevoJugador(@RequestBody Jugador jugador) {
		return JugadoresService.postJugador(jugador);
		/*
		long id = lastId.incrementAndGet();
		jugador.setId(id);
		jugador.setPartidasGanadas(0);
		jugadores.put(id, jugador);

		return jugador;
		*/
	}

	
	//PUT
	@PutMapping("/{id}")
	public ResponseEntity<Jugador> actulizaJugador(@PathVariable long id, @RequestBody Jugador jugadorActualizado) {
		
		Jugador jugador = JugadoresService.actualizaJugador(id, jugadorActualizado);

		if (jugador != null) {
			return new ResponseEntity<>(jugadorActualizado, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		
		/*
		Jugador jugador = jugadores.get(id);

		if (jugador != null) {

			jugadorActualizado.setId(id);
			jugadores.put(id, jugadorActualizado);

			return new ResponseEntity<>(jugadorActualizado, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}*/
	}

	
	//GET {id}
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<Jugador> getJugador(@PathVariable long id) {

		Jugador jugador = JugadoresService.getJugador(id);//encuentra a la jugador

		if (jugador != null) {//si existe
			return new ResponseEntity<>(jugador, HttpStatus.OK);//devuelve sus datos
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		
		/*
		Jugador jugador = jugadores.get(id);

		if (jugador != null) {
			return new ResponseEntity<>(jugador, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}*/
	}

	
	//DELETE
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Jugador> borraJugador(@PathVariable long id) {
		
		Jugador jugador = JugadoresService.deleteJugador(id);

		if (jugador != null) {
			return new ResponseEntity<>(jugador, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		
		/*
		Jugador jugador = jugadores.remove(id);

		if (jugador != null) {
			return new ResponseEntity<>(jugador, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		*/
	}
}
