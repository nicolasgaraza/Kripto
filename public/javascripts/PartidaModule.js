

//luego mover a otro lado

var partidaModule =  angular.module('PartidaModule', []);


partidaModule.value('defaults', {
	partidaId : $("#partidaId").val(),
	jugadorActual : $("#jugadorActual").val(), 
	socket : null ,
	Mensaje : null,
});


//Interfaz para definir las operaciones

partidaModule.factory('Cartas', function (){
	return [];
});

partidaModule.factory('Io', function (Cartas,  defaults){

	
	///Realiza la conexion con el servidor para indicar que el jugador actual a entrado a la partida
	///Esta operacion registra los websockets


	return {
		conectarPartida : function (partidaId, callback){
			console.log('conecto la partida ' + partidaId );
			defaults.socket =  io.connect('http://localhost:3000');
			var socket = defaults.socket ;

			//Evento emitido que sucede una vez se allan barajado la partida seleccionada
			socket.on('barajarCompleted' , function (data) {
				console.log('Se ha recibido el evento barajarCompleted los datos enviados fueron ',JSON.stringify(data));
				Cartas =  data.Cartas;
		  	});
			//Evento que se llama una vez se valido la jugada en la partida actual, el mismo no debe porque haber sido
			//emitido por el jugadorActual pero si siempre es para una partida
		  	socket.on('validarJugadaCompleted', function(data/*{Mensaje: , , Puntajes : {Jugador: , Puntaje : }}*/){
	  			defaults.Mensaje = data.Mensaje;

	  			defaults.Puntajes = {}  
		  	});

			console.log('se procede a registrar el cliente para el canal ' + partidaId);

			socket.emit('registrarse', { socketId: null, partidaId : partidaId });

			if(callback !== undefined ){
				callback();		
			}

		},

	};
});


partidaModule.controller('PartidaController', function ($scope,$location,Io, defaults, Cartas){
	console.log($location);

	//var registrar el web socket
	Io.conectarPartida(defaults.partidaId, function(){
		console.log("Se ha conectado correctamente");
	});

	//variable donde guardaremos las cartas que nos dara 
	$scope.cartas = Cartas;
	$scope.jugadorActual = defaults.jugadorActual;

});


function soloDePrueba(partidaId)
{
	var socket = io.connect('http://localhost');
	socket.emit('barajar', { partidaId: partidaId });
}

/*Ejemplo:

angular.module('myModuleName', ['dependency1', 'dependency2'])

// 2. set a constant
    .constant('MODULE_VERSION', '0.0.3')

// 3. maybe set some defaults
    .value('defaults', {
        foo: 'bar'
    })

// 4. define a module component
    .factory('factoryName', function() {})

// 5. define another module component
    //.directive('directiveName', function() {})
;// and so on*/