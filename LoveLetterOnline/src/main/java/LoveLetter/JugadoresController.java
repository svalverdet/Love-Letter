package LoveLetter;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
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

	private Map<Long, Jugador> jugadores = new HashMap<Long, Jugador>();
	private AtomicLong lastId = new AtomicLong();

	
	//GET
	@RequestMapping(method = RequestMethod.GET)
	public Collection<Jugador> jugadores() {
		return jugadores.values();
	}

	//POST
	@RequestMapping(method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public Jugador nuevoJugador(@RequestBody Jugador jugador) {

		long id = lastId.incrementAndGet();
		jugador.setId(id);
		
		Random rand = new Random();
		int  n = rand.nextInt(3);
		jugador.setPartidasGanadas(n);
		
		jugadores.put(id, jugador);

		return jugador;
	}

	
	//PUT
	@PutMapping("/{id}")
	public ResponseEntity<Jugador> actulizaJugador(@PathVariable long id, @RequestBody Jugador jugadorActualizado) {

		Jugador jugador = jugadores.get(id);

		if (jugador != null) {

			jugadorActualizado.setId(id);
			jugadores.put(id, jugadorActualizado);

			return new ResponseEntity<>(jugadorActualizado, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	
	//GET {id}
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<Jugador> getJugador(@PathVariable long id) {

		Jugador jugador = jugadores.get(id);

		if (jugador != null) {
			return new ResponseEntity<>(jugador, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	
	//DELETE
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Jugador> borraJugador(@PathVariable long id) {

		Jugador jugador = jugadores.remove(id);

		if (jugador != null) {
			return new ResponseEntity<>(jugador, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
