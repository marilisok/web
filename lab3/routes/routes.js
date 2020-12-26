var express = require('express');
var router = express.Router();

var pictures = require('../public/json/pictures');
var persons = require('../public/json/persons');
var settings = require('../public/json/setting');


router.get('/', function(req,res) {
    res.render('index', {title:'Главная страница', arts: pictures});
});

router.get('/cards', function(req,res) {
    res.render('cards', {title:'Участники', persons: persons});
});

router.get('/setting', function(req,res) {
    res.render('settings', {title:'Настройки', item: settings});
});

router.post('/editPicture/:num', function(req,res) {
    const id = Number(req.params.num);
    for(let picture of pictures){
        if(picture.id === id){
            picture.name = req.body.name;
            picture.artist = req.body.artist;
            picture.price = Number(req.body.price);
            picture.min = Number(req.body.min);
            picture.max = Number(req.body.max);
            picture.picture = req.body.picture;
            if(req.body.in_trade === 'yes')
                picture.in_trade = true;
            else
                picture.in_trade = false;
            break;
        }
    }
    res.redirect('/');
});

router.post('/newPicture/', function(req,res) {
    pictures.push({
        "id": Number(req.body.id),
        "name": req.body.name,
        "artist": req.body.artist,
        "description": req.body.description,
        "price": Number(req.body.price),
        "picture": req.body.picture,
        "min": Number(req.body.min),
        "max": Number(req.body.max),
        "in_trade": false
    });
    res.redirect('/');
});

router.post('/deletePicture/:num', function(req,res) {
    const id = Number(req.params.num);
    for (let picture of pictures) {
        if(picture.id === id && picture.price >=0){
            console.log("delete");
            pictures.splice(pictures.indexOf(picture), 1);

        }
    }
    res.redirect('/');
});

router.post('/editPerson/:num', function(req,res) {
    const id = Number(req.params.num);
    for(let person of persons){
        if(person.id === id){
            person.name = req.body.name;
            person.money = Number(req.body.money);
            break;
        }
    }
    res.redirect('/cards');
});

router.post('/newPerson/', function(req,res) {
    persons.push({
        "id": Number(req.body.id),
        "name": req.body.name,
        "money": Number(req.body.money)
    });
    res.redirect('/cards');
});

router.post('/deletePerson/:num', function(req,res) {
    const id = Number(req.params.num);
    for (let person of persons) {
        if(person.id === id){
            persons.splice(persons.indexOf(person), 1);
            res.redirect('/cards');
        }
    }
});

router.post('/changeSettings/', function(req,res) {
    settings.dt = req.body.dt;
    settings.tm = req.body.tm;
    settings.timeout = req.body.timeout;
    settings.interval = req.body.interval;
    settings.pause = req.body.pause;
    res.redirect('/setting');
});


module.exports = router;