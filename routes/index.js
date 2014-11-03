
/*
 * GET home page.
 */
var cloudinary = require('cloudinary'),
	easyimg = require('easyimage'),
	formidable = require('formidable');

	cloudinary.config({ 
	  cloud_name: process.env.CLOUDINARY_CLOUD, 
	  api_key: process.env.CLOUDINARY_KEY, 
	  api_secret: process.env.CLOUDINARY_SECRET 
	});

module.exports = function (app) {
	
	app.get('/', function(req, res){
		res.render('index');
	});

	app.post('/', function(req, res){
		
		var form = new formidable.IncomingForm();
		var default_width = 1024, 
			default_height = 1024;
			
		form.parse(req, function(err, fields, files) {
			if(files.image !== undefined) {
				easyimg.info(files.image.path).then(function (image) { console.log(image)
					if(image.width == default_width && image.height == default_height) {
						var croppedImage = [];
						var publicId = [];
						for (var i = 0 ; i < 4; i++) {
							var width = 0, height = 0;
							switch(i) {
								case 0:
									width = 755;
									height = 450;
									cloudinary.uploader.upload(files.image.path, function(result) { 
										console.log(result.url)
								  		croppedImage[i] = result.url;
								  		publicId[i] = result.public_id;
									}, { width:width, height:height});	
									break;
								case 1:
									width = 365;
									height = 450;
									cloudinary.uploader.upload(files.image.path, function(result) { 
								  		console.log(result.url)
								  		croppedImage[i] = result.url;
								  		publicId[i] = result.public_id;
									}, { width:width, height:height});	
									break;
								case 2:
									width = 365;
									height = 212;
									cloudinary.uploader.upload(files.image.path, function(result) { 
								  		console.log(result.url)
								  		croppedImage[i] = result.url;
								  		publicId[i] = result.public_id;
									}, { width:width, height:height});	
									break;
								case 3:
									width = 380;
									height = 380;
									cloudinary.uploader.upload(files.image.path, function(result) { 
								  		console.log(result.url)
								  		croppedImage[i] = result.url;
								  		publicId[i] = result.public_id;
								  		console.log('that step' + croppedImage[0])
								  		console.log('that step' + croppedImage[1])
								  		console.log('that step' + croppedImage[2])
								  		console.log('that step' + croppedImage[3])
								  		res.render('resize', {croppedImage :croppedImage, publicId: publicId });
									}, { width:width, height:height});	
									break;	

							}
							console.log('this step'+croppedImage);							
						};
							//res.render('resize', {croppedImage :croppedImage, publicId: publicId });
						
					} else {
						res.render('error', error='Image size is to 1024x1024. Please try again');
					}
				});
			}			
		});
		
	});

	app.get('/resize', function(req, res){
		var croppedImage = req.body.croppedImage;
		var publicId = req.body.publicId;

		res.render('resize', {croppedImage :croppedImage, publicId: publicId });
	});

	app.post('/resize', function(req, res){
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
			if(fields.img1_width != '' && fields.img1_height != '') {
				cloudinary.api.update(fields.img1_publicId, function(result) {

				},{width: fields.img1_width , height: fields.img1_height });
			}
			if(fields.img2_width != '' && fields.img2_height != '') {
				cloudinary.api.update(fields.img2_publicId, function(result) {

				},{width: fields.img2_width , height: fields.img2_height });
			}
			if(fields.img3_width != '' && fields.img3_height != '') {
				cloudinary.api.update(fields.img3_publicId, function(result) {

				},{width: fields.img3_width , height: fields.img3_height });
			}
			if(fields.img4_width != '' && fields.img4_height != '') {
				cloudinary.api.update(fields.img4_publicId, function(result) {

				},{width: fields.img4_width , height: fields.img4_height });
			}
		});

	});
}

