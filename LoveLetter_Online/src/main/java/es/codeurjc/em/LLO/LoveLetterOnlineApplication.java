package es.codeurjc.em.LLO;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;


@SpringBootApplication
@EnableWebSocket
public class LoveLetterOnlineApplication implements WebSocketConfigurer{

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(createGameHandler(), "/game")
		.setAllowedOrigins("*");
	}
	
	@Bean
	public GameHandler createGameHandler() {
		return new GameHandler();
	}
	
	public static void main(String[] args) {
		/*
		SpringApplication app = new SpringApplication(LoveLetterOnlineApplication.class);
        Properties properties = new Properties();
        properties.setProperty("spring.resources.staticLocations",
                                   "classpath:/static/");
        app.setDefaultProperties(properties);
        app.run(args);		
		*/
		SpringApplication.run(LoveLetterOnlineApplication.class, args);
	}
}


