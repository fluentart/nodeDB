import * as fs from 'fs'
import { EventEmitter } from 'events';
//const EventEmitter = require('events');
 
class Collection extends EventEmitter {
  name: string;
  data: any = [];
  public ready: boolean = false;

  constructor(collectionName:string) 
  {
    super();
    //console.log("constructing collection: "+collectionName)
    this.name = collectionName;
    this.data = [];

    var filePath = './db_'+this.name+'.json'

    var fileExists = fs.existsSync(filePath);
    if (fileExists) {
      var fileData = fs.readFileSync(filePath);
      this.data = JSON.parse(fileData.toString());
    } else {
      this.data = [];
    }
    
    //AUTOSAVE
    setInterval(() => {
      this.save();
    },30000);
  }

  insert(dataToInsert:any) {
    var overlay = {
      _id : makeid(64),
      _time : new Date().toISOString(),
    }
    
    var newdata = Object.assign(overlay, dataToInsert);
    this.data.push(newdata);
    this.emit("insert", newdata);
    
  }

  find(filter: any, cb:any) {
    var filteredArray = [];


    for (var dbEntry in this.data) 
    {
      var match = compare(this.data[dbEntry], filter);
      if (match == 0) {}
      if (match == 1) { filteredArray.push(this.data[dbEntry]);}

      if ( parseInt(dbEntry) == this.data.length - 1) {
        cb(undefined, filteredArray);
      }

    }

    //console.log(this.data.length)
    
  }

  update(filter:any, newDbEntry: any, cb:any) {
    console.log("============")
    console.log(newDbEntry);
    console.log("============")


    var result = {
      matched:0,
      updated:0
    }
    
    if (filter == undefined) { console.log("filter set to undefined"); cb(); return; }
    if (newDbEntry == undefined) { console.log("newDbEntry set to undefined"); cb(); return;  }

    try {
        for (var dbEntry in this.data) 
        {
          var match = compare(this.data[dbEntry], filter);
          if (match == 0) {}
          if (match == 1) { 
            //filteredArray.push(this.data[dbEntry]);
            result.matched++;
            
            newDbEntry._id = makeid(64),
            newDbEntry._time = new Date().toISOString()
            result.updated++;
            this.data[dbEntry] = newDbEntry;
            console.log("entry updated.")
            //end update
          }

          if ( parseInt(dbEntry) == this.data.length - 1) {
            cb(undefined, result);
          }

        }
    } catch (err) { console.log("ERROR IN db .update()"); console.log(err); cb(err, undefined); }
  }

  save(cb?:any) {
    fs.writeFile('./db_'+this.name+'.json', JSON.stringify(this.data, null, 2), (err) => {
      console.log('./db_'+this.name+".json saved.")
      if (cb) {cb(err);}
    });
  }

  wait(cb:any) {
    var done = 0;
    while (done == 0) {
      //waiiit..
      if (this.ready == true) { done = 1; cb() }  
    }
    
  }
}


export function connect(connectionString:any, collectionList:any) {
  var db : any = {};
  for (var collection of collectionList) {
    db[collection] = <Collection> new Collection(collection)
  }
  return db
}



function makeid(length:number) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

//console.log(makeid(64));


function errorHandler(err:Error) {
  console.log("=== ERROR!===");
  console.log(err);
  console.log(" -- end of error --")
}


export function compare(dbObject:any, filter:any) {
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
  } else { return 0; }

  
}

export function countObjectProperties(objectToCount:any) {
  var count = 0;
  for (var key in objectToCount) {
    count++;
  }
  return count;
}