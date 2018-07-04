import * as nodeDB from './nodeDB'

var db : any = nodeDB.connect("", ["mydb", "anotherdb"]);

db.mydb.on("insert", (entry:any) => {
  console.log("insert event:")
  console.log(entry);
  db.mydb.save();

  db.mydb.find({car:"BAKKIE"}, (err:Error, results:any) => {
    console.log(results);
  })
})

db.mydb.insert({name:"KOOS", age:Math.round(Math.random()*120), car:"BAKKIE"})