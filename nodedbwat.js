"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var r = require('rethinkdb');
var connection = null;
var events_1 = require("events");
var Table = /** @class */ (function (_super) {
    __extends(Table, _super);
    function Table(dbName, tableName) {
        var _this = _super.call(this) || this;
        _this.data = [];
        _this.ready = false;
        _this.dbName = dbName;
        _this.tableName = tableName;
        return _this;
    }
    Table.prototype.insert = function (dataToInsert, cb) {
        //log("insert")
        //log(dataToInsert);
        //log(this.dbName);
        r.db(this.dbName).table(this.tableName).insert(dataToInsert).run(connection, cb);
    };
    Table.prototype.find = function (filter, cb) {
        var filteredArray = [];
        r.db(this.dbName).table(this.tableName).filter(filter).run(connection, function (err, cursor) {
            if (err)
                throw err;
            cursor.toArray(function (err, result) {
                cb(undefined, result);
            });
        });
    };
    Table.prototype.sample = function (filter, number, cb) {
        r.db(this.dbName).table(this.tableName).filter(filter).sample(number).run(connection, function (err, cursor) {
            if (err)
                throw err;
            cursor.toArray(function (err, result) {
                cb(undefined, result);
            });
        });
    };
    Table.prototype.update = function (filter, newDbEntry, cb) {
    };
    Table.prototype.test = function () {
        console.log("testing..");
    };
    return Table;
}(events_1.EventEmitter));
function log(a) { console.log(a); console.log('\n'); }
exports.log = log;
var connection;
var tables;
function NodeDB(connectionString, cb) {
    r.connect(connectionString, function (err, conn) {
        if (err)
            throw err;
        connection = conn;
        r.dbCreate(connectionString.dbName).run(connection, function (err, result) {
            console.log("db created..");
            //console.log(result);
            console.log("tables:");
            var count = connectionString.tables.length;
            console.log(count);
            for (var _i = 0, _a = connectionString.tables; _i < _a.length; _i++) {
                var table = _a[_i];
                console.log(table);
                r.db(connectionString.dbName).tableCreate(table).run(connection, function (error, madeTable) {
                    count--;
                    console.log("----");
                    if (count == 0) {
                        console.log("SUCCESS");
                        var db = [];
                        var countC = connectionString.tables.length;
                        for (var _i = 0, _a = connectionString.tables; _i < _a.length; _i++) {
                            var table = _a[_i];
                            db[table] = new Table(connectionString.dbName, table);
                        } //for
                        cb(undefined, db);
                    } //if
                }); //r.db
                // db[table] = new Table(connectionString.dbName, table, (err, result) => {
                //   
                //   if (count == 0) {
                //     console.log("SUCCESS")
                //     cb();
                //     return db;              
                //   }
                // });
            }
        });
    });
}
exports.NodeDB = NodeDB;
function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
exports.makeid = makeid;
function compare(dbObject, filter) {
    var filterKeys = countObjectProperties(filter);
    var dbObjectKeys = countObjectProperties(filter);
    var countMatch = 0;
    for (var filterKey in filter) {
        if (dbObject.hasOwnProperty(filterKey)) {
            if (dbObject[filterKey] == filter[filterKey]) {
                countMatch++;
            }
        }
    }
    if (countMatch == filterKeys) {
        return 1;
    }
    else {
        return 0;
    }
}
exports.compare = compare;
function getFirstKeyValue(inObj) {
    if (countObjectProperties(inObj) > 0) {
        for (var objKey in inObj) {
            if (inObj.hasOwnProperty(objKey)) {
                return { key: objKey, value: inObj[objKey] };
            }
        }
    }
    else {
        console.log("inObj has zero properties");
    }
}
exports.getFirstKeyValue = getFirstKeyValue;
function countObjectProperties(objectToCount) {
    var count = 0;
    for (var key in objectToCount) {
        count++;
    }
    return count;
}
exports.countObjectProperties = countObjectProperties;
// https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
}
exports.dynamicSort = dynamicSort;
