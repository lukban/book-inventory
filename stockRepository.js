var url = 'mongodb://localhost:27017/book_inventory_db';
var MongoClient = require('mongodb').MongoClient;
var connection = MongoClient.connect(url);

module.exports = function () {
    return {
        findAll: function () {
            return connection.then(function (db) {
                return db.collection('books').find({}).toArray();
            });
        },
        stockUp: function (isbn, count) {
            return connection.then(function (db) {
                return db.collection('books').updateOne({isbn: isbn}, {
                    isbn: isbn,
                    count: count
                }, {upsert: true});
            });
        },
        getCount: function (isbn) {
            return connection.then(function (db) {
                return db.collection('books').find({"isbn": isbn}).limit(1).next();
            }).then(function (result) {
                if (result) {
                    return result.count;
                }
                return null;
            });
        }
    };
};