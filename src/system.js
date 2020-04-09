import FP from 'vegas-functional-programming';
import EventEmitter from 'vegas-utils/EventEmitter';
import Middleware from 'vegas-utils/Middleware';
import Thread from 'vegas-utils/Thread';
import Stack from 'vegas-utils/Stack';
import * as rx from 'vegas-utils/Reactive';
import { Node } from 'vegas-dom';
import { xmlToJson } from 'vegas-xml';
import htmlTemplate from './template.html';
import { componentsHandler, handlebarBuilder, localesBuilder } from 'vegas-templates';
import localesXml from './locales.xml';
import { xmlToLocales } from 'vegas-localization';
import { currency, string } from './shared';
import { createComponents } from '../modules/vegas-dom';

//IMPORT STATEMENTS FOLDER
const STATEMENTS = require.context('./statements/', true, /.js/);
const statements = {};
STATEMENTS.keys().forEach((filename) => {
    statements[filename.replace('./', '').replace('.js', '')] = STATEMENTS(filename).default;
});

const em = EventEmitter();
const stack = Stack();

FP(Function);

const locales = xmlToLocales(localesXml);
console.warn(locales);

window.test = function () {
    console.warn(this);
};
/** TODO: xmlParsing && template creation (vegas-template) */
const store = rx.create({
    url: '',
    lang: 'en',
    balance: 200,
    list: [
        { id: 'ME', items: [1, 2] },
        { id: 'YOU', items: [3, 4] }
    ],
    names: ['a', 'b', 'c']
});

// window.v = store;


// const parsers = { currency, string };
//
// const { html, style } = componentsHandler(handlebarBuilder(localesBuilder(htmlTemplate, locales[store.lang], parsers), store, parsers), components, parsers);
// console.log(html, style)
// const app = document.getElementById('app');
// document.head.appendChild(Node(`<style>${style}</style>`));
// app.innerHTML = html;
// const cmpList = createComponents(app, components, { store, rx, parsers });


// const addAndDouble = add.compose(multiply.partial(2));
// console.log(addAndDouble(20, 3, 1)); //48

// console.log(xmlToJson(template));


// let i = 0;
// const removeA = setInterval
//     .argumentsOrder(1, 0)
//     .partial(200)
//     .map(function () {
//         return i++;
//     })
//     .debounce(2000)
//     .subscribe(console.log.partial('A'));
//
// const removeB = em.on
//     .partial('event')
//     .subscribe(function (a) {
//         return a;
//     });
//
// clearInterval(removeA);
//
// // console.log(em.emit('event', 2));
// // removeB();
// // em.emit('event', 2);
//
// Function.wrap(10)
//     .map(i => i * 3)
//     .subscribe(console.log); //30
//
// const twenty = Function.wrap(10)
//     .map(i => [i * 2, i * 3, i * 4])
//     .spread()
//     .subscribe(Function.identity());
// console.log(twenty); //20
//
// stack.add(function (next) {
//     this.i = 1.5;
//     next();
// });
// stack.exe(function (next) {
//     console.log(this.i); //1.5
//     next();
// });
//
// const three = Function.wrap(stack.context())
//     .destructure('i')
//     .map(i => i * 2)
//     .subscribe(Function.identity());
// console.log(three); //3
//
// stack.exe.map(function () {
//     return this.i;
// }).subscribe(console.log.partial('D'));
//
// function Sender() {
//     return {
//         post: function (req, res, next) {
//             console.log('post', req);
//             next();
//         },
//         send: function (params) {
//             console.log('send');
//             // next();
//         }
//     };
// }
//
// const origin = Sender();
// const sender = Middleware('send', Middleware('post', origin));
// sender.beforePost(function (req, res, next) {
//     req.body = {};
//     next();
// });
// sender.afterPost(function (req, res, next) {
//     console.log(this);
// });
// sender.post({}, {});

// setInterval
//     .argumentsOrder(1, 0)
//     .partial(0)
//     .map(() => i++)
//     .queue()
//     .subscribe(function (a) {
//         console.log(a);
//         return new Promise(r => setTimeout(r, 500));
//     });

