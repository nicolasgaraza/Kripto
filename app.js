
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var io = require("socket.io");

var app = express();

//save it on the app to share it on multiple sites


var partida = require("./routes/partida")(app);
var utils =  require("./Business/Utils.js");

app.set("utils",utils);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('0388b821-0fe6-4062-8916-aae01a892a9d'));
app.use(express.session());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


app.use(function (req, res, next){
	console.log("guardo en la variable req el modulo utils")
	req.utils =  utils;
	next();
});

var validarUsuarioEnRequest = function (req, res, next){
	if( req.session.jugadorNombre === undefined){
		//guardamos en la session cual era la pagina deseada
		req.session.paginaSolicitada =  req.protocol + '://' + req.get('host') + req.originalUrl;
		console.log("pagina deseada antes de loguearse %s", req.session.paginaSolicitada  );
		res.redirect('/');
	}
	else
		next();
};

app.use('/partida', validarUsuarioEnRequest);
app.use('/default', validarUsuarioEnRequest);

app.use(app.router);
app.use(require('less-middleware')( path.join(__dirname, '/public') ));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./routes/error').error);

// development only
if ('development' == app.get('env')) {
  //app.use(express.errorHandler());
}



app.get('/', routes.index);
app.post('/login', routes.login);
app.get('/default', routes.default);
app.get('/partida/:partidaId', partida.selectPartida);
app.get('/partidaNueva', partida.newPartida);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
console.log("estos son los datos de utils %j"  + utils);

  console.log('llamo a ioOperations con los datos %s ', utils);
	var ioOperations =  require("./Business/IoOperations.js")(utils, io);
	ioOperations.registerEvents();


});
//start socket io
io = io.listen(server);

app.set("io", io);