// const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const shopController = require('../controllers/shop');
const router = express.Router();
const Auth = require('../middleware/is-auth');
router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);

// cart
router.get('/cart', Auth, shopController.getCart);
router.post('/cart', Auth, shopController.postcart);
router.post('/cart-item-delete', Auth, shopController.DeleteCart);
// orderes
router.post('/order', shopController.Addorders);
router.get('/orders', Auth, shopController.getOrders);
router.get('/orders/:invoiceId', Auth, shopController.getInvoice);

router.get('/checkout', Auth, shopController.getCheckout);

// when stripe send on it
router.get('/checkout/success', Auth, shopController.Addorders);

// when payment will cancel
router.get('/checkout/cancel', Auth, shopController.getCheckout);

router.get('/product/:id', Auth, shopController.getunique);
module.exports = router;
