

module.exports = function(app){
 console.log("tengo la variable io " + app.get("io") );
 return {
  selectPartida : function(req, res){

        var io =  app.get(io);
        //debo realizar el procesamiento del socket io

        console.log("se ha seleccionado la partida " + req.params.partidaId );

        //renderizamos la pagina solicitada
        res.render("partida", {partidaId : req.params.partidaId});
      }
 }
}
