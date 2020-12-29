var express = require('express');
var router = require('./routes');
var path = require('path');

var app = express();

app.use(express.urlencoded());
app.use(express.json());
app.set('view engine','pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

app.listen(3003, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", 3003);
});