var _ = require('lodash');

var heroin = require('heroin-js');

var configurator = heroin(process.env.HEROKU_API_TOKEN, {debug: false});

configurator.export('bookinventory501').then(function(result) {
    console.log(result);
});

var baseConfig = require('./base.js');

var config = _.merge( {}, baseConfig, require( "./" + process.env.HOST_ENV + ".js" ) )

configurator(config);