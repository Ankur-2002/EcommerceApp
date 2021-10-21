const Product = require('../models/product');
const user = require('../models/user');
const Order = require('../models/Order');
const fs = require('fs');
const path = require('path');
const Pdf = require('pdfkit');
const stripe = require('stripe')(
  'sk_test_51JlVavSD5rX3MT7WIyF1mV2V6fd0a7kQVHXWpqGu4JJOWSrSoP4VtjsUH9JE2JeDqwFiKAv3OmSz6Vedh5LLruKR00JzoziceN'
);
// const Cart = require('../models/cart');
// const cart = require('../models/cart');
// const user = require('../models/user');
const SKIP_ORDER_PER_PAGE = 2;
exports.getProducts = (req, res, next) => {
  const skip = req.query.page ? req.query.page : 1;
  let total = 0;
  Product.find()
    .count()
    .then(number => {
      total = number;
      return Product.find()
        .skip((skip - 1) * SKIP_ORDER_PER_PAGE)
        .limit(SKIP_ORDER_PER_PAGE);
    })
    .then(products => {
      return res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        current: skip,
        nextpage: +skip + 1,
        prevpage: +skip - 1,
        hasnext: +skip * SKIP_ORDER_PER_PAGE < +total,
        hasprev: +skip > 1,
        lastpage: Math.ceil(+total / +SKIP_ORDER_PER_PAGE),
      });
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};

exports.getIndex = async (req, res, next) => {
  const skip = req.query.page ? req.query.page : 1;

  let total = 0;
  Product.find()
    .count()
    .then(number => {
      total = number;
      return Product.find()
        .skip((skip - 1) * SKIP_ORDER_PER_PAGE)
        .limit(SKIP_ORDER_PER_PAGE);
    })
    .then(products => {
      return res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        current: skip,
        nextpage: +skip + 1,
        prevpage: +skip - 1,
        hasnext: +skip * SKIP_ORDER_PER_PAGE < +total,
        hasprev: +skip > 1,
        lastpage: Math.ceil(+total / +SKIP_ORDER_PER_PAGE),
      });
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};

exports.getCart = async (req, res, next) => {
  user
    .findById(req.user._id)
    .populate('cart.items.productId', 'title')
    .then(prod => {
      return res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        product: prod.cart.items,
      });
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};
exports.Addorders = async (req, res, next) => {
  console.log(req, 'when stripe come');
  req.user
    .populate('cart.items.productId')
    .then(er => {
      const order = new Order({
        products: er.cart.items.map(item => {
          return {
            product: {
              ...item.productId,
            },
            quantity: item.quantity,
          };
        }),

        user: {
          email: req.user.email,
          userId: req.user._id,
        },
      });
      return order.save();
    })
    .then(ress => {
      return req.user.ClearCart();
    })

    .then(Res => {
      return res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};
exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(er => {
      const product = er.map(item => {
        return { _id: item._id, product: item.products };
      });

      res.render('shop/order', {
        path: '/orders',
        pageTitle: 'Your Orders',
        order: product,
      });
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  var total = 0;
  var products;
  user
    .findById(req.user._id)
    .populate('cart.items.productId')
    .then(prod => {
      products = prod.cart.items;
      prod.cart.items.map(i => {
        total += i.productId.price * i.quantity;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: products.map(p => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            // price: p.productId._id,
            amount: p.productId.price * 100,
            currency: 'INR',
            quantity: +p.quantity,
          };
        }),
        success_url:
          req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
      });
    })
    .then(session => {
      console.log(session);
      return res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        product: products,
        total: total,
        sessionId: session.id,
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};

exports.getunique = (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Product.findById(id)
    .then(props => {
      res.render('shop/product-detail', {
        path: '/products',
        pageTitle: 'Your Orders',
        products: props,
      });
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};
exports.postcart = async (req, res, next) => {
  await Product.findById(req.body.id)
    .then(result => {
      return req.user.AddTocart(result);
    })
    .then(ress => {
      return res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};

exports.DeleteCart = (req, res, next) => {
  const data = req.body.id;

  req.user
    .DeleteCart(data)
    .then(ress => {
      return res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const OrderId = req.params.invoiceId;
  const url = path.join('data', `invoice-${OrderId}.pdf`);

  Order.findById(OrderId)
    .then(order => {
      console.log(order, 213123);
      console.log(req.user);
      if (!order) return next(new Error('No Order Found'));

      if (order.user.userId.toString() !== req.user._id.toString())
        return next(new Error('No Order Found'));
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=ankur.pdf');
      // const file = fs.createReadStream(url);
      const file = new Pdf();
      file.text(`OrderID : #${order._id}`, {
        underline: true,
        align: 'center',
        lineGap: 25,
      });

      order.products.map((i, index) => {
        file.moveDown();
        file.text(
          `Order ${index}  ${i.product.title} ${i.product.price} X ${i.quantity}`,
          {
            lineGap: 10,
          }
        );
        file.image(i.product.imageUrl, {
          align: 'center',
          valign: 'center',
          width: 200,
          height: 150,
          cover: [200, 150],
          link: 'www.google.com',
        });
      });
      // file.addPage().fontSize(32).text('new Page');
      file.end();
      file.pipe(res);

      // console.log(file, 'ankur');
      // if (!file) return next(err);
      // file.pipe(res);

      // fs.readFile(url, (err, data) => {
      //   res.send(data);
      // });
    })
    .catch(err => {
      return next(err);
    });
};
