const { Client } = require("pg");

const client = new Client({
  user: "raphael",
  password: "root",
  host: "localhost",
  database: "namegator",
  port: 5432
})

client.connect();

// client.query("select * from namegator.item", function (err, res) {
//   console.log(res);
// })

exports.execute = function (query, values) {
  return new Promise(function (resolve, reject) {
    client.query(query, values, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows);
      }
    })
  })
}