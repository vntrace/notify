// The framework
var express = require('express');

var env = process.env.NODE_ENV || 'development';

module.exports = function(app, config) {
    // TODO: what is this shit ?
    app.set('showStackError', true);

    app.use(express.compress({
        filter: function(req, res){
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    app.use(express.static(config.root+'/public'));

    if (process.env.NODE_ENV !== 'test') {
        app.use(express.logger('dev'));
    }

    app.set('views', config.root + '/app/views');
    app.set('view engine', 'ejs');

    app.configure(function(){

        app.use(function(req, res, next) {
            res.locals.env = process.env.NODE_ENV;
            next();
        });

        // parse cookie
        app.use(express.cookieParser());
        // parse request body
        app.use(express.bodyParser());
        app.use(express.methodOverride());

        // bind req to view
        app.use(function(req, res, next){
            res.locals.req = req;
            next();
        });

        // title and app name
        app.use(function(req, res, next){
            res.locals.appName = 'Gate';
            res.locals.title = 'Notify';
            next();
        });

        app.use(app.router);
    
        // error-handling
        app.use(function(err, req, res, next){
            if(env === "development") {
                console.log(err);
            }
            res.status(500).send('Some shjt happen');
        });

        // 404 not found
        app.use(function(req, res, next){
            res.status(404).send('Who\'s let the dog out ?');
        });
    });

    app.configure('development', function(){
        app.locals.pretty = true;
    });

    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://notify.me");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
};