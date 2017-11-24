package LoveLetter;

//import java.util.ArrayList;
import java.util.Collection;
//import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/jugadores")
public class JugadoresController {

	private Map<Long, Jugador> jugadores = new ConcurrentHashMap<>();
	//private Map<Long, Jugador> jugadores = new HashMap<Long, Jugador>
	private AtomicLong lastId = new AtomicLong();

	
	
	//@GetMapping("/")//Te da todos los jugadores con sus atributos
	@RequestMapping(method = RequestMethod.GET)
	public Collection<Jugador> jugadores() {
		return jugadores.values();//te devuelve los valores de cada jugador
	}

	//@PostMapping("/")//le das un body para meter un jugador en la lista
	@RequestMapping(method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public Jugador nuevoJugador(@RequestBody Jugador jugador) {

		long id = lastId.incrementAndGet();//saca cual sería el siguiente id que habría que ponerle
		jugador.setId(id);//le da el id al jugador nuevo
		jugadores.put(id, jugador);//se añade a la lista de jugadores

		return jugador;//te devuelve todos los datos del jugador que has añadido
	}

	@PutMapping("/{id}")//se modificarán los atributos tal y como indiques en el body del id que pongas después de "/"
	public ResponseEntity<Jugador> actulizaJugador(@PathVariable long id, @RequestBody Jugador jugadorActualizado) {

		Jugador jugador = jugadores.get(id);//encuentra el jugador con el id dado

		if (jugador != null) {//si el id del jugador existe actualiza sus datos

			jugadorActualizado.setId(id);
			jugadores.put(id, jugadorActualizado);

			return new ResponseEntity<>(jugadorActualizado, HttpStatus.OK);
		} else {//sino es que no exite el jugador que buscabas
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	
	//@GetMapping("/{id}")//te devuelve los datos del jugador con la id dada después de "/"
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<Jugador> getJugador(@PathVariable long id) {

		Jugador jugador = jugadores.get(id);//encuentra al jugador

		if (jugador != null) {//si existe
			return new ResponseEntity<>(jugador, HttpStatus.OK);//devuelve sus datos
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	//@DeleteMapping("/{id}")//elimina al jugador con id dada
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
/*public class JugadoresContoller {
private List<Jugador> jugadores = new ArrayList<>();
	
	@RequestMapping(value="/jugadores", method=RequestMethod.GET)
	public List<Jugador> getJugadores(){
		return jugadores;
	}
	
	@RequestMapping(value="/jugadores", method=RequestMethod.POST)
	public ResponseEntity<Boolean> addJugador (@RequestBody Jugador j){
		jugadores.add(j);
		return new ResponseEntity<>(true, HttpStatus.CREATED);
	}
	
	@RequestMapping(value="/jugadores/{id}", method=RequestMethod.PUT)
	public ResponseEntity<Jugador> actualizaJugador(@PathVariable long id, @RequestBody Jugador jugadorActualizado){
		return new ResponseEntity<>(jugador, HttpStatus.OK);
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
}*/
