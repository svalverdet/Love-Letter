# Love Letter Online

  Enlace a Video explicando la práctica: https://www.youtube.com/watch?v=Ut9UJy85z9Y
  
  Enlace a Trello: https://trello.com/b/eUYnbDKB/love-letter-online  
  
---
* **Descripción de la temática del juego:**  
  
  En el lejano reino de Deba se encuentra la princesa Catalinxu, quien aguarda pacientemente la llegada de un pretendiente que esté a la altura de ser su prometido. Muchos son los que tratan de cortejarla escribiéndole cartas de amor cada día.  
  
  Tú eres uno de esos pretendientes, intentando que tu carta llegue a la princesa. Para conseguir que ella lea tu carta, deberás confiar en un intermediario que le entregue tu preciado mensaje en mano.
  A lo largo del juego mantendrás en secreto la identidad de tu confidente, representado por una carta del mazo.  
  
  Deberás asegurarte de que al final del día (al final de la ronda) tu intermediario (la carta en tu mano) sea la persona más cercana a la princesa, pues ella sólo leerá el primer mensaje de amor que reciba en el día.  
  
  Los pretendientes podrán mandarse cartas entre ellos a través de un chat para fardar de sus logros conquistando a la princesa o para deshonrar a los contrincantes.
    
---
  * **Reglas del juego:**    
     
     El juego tiene 28 cartas y podrán jugar entre 2 y 4 pretendientes.  
     Cada carta tiene un valor en la esquina superior izquierda: cuanto más alto sea el número, más cercano es el personaje a la princesa. Cada carta tiene un efecto distinto al ser descartada.   
     
     Las cartas se colocan en un mazo boca abajo, cada jugador roba una carta del mazo, esta carta es la mano inicial.  
       
     Love Letter Online se juega en diferentes rondas, que representan los días. Al final de cada ronda, la carta de amor de un jugador llega a la princesa.  
     El jugador que gane más rondas ganará el juego: cuando la princesa haya leido las suficientes cartas de uno de los pretendientes, caerá perdidamente enamorada y el jugador ganará el corazón de la princesa.   
     
     Durante tu turno, roba la carta superior del mazo y añadela a tu mano. Entonces elige una de las dos cartas y descártala, de este modo se aplicará su efecto.  
     Las cartas descartadas permanecen delante del jugador que las descarta. Quedarán colocadas superpuestas de manera visible para que quede claro el orden en que han sido descartadas. Esto ayudará a los jugadores a averiguar qué cartas pueden tener en mano los demás.  
     Una vez es aplicado el efecto de la carta el turno pasa al jugador siguiente.  
     
     Si un jugador es eliminado de la ronda, ese jugador descarta la carta en su mano boca arriba (sin aplicar su efecto) y deja de jugar hasta la siguiente ronda.    
       
     Una ronda termina cuando el mazo de robo es agotado al final de un turno. Aquellos jugadores que permanezcan en la ronda revelan sus manos. El jugador con la carta de valor más alto gana la ronda. En caso de empate el jugador que descartó cartas de mayor valor gana.  
     El personaje más cercano a la princesa entrega la carta de amor y ella se retira a sus aposentos para leerla.  
     La ronda termina también si todos los jugadores menos uno son eliminados de la ronda, en ese caso, el jugador que siga en juego gana, independientemente del valor de su carta.
       
---
* **Integrantes del equipo de desarrollo:**

    **Sara López García**
    
    s.lopezgarci@alumnos.urjc.es  
    SaraLopGar   
      
    **Sandra Valverde Tallón**
    
    s.valverdet@alumnos.urjc.es  
    svalverdet

---
* **Navegación:**  

