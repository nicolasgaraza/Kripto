exports.error = function( err ,req, res, next){

	console.error(err);
	if( err !== undefined || err !== null){
		res.status(500);
		res.render('error',{ title: 'LaQuinta' + ' - Error', ErrorMessage : err} );
	}else
		next();
}