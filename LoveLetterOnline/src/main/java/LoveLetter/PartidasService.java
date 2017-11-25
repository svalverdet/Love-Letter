package LoveLetter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Component;

@Component
public class PartidasService {
	private Map<Long, Partida> partidas = new ConcurrentHashMap<>();
	//private Map<Long, Partida> partidas = new HashMap<Long, Partida>
	private AtomicLong lastId = new AtomicLong();
	
	
	public PartidasService() {
		//Crear partidas dummies.
	}
	
	
	//GET
	public Collection<Partida> getPartidas(){
		return partidas.values();
	}
	
	//POST
	public Partida postPartida(Partida partida) {

		long id = lastId.incrementAndGet();//saca cual sería el siguiente id que habría que ponerle
		partida.setId(id);//le da el id a la partida nueva
		partidas.put(id, partida);//se añade a la lista de partidas

		return partida;//te devuelve todos los datos de la partida que has añadido
	}

	//GET {id}
	public Partida getPartida(Long id) {
		return partidas.get(id);
	}
	
	//DELETE
	public Partida deletePartida(Long id) {
		return partidas.remove(id);
	}
	
	
	
}