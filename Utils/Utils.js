
module.exports = function(app){
	   

	 return {
	 	createPartida : function (callback){
 			var partida = new Partida(randomInt(1, 50));
 			playSpace.Partidas.push(partida);
 			return partida;
	 	},
	 	getPartida : _getPartida,
	 	setJugador : function (partidaId, jugador){
 			var partida = _getPartida(partidaId);
 			console.log("se encontro la partida " +  partida  + "  " + partidaId);
 			if( partida.Jugador1 === "")
 				partida.Jugador1 =  jugador;
 			else if( partida.Jugador2 === "")
 				partida.Jugador2 =  jugador;
 			else
 				throw new Error("hubo un error al setear el jugador para la partida " + partidaId + " la misma ya posee 2 jugadores");
	 	},
	 	barajar : function(partidaId){
	 		var partida = _getPartida(partidaId);
	 		return partida.Baraja.barajar();
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
	 	this.Partidas = []
 };



function Partida (partidaId){
	this.Jugador1= "";
	this.Jugador2 = "";
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

Partida.prototype.puedeJugar = function(jugador){
	if(this.Jugador1 !== "" && this.Jugador2 !== "")
		return true;
	return false;
};


 function Baraja(){
 	var palos = 4;
 	var cantidadCartasPorPalo = 12;

 	var totalCartas = palos *  cantidadCartasPorPalo;

 	this.Cartas = [];
 	var id = 0;
 	for (var i = 0; i < palos; i++) {
 		
 		for (var j = 0; j < cantidadCartasPorPalo.length; j++) {
 			id++;
 			this.Cartas.push({
				Palo = i,
				Numero = j,
				Seleccionada = false,
				Id = id
 			});
 		};

 		//this.Cartas.push(c);
 	};

 	this.MaxId = id;

 	this.IdsUsados = [];
 }
///Retorna los valores de 5 cartas que no han sido seleccionadas aun
Baraja.prototype.barajar =  function(){

	console.log("procedo a barajar, seleccionar 5 cartas y marcarlas como jugadas para la partida");
	var ret = []; //variable que guarda las cartas

	for (var i = 0; i < 5; i++) { //busco 5 cartas
		var id = randomInt(1, this.MaxId + 1);
		while(this.IdsUsados.indexOf(id) > -1) //mientras el id alla sido usado busco otro 
			id = randomInt(1, this.MaxId + 1);
		this.IdsUsados.push(id); // lo agrego en mi lista de utilizados
		for (var i = 0; i < this.Cartas.length; i++) {
			if(this.Cartas[i].Id === id){
				this.Cartas[i].Seleccionada = true; //la marco como seleccionada
				ret.push(this.Cartas[i]);
				break;
			}
		};
	};
};

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
};