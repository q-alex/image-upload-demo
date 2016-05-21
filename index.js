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

// set up file saving
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

// set up handling image urls
var webUpload = multer();

// set up url for sending files to
app.post('/file-image-upload', fileUpload.single('image'), function(req ,res) {
	console.log(req.file);
	res.status(204).end();
});

// set up url for sending image urls to
app.post('/web-image-upload', webUpload.single('url'), function(req, res) {
	console.log(req.body.url);

	// grab file extension from url
	var fileExtension = req.body.url.split('/');
	fileExtension = fileExtension[fileExtension.length - 1].split('.')[1];

	// save file with random name to avoid name clash
	var fileName = crypto.randomBytes(16).toString('hex') + Date.now() + '.' + fileExtension;
	var file = fs.createWriteStream('./uploads/' + fileName );
	var request = http.get(req.body.url, function(response) {
	  response.pipe(file);
	});
	res.status(204).end();
});

// set up url for upload interface
var port = 3000;
app.listen( port, function(){ console.log('listening on port ' + port); } );
