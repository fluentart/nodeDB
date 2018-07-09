"use strict";
exports.__esModule = true;
var nodedbwat_1 = require("./nodedbwat");
console.log("running tests:");
nodedbwat_1.NodeDB({ dbName: "test", host: 'localhost', port: 28015, tables: ["yourdata", "moredata"] }, dbReady);
function dbReady(err, db) {
    console.log("db ready.");
    var count = 0;
    var limit = 10000;
    var data = [];
    for (var a = 0; a <= limit; a++) {
        data.push({ foo: Math.random(), bar: "asdf" });
    }
    db.brands.insert(data, function (err, res) {
        console.log(err);
        console.log(res.inserted);
    });
}
