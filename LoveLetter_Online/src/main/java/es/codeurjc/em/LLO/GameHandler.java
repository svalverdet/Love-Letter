package es.codeurjc.em.LLO;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.core.TreeNode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class GameHandler extends TextWebSocketHandler {

	private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
	private ObjectMapper mapper = new ObjectMapper();
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		synchronized(sessions) {
			System.out.println("New user: " + session.getId());
			sessions.put(session.getId(), session);
		}
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		synchronized(sessions) {
			System.out.println("Session closed: " + session.getId());
			
			//Se crea un nodo
			ObjectNode node = mapper.createObjectNode();			node.put("action", "END_GAME");
			
			Partida p = null;
			//Busco la partida que tenga ese jugador
			for(Partida p_tmp : PartidasService.getPartidas()){
				List<Jugador> jugadoresPartida = p_tmp.getJugsPartida();
				for(int j=0; j<jugadoresPartida.size(); j++) {
					String id1 = jugadoresPartida.get(j).getWsID();
					String id2 = session.getId();
					if(id1.equals(id2)) {
						p = p_tmp;
					}
				}
			}
			
			//Comparto la información con el resto de jugadores de la partida
			if(p != null) {
				sendOtherParticipants(session, node, p.getJugsPartida());
			}
			
			//Elimino la sesión
			sessions.remove(session.getId());
		}
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		
		synchronized(sessions) {
			System.out.println("Message received: " + message.getPayload());
			JsonNode node = mapper.readTree(message.getPayload());
			
			long partida_id, jugador_id;
			
			switch(node.get("action").asText()) {
				case("LOGIN"):
					jugador_id = node.get("data").get("id").asLong();
					JugadoresService.getJugador(jugador_id).setWsID(session.getId());
					break;
				case("JOIN_GAME"):
				case("LEAVE_GAME"):
				case("START_GAME"):
				case("CONECTAR"):
				case("PASAR_TURNO"):
				case("PASAR_VARIABLES_GLOBALES"):
				case("REPARTIR"):
				case("DESCARTAR"):
				case("SEND_DECK_INDEX"):
				case("HACER_DESAFIO"):
				case("RESOLVER_DESAFIO"):
				case("DO_ANIM"):
				case("PASAR_ESTADO_JUGADOR"):
				case("DERROTADO"):
				case("END_GAME"):
				case("MESSAGE"):
				case("SOLICITAR_CARTAS"):
				case("FIN_RONDA"):
					partida_id = node.get("data").get("partida").get("id").asLong();
					sendOtherParticipants(session, node, PartidasService.getPartida(partida_id).getJugsPartida());
					break;
				/*case("LEAVE_GAME_LAST"):
					partida_id = node.get("data").get("id").asLong();
					PartidasService.deletePartida(partida_id);
					
					break;*/
				
					
				default:
					break;
			}
		}
		
	}

	private void sendOtherParticipants(WebSocketSession session, JsonNode node, List<Jugador> participants) throws IOException {
		System.out.println("Message sent: '" + node.toString() + "' from client "+ session.getId());
		
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("action", node.get("action").asText());
		
		switch(node.get("action").asText()) {
			case("JOIN_GAME"):
			case("LEAVE_GAME"):
			case("START_GAME"):
				newNode.put("name", node.get("data").get("name").asText());
				newNode.set("partida", node.get("data").get("partida"));
				break;
			case("LEAVE_GAME_LAST"):
				newNode.put("name", node.get("data").get("name").asText());
				break;
			case("PASAR_TURNO"):
				newNode.put("turno", node.get("data").get("turno").asText());
				break;
			case("PASAR_VARIABLES_GLOBALES"):
				newNode.set("mazo", node.get("data").get("mazo"));
				break;
			case("REPARTIR"):
				newNode.set("tipo", node.get("data").get("tipo"));
				newNode.set("jugadorReceptor", node.get("data").get("jugadorReceptor"));
				break;
			case("DESCARTAR"): 
				newNode.set("tipo", node.get("data").get("tipo"));
				newNode.set("indice", node.get("data").get("indice"));
				newNode.set("jugadorReceptor", node.get("data").get("jugadorReceptor"));
				newNode.set("hacerEfecto", node.get("data").get("hacerEfecto"));
				newNode.set("muerto", node.get("data").get("muerto"));
				break;
			case("SEND_DECK_INDEX"):
				newNode.put("id", node.get("data").get("id").asText());
				break;
			case("DO_ANIM"):
				newNode.set("jugadorA", node.get("data").get("jugadorA"));
				newNode.set("jugadorB", node.get("data").get("jugadorB"));
				
				newNode.set("cartaA", node.get("data").get("cartaA"));
				newNode.set("tipoframeB", node.get("data").get("tipoframeB"));
				break;
			case("HACER_DESAFIO"):
				newNode.set("jugadorA", node.get("data").get("jugadorA"));
				newNode.set("jugadorB", node.get("data").get("jugadorB"));
				
				newNode.set("personaje1", node.get("data").get("personaje1"));
				newNode.set("valor1", node.get("data").get("valor1"));
				newNode.set("tipoframe1", node.get("data").get("tipoframe1"));
				
				newNode.set("acusacion", node.get("data").get("acusacion"));
				
				newNode.set("personaje2", node.get("data").get("personaje2"));
				newNode.set("valor2", node.get("data").get("valor2"));
				newNode.set("tipoframe2", node.get("data").get("tipoframe2"));
				break;
			case("RESOLVER_DESAFIO"):
				newNode.set("jugadorA", node.get("data").get("jugadorA"));
				newNode.set("jugadorB", node.get("data").get("jugadorB"));
				
				newNode.set("acusacion", node.get("data").get("acusacion"));
				
				newNode.set("personajeB", node.get("data").get("personajeB"));
				newNode.set("valorB", node.get("data").get("valorB"));
				newNode.set("tipoframeB", node.get("data").get("tipoframeB"));
				break;
			case("PASAR_ESTADO_JUGADOR"):
				newNode.set("jugador", node.get("data").get("jugador"));
				newNode.set("vivo", node.get("data").get("vivo"));
				newNode.set("protegido", node.get("data").get("protegido"));
				newNode.set("corazones", node.get("data").get("corazones"));
				break;
			case("SOLICITAR_CARTAS"):
				newNode.set("solicitante", node.get("data").get("solicitante"));
				newNode.set("solicitado", node.get("data").get("solicitado"));
				newNode.set("valor", node.get("data").get("valor"));
				break;
			case("MESSAGE"):
				newNode.set("msg", node.get("data").get("msg"));
				newNode.set("receptor", node.get("data").get("receptor"));
				break;
			case("DERROTADO"):
				newNode.set("jugador", node.get("data").get("jugador"));
				break;
			case("FIN_RONDA"):
				newNode.set("jugador", node.get("data").get("jugador"));
				break;
			default:
				break;
		}
		
		
		//Mandar el mensaje únicamente a los demás jugadores de la sala
		if(participants != null) {
			WebSocketSession p;
			//Toma las sesiones de los jugadores que están en la sala
			for(int i=0; i<participants.size(); i++) {
				String id = participants.get(i).getWsID();
				p = sessions.get(id);
				
				if(!p.getId().equals(session.getId())) {
					p.sendMessage(new TextMessage(newNode.toString()));
				}
			}
		//Mandar el mensaje a todas las sesiones
		}else {
			for(WebSocketSession participant : sessions.values()) {
				if(!participant.getId().equals(session.getId())) {
					participant.sendMessage(new TextMessage(newNode.toString()));
				}
			}
		}
	}

}

