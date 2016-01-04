module.exports = function (stockRepository) {
    return {
        stockUp: function (req, res) {
            stockRepository.stockUp(req.body.isbn, req.body.count)
                .then(function (result) {
                    res.json({isbn: req.body.isbn, count: req.body.count});
                }).catch(function (err) {
                    console.error(err.stack);
                    res.status(500).json({error: "Can't stock up right now. Try again later."});
                });

        },
        getCount: function (req, res) {
            stockRepository.getCount(req.params.isbn).then(function (result) {
                if (result !== null) {
                    res.status(200).json({count: result});
                } else {
                    res.status(404).json({error: 'No book with ISBN: ' + req.params.isbn});
                }
                res.json({});
            });
        },
        getAvailability: function (req, res) {
            stockRepository.getCount(req.params.isbn).then(function (result) {
                if (result !== null) {
                    if (result > 0)
                        res.status(200).send("available");
                    else
                        res.status(200).send("unavailable");
                } else {
                    res.status(200).send("unavailable");
                }
                res.send("unknown");
            });
        },
        findAll: function (req, res) {
            stockRepository.findAll().then(function (books) {
                res.json(books);
            }).catch(function (err) {
                console.error(err.stack);
                res.status(500).json({error: "Can't read the stock right now. Try again later."});
            });
        },
        clientError: function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        },
        serverError: function (err, req, res, next) {
            res.status(err.status || 500);
            console.error(err.stack);
            res.json({
                message: err.message,
                error: (process.env.NODE_ENV === 'production') ? {} : err
            });
        }
    };
};