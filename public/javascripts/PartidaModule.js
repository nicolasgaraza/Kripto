var partidaModule =  angular.module('PartidaModule', []);


partidaModule.value('defaults', {
	partidaId : $("#partidaId").val(),
	jugadorActual : $("#jugadorActual").val(), 
	socket : null ,
	Mensaje : null,
});

/*
partidaModule.factory('Io', function (Cartas,  defaults){

	
	///Realiza la conexion con el servidor para indicar que el jugador actual a entrado a la partida
	///Esta operacion registra los websockets


	
});*/


partidaModule.controller('PartidaController', function ($scope,$location, defaults){
	console.log($location);

	var Io = {
		conectarPartida : function (partidaId, callback){
			console.log('conecto la partida ' + partidaId );
			defaults.socket =  io.connect('http://localhost:3000');
			var socket = defaults.socket ;

			//Evento emitido que sucede una vez se allan barajado la partida seleccionada
			socket.on('barajarCompleted' , function (data) {
				console.log('Se ha recibido el evento barajarCompleted los datos enviados fueron ',JSON.stringify(data));
				$scope.cartas =  data.Cartas;
				console.log('Ahora cartas posee ' +  JSON.stringify($scope.cartas));
				$scope.$apply();
		  	});
			//Evento emitido que sucede una vez se allan barajado la partida seleccionada
			socket.on('pausarCompleted' , function (data) {
				console.log('Se ha recibido el evento pausarCompleted los datos enviados fueron ',JSON.stringify(data));
				MostrarPanelIndicarJugada();
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
	
	//var registrar el web socket
	Io.conectarPartida(defaults.partidaId, function(){
		console.log("Se ha conectado correctamente");
	});
	$scope.showPartida =  true; //con esto quitaremos el loading de la pagina /*Por hacer*/
	$scope.jugadorActual = defaults.jugadorActual;
	//variable donde guardaremos las cartas que nos dara 
	$scope.cartas = [];
	console.log("La variable Cartas tiene en su init " + JSON.stringify($scope.cartas));
	$scope.jugadorActual = defaults.jugadorActual;
	
	
	//Esta funcion oculta el boton de 'Listo'
	$scope.puedePausar = function (){
		return $scope.cartas.length !== 5;
		//return false;
	};
	
	$scope.pausarPartida =  function() {
		console.log('llamado a la funcion pausar');
		defaults.socket.emit('pausar', {partidaId :  defaults.partidaId, jugadorActual : defaults.jugadorActual });	
	};
	
	$scope.mostrarPanelIndicarJugada =  false;
	function MostrarPanelIndicarJugada(){
		$scope.mostrarPanelIndicarJugada =  true;
		
	};
	
	$scope.cargarValorCarta= function (index){
		if( index + 1=== 5){
			return; //es la quinta carta no hago nada
		}
	};
	
});


//Interfaz para definir las operaciones

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