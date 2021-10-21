const path = require('path');
const { body } = require('express-validator');
const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();
const Auth = require('../middleware/is-auth');
// /admin/add-product => GET
router.get('/add-product', Auth, adminController.getAddProduct);
router.post(
  '/edit-product/:id',
  [
    body('title').isLength({ min: 3 }).trim().isString(),

    body('description').isLength({ min: 5, max: 200 }),
    body('price').isNumeric().isFloat(),
  ],
  Auth,
  adminController.SaveProduct
);
router.get('/edit-product/:id', Auth, adminController.Editproduct);
// // /admin/products => GET
router.get('/products', Auth, adminController.getProducts);
// // /admin/add-product => POST
router.post(
  '/add-product',
  [
    body('title').isLength({ min: 3 }).trim().isString(),

    body('description').isLength({ min: 5, max: 200 }),
    body('price').isNumeric().isFloat(),
  ],
  Auth,
  adminController.postAddProduct
);

router.delete('/delete-product/:id', Auth, adminController.DeleteProduct);

module.exports = router;
