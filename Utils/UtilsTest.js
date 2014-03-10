var utils = require( "./Utils.js")(null); //deberiamos enviar un mock de socket io

/*	
	variables utilizadas por las pruebas de Suits1 
*/

var partida = null;
exports.Suit1 = {

	crearPartida :  function(test){
// procedemos a crear una paritda
		partida  = utils.createPartida();
		test.ok(partida !== null, "la partida fue creada con exito");
		//obtenemos la partida desde la llamada de los utils
		test.ok(partida === utils.getPartida(partida.PartidaId), "se ha econtrado la partida con exito, la misma es "+partida.PartidaId);

		test.done();
	},
	setJugador: function(test){
		utils.setJugador(partida.PartidaId,"jugador1");
		test.ok("jugador1" === partida.Jugador1,"se agrego el jugador1 como jugador en la partida de manera correcta");

		//agregamos al jugador 2

		utils.setJugador(partida.PartidaId,"jugador2");
		test.ok("jugador2" === partida.Jugador2,"se agrego el jugador2 como jugador en la partida de manera correcta");

		test.throws(function(){ 
			utils.setJugador(partida.PartidaId,"jugador1");
		});

		test.done();
	},
	barajar : function(test){
		//procedemos a barajar, debemos hacerlo y fijarnos que siempre tengamos 5 cartas o las necesarias y nunca repetidas
		var puedeDarCartas = true;
		while(puedeDarCartas){
			utils.barajar(partida.PartidaId);
		}

		test.done();
	}
};