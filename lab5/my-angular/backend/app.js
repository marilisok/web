const app = require('express')();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const corsOptions = {
  'credentials': true,
  'origin': true,
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'allowedHeaders': 'Authorization,X-Requested-With,X-HTTP-Method-Override,Content-Type,Cache-Control,Accept',
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routes);


port = 3333;
server.listen(port);
