

module.exports = function(app){
 console.log("tengo la variable io " + app.get("io") );
 return {
  selectPartida : function(req, res){

        var io =  app.get("io");
        //debo realizar el procesamiento del socket io

        console.log("se ha seleccionado la partida " + req.params.partidaId );

        //renderizamos la pagina solicitada
        res.render("partida", {partidaId : req.params.partidaId});
      },
  newPartida : function(req, res){
        console.log("llamada de nueva partida");
        var utils = req.utils();
        var p = utils.createPartida(null);        
        console.log("creamos una nueva partida con id %d", p.PartidaId);

        console.log("partida creada");
        //renderizamos la pagina solicitada
        res.redirect("../partida/" +  p.PartidaId);
      }
 }
}
