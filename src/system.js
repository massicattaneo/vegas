import FP from 'vegas-functional-programming';
import Em from 'vegas-event-emitter';
import { Middleware, Stack } from 'vegas-utils';
import { Node } from 'vegas-dom';
import Reactive from 'vegas-reactive';
import { xmlToJson } from 'vegas-xml';
import htmlTemplate from './template.html';
import { componentsHandler, handlebarBuilder, localesBuilder } from '../modules/vegas-templates';
import localesXml from './locales.xml';
import { xmlToLocales } from 'vegas-localization';
import { createComponents } from '../modules/vegas-dom';

//IMPORT STATEMENTS FOLDER
const STATEMENTS = require.context('./statements/', true, /.vue/);
const statements = {};
STATEMENTS.keys().forEach((filename) => {
    statements[filename.replace('./', '').replace('.vue', '')] = STATEMENTS(filename).default;
});

//IMPORT STATEMENTS FOLDER
const COMPONENTS = require.context('./components/', true, /.vue/);
const components = {};
COMPONENTS.keys().forEach((filename) => {
    components[filename.replace('./', '').replace('.vue', '')] = COMPONENTS(filename);
});


const em = Em();
const stack = Stack();
const rx = Reactive();

FP();

const locales = xmlToLocales(localesXml);
console.log(localesBuilder('<div>[[footer.trentino.href]]</div>', locales.it, {}))
// console.log(locales);
//
//
// /** TODO: xmlParsing && template creation (vegas-template) */
// const store = rx.create({
//     url: '',
//     lang: 'en',
//     balance: 200,
//     list: [
//         { id: 'ME', items: [1, 2] },
//         { id: 'YOU', items: [3, 4] }
//     ],
//     names: ['a', 'b', 'c']
// });
//
// window.v = store;
//
// function currency(value, symbol) {
//     return `${Number(value).toFixed(2)}${symbol || '€'}`;
// }
//
// function string(value, type) {
//     return value.toString()[type]();
// }
//
// function reactive(value, param, parse) {
//     const id = (reactive._id || 0) + 1;
//     reactive._id = id;
//
//     function react({ i }) {
//         if (document.getElementById(`rx_${id}`))
//             document.getElementById(`rx_${id}`).innerHTML = parse(i);
//     }
//
//     rx.connect({ i: () => store[param] }, react);
//     setTimeout(() => react({ i: store[param] }), 0);
//     return `<span id="rx_${id}">${value}</span>`;
// }
//
// const parsers = { currency, reactive, string };
//
// const { html, style } = componentsHandler(handlebarBuilder(localesBuilder(htmlTemplate, locales[store.lang], parsers), store, parsers), components, parsers);
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
//         post: function (a, b, next) {
//             console.log('pepe', a, this);
//         }
//     };
// }
//
// const sender = Middleware('post', Sender());
// sender.before(function (req, res, next) {
//     this.req = req;
//     this.res = res;
//     next('a');
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
// const store = rx.create({ a: 1 });
//
// rx.use(store, function (s, next) {
//     s.a = 23;
//     setTimeout(next, 3500);
// });

// rx.use(store, function (s, next) {
//     console.log('USE CONTEXT', this);
//     setTimeout(next, 500);
// });
//
// rx.set(store, 'a', 2)
//     .subscribe(function () {
//         console.log('AFTER SET', store.a, this);
//     });
//
// rx.set(store, 'a', 4)
//     .promise()
//     .then(function () {
//         console.log('AFTER PROMISE', store.a);
//     });
//
// rx.connect(store, function (s) {
//     console.log('CONNECT CONTEXT', this);
//     console.log('CONNECT', s.a);
// });

// store.a = 3;
//
//
// rx.use(store, function (s, next) {
//     s.a = 4;
//     next();
// });
//
// rx.connect(store, function ({ a }) {
//     console.log('VALUE1 ', a);
// });


// (async function f() {
//     const a = await Promise.all(rx.set(store, 'a', 2));
//     console.log(a);
// })();
