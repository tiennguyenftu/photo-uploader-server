var router = require('express').Router();
var moment = require('moment');
var Image = require('../model/Image');
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

router.get('/', function (req, res, next) {

    Image.find({}, function (err, images) {
        if (err) return next(err);
        res.render('index', {images: images});
    });
});

router.post('/', upload.array('images', 12), function (req, res, next) {
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

module.exports = router;


