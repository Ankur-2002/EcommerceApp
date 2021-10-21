const express = require('express');
const authController = require('../controllers/auth');
const { check, body } = require('express-validator');
const user = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter valid email')
      .custom((value, { req }) => {
        return true;
      })
      .normalizeEmail()
      .trim(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password should be 6 character long')
      .trim(),
  ],
  authController.postLogin
);
router.post('/logout', authController.logout);

router.get('/signup', authController.signup);
router.post(
  '/signup',

  [
    check('email')
      .isEmail()
      .normalizeEmail()
      .trim()
      .custom((value, { req }) => {
        return user.findOne({ email: value }).then(result => {
          if (result !== null) {
            return Promise.reject('Email already exist');
          }
          return true;
        });
      }),
    check(
      'password',
      'Please check password field. the password should be greater than 6 character and Alphanumeric.'
    )
      .isLength({ min: 7 })
      .isAlphanumeric()
      .trim(),

    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password have to match');
        }
        return true;
      }),
  ],
  authController.Postsignup
);
router.get('/reset', authController.resetPassword);
router.post('/reset', authController.genResetPassword);
router.get('/new-password', authController.getNewpassword);
router.post('/newpassword', authController.setResetPassword);
module.exports = router;
