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
public class PartidasController {
private List<Partida> partidas = new ArrayList<>();
	
	@RequestMapping(value="/partidas", method=RequestMethod.GET)
	public List<Partida> getPartidas(){
		return partidas;
	}
	
	@RequestMapping(value="/partidas", method=RequestMethod.POST)
	public ResponseEntity<Boolean> addPartida (@RequestBody Partida p){
		partidas.add(p);
		return new ResponseEntity<>(true, HttpStatus.CREATED);
	}
}
