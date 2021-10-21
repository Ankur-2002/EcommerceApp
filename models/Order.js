const { Timestamp } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    email: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
});
module.exports = mongoose.model('order', Order);
// const fs = require('fs');
// const path = require('path');
// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   'data',
//   'cart.json'
// );
// module.exports = class cart {
//   static addProduct(id, price) {
//     fs.readFile(p, (err, content) => {
//       let cart = { product: [], cartPrice: 0 };
//       if (!err) {
//         cart = JSON.parse(content);
//       }
//       // existing cart
//       const existing = cart.product.find(item => item.id === id);
//       let newProduct;
//       if (existing) {
//         newProduct = { ...existing };
//         newProduct.qty = newProduct.qty + 1;
//         newProduct.price = +price;
//         const index = cart.product.findIndex(item => item.id === id);
//         cart.product[index] = { ...newProduct };
//       } else {
//         newProduct = { qty: 1, id: id, price: +price };
//         cart.product.push(newProduct);
//       }
//       cart.cartPrice += +price;
//       fs.writeFile(p, JSON.stringify(cart), err => {
//         if (err) console.log(err);
//       });
//     });
//   }

//   static DeleteItem(id) {
//     fs.readFile(p, (err, content) => {
//       let cart = JSON.parse(content);
//       let cost = 0,
//         qty = 0;
//       cart.product = cart.product.filter(item => {
//         if (item.id !== id) return item;
//         else if (item.id === id) {
//           cost = +item.price;
//           qty = +item.qty;
//         }
//       });
//       cart.cartPrice -= cost * qty;
//       fs.writeFile(p, JSON.stringify(cart), err => {
//         if (err) console.log(err);
//       });
//     });
//   }
//   static getCart(cb) {
//     fs.readFile(p, (err, content) => {
//       let cart;
//       if (!err) {
//         cart = JSON.parse(content);
//       }
//       cb(cart);
//     });
//   }
// };
