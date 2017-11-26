package LoveLetter;

import java.util.Properties;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LoveLetterOnlineApplication {

	public static void main(String[] args) {
		
		SpringApplication app = new SpringApplication(LoveLetterOnlineApplication.class);
        Properties properties = new Properties();
        properties.setProperty("spring.resources.staticLocations",
                                   "classpath:/static/");
        app.setDefaultProperties(properties);
        app.run(args);		
		
		//SpringApplication.run(LoveLetterOnlineApplication.class, args);
	}
}
