
/*
 * GET home page.
 */

exports.default = function(req, res){
	var partida = req.utils;
	console.trace(partida().getListaPartidas);
	res.render('default', { title: 'Express', partidas: partida().getListaPartidas(), jugador : req.session.jugadorNombre  });
}

exports.index = function(req, res){
	res.render('index',{ title: 'LaQuinta'} );
}

exports.login = function ( req, res){
	var jugador = req.body.jugadorName;
	req.session.jugadorNombre =  jugador;
	console.log("form : %j", req.session);
	if(req.session.paginaSolicitada !== undefined){
		console.log("vamos a redirigir a %s",req.session.paginaSolicitada );
		//tenemos una pagina anterior, vamos a redirigir alli
		var pagina = req.session.paginaSolicitada;
		//la quitamos
		req.session.paginaSolicitada = undefined;
		res.redirect(pagina);
	}else {
		res.redirect('/default');
	}
}



