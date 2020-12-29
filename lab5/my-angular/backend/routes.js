var express = require('express');
var router = express.Router();
var stocks = require('./json/stocks');
var brokers = require('./json/brokers');
var settings = require('./json/settings');

router.get('/brokers', function(req, res){
  res.json(brokers);
});

router.put('/brokers', function(req,res) {
  console.log(req.body);
  brokers.push({
    "id": Number(req.body.id),
    "name": req.body.name,
    "money": Number(req.body.money),
  });
});

router.post('/broker/:id', function(req,res) {
  const id = Number(req.params.id);
  console.log(id);
  console.log(req.body);
  for(let broker of brokers){
    if(broker.id === id){
      broker.money = Number(req.body.money);
    }
  }
});

router.delete('/brokers/:id', function(req, res){
  const id = Number(req.params.id);
  console.log(id);
  for(let broker of brokers){
    if(broker.id === id){
      brokers.splice(brokers.indexOf(broker), 1);
    }
  }
});

router.get('/stocks', function(req, res){
  res.json(stocks);
});

router.put('/stocks', function(req,res) {
  console.log(req.body);
  stocks.push({
    "id": Number(req.body.id),
    "distribution": req.body.distribution,
    "max": Number(req.body.max),
    "price": Number(req.body.price),
    "count": Number(req.body.count)
  });
});

router.delete('/stocks/:id', function(req, res){
  const id = Number(req.params.id);
  console.log(id);
  for(let stock of stocks){
    if(stock.id === id){
      stocks.splice(stocks.indexOf(stock), 1);
    }
  }
});


router.get('/settings', function(req, res){
  res.json(settings);
});

router.post('/settings', function(req,res) {
  console.log(req.body);
  settings.tm_end = req.body.tm_end;
  settings.tm_start = req.body.tm_start;
  settings.tm_out = req.body.tm_out;
});
module.exports = router;
