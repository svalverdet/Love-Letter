package LoveLetter;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
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
	
	
	//PUT
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<Partida> actualizaPartida(@PathVariable long id, @RequestBody Partida partidaActualizada) {

		Partida partida = partidasService.actualizaPartida(id, partidaActualizada);

		if (partida != null) {
			return new ResponseEntity<>(partidaActualizada, HttpStatus.OK);
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

}
