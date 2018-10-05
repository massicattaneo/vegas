const access = require('./private/mongo-db-access');
const MongoClient = require('mongodb').MongoClient;
const MongoStore = require('express-brute-mongo');
const text = process.env.APP_CONFIG || JSON.stringify(access.config);
const config = JSON.parse(text);
const ObjectID = require('mongodb').ObjectID;

function getObjectId(id) {
    try {
        return new ObjectID(id);
    } catch (e) {
        return e;
    }
}

function clean(o) {
    return Object.keys(o).reduce(function (ret, key) {
        ret[key] = o[key];
        if (typeof ret[key] === 'string') {
            ret[key] = o[key].trim();
        }
        if (key.indexOf('Id') !== -1 && o[key] !== '' && o[key].length <= 40) {
            try {
                ret[key] = getObjectId(o[key]);
            } catch (e) {
                ret[key] = o[key];
            }
        }
        return ret;
    }, {});
}

module.exports = function (isDeveloping, {}) {
    const obj = {};
    const url = isDeveloping ? `mongodb://localhost:27017/vegas` : `mongodb://${config.mongo.user}:${encodeURIComponent(access.password)}@${config.mongo.hostString}`;
    let db;

    obj.connect = function () {
        return new Promise(function (res, rej) {
            const store = new MongoStore(async function (ready) {
                const client = await MongoClient.connect(url);
                db = client.db('vegas')
                ready(db.collection('bruteforce-store'));
                res({ store, db });
            });
        });
    };

    obj.rest = {
        get: function (table, filter = '') {
            const find = {};
            const filters = filter.split('&');
            filters.forEach(f => {
                if (f.indexOf('>') !== -1) {
                    const tmp = f.split('>');
                    find[tmp[0]] = find[tmp[0]] || {};
                    find[tmp[0]]['$gt'] = Number(tmp[1]);
                }
                if (f.indexOf('<') !== -1) {
                    const tmp = f.split('<');
                    find[tmp[0]] = find[tmp[0]] || {};
                    find[tmp[0]]['$lt'] = Number(tmp[1]);
                }
                if (f.indexOf('=') !== -1) {
                    const tmp = f.split('=');
                    if (tmp[0].toLowerCase().indexOf('id') !== -1) {
                        try {
                            find[tmp[0]] = getObjectId(tmp[1]);
                        } catch (e) {
                            find[tmp[0]] = tmp[1];
                        }
                    } else {
                        find[tmp[0]] = tmp[1];
                    }
                }
            });
            return new Promise(async function (resolve, rej) {
                db.collection(table).find(find).toArray(function (err, result) {
                    if (err) return rej(new Error('generic'));
                    resolve(result);
                });
            });
        },
        insert: function (table, body) {
            return new Promise(async function (resolve, rej) {
                db.collection(table).insertOne(clean(body), function (err, res) {
                    if (err)
                        rej(new Error('dbError'));
                    else {
                        const data = Object.assign({ _id: res.insertedId }, body);
                        const type = `insert-rest-${table}`;
                        wss.broadcast(JSON.stringify({ type, data }));
                        resolve(data);
                    }
                });
            });
        },
        update: function (table, id, body) {
            return new Promise(async function (resolve, rej) {
                db
                    .collection(table)
                    .findOneAndUpdate(
                        { _id: getObjectId(id) },
                        { $set: clean(body) },
                        { returnOriginal: false },
                        function (err, r) {
                            if (err) return rej(new Error('generic'));
                            if (r.value === null) return rej(new Error('generic'));
                            const type = `update-rest-${table}`;
                            wss.broadcast(JSON.stringify({ type, data: r.value }));
                            resolve(r.value);
                        });
            });
        },
        delete: function (table, id) {
            return new Promise(async function (resolve, rej) {
                const item = await obj.rest.get(table, `_id=${id}`);
                db.collection(table).remove({ _id: getObjectId(id) }, function (err, res) {
                    if (err)
                        rej(new Error('dbError'));
                    else {
                        const type = `delete-rest-${table}`;
                        wss.broadcast(JSON.stringify({ type, data: item[0] }));
                        resolve(item[0]);
                    }
                });
            });
        }
    };

    return obj;
};
