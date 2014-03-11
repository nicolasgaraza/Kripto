
/*
 * GET home page.
 */

exports.index = function(req, res){
	var partida = req.utils;
	console.trace(partida().getListaPartidas);
	res.render('index', { title: 'Express', partidas: partida().getListaPartidas() });
}

