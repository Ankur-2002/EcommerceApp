const crypto = require('crypto');
const user = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const sendgrid = require('nodemailer-sendgrid-transport');
const nodemailer = require('nodemailer');
// const user = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: {
      api_key:
        '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',
    },
  })
);
exports.getLogin = (req, res, next) => {
  // const msg = req.flash('error');
  const Error = validationResult(req);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    error: req.flash('error'),
    oldData: {
      email: '',
      password: '',
    },
    Errors: [],
  });
};

exports.postLogin = async (req, res, next) => {
  // res.setHeader('Set-Cookie', 'isLoggedin = true');
  const password = req.body.password;
  const email = req.body.email;
  const Error = validationResult(req);
  console.log(Error.array());
  await user
    .findOne({ email: email })
    .then(result => {
      if (!result) {
        req.flash('error', 'Something went wrong');
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          error: req.flash('error'),
          oldData: {
            email: req.body.email,
            password: req.body.password,
          },
          Errors: [...Error.array()],
        });
      }
      bcrypt
        .compare(password, result.password)
        .then(bool => {
          if (!bool) {
            return res.status(422).render('auth/login', {
              path: '/login',
              pageTitle: 'Login',
              error: 'Incorrect password',
              oldData: {
                email: req.body.email,
                password: req.body.password,
              },
              Errors: [...Error.array(), { param: 'password' }],
            });
          }
          req.session.isLogin = true;
          req.session.user = result;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/');
        });
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
  // req.session.AM = true;
};
exports.logout = async (req, res, next) => {
  await req.session.destroy(ress => {
    console.log(ress);
    res.redirect('/');
  });
};
exports.signup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    error: req.flash('error'),
    oldData: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    Errors: [],
  });
};
exports.Postsignup = async (req, res, next) => {
  // const users = new user(req.body);
  const error = validationResult(req);
  console.log(error.array());
  if (!error.isEmpty()) {
    return res.status(422).render('auth/Signup', {
      path: '/signup',
      pageTitle: 'Signup',
      error: error.array()[0].msg,
      oldData: {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
      Errors: error.array(),
    });
  }

  const password = req.body.password;
  const email = req.body.email;
  const cart = { items: [] };
  await bcrypt
    .hash(password, 12)
    .then(password => password)
    .then(async password => {
      const data = await new user({
        password,
        email,
        cart,
      });

      return await data.save();
    })
    .then(async result => {
      return await transporter.sendMail({
        to: email,
        from: 'ankurchaurasia002@gmail.com',
        subject: 'successfull 🍎 ',
        html: '<div><span>My image</span></div>',
      });
    })
    .then(re => {
      return req.session.save(() => {
        return res.redirect('/login');
      });
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};

exports.resetPassword = (req, res, next) => {
  res.render('auth/reset', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    error: req.flash('error'),
  });
};

exports.genResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) return res.redirect('/login');
    const Token = buffer.toString('hex');
    user
      .findOne({ email: req.body.email })
      .then(result => {
        if (!result) {
          req.flash('error', 'Account not exists.');
          return res.redirect('/reset');
        }
        result.passwordToken = Token;
        result.expirationTime = Date.now() + 3606600;
        return result.save();
      })
      .then(response => {
        transporter
          .sendMail({
            to: req.body.email,
            from: 'ankurchaurasia002@gmail.com',
            subject: 'Can your password now',
            html: `
          <p>Your request has been accepted.</p>
          <p>Please change your password. click this link to change your password</p>
          <a href="http://localhost:3000/new-password/?token=${Token}">Click here</a>
          `,
          })
          .then(re => {
            req.flash(
              'error',
              'Your request has been accpected. please check your email account'
            );
            return res.redirect('/reset');
          });
      })
      .catch(err => {
        const error = new Error('Error occured');
        error.HttpStatus = 500;
        return next(error);
      });
  });
};
exports.getNewpassword = (req, res, next) => {
  const token = req.query.token;
  user
    .findOne({ passwordToken: token, expirationTime: { $gt: Date.now() } })
    .then(result => {
      if (!result) {
        return res.redirect('/reset');
      }
      return res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'new-password',
        isAuthenticated: false,
        error: req.flash('error'),
        userId: result._id.toString(),
        token: result.passwordToken,
      });
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};
exports.setResetPassword = (req, res, next) => {
  console.log(req.body);
  return user
    .findOne({
      passwordToken: req.body.token,
      expirationTime: { $gt: Date.now() },
      _id: req.body.userId,
    })
    .then(result => {
      return bcrypt.hash(req.body.newPassword, 12).then(ress => {
        result.password = ress;
        result.passwordToken = undefined;
        result.expirationTime = undefined;
        return result.save();
      });
    })
    .then(result => {
      req.flash('error', 'Your password has been updated');
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error('Error occured');
      error.HttpStatus = 500;
      return next(error);
    });
};
