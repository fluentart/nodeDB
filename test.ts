import { NodeDB } from './nodedbwat'

console.log("running tests:")

NodeDB({dbName: "test", host: 'localhost', port: 28015, tables: ["yourdata", "moredata"]}, dbReady);

function dbReady(err, db) {
  console.log("db ready.")

  var count = 0;
  var limit = 10000;
  var data = [];
  for (var a = 0; a <= limit; a++) {
    data.push({foo: Math.random(), bar:"asdf"});
  }

  db.brands.insert(data, (err, res) => {
    console.log(err);
    console.log(res.inserted);
  })

}

