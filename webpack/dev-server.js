const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.dev.js');
const path = require('path');
const fs = require('fs');
const { localesBuilder } = require('../modules/vegas-templates');
const { xmlToLocales } = require('../modules/vegas-localization');
const FP = require('../modules/vegas-functional-programming');

FP();

const parsers = {};
module.exports = function (app, express) {

    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: '../src',
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    const localesXml = fs.readFileSync(path.resolve(__dirname, '../src/locales.xml'), 'utf8');
    const locales = xmlToLocales(localesXml);
    app.use(express.static(__dirname));

    return function response(req, res) {
        const file = middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html'), 'utf8');
        let partial;
        const [string, lang = 'it'] = (req.url || '').match(/\/([^/]*)(\/.*)/) || [];
        const locale = locales[lang] || {};
        if (locale.pages) {

            const anies = Object.keys(locale.pages).map(key => {
                return { key, value: locale.pages[key].href };
            }) || [];
            // const { key } = anies.find(({ value }) => value === req.url) || {};
            // if (fs.existsSync(path.resolve(__dirname, `../src/pages/${key}.html`))) {
            //     partial = fs.readFileSync(path.resolve(__dirname, `../src/pages/${key}.html`), 'utf8');
            // } else {
            partial = fs.readFileSync(path.resolve(__dirname, `../src/pages/home.html`), 'utf8');
            // }
        } else {
            partial = fs.readFileSync(path.resolve(__dirname, `../src/pages/home.html`), 'utf8');

        }
        const parsedFile = localesBuilder(file, locale, parsers);
        const homeContent = localesBuilder(partial, locale, parsers);
        res.write(parsedFile.replace('**content**', homeContent));
        res.end();
    };

};
