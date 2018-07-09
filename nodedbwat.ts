var r = require('rethinkdb');
var connection = null

import { EventEmitter } from 'events';

class Table extends EventEmitter {
  dbName :string;
  tableName: string;
  data: any = [];
  filePath: string;

  public ready: boolean = false;

  constructor(dbName:string, tableName:string) {
    super();
    this.dbName = dbName;
    this.tableName = tableName;
  }

  insert(dataToInsert: any, cb:any) {
    //log("insert")
    //log(dataToInsert);
    //log(this.dbName);
    r.db(this.dbName).table(this.tableName).insert(dataToInsert).run(connection, cb)
  }

  find(filter: any, cb: any) {
    var filteredArray = [];

    r.db(this.dbName).table(this.tableName).filter(filter).run(connection, function(err, cursor) {
      if (err) throw err;
      cursor.toArray(function(err, result) {
        cb(undefined, result);
      });
    })

  }

  sample(filter, number, cb:any) {
    r.db(this.dbName).table(this.tableName).filter(filter).sample(number).run(connection, function(err, cursor) {
      if (err) throw err;
      cursor.toArray(function(err, result) {
        cb(undefined, result);
      });
    })

  }


  update(filter: any, newDbEntry: any, cb: any) {
  }

  test() {
    console.log("testing..")
  }

}

export function log(a) { console.log(a); console.log('\n'); }

var connection: any;
var tables: any;

export function NodeDB (connectionString: any, cb:any) {
    r.connect(connectionString, (err, conn) => {
      if (err) throw err;
      connection = conn;

      r.dbCreate(connectionString.dbName).run(connection, (err, result) => {
        console.log("db created..")
        //console.log(result);

        console.log("tables:")
        
        var count = connectionString.tables.length;
        console.log(count);

        for (var table of connectionString.tables) {
            console.log(table);

            r.db(connectionString.dbName).tableCreate(table).run(connection, (error, madeTable) => {
              count--;
              console.log("----")
              if (count == 0) {
                console.log("SUCCESS")       
                
                var db = [];

                var countC = connectionString.tables.length;
                for (var table of connectionString.tables) {
                  db[table] = new Table(connectionString.dbName, table);
                } //for
                cb(undefined, db);

              } //if
            }) //r.db



            // db[table] = new Table(connectionString.dbName, table, (err, result) => {
            //   
            //   if (count == 0) {
            //     console.log("SUCCESS")
            //     cb();
            //     return db;              
            //   }
            // });
            
            
          }
        })

      })

    }


export function makeid(length:number) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
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

export function getFirstKeyValue(inObj:any) {
  if (countObjectProperties(inObj) > 0) {
    for (var objKey in inObj) {
      if (inObj.hasOwnProperty(objKey)) {
        return {key:objKey, value:inObj[objKey]}
      }
    }
  } else {
    console.log("inObj has zero properties")
  }
}


export function countObjectProperties(objectToCount:any) {
  var count = 0;
  for (var key in objectToCount) {
    count++;
  }
  return count;
}

// https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
export function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a,b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}