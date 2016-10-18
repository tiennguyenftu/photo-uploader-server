var express = require('express');
var app = express();
var mongoose = require('mongoose');
var moment = require('moment');
var Image = require('./model/Image');
var exphbs = require('express-handlebars');


var databaseConfig = require('./database');
mongoose.connect(databaseConfig.url, function () {
    console.log('Database connected');
});


var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, moment().format("MMM-Do-YY-h-mm-ss") + file.originalname);
    }
});
var upload = multer({ storage: storage });



var PORT = process.env.PORT || 3000;
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res, next) {

    Image.find({}, function (err, images) {
        if (err) return next(err);
        res.render('index', {images: images});
    });
});

app.post('/', upload.array('images', 12), function (req, res, next) {
    var uploadImages = req.files;
    var images = uploadImages.map(function (uploadImage) {
        return {
            name: uploadImage.originalname,
            url: '/uploads/' + uploadImage.filename
        }
    });
    Image.create(images, function (err) {
        if (err) return next(err);
        res.redirect('/');
    });
});

app.listen(PORT, function () {
    console.log('Server started on port ' + PORT);
});
