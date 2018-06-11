package es.codeurjc.em.LLO;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class GameHandler extends TextWebSocketHandler {

	private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
	private ObjectMapper mapper = new ObjectMapper();
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("New user: " + session.getId());
		sessions.put(session.getId(), session);
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("Session closed: " + session.getId());
		sessions.remove(session.getId());
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
				case("pasar_turno"):
				case("PASAR_VARIABLES_GLOBALES"):
				case("REPARTIR"):
				case("DESCARTAR"):
				case("SEND_DECK_INDEX"):
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
			case("pasar_turno"):
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
				break;
			case("SEND_DECK_INDEX"):
				newNode.put("id", node.get("data").get("id").asText());
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

