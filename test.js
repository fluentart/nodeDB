"use strict";
exports.__esModule = true;
var nodeDB = require("./nodedbwat");
console.log("running tests:");
var db = nodeDB.connect("", ["mydb", "anotherdb"]);
db.mydb.on("insert", function (entry) {
    console.log("insert event:");
    console.log(entry);
    db.mydb.save();
    db.mydb.find({ car: "BAKKIE" }, function (err, results) {
        console.log(results);
    });
});
db.mydb.insert({ name: "KOOS", age: Math.round(Math.random() * 120), car: "BAKKIE" });
