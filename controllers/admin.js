const Product = require('../models/product');
const fileDelete = require('../util/file');
const { validationResult } = require('express-validator');
exports.getAddProduct = async (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    edit: false,
    hasError: false,
    error: null,
  });
};
exports.SaveProduct = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  if (req.file) {
    data.imageUrl = req.file.path;
  }
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      hasError: true,
      product: {
        title: req.body.title,
        imageUrl: req.body.image,
        price: req.body.price,
        description: req.body.description,
        _id: req.body._id,
      },
      edit: true,
      error: error.array(),
    });
  }
  Product.findOne({ _id: id })
    .then(ress => {
      ress.title = data.title;
      ress.price = data.price;
      ress.description = data.description;
      if (data.imageUrl) fileDelete.deleteFile(ress.imageUrl);
      ress.imageUrl = data.imageUrl;
      ress.save();
      res.redirect('/');
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};
exports.Editproduct = async (req, res, next) => {
  const id = req.params.id;

  return Product.findById(id)
    .then(result => {
      // console.log(result);
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        product: result,
        edit: true,
        hasError: false,
        error: null,
      });
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};
exports.postAddProduct = async (req, res, next) => {
  const error = validationResult(req);
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      hasError: true,
      product: {
        title,
        image,
        price,
        description,
      },
      edit: false,
      error: [{ msg: "Image doesn't have a valid format." }],
    });
  }
  if (!error.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      hasError: true,
      product: {
        title,
        image,
        price,
        description,
      },
      edit: false,
      error: error.array(),
    });
  }

  const data = await new Product({
    title: title,
    imageUrl: req.file.path,
    price: price,
    description: description,
    userId: req.user._id,
  });

  await data
    .save()
    .then(ress => {
      return res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};

exports.getProducts = async (req, res, next) => {
  console.log(req.session.user._id, 'Asdf');
  Product.find({ userId: req.session.user._id })
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};
exports.DeleteProduct = async (req, res, next) => {
  const id = req.params.id;
  Product.findByIdAndDelete(id)
    .then(res => {
      return fileDelete.deleteFile(res.imageUrl);
    })
    .then(err => {
      return res.status(200).json({ message: 'done' });
    })
    .catch(err => {
      return res.status(404).json({ message: 'not done' });
    });
};
