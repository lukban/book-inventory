var express = require('express');
var app = express();
var bodyParser = require('body-parser');

function logRequest(req, res, next) {
    console.log('incoming request logged at ' + new Date());
    next();
}

module.exports = function(stockRepository) {
    app.use(logRequest);
    app.use(bodyParser.json());

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    var routes = require('./routes')(stockRepository);
    app.get('/stock', routes.findAll);
    app.get('/stock/:isbn', routes.getCount);
    app.post('/stock', routes.stockUp);

    app.use(routes.stockUp);
    app.use(routes.serverError);

    return app;
};
