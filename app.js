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
MongoClient.connect(url, function (err, db) {
    collection = db.collection('books');

    //setTimeout(() => {collection = db.collection('books')}, 10000);

    // better option: app.get, app.post registration goes here
});

app.get('/stock', function (req, res) {
    return collection.find({}).toArray(function (err, docs) {
        res.json(docs);
    });
});

app.post('/stock', function (req, res) {
    var isbn = req.body.isbn;
    var count = req.body.count;

    collection.updateOne(
        {isbn: isbn},
        {
            isbn: isbn,
            count: count
        },
        {upsert: true});


    res.json({isbn: isbn, count: count});
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
