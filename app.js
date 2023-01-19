const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const auth = require('./routes/auth');
const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

app.set('view engine', 'ejs');
app.set('views', 'views');
const store = new MongoStore({
  uri: 'mongodb+srv://ankur:ankur@shopping.oqsyn.mongodb.net/shop?retryWrites=true&w=majority',
  collection: 'sessions',
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  )
    cb(null, true);
  else cb(null, false);
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'image');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toDateString() +
        new Date().getTime().toString() +
        '-' +
        file.originalname
    );
  },
});

const csurfInit = csurf({});
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use(flash());
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csurfInit);
app.use(async (req, res, next) => {
  // console.log(req.session, 'from app');

  if (!req.session.user) next();
  else
    await User.findById(req.session?.user?._id)
      .then(result => {
        if (!result) return next();
        req.user = result;
        next();
      })
      .catch(err => {
        const error = new Error('New Error');
        error.HttpStatus = 500;
        next(error);
      });
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLogin;
  res.locals.csrf = req.csrfToken();
  next();
});
mongoose
  .connect(
    'mongodb+srv://ankur:ankur@shopping.oqsyn.mongodb.net/shop?retryWrites=true&w=majority'
  )
  .then(res => {
    User.findOne().then(result => {
      if (!result) {
        const user = new User({
          name: 'Ankur',
          email: 'Email@gmai.com',
        });
        user.save();
      }
    });
    app.listen(process.env.PORT);
  })
  .catch(err => {
    console.log(err);
  });

app.use('/admin', adminRoutes);
app.use(auth);
app.use(shopRoutes);
app.use(errorController.get404);
app.get('/500', (req, res) => {
  return res.status(500).render('500', {
    pageTitle: 'Page not found',
    path: '500',
    productCSS: true,
    activeAddProduct: true,
  });
});
// if any Backend or frontend error ocurred it move to this page auto - matically
app.use((error, req, res, next) => {
  console.log(error);
  return res.status(error?.HttpStatus || 500).render('500', {
    pageTitle: 'Page not found',
    path: '500',
    productCSS: true,
    activeAddProduct: true,
    isAuthenticated: false,
  });
});

// // sql.sync().then(res => user.findByPk(1).then(res => res.destroy()));
// // make a foreign key
// product.belongsTo(user, { constraints: true, onDelete: 'CASCADE' });
// user.hasMany(product);
// // sync your sql models to
// sql
//   .sync()
//   .then(result => {
//     return user.findByPk(1);
//     // console.log(result);
//   })
//   .then(result => {
//     if (!result) {
//       return user.create({
//         name: 'ankur',
//         email: 'ankurchaurasia29@gmail.com',
//         password: 'new',
//       });
//     } else {
//       return result;
//     }
//   })
//   .then(result => {
//     console.log(result);
//     app.listen(3000);
//   });
