

module.exports = function(app){
 console.log("tengo la variable io " + app.get("io") );
 return {
  selectPartida : function(req, res){

       

        console.log("buscamos la partida " + req.params.partidaId );

        var utils = req.utils();
        var partida = utils.getPartida(req.params.partidaId );
        if( partida ==  null)
          throw new Error("Mmm... parece que no hemos podido encontrar la partida indicada");


        //mover luego esta validacion y agregacion del segundo jugador a un modulo de la logica y no aqui

        if( !partida.validarJugador(req.session.jugadorNombre)){
          console.log("se ha intentado acceder a una partida ya copletada %j por el jugador %s", partida, req.session.jugador);
          throw new Error("Mmm... esta partida esta cerrada y no puedes acceder a la misma, selecciona o crea otra partida nueva");
        }
        else if(partida.Jugador2 === null && partida.Jugador1.Nombre !==req.session.jugadorNombre ){
          console.log("se ha agregado al jugador %s a la partida %j", req.session.jugadorNombre, partida);
          utils.setJugador(partida.PartidaId, req.session.jugadorNombre);
        }

        //Creamos el puente socket.io para esta partida


        //renderizamos la pagina solicitada
        res.render("partida", {partidaId : req.params.partidaId, jugadorActual: req.session.jugadorNombre});
      },
  newPartida : function(req, res){
        console.log("llamada de nueva partida");
        var utils = req.utils();
        var p = utils.createPartida(null);        
        console.log("creamos una nueva partida con id %d", p.PartidaId);
        //seteamos el jugador actual
        utils.setJugador(p.PartidaId, req.session.jugadorNombre);
        console.log("partida creada");
        //renderizamos la pagina solicitada
        res.redirect("../partida/" +  p.PartidaId);
      }
 }
}
