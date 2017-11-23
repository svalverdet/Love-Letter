package LoveLetter;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JugadoresContoller {
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
}
