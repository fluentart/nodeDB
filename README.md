# node db wat
purely minimalist node only database inspired by the mongo interface. warning not production tested.

# goals

- small efficient codebase
- high throughput atomic writes to disc/network (only write new data to disc)
- no write corruption on master data even during unexpected errors/faults.
- optional automatic passthrough to replicate or loadbalance

# install

```
npm install nodedbwat
```

# todo

many many things.

# usage:

```javascript

// LOAD/CREATE DATABASE(S)
var nodedbwat = require("nodedbwat");
var db = nodedbwat.connect("", ["mydb", "anotherdb"]);

// SUBSCRIBE TO DB INSERT EVENTS FOR A REALTIME FEED
db.mydb.on("insert", function (entry) {
    
    // LOGS OUT EVENT
    console.log("insert event:");
    console.log(entry);
    
    // SAVE TO SSD
    db.mydb.save(); 

    // FIND DATA
    db.mydb.find({ car: "BAKKIE" }, function (err, results) {
        console.log(results);
    });

});

// INSERTS DATA
db.mydb.insert({ name: "KOOS", age: Math.round(Math.random() * 120), car: "BAKKIE" });
```

# build:

```
tsc *.ts --lib 'ES2015' -w
```

# reference
```javascript
// CONNECT
var nodeDBwat = require('nodedbwat');
var db = nodeDBwat.connect("", ["brands", "models", "stats"], {dbPath:__dirname})

/*
connect(peerIps[], collections[], options?)

options = {
  dbPath: "./db" ,          // set the folder relative of abolute
                            // use __dirname to get the current path
}
*/

```
----------------------------------

```javascript
// INSERT DATA
var somedata = { foo : "bar", peep : "poop", a : [1,2,3] }

db.mydb.insert(somedata)
```
----------------------------------

```javascript
// FIND DATA BY FILTERING
db.mydb.find({peep:"poop"}, (err, result) => { 
  console.log(result); 
})
```

----------------------------------

```javascript
// FIND AND UPDATE 
db.mydb.update({peep:"poop"}, {bar:"foo"} , (err, result) => { 
  console.log(result); 
})
```

----------------------------------

```javascript
// SAVE TO db_mydb.json FILE
db.mydb.save((err) => { 
  console.error(err); 
})
```