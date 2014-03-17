


module.exports = function(utils /*Modulo Utils*/, io /*componente io.socket*/){
	//eventos
	var SocketIoEvents =  {};
	SocketIoEvents.Barajar = "barajar";
	SocketIoEvents.Registrar = "registrarse";
	SocketIoEvents.BarajarCompleted =  'barajarCompleted';


	return {
		//Esta funcion registra los eventos principales de la comunicacion de IO Socket
		registerEvents : function(){

			console.log('se registran los eventos');
			io.sockets.on('connection', function (socket) {
				console.log('se ha llamado al evento socket');
				socket.on(SocketIoEvents.Registrar, function(data){
					console.log(' %j :se ha registrado el socket %s para la partida %s', data ,data.socketId, data.partidaId );
					socket.join(data.partidaId);
				});
				socket.on('barajar', function(data){
					console.log('se ha llamado al evento barajar los datos son %s' , data);
					var cartas = utils().barajar(data.partidaId);
					io.sockets.in(data.room).emit(SocketIoEvents.BarajarCompleted,{
						Cartas : cartas	
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