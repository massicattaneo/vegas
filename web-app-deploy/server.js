const adminKeys = require('./private/adminKeys');
const path = require('path');
const fs = require('fs');
const detector = require('spider-detector');
const express = require('express');
const port = process.env.PORT || 8095;
const app = express();
const isDeveloping = process.env.NODE_ENV === 'development';
const Mongo = require('./mongo');
const bodyParser = require('body-parser');
const ExpressBrute = require('express-brute');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
const fileUpload = require('express-fileupload');
const http = require('http');
const WebSocket = require('ws');

function requiresAdmin(req, res, next) {
    next();
}

(async function () {
    const mongo = Mongo(isDeveloping, { wss: { broadcast: e => e } });
    const { store, db } = await mongo.connect();
    const bruteforce = new ExpressBrute(store, { freeRetries: 6, minWait: 500, maxWait: 60 * 1000, lifetime: 2 * 60 });
    app.use(fileUpload());
    app.use(detector.middleware());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({
        cookie: { path: '/', httpOnly: true, secure: false, maxAge: Date.now() + (30 * 24 * 60 * 60 * 1000) },
        secret: adminKeys.sessionSecret,
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({ db: db })
    }));
    app.use(compression());

    app.get('/api/rest/*',
        requiresAdmin,
        async function (req, res) {
            const path = decodeURI(req.url).substr(10, 1000000).split('?');
            mongo.rest.get(path[0], path[1])
                .then(function (cash) {
                    res.send(cash);
                })
                .catch(function (err) {
                    res.status(500);
                    res.send(err.message);
                });
        });

    app.post('/api/rest/*',
        requiresAdmin,
        async function (req, res) {
            const paths = req.url.split('/');
            const table = paths[paths.length - 1];
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            mongo.rest.insert(table, Object.assign(req.body, { ip }))
                .then(function (cash) {
                    res.send(cash);
                })
                .catch(function (err) {
                    res.status(500);
                    res.send(err.message);
                });
        });

    app.put('/api/rest/*',
        requiresAdmin,
        async function (req, res) {
            const paths = req.url.split('/');
            const table = paths[paths.length - 2];
            const id = paths[paths.length - 1];
            mongo.rest.update(table, id, req.body)
                .then(function (cash) {
                    res.send(cash);
                })
                .catch(function (err) {
                    res.status(500);
                    res.send(err.message);
                });
        });

    app.delete('/api/rest/*',
        requiresAdmin,
        async function (req, res) {
            const paths = req.url.split('/');
            const table = paths[paths.length - 2];
            const id = paths[paths.length - 1];
            mongo.rest.delete(table, id)
                .then(function (cash) {
                    res.send(cash);
                })
                .catch(function (err) {
                    res.status(500);
                    res.send(err.message);
                });
        });

    app.get('/api/upload/*',
        requiresAdmin,
        async function (req, res) {
            const path = decodeURIComponent(req.url.replace('/api/upload/', ''));
            // const file = await dropbox.download(path);
            // res.type('pdf');
            // res.end(file.fileBinary, 'binary');
        });

    app.post('/api/upload',
        requiresAdmin,
        async function (req, res) {
            // const name = req.files.fileUpload.name;
            // const ext = path.extname(name);
            // google.upload(name, req.files.fileUpload.data, ext).then(async function (googleRef) {
            //     const file = await mongo.rest.insert('uploads', { name, ext, googleRef });
            //     res.send(file);
            // }).catch(console.log);
        });

    app.delete('/api/upload/:id',
        requiresAdmin,
        async function (req, res) {
            // const id = req.params.id;
            // const file = await mongo.rest.delete('uploads', id);
            // await google.delete(file.googleRef);
            // res.send(file);
        });

    if (isDeveloping) {
        app.get('*', require('../webpack/dev-server')(app, express));
        console.log('hola');
    } else {
        app.use(express.static(__dirname + '/static', {
            maxage: 365 * 24 * 60 * 60 * 1000,
            etag: false
        }));
        const content = fs.readFileSync(path.join(__dirname, 'static/templates/index.html'), 'utf8');
        app.get('*', function response(req, res) {
            res.write(content);
            res.end();
        });
    }

    http.createServer(app).listen(port, () => {
        console.log('http server running at ' + port);
    });

})();
