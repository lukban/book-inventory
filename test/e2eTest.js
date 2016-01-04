var request = require('supertest');
var assert = require('assert');
var repository = require("../inMemoryStockRepository")();
var app = require('../app.js')(repository);
describe('Book inventory', function () {
    it('allows to stock up the items', function (done) {
        request(app).post('/stock').send({
            "isbn": "1234567890",
            "count": 10
        }).set('Content-Type', 'application/json').
            expect('Content-Type', /json/).
            expect(200).
            end(function (err, res) {
                if (err) return done(err);
                assert.equal(res.body.isbn, "1234567890");
                done();
            });
    });

    it('allows to check book count by ISBN', function (done) {
        repository.stockUp('1234567890', 20).then(function () {
            request(app)
                .get('/stock/1234567890')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.count, 20);
                    done();
                });
        });
    });
});