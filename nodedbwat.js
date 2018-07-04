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
var fs = require("fs");
var events_1 = require("events");
//const EventEmitter = require('events');
var Collection = /** @class */ (function (_super) {
    __extends(Collection, _super);
    function Collection(collectionName) {
        var _this = _super.call(this) || this;
        _this.data = [];
        _this.ready = false;
        //console.log("constructing collection: "+collectionName)
        _this.name = collectionName;
        _this.data = [];
        var filePath = './db_' + _this.name + '.json';
        var fileExists = fs.existsSync(filePath);
        if (fileExists) {
            var fileData = fs.readFileSync(filePath);
            _this.data = JSON.parse(fileData.toString());
        }
        else {
            _this.data = [];
        }
        //AUTOSAVE
        setInterval(function () {
            _this.save();
        }, 30000);
        return _this;
    }
    Collection.prototype.insert = function (dataToInsert) {
        var overlay = {
            _id: makeid(64),
            _time: new Date().toISOString()
        };
        var newdata = Object.assign(overlay, dataToInsert);
        this.data.push(newdata);
        this.emit("insert", newdata);
    };
    Collection.prototype.find = function (filter, cb) {
        var filteredArray = [];
        for (var dbEntry in this.data) {
            var match = compare(this.data[dbEntry], filter);
            if (match == 0) { }
            if (match == 1) {
                filteredArray.push(this.data[dbEntry]);
            }
            if (parseInt(dbEntry) == this.data.length - 1) {
                cb(undefined, filteredArray);
            }
        }
        //console.log(this.data.length)
    };
    Collection.prototype.update = function (filter, newDbEntry, cb) {
        console.log("============");
        console.log(newDbEntry);
        console.log("============");
        var result = {
            matched: 0,
            updated: 0
        };
        if (filter == undefined) {
            console.log("filter set to undefined");
            cb();
            return;
        }
        if (newDbEntry == undefined) {
            console.log("newDbEntry set to undefined");
            cb();
            return;
        }
        try {
            for (var dbEntry in this.data) {
                var match = compare(this.data[dbEntry], filter);
                if (match == 0) { }
                if (match == 1) {
                    //filteredArray.push(this.data[dbEntry]);
                    result.matched++;
                    newDbEntry._id = makeid(64),
                        newDbEntry._time = new Date().toISOString();
                    result.updated++;
                    this.data[dbEntry] = newDbEntry;
                    console.log("entry updated.");
                    //end update
                }
                if (parseInt(dbEntry) == this.data.length - 1) {
                    cb(undefined, result);
                }
            }
        }
        catch (err) {
            console.log("ERROR IN db .update()");
            console.log(err);
            cb(err, undefined);
        }
    };
    Collection.prototype.save = function (cb) {
        var _this = this;
        fs.writeFile('./db_' + this.name + '.json', JSON.stringify(this.data, null, 2), function (err) {
            console.log('./db_' + _this.name + ".json saved.");
            if (cb) {
                cb(err);
            }
        });
    };
    Collection.prototype.wait = function (cb) {
        var done = 0;
        while (done == 0) {
            //waiiit..
            if (this.ready == true) {
                done = 1;
                cb();
            }
        }
    };
    return Collection;
}(events_1.EventEmitter));
function connect(connectionString, collectionList) {
    var db = {};
    for (var _i = 0, collectionList_1 = collectionList; _i < collectionList_1.length; _i++) {
        var collection = collectionList_1[_i];
        db[collection] = new Collection(collection);
    }
    return db;
}
exports.connect = connect;
function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
//console.log(makeid(64));
function errorHandler(err) {
    console.log("=== ERROR!===");
    console.log(err);
    console.log(" -- end of error --");
}
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
function countObjectProperties(objectToCount) {
    var count = 0;
    for (var key in objectToCount) {
        count++;
    }
    return count;
}
exports.countObjectProperties = countObjectProperties;
