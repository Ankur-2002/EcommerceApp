// // const sequelize = require('sequelize');
// // const sql = require('../util/database');
// // const product = sql.define('product', {
// //   id: {
// //     type: sequelize.INTEGER,
// //     allowNull: false,
// //     autoIncrement: true,
// //     primaryKey: true,
// //   },
// //   title: sequelize.STRING,
// //   price: {
// //     allowNull: false,
// //     type: sequelize.DOUBLE,
// //   },
// //   imageUrl: {
// //     type: sequelize.STRING,
// //     allowNull: false,
// //   },
// //   description: {
// //     type: sequelize.STRING,
// //     allowNull: false,
// //   },
// // });
// // module.exports = product;
// const _db = require('../util/database').db;
// const mongodb = require('mongodb');
// class Product {
//   constructor(id, title, imageUrl, description, price, userID) {
//     (this.imageUrl = imageUrl),
//       (this.description = description),
//       (this.price = price),
//       (this.title = title);
//     this.userID = userID;
//   }

//   save() {
//     const db = _db();
//     // console.log(_db());
//     db.collection('Products')
//       .insertOne(this)
//       .then(result => {})
//       .catch(err => {
//         console.log(err);
//       });
//   }
//   static find() {
//     const db = _db();
//     // mongoDB give the cursor pointer to first document and go through all documents
//     // that is why we are using toArray() to get all data

//     return db
//       .collection('Products')
//       .find()
//       .toArray()
//       .then(res => {
//         // console.log(res);
//         return res;
//       })
//       .catch(err => console.log(err));
//   }
//   static findById(id) {
//     const db = _db();
//     return db
//       .collection('Products')
//       .find({ _id: mongodb.ObjectId(id) })
//       .next()
//       .then(res => {
//         return res;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
//   static deleteOne(id) {
//     const db = _db();
//     return db
//       .collection('Products')
//       .deleteOne({
//         _id: mongodb.ObjectId(id),
//       })
//       .then(res => {
//         return res;
//       })
//       .catch(err => console.log(err));
//   }
//   static edit(id, data) {
//     const db = _db();
//     console.log(data);
//     return db.collection('Products').updateOne(
//       {
//         _id: mongodb.ObjectId(id),
//       },
//       {
//         $set: { ...data, _id: mongodb.ObjectId(id) },
//         // _id: mongodb.ObjectId(id),
//       }
//     );
//   }
// }

// module.exports = Product;
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Product = new schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'User',
  },
});

const Products = mongoose.model('Product', Product);
module.exports = Products;