// Array.prototype
//     .forEach
//     .bind([0, 1, 2, 3])
//     .map(i => [i + 1, i + 2])
//     .spread()
//     .queue()
//     .subscribe(function me(a, b, queue) {
//         return Promise.resolve();
//     });

// function add(...args) {
//     return args.reduce((ret, i) => ret + i, 0);
// }
//
// function multiply(...args) {
//     return args.reduce((ret, i) => ret * i, 1);
// }
//

/** STORE */
// const a = rx.create(1);
// const b = rx.create(2);

// rx.use(store1, function use1(s, next) {
//     s.a = 23;
//     setTimeout(next, 3500);
// });

// rx.use({ a }, function use2({ a }, next) {
//     console.log('step1');
//     setTimeout(next, 3500);
// });
// rx.use({ a }, function use2({ a }, next) {
//     console.log('step2');
//     a.update(a + 3);
//     setTimeout(next, 3500);
// });
//
// a.set(2)
//     .subscribe(function () {
//         console.log(a + 30);
//         a.set(a + 30);
//     });
//
// store.url.set('beta')
//     .promise()
//     .then(function () {
//         console.log('AFTER PROMISE', store.url.get());
//     });
//
// rx.use({ a }, function ({ a }, next) {
//     a.update(a * 2); //5
//     console.warn('step3', a.get());
//     next();
// });
//
// rx.use({ b }, function ({ b }, next) {
//     b.update(b * 2); //8
//     next();
// });

// rx.use({ b }, function ({ b }, next) {
//     b.update(b + 5);
//     next();
// });

// const disconnect = rx.connect({ a, b }, function ({ a, b }) {
//     console.log('CONNECT', a + b);
// });


// b.set(300);
// disconnect();
// a.set(1);

const shared = rx.create({ a: 1 });
const thread1 = Thread(statements, shared, { numberOfWorkers: 1 });
const thread2 = Thread(statements, shared);
const thread3 = Thread(statements, shared);

thread1
    .catch
    .map(function ({ message }) {
        return [`[${this.threadName}]`, message];
    })
    .spread()
    .subscribe(console.warn);

thread1.worker('pow', function () {
    return [234];
}).map(a => a)
    .subscribe(console.log);

thread1.main('load', function () {
    return { url: 'http://localhost:8095/assets/images/apple-touch-icon.png', type: 'image' };
}).subscribe(console.log);

// (async function f() {
//     const time = Date.now();
//     Promise.all([
//         thread2.worker('loop', () => 2000000000).promise(),
//         thread3.worker('loop', () => 2000000000).promise()
//     ]).then(function (res) {
//         console.log('different threads', Date.now() - time, res);
//     });
//
//
//     const time1 = Date.now();
//     const res = await Promise.all([
//         thread1.worker('loop', () => 2000000000).promise(),
//         thread1.worker('loop', () => 2000000000).promise()
//     ]);
//     console.log('same threads', Date.now() - time1, res);
// })();

// thread1
//     .worker('loop', () => 2000000000)
//     .subscribe(a => console.log(a));
//
// thread1
//     .worker('loop', () => 2)
//     .subscribe(a => console.log(a));

// (async function () {
//     thread2.worker('loop', () => [2000000000, 2]).promise().then(console.log);
//     thread2.worker('loop', () => [20000000, 2]).promise().then(console.log);
//     thread1.worker('loop', () => [200000000, 2]).promise().then(console.log);
//     thread1.worker('loop', () => [2000000, 2]).promise().then(console.log);
// })();

// thread1.worker('loop', function () {
//     return [200000000, 2];
// }).subscribe(function () {
//     console.log(this);
// });

// (async function f() {
//     for (let a = 0; a < 10; a++)
//         await thread1.main('add', function () {
//             return [a, 2];
//         });
// })();
//
// (async function f() {
//     for (let a = 0; a < 10; a++)
//         await thread2.main('add', function () {
//             return [a, 2];
//         });
// })();
//
// XSLT



