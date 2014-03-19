


module.exports = function(utils /*Modulo Utils*/, io /*componente io.socket*/){
	//eventos
	var SocketIoEvents =  {};
	SocketIoEvents.PuedeJugar =  "puedeJugar";
	SocketIoEvents.Barajar = "barajar";
	SocketIoEvents.BarajarCompleted =  'barajarCompleted';
	SocketIoEvents.Registrar = "registrarse";
	SocketIoEvents.Pausar =  'pausar';
	SocketIoEvents.PausarCompleted =  'pausarCompleted';


	return {
		//Esta funcion registra los eventos principales de la comunicacion de IO Socket
		registerEvents : function(){

			console.log('se registran los eventos');
			io.sockets.on('connection', function (socket) {
				console.log('se ha llamado al evento socket');
				socket.on(SocketIoEvents.Registrar, function(data){
					console.log(' %j :se ha registrado el socket %s para la partida %s', data ,data.socketId, data.partidaId );
					socket.join(data.partidaId);
					if(utils().getPartida(data.partidaId).puedeJugar()){
						setTimeout(function(){
							var cartas = utils().barajar(data.partidaId);
							io.sockets.in(data.partidaId).emit(SocketIoEvents.BarajarCompleted,{
								Cartas : cartas	
							});
						}, 10000);
					}
				});
				/*socket.on(SocketIoEvents.Barajar, function(data){
					console.log('se ha llamado al evento barajar los datos son %s' , data);
					var cartas = utils().barajar(data.partidaId);
					io.sockets.in(data.partidaId).emit(SocketIoEvents.BarajarCompleted,{
						Cartas : cartas	
					});
				});*/
				
				socket.on(SocketIoEvents.Pausar, function(data){
					console.log('se ha llamado al evento pausar los datos son %s' , data);
					utils().pausarPartida(data.partidaId, data.jugadorActual);
					io.sockets.in(data.partidaId).emit(SocketIoEvents.PausarCompleted,{
						Jugador : data.jugadorActual	
					});
				});
			});

			/*io.sockets.on('connection', function (socket) {
				console.log( '%j' ,socket);	

				socket.on('registrarse', function (partidaId) {
					socket.join(partidaId);
				});

				socket.on('disconnect', function () {
					io.sockets.emit('user disconnected');
				});
			}*/
		}
	};
};