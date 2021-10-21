const mongoose = require('mongoose');
const Products = require('./product');
const schema = mongoose.Schema;
const User = new schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordToken: String,
  expirationTime: String,
  cart: {
    items: [
      {
        productId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});
User.methods.ClearCart = function () {
  this.cart.items = [];
  return this.save();
};
User.methods.getCart = function () {
  const ids = this.cart.items.map(item => item.productId);
  const data = Products.find({
    _id: { $in: [...ids] },
  });
};
User.methods.AddTocart = function (product) {
  const cart = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  if (cart === -1) {
    this.cart.items.push({
      productId: product._id,
      quantity: 1,
    });
  } else {
    var item = this.cart.items[cart];
    item = {
      productId: mongoose.mongo.ObjectId(item.productId.toString()),
      quantity: item.quantity + 1,
    };

    this.cart.items[cart] = item;
  }
  // console.log(this.cart);
  return this.save();
};
User.methods.DeleteCart = function (id) {
  const Productes = this.cart.items?.filter(
    item => item._id.toString() !== id.toString()
  );
  // console.log(Productes, 'Ankur is one the coder in the world');
  this.cart.items = Productes;
  return this.save();
};

module.exports = mongoose.model('User', User);
// const xyz = new User({

// const _db = require('../util/database').db;
// const mongo = require('mongodb');
// class user {
//   constructor(username, email, cart, id) {
//     (this.username = username), (this.email = email);
//     this.cart = cart;
//     this._id = id;
//   }
//   save() {
//     const db = _db();
//     return db
//       .collection('user')
//       .insertOne(this)
//       .then(result => result)
//       .catch(err => err);
//   }
//   Addtocart(product) {
//     const db = _db();
//     console.log('YES YES YES', product);
//     var newq = 1;
//     var item = [];
//     if (this.cart != undefined) {
//       item = [...this.cart.items];
//     }
//     const index = item.findIndex(
//       value => value.productID.toString() === product._id.toString()
//     );
//     if (index === -1) {
//       item.push({
//         productID: new mongo.ObjectId(product._id),
//         quatity: newq,
//       });
//     } else {
//       newq = item[index].quatity + 1;
//       item[index] = { ...item[index], quatity: newq };
//     }

//     return db.collection('user').updateOne(
//       {
//         _id: new mongo.ObjectId(product.userID),
//       },
//       {
//         $set: { cart: { items: item } },
//       }
//     );
//   }
//   static findByid(id) {
//     const db = _db();
//     return db
//       .collection('user')
//       .findOne({
//         _id: mongo.ObjectId(id),
//       })
//       .then(result => {
//         return result;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   getCart() {
//     const id = this._id;
//     const prodIds = this.cart.items.map(i => i.productID);
//     const items = this.cart.items;
//     console.log(items, 'IIIIIIIIIIIIIIIIIIIIIIIIIIII');
//     const db = _db();
//     return db
//       .collection('Products')
//       .find({
//         _id: { $in: [...prodIds] },
//       })
//       .toArray()
//       .then(res => {
//         // return res;
//         return res.map(i => {
//           return {
//             ...i,
//             quatity: items.find(k => {
//               if (k.productID.toString() === i._id.toString()) return k.quatity;
//             }).quatity,
//           };
//         });
//       })
//       .catch(err => console.log(err));
//   }

//   DeleteCart(id) {
//     const db = _db();
//     var items = this.cart.items;
//     items = items.filter(i => i.productID.toString() !== id.toString());

//     return db.collection('user').updateOne(
//       {
//         _id: new mongo.ObjectId(this._id),
//       },
//       {
//         $set: { cart: { items: items } },
//       }
//     );
//   }

//   PlaceOrder() {
//     const db = _db();
//     return this.getCart()
//       .then(product => {
//         const order = {
//           items: product,
//           user: {
//             username: this.username,
//             _id: new mongo.ObjectId(this._id),
//           },
//         };
//         return db.collection('order').insertOne(order);
//       })
//       .then(ress => {
//         this.cart = [];
//         return db.collection('user').updateOne(
//           {
//             _id: new mongo.ObjectId(this._id),
//           },
//           {
//             $set: { cart: { items: [] } },
//           }
//         );
//       });
//   }
//   getOrder() {
//     const db = _db();
//     return db
//       .collection('order')
//       .find({
//         user: {
//           _id: this._id,
//         },
//       })
//       .then(res => {
//         console.log(res);
//         return res;
//       })
//       .catch(er => console.log(er));
//   }
// }

// module.exports = user;
