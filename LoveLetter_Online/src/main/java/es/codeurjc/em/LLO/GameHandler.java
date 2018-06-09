package es.codeurjc.em.LLO;

import java.io.IOException;
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
			
			long num = 1;
			
			switch(node.get("action").asText()) {
			case("JOIN_GAME"):
				
				sendOtherParticipants(session, node, PartidasService.getPartida(num).getJugsPartida());
				break;
			default:
				sendOtherParticipants(session, node, PartidasService.getPartida(num).getJugsPartida());
				break;
			}
		}
		
	}

	private void sendOtherParticipants(WebSocketSession session, JsonNode node, Collection<Jugador> participants) throws IOException {
		System.out.println("Message sent: '" + node.toString() + "' from client "+ session.getId());
		
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("action", node.get("action").asText());
		//newNode.put("name", node.get("data").get("name").asText());
		//newNode.put("message", node.get("message").asText());
		
		
		//switch
		
		/*
		List<WebSocketSession> participantSessions = new ArrayList<>();
		
		for(int i=0; i<participants.size(); i++) {
			sessions.values().
		}
		*/
		for(WebSocketSession participant : sessions.values()) {
			if(!participant.getId().equals(session.getId())) {
				participant.sendMessage(new TextMessage(node.toString()));
			}
		}
		
	}

}

