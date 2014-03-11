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
		test.ok("jugador1" === partida.Jugador1.Nombre,"se agrego el jugador1 como jugador en la partida de manera correcta");

		//agregamos al jugador 2

		utils.setJugador(partida.PartidaId,"jugador2");
		test.ok("jugador2" === partida.Jugador2.Nombre,"se agrego el jugador2 como jugador en la partida de manera correcta");

		test.throws(function(){ 
			utils.setJugador(partida.PartidaId,"jugador1");
		});

		test.done();
	},
	barajar : function(test){
		//procedemos a barajar, debemos hacerlo y fijarnos que siempre tengamos 5 cartas o las necesarias y nunca repetidas
		var puedeDarCartas = true;
		console.log("Procedo a llamar a barajar, al principio deberia poder hacerlo");
		test.ok(partida.Baraja.PudeRepartir() !== false, "Hubo un error al ver si se podia repartir, como es la primera vez se deberia poder repartir 5 cartas ya que ninguna fue tomada")
		while(partida.Baraja.PudeRepartir()){
			var cartas = utils.barajar(partida.PartidaId);
			test.ok(cartas.length === 5 , "las cartas dadas en la baraja al repartir no son 5 sino %d", cartas.length);
			console.log("Genere las cartas que necesitaba, me quedan %d", partida.Baraja.Cartas.length -  partida.Baraja.IdsUsados.length);

			var todasMarcadas = true;
			var norepetida =  true;
			var ids = [];
			for (var i = 0; i < cartas.length; i++) {
				if(cartas[i].Seleccionada !== true)
				{
					todasMarcadas =  false;
					break;
				}
				if(ids.indexOf(cartas[i].Id) > -1){
					norepetida =  false;
				}else{
					ids.push(cartas[i].Id);
				}

			};

			test.ok(todasMarcadas, "Todas las cartas deben seleccionarse al momento de repartir una mano asi las mismas no son selecciondas nuevamente");
			test.ok(norepetida, "Hay cartas que se encuentran repetidas");

		}

		//si todo esta bien entonces creamos

		test.done();
	},
	validarJugada : function(test){
		/*
		test.throws(function(){
			utils.validarJugada("jugadaNoValida", partida.Jugador1.Nombre, partida.PartidaId);
		}, null, "La jugada enviada no e's valida, debe generar un error");
		*/

		//set cartas
		var valorDeseado = 1;
		for (var i = 0; i < partida.Baraja.Cartas.length; i++) {
		 	if(partida.Baraja.Cartas[i].Numero === valorDeseado){
		 		partida.Baraja.Cartas[i].Seleccionada = true;
		 	}else{
		 		partida.Baraja.Cartas[i].Seleccionada =  false;
		 	}
		 	if( i === 3 )
	 			valorDeseado = 5;
		 };

		test.throws(function(){
			utils.validarJugada("1+1+1+1", "jugadorNoValido", partida.PartidaId);
		}, null, "El jugador enviado no es valido debe generar un error");


		test.throws(function(){
			utils.validarJugada("1+1+1+1", partida.Jugador2.Nombre, "idPartidaErronea");
		}, null, "La partidaId enviada no es valida debe generar un error");

		test.ok(utils.validarJugada("1+1+1+1", partida.Jugador1.Nombre, partida.PartidaId),
		 "La jugada enviada es valida, deberia ser correcta");


		test.done();
	}

};