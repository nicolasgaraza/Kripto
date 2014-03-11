
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
app.set("io", io);

var partida = require("./routes/partida")(app);
var utils =  require("./Utils/Utils.js");
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
app.use(express.cookieParser('your secret here'));
app.use(express.session());



app.use(function (req, res, next){
	console.log("guardo en la variable req el modulo utils")
	req.utils =  utils;
	next();
});

app.use(app.router);
app.use(require('less-middleware')( path.join(__dirname, '/public') ));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/partida/:partidaId', partida.selectPartida);
app.get('/partidaNueva', partida.newPartida);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
//start socket io
io.listen(server);
