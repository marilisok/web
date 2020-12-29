var express = require('express');
var router = express.Router();

var books_in_library = require('./public/json/library');


router.get('/', function (req, res) {
    res.render('index', {title : 'Library'});
});

router.get('/book', function (req, res) {
    res.render('book', {title: 'Library', books: books_in_library});
});
router.get('/book/expired', function (req, res) {
    res.render('book', {title: 'Library', books: books_in_library.filter (
        (book) => {
            if(book.return_data === '-')
                return false;
            return (new Date(book.return_data) <= new Date());
        }
    )});
});

router.get('/book/available', function (req, res) {
    res.render('book', {title: 'Library', books: books_in_library.filter (
            (book) => {
                return (book.in_library === "да");
            }
        )});
});

router.get('/book/:num', function (req, res) {
    const id = Number(req.params.num);
    for (let book of books_in_library) {
        if(book.id === id){
            res.render('onebook', {title: 'Library', item: book});
        }
    }
});

router.post('/book/:num', function (req, res) {
    const id = Number(req.params.num);
    for (let book of books_in_library) {
        if(book.id === id){
            books_in_library.splice(books_in_library.indexOf(book), 1);
            res.render('middle', {title: 'Library', msg: "Книга удалена"});
            return;
        }
    }
});

router.post('/new', function (req, res) {
    const id = Number(req.body.id);
    if(isNaN(id) || req.body.nm === "" || req.body.au ==="" || new Date(req.body.dt) > new Date()){
        res.render('middle', {title: 'Library', msg: "Проверьте введенные данные"});
        return;
    }
    for(let book of books_in_library){
        if(id === book.id){
            res.render('middle', {title: 'Library', msg: "Книга с таким id уже существует"});
            return;
        }
    }
    books_in_library.push({
        "id": id,
        "name": req.body.nm,
        "au": req.body.au,
        "data": req.body.dt,
        "in_library": "да",
        "person": "-",
        "return_data": "-"
    });
    res.render('middle', {title: 'Library', msg: "Книга добавлена"});
});

router.post('/book/back/:num', function (req, res) {
    const id = Number(req.params.num);
    for(let book of books_in_library){
        if(id === book.id){
            book.in_library = "да";
            book.person =  "-";
            book.return_data = "-";
            res.render('middle', {title: 'Library', msg: "Книга возвращена"});
            return;
        }
    }
});

router.post('/book/reader/:num', function (req, res) {
    if(new Date(req.body.dt) < new Date()){
        res.render('middle', {title: 'Library', msg: "Проверьте введенные данные"});
        return;
    }

    const id = Number(req.params.num);
    for(let book of books_in_library){
        if(id === book.id){
            book.in_library = "нет";
            book.person =  req.body.nm;
            book.return_data = req.body.dt;
            res.render('middle', {title: 'Library', msg: "Книга оформлена успешно"});
            return;
        }
    }
});

router.post('/book/edit/:num', function (req, res) {

    if(new Date(req.body.dt) > new Date()){
        res.render('middle', {title: 'Library', msg: "Проверьте введенные данные"});
        return;
    }

    const id = Number(req.params.num);
    for(let book of books_in_library){
        if(id === book.id){
            if(req.body.nm)
                book.name = req.body.nm;
            if(req.body.au)
                book.au = req.body.au;
            if(req.body.dt)
                book.data = req.body.dt;
            res.render('middle', {title: 'Library', msg: "Данные о книге отредактированы"});
            return;
        }
    }
});




module.exports = router;