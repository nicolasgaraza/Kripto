console.log('Accessing Utils Mode');
module.exports = function(){
	   

	 return {
	 	generateRandomNumber : randomInt,
	 	getListaPartidas : function(){
	 		console.log("Get partidas called");
	 		var result = [];
	 		for (var i = 0; i < playSpace.Partidas.length; i++) {
	 		 	var partida = playSpace.Partidas[i] ;
	 		 	result.push({
	 		 		PartidaId : partida.PartidaId,
	 		 		Jugador1 : partida.Jugador1,
	 		 		Jugador2 : partida.Jugador2,
	 		 		NecesitaJugador : (partida.Jugador2 === null && partida.Jugador1 !== null) || 
	 		 		(partida.Jugador1 === null && partida.Jugador2 !== null)
	 		 	});
	 		};

	 		return result;
	 	},
	 	createPartida : function (callback){
 			var partida = new Partida(randomInt(1, 50));
 			playSpace.Partidas.push(partida);
 			return partida;
	 	},
	 	getPartida : _getPartida,
	 	setJugador : function (partidaId, jugador){
 			var partida = _getPartida(partidaId);
 			console.log("se encontro la partida " +  partida  + "  " + partidaId);
 			if( partida.Jugador1 === null)
 				partida.Jugador1 = new Jugador(jugador);
 			else if( partida.Jugador2 === null)
 				partida.Jugador2 =  new Jugador(jugador);
 			else
 				throw new Error("hubo un error al setear el jugador para la partida " + partidaId + " la misma ya posee 2 jugadores");
	 	},
	 	barajar : function(partidaId){
	 		var partida = _getPartida(partidaId);
	 		return partida.Baraja.barajar();
	 	},
	 	validarJugada : function ( jugada, jugador, partidaId)/*return bool, true acerto, false se equivoco*/{

	 		console.log("procedemos a validar la jugada %s para el jugador %s de la partida %s", jugada, jugador, partidaId);
	 		var p = _getPartida(partidaId);
	 		if(p === null)
	 			throw new Error("Partida con Id " + partidaId + "no encontrada");
	 		if( p.puedeJugar()){
 				//validar jugada, ahora retornamos true
				if(p.Jugador1.Nombre === jugador || p.Jugador2.Nombre === jugador){

				}else{
					throw new Error("El jugador indicado no es valido para la partida " + partidaId );
				}
 				//Codigo de Validacion
 				return true;
	 		}
	 		else
	 			throw new Error("La partida no contiene el jugador %s", jugador);
	 		return false;
	 	},
		pausarPartida : function (partidaId, jugadorNombre){
			var p = _getPartida(partidaId);
			if(p.puedeJugar()){
				p.pausar(jugadorNombre);
			}else{
				throw new Error('La partidad que se decidio pausar no puede jugar en el momento');
			}
			return true;
		},
	 	setIoSocketAJugador : function(partidaId, nombreJugador, IO /*identificador del socket que esta usando el jugador*/){
	 		var p = _getPartida(partidaId);
	 		if(p.Jugador1.Nombre === nombreJugador){
	 			p.Jugador1.Io =  IO;
	 		}
	 		else if(p.Jugador2.Nombre == nombreJugador){
	 			p.Jugador2.Io =  IO;	
	 		}
	 		else
	 			throw new Error("No se ha podido asociar el IO indicado al jugador solicitado");


	 	}
	 }
} 

function _getPartida(partidaId, callback){
	for (var i = 0; i < playSpace.Partidas.length; i++) {
		var partida = playSpace.Partidas[i];
		if(partida !== null && partida!== undefined && partida.PartidaId == partidaId)
		return partida;
	};
	return null; // no se encontro la partida
};

var playSpace = new function() {
	 	this.Partidas = [];	
 };

function Jugador(nombre){
	this.Nombre = nombre;
	this.Puntos = 0;
	this.Io = null;
};


function Partida (partidaId){
	this.Jugador1= null;
	this.Jugador2 = null;
	this.PartidaId = partidaId;

	this.Baraja  =  new Baraja();

	this.Pausado = false;
	this.JugadorActual = null;
}
///Pausa la partida y marca al jugador que lo hizo, la idea es que el mismo pueda escribir lo que hizo para ganar la partida
/// y que l otro jugador se le indique que espere
Partida.prototype.pausar = function(jugador){
	this.Pausado  =  true;
	this.JugadorActual =  jugador;

	//mas adelante generar un tick para que a el x tiempo lo despause
};

Partida.prototype.puedeJugar = function(){
	if(this.Jugador1 !== null && this.Jugador2 !== null)
		return true;
	return false;
};

Partida.prototype.validarJugador = function(jugador){
	if((this.Jugador1 !== null && this.Jugador1.Nombre === jugador)
		|| (this.Jugador2 !== null && this.Jugador2.Nombre === jugador)){
		return true;
	}
	else if(this.Jugador2 !== false)
	{
		return true;
	}
	return false;
}


 function Baraja(){
 	var palos = 4;
 	var cantidadCartasPorPalo = 12;

 	var totalCartas = palos *  cantidadCartasPorPalo;

 	this.Cartas = [];
 	var id = 0;
 	for (var i = 0; i < palos; i++) {
 		console.log("procedo a generar las cartas para el palo %d", i);
 		for (var j = 1; j <= cantidadCartasPorPalo; j++) {
 			console.log("genero la carta numero %d del palo %d", j, i);
 			id = id + 1 ;
 			console.log("id generado actual %d", id);
 			this.Cartas.push({
				Palo : i,
				Numero : j,
				Seleccionada : false,
				Id : id
 			});
 		};

 		//this.Cartas.push(c);
 	};
 	console.log("Id generado maximo %d" , id);
 	this.MaxId = id;

 	this.IdsUsados = [];

 	this.PudeRepartir = function(){
 		if(totalCartas  - this.IdsUsados.length < 5)
 			return false;
 		return true;
 	}
 }
///Retorna los valores de 5 cartas que no han sido seleccionadas aun
Baraja.prototype.barajar =  function(){

	console.log("procedo a barajar, seleccionar 5 cartas y marcarlas como jugadas para la partida");
	var ret = []; //variable que guarda las cartas

	if(this.Cartas.length - this.IdsUsados.length < 5){
		return [];
	}

	for (var i = 0; i < this.Cartas.length; i++) {
		if(this.Cartas[i].Seleccionada)
			this.Cartas[i].Seleccionada =  false;
	};

	for (var i = 0; i < 5; i++) { //busco 5 cartas
		console.log("busco la carta numero %d", i)
		var id = randomInt(1, this.MaxId + 1);
		console.log("genere el id %d, el maximo posible es %d", id, this.MaxId);
		while(this.IdsUsados.indexOf(id) > -1) //mientras el id alla sido usado busco otro 
			id = randomInt(1, this.MaxId + 1);
		this.IdsUsados.push(id); // lo agrego en mi lista de utilizados
		for (var j = 0; j < this.Cartas.length; j++) {
			if(this.Cartas[j].Id === id){
				this.Cartas[j].Seleccionada = true; //la marco como seleccionada
				console.log("Encontre la carta numero %d quedan un total de %d posibles cartas", i, this.Cartas.length - this.IdsUsados.length);
				ret.push(this.Cartas[j]);
				break;
			}
		};
	};

	return ret;
};

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
};