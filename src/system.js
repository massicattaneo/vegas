import FP from 'vegas-functional-programming';
import Em from 'vegas-event-emitter';
import { Stack, Middleware } from 'vegas-utils';

const em = Em();
const stack = Stack();

FP();

let i = 0;
const removeA = setInterval
    .argumentsOrder(1, 0)
    .partial(200)
    .map(function () {
        return i++;
    })
    .debounce(2000)
    .subscribe(console.log.partial('A'));

const removeB = em.on
    .partial('event')
    .subscribe(function (a) {
        return a;
    });

clearInterval(removeA);

// console.log(em.emit('event', 2));
// removeB();
// em.emit('event', 2);

Function.wrap(10)
    .map(i => i * 3)
    .subscribe(console.log); //30

const twenty = Function.wrap(10)
    .map(i => [i * 2, i * 3, i * 4])
    .spread()
    .subscribe(Function.identity());
console.log(twenty); //20

stack.add(function (next) {
    this.i = 1.5;
    next();
});
stack.exe(function (next) {
    console.log(this.i); //1.5
    next();
});

const three = Function.wrap(stack.context())
    .destructure('i')
    .map(i => i * 2)
    .subscribe(Function.identity());
console.log(three); //3

stack.exe.map(function () {
    return this.i;
}).subscribe(console.log.partial('D'));

function Sender() {
    return {
        post: function (a, b, next) {
            console.log('pepe', a, this);
        }
    };
}

const sender = Middleware('post', Sender());
sender.before(function (req, res, next) {
    this.req = req;
    this.res = res;
    next('a');
});
sender.post({}, {});