![Alt Text](https://github.com/svalverdet/Love-Letter-Online/blob/master/LoveLetter_Online/src/main/resources/static/assets/prueba/navegaci%C3%B3n.png)
  
Al principio aparecerá un cuadro emergente en el que habrá que escribir el nombre del usuario con el que queremos jugar. Tras rellenar el campo al clicar sobre "entrar", el juego nos llevará a la pantalla 1. La pantalla 1 representa el menú del juego. Desde ahí se pueden empezar el juego consultar el ranking o volver al login. 
La pantalla 3 representa el Ranking, donde se muestran las mejores 5 puntuaciones de los jugadores. 
Por último, la pantalla 2 contiene el lobby. Desde él se pueden crear partidas y unirse a ellas. Una vez la partida a la que se haya unido el jugador se llene, se pasará a la pantalla 5, el propio juego (la pantalla 4 es solo una muestra de como se van llenando las partidas). 
    
![Alt Text](https://github.com/svalverdet/Love-Letter-Online/blob/master/LoveLetter_Online/src/main/resources/static/assets/prueba/captura1.png)
    
  Dentro de la pantalla de juego tendremos en nuestra esquina inferior derecha nuestra mano de cartas, mientras que en el centro inferiror estará nuestra pila de descarte. Los demás jugadores (de 2 a 4) tienen sus pilas de descarte en la parte superior (el jugador dos es el de más a la derecha, luego el tres y el cuatro a la izquierda). En el centro se encuentra el mazo y en la parte derecha se hayan unos botones que al pulsarlos hará que salga una pantalla emergente con información de cada carta o que servirán para acusar a un jugador (usando el Guardia). Esta ventana emergente podrá volver a minimizarse pulsando sobre la cruz de su esquina superior derecha (P7). La información de la ventana emergente viene dada por: el nombre de la carta, el número de cartas del mismo tipo (entre paréntesis), la descripción y su valor.  
  
 ![Alt Text](https://github.com/svalverdet/Love-Letter-Online/blob/master/LoveLetter_Online/src/main/resources/static/assets/prueba/captura2.png)
    
  Por último a la izquierda hay un cuadro que da la información de las últimas tres acciones que han pasado en la partida. Este irá guiando la partida e indicando al jugador lo que debe hacer en cada momento. Informará de la identidad del ganador de cada ronda y del ganador de toda la partida. El ganador de la partida será el primer jugador que consiga 3 corazones.

---
* **Diagrama de clases y API REST:**  
 ![Alt Text](https://github.com/svalverdet/Love-Letter-Online/blob/master/LoveLetter_Online/src/main/resources/static/assets/prueba/DiagramaBueno.png)
 
---
* **Instrucciones:**    

Para ejecutar la aplicación será necesario ejecutar primero el servidor desde Spring. Después, escribiremos en el buscador del navegador localhost:8080
Con ello ya se podrá empezar a jugar, no es necesaria ninguna instalación adicional. 

---
* **Websockets**

En la práctica se ha utilizado Websockets en una parte del Lobby y para todos los pasos de mensajes del juego en sí. 

Una vez se crea una sala o se une un jugador, el jugador pasará a una sala de espera (EnPartida.js). Al unirse a una sala o salir de ella se hace uso de WS, de tal modo que los jugadores sepan cuantas personas hay en su sala en todo momento.

Una vez comienza la partida, el primer jugador apuntado en su lista de jugadores actuará como controlador del juego. 

---
* **Documentación del protocolo**

Todos los mensajes contienen un campo "action" y otro "data",  donde se almacenan la acción a realizar y los datos para llevarla a cabo, respectivamente. 



LOGIN: una vez se crea el jugador, se añade su identificador de sesión de Websockets.
Mensaje: id del jugador. 

JOIN_GAME: se comparte con el resto de jugadores de la partida el nombre del jugador que se ha unido y la partida actualizada. 
Mensaje: nombre del jugador y partida. 

LEAVE_GAME: se comparte con el resto de jugadores de la partida el nombre del jugador que ha salido de la sala de espera y la partida actualizada. 
Mensaje: nombre del jugador y partida. 

START_GAME: se comparte con el resto de jugadores de la partida el nombre del último jugador que ha entrado en la partida y la partida actualizada para posteriormente iniciar el juego. 
Mensaje: nombre del jugador y partida. 


Una vez dentro del juego: 

CONECTAR: se asegura de que todos los participantes hayan pasado al estado de Phaser "Jugar". 
Mensaje: partida. 

PASAR_VARIABLES_GLOBALES: pensado para que el coordinador de la partida comparta todas las variables globales iniciales. 
Mensaje: partida y mazo de cartas (esto es, un array de enteros). 

MESSAGE: mensaje que se pasa a la consola de ayuda de cada pantalla, informa sobre el estado del juego.
Mensaje: partida, msg, receptor. Si receptor no estuviera definido, se pasará el mensaje al resto de jugadores de la partida.

REPARTIR: se indica al resto de jugadores cómo mostrar la carta que se le ha repartido a otros jugadores. 
Mensaje: partida, tipo de carta y jugador destinatario. 

SEND_DECK_INDEX: se comunica al resto de jugadores de la partida la modificación del índice que recorre el mazo, para que actualicen su variable. 
Mensaje: partida e índice. 

DESCARTAR: se indica al resto de jugadores cómo mostrar la carta que ha descartado otro jugador. 
Mensaje: partida, tipo de carta, jugador destinatario e índice. 

PASAR_TURNO: se comunica al resto de jugadores de la partida la modificación del índice de turnos, para que actualicen su variable. 
Mensaje: partida y número de turno.

HACER_DESAFIO: cuando un jugador A desafía a otro jugador B se lo comunica. El jugador B entonces realiza las acciones necesarias y envía datos de vuelta para el jugador A.
Mensaje: partida, jugadorA, jugadorB, personaje1, valor1, tipoframe1, acusacion, personaje2, valor2, tipoframe2. Estos son: los jugadores, la posible acusación y las propiedades de las cartas del jugador A.

RESOLVER_DESAFIO: después de que el jugador B haya recibido el desafío, manda los datos de vuelta al jugador A. Este hará los cálculos necesarios para continuar el juego.
Mensaje: partida, jugadorA, jugadorB, acusacion, personajeB, valorB, tipoframeB. Estos son: los jugadores, la posible acusación y las propiedades de la carta del jugador B.

DO_ANIM: al realizar animaciones adicionales de las cartas (como los efectos del cura), se comunica al resto de jugadores que muestren por pantalla dicha animación.
Mensaje: partida, jugadorA, jugadorB, cartaA, tipoframeB. Estos son: los jugadores y sus cartas en acción.

PASAR_ESTADO_JUGADOR: se comunica al resto de jugadores el estado de un jugador cuando éste se modifica (si gana 'corazones', si se protege o si muere).
Mensaje: partida, jugador, vivo, protegido, corazones.

DERROTADO: informa a un jugador concreto de su muerte para que descarte su carta y muestre su derrota.
Mensaje: partida, jugador.

SOLICITAR_CARTAS: si la partida finaliza a causa del agotamiento de cartas, el jugador que haya detectado el fin del juego al no haber podido robar una carta, solicitará las cartas del resto de jugadores que potencialmente pudieran ganar (que no estén muertos).
Mensaje: partida, solicitante, solicitado, valor.

FIN_RONDA: al detectar el fin de la ronda, se informa al resto de jugadores para que muestren por pantalla los 'corazones' del jugador ganador.
Mensaje: partida, jugador.

END_GAME: se comunica a los jugadores que la partida ha finalizado para que vuelvan al menú principal y se borre la partida.
Mensaje: partida.

Además, en caso de que un jugador saliera en mitad de una partida, al salir se lo comunicará al resto, que saldrán de la partida y esta será eliminada.
