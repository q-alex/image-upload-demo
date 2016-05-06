var express = require('express');
var multer = require('multer');
var mime = require('mime');

var crypto = require('crypto');
var http = require('http');
var fs = require('fs');

var app = new express();

app.use(express.static('views'));
app.use(express.static('public'));
app.use(express.static('uploads'));

var fileUpload = multer({storage: multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
    crypto.randomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
})});
var webUpload = multer();

app.post('/file-image-upload', fileUpload.single('image'), function(req ,res) {
	console.log(req.file);
	res.status(204).end();
});

app.post('/web-image-upload', webUpload.single('url'), function(req, res) {
	console.log(req.body.url);

	var fileExtension = req.body.url.split('/');
	fileExtension = fileExtension[fileExtension.length - 1].split('.')[1];

	var fileName = crypto.randomBytes(16).toString('hex') + Date.now() + '.' + fileExtension;
	var file = fs.createWriteStream('./uploads/' + fileName );
	var request = http.get(req.body.url, function(response) {
	  response.pipe(file);
	});
	res.status(204).end();
});

var port = 3000;
app.listen( port, function(){ console.log('listening on port ' + port); } );
