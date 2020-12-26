var express = require('express');
var path = require('path');
var router = require('./routes/routes');
var bodyParser = require('body-parser');
var https = require('https');
const fs = require('fs');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/', router);


var key = fs.readFileSync(path.join(__dirname, '.', 'keys', 'selfsigned.key'));
var cert = fs.readFileSync(path.join(__dirname, '.', 'keys', 'selfsigned.csr'));
var options = {
    key: key,
    cert: cert
};

var server = https.createServer(options, app);


server.listen(8146, (err) => {
    if (err) {
        console.log("Error was occured at server start");
    } else {
        console.log(`Server is started at port `+8146);
    }
});