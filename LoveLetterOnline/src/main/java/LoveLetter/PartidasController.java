package LoveLetter;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/partidas")
public class PartidasController {
	
	@Autowired
	private PartidasService partidasService;
	
	
	//GET
	@RequestMapping(method = RequestMethod.GET)
	public Collection<Partida> partidas() {
		return partidasService.getPartidas();//te devuelve los valores de cada partida
	}
	
	
	//POST
	@RequestMapping(method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public Partida nuevaPartida(@RequestBody Partida partida) {

		return partidasService.postPartida(partida);
	}
	
	
	//GET {id}
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<Partida> getPartida(@PathVariable long id) {

		Partida partida = partidasService.getPartida(id);//encuentra a la partida

		if (partida != null) {//si existe
			return new ResponseEntity<>(partida, HttpStatus.OK);//devuelve sus datos
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	
	//DELETE
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Partida> borraPartida(@PathVariable long id) {

		Partida partida = partidasService.deletePartida(id);

		if (partida != null) {
			return new ResponseEntity<>(partida, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	
	
	
	
	
	/*
	//Te da todas las partidas con sus atributos
	@RequestMapping(method = RequestMethod.GET)
	public Collection<Partida> partidas() {
		return partidas.values();//te devuelve los valores de cada partida
	}

	//le das un body para meter una partida en la lista
	@RequestMapping(method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public Partida nuevaPartida(@RequestBody Partida partida) {

		long id = lastId.incrementAndGet();//saca cual sería el siguiente id que habría que ponerle
		partida.setId(id);//le da el id a la partida nueva
		partidas.put(id, partida);//se añade a la lista de partidas

		return partida;//te devuelve todos los datos de la partida que has añadido
	}
	
	@PutMapping("/{id}")//se modificarán los atributos tal y como indiques en el body del id que pongas después de "/"
	public ResponseEntity<Partida> actulizaPartida(@PathVariable long id, @RequestBody Partida partidaActualizada) {

		Partida partida = partidas.get(id);//encuentra la partida con el id dado

		if (partida != null) {//si el id de la partida existe actualiza sus datos

			partidaActualizada.setId(id);
			partidas.put(id, partidaActualizada);

			return new ResponseEntity<>(partidaActualizada, HttpStatus.OK);
		} else {//sino es que no exite la partida que buscabas
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	//te devuelve los datos de la partida con la id dada después de "/"
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<Partida> getPartida(@PathVariable long id) {

		Partida partida = partidas.get(id);//encuentra a la partida

		if (partida != null) {//si existe
			return new ResponseEntity<>(partida, HttpStatus.OK);//devuelve sus datos
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	//elimina la partida con id dada
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Partida> borraPartida(@PathVariable long id) {

		Partida partida = partidas.remove(id);

		if (partida != null) {
			return new ResponseEntity<>(partida, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}*/
}
