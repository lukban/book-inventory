var express = require('express');
var app = express();
var bodyParser = require('body-parser');

function logRequest(req, res, next) {
    console.log('incoming request logged at ' + new Date());
    next();
}

app.use(logRequest);
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello World!');
});

var collection = null;
var url = 'mongodb://localhost:27017/book_inventory_service';
var MongoClient = require('mongodb').MongoClient;
var collection = MongoClient.connect(url).then(function (db) {
    return db.collection('books');
});

app.get('/stock', function (req, res) {
    collection.
        then(function (collection) {
            return collection.find({}).toArray();
        }).
        then(function (books) {
            res.json(books);
        });
});

app.post('/stock', function (req, res) {
    collection.
        then(function (collection) {
            //throw new Error("asdfdsaf");
            return collection.updateOne({isbn: req.body.isbn}, {
                isbn: req.body.isbn,
                count: req.body.count
            }, {upsert: true});
        }).
        then(function (result) {
            res.json({isbn: req.body.isbn, count: req.body.count});
        }).catch(function (err) {
            console.error(err.stack);
            res.status(500).json({error: "Can't read the stock right now. Try again later."});
        });
});

app.use(clientError);
app.use(serverError);

function clientError(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

function serverError(err, req, res, next) {
    res.status(err.status || 500);
    console.error(err.stack);
    res.json({
        message: err.message,
        error: (process.env.NODE_ENV === 'production') ? {} : err.toString()
    });
}

module.exports = app;
