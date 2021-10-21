// // // const sql = require('mysql2');

// // // const pool = sql.createPool({
// // //   host: 'localhost',
// // //   user: 'root',
// // //   password: 'nirankari@123',
// // //   database: 'EMPLOYEES',
// // // });

// // // // because it's is async file
// // // module.exports = pool.promise();
// // const sequelize = require('sequelize');
// // //------------------------ database  --- username --- password
// // const sql = new sequelize('EMPLOYEES', 'root', 'nirankari@123', {
// //   dialect: 'mysql',
// //   host: 'localhost',
// //   // database:''
// // });
// // module.exports = sql;

// const mongodb = require('mongodb');
// const mongoClient = mongodb.MongoClient;
// var _db;
// const MongoClient = callback => {
//   mongoClient
//     .connect(
//       'mongodb+srv://ankur:ankur@shopping.oqsyn.mongodb.net/shop?retryWrites=true&w=majority'
//     )
//     .then(clientInstance => {
//       _db = clientInstance.db();
//       callback(clientInstance);
//     })
//     .catch(err => console.log(err));
// };
// const db = () => {
//   if (_db) return _db;
//   else return Error('NO DATABASE');
// };
// exports.db = db;
// exports.MongoClient = MongoClient;
// const Product = require('../models/product');
// console.log()
