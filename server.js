var express = require('express');
var app = express();
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');

var indexRoutes = require('./routes/index');
var apiRoutes = require('./routes/api');

var databaseConfig = require('./config/database');
mongoose.connect(databaseConfig.url, function () {
    console.log('Database connected');
});

var PORT = process.env.PORT || 3000;
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/public'));

app.use(indexRoutes);
app.use('/api', apiRoutes);

app.listen(PORT, function () {
    console.log('Server started on port ' + PORT);
});
