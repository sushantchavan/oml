
/*
 * GET home page.
 */
var cloudinary = require('cloudinary'),
	easyimg = require('easyimage'),
	formidable = require('formidable'),
	aysnc = require('async');

	cloudinary.config({ 
	  cloud_name: process.env.CLOUDINARY_CLOUD, 
	  api_key: process.env.CLOUDINARY_KEY, 
	  api_secret: process.env.CLOUDINARY_SECRET 
	});

module.exports = function (app) {
	
	function updateImage (width, height, id, croppedImage, publicId, callback) {
		cloudinary.api.update(id, function (result) {
			console.log(result);
			croppedImage.push(result.url);
			publicId.push(result.public_id);
			callback();
		}, {width: width, height: height});
	}

	function uploadImage (width, height, path, croppedImage, publicId, callback) {
		cloudinary.uploader.upload(path, function (result) {
			console.log(result);
			croppedImage.push(result.url);
			publicId.push(result.public_id);
			callback();
		}, {width: width, height: height});
		
	}

	
	app.get('/', function(req, res){
		res.render('index');
	});

	app.post('/', function(req, res){
		
		var form = new formidable.IncomingForm();
			croppedImage = [],
			publicId = [],
			func = [],
			default_width = 1024, 
			default_height = 1024;

		function callback () {
			if(croppedImage.length >= 4 && publicId.length >= 4 ) {
				if(req.session.croppedImage != undefined) {
					req.session.croppedImage = null;
				}
				if(req.session.publicId != undefined) {
					req.session.publicId = null;
				}
				req.session.croppedImage = croppedImage;
				req.session.publicId = publicId;
				res.redirect('/resize');
				
			}
				
		}

		form.parse(req, function(err, fields, files) {
			if(files.image !== undefined) {
				easyimg.info(files.image.path).then(function (image) { console.log(image)
					
					if(image.width == default_width && image.height == default_height) {
						
						uploadImage(755, 450, files.image.path, croppedImage, publicId, callback);
						uploadImage(365, 450, files.image.path, croppedImage, publicId, callback);
						uploadImage(365, 212, files.image.path, croppedImage, publicId, callback);
						uploadImage(380, 380, files.image.path, croppedImage, publicId, callback);

					} else {
						res.render('error', error='Image size is to 1024x1024. Please try again');
					}
				});
			}			
		});
		
	});

	app.get('/resize', function(req, res){

		var croppedImage = req.session.croppedImage;
		var publicId = req.session.publicId;

		res.render('resize', {croppedImage :croppedImage, publicId: publicId });
	});

	app.post('/resize', function(req, res){
		var form = new formidable.IncomingForm(),
			croppedImage = [],
			publicId = [];

		function callback () {
			if(croppedImage.length >= 4 && publicId.length >= 4  ) {
				console.log('we get inside')
				console.log(croppedImage)
				req.session.croppedImage = croppedImage;
				req.session.publicId = publicId;
				res.redirect('/resize');
			}
				
		}

		form.parse(req, function(err, fields, files) {
			if(fields.img1_width != '' && fields.img1_height != '') {
				
				updateImage(fields.img1_width, fields.img1_height, fields.img1_id, croppedImage, publicId, callback);
			
			} else {
				croppedImage.push(req.session.croppedImage[0]);
				publicId.push(req.session.publicId[0]);
			}

			if(fields.img2_width != '' && fields.img2_height != '') {
				
				updateImage(fields.img2_width, fields.img1_height, fields.img2_id, croppedImage, publicId, callback);
			
			} else {
				croppedImage.push(req.session.croppedImage[1]);
				publicId.push(req.session.publicId[1]);
			}
			if(fields.img3_width != '' && fields.img3_height != '') {
			
				updateImage(fields.img3_width, fields.img1_height, fields.img3_id, croppedImage, publicId, callback);
			
			} else {
				croppedImage.push(req.session.croppedImage[2]);
				publicId.push(req.session.publicId[2]);
			}
			if(fields.img4_width != '' && fields.img4_height != '') {
				updateImage(fields.img4_width, fields.img1_height, fields.img4_id, croppedImage, publicId, callback);
			} else {
				croppedImage.push(req.session.croppedImage[3]);
				publicId.push(req.session.publicId[3]);
			}
			
		});

	});
}

