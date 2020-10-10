const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const session = require('express-session');
require('dotenv/config');

const Blog = require('./models/blogs');
const Comment = require('./models/comments');
const User = require('./models/user');

// Requring Route
const indexRoute = require('./routes/index');
const blogRoute = require('./routes/blogs');
const commentRoute = require('./routes/comments');

// App config
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to DB');
    }
  }
);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(flash());

// Passport Config
app.use(
  require('express-session')({
    secret: 'secret is secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRoute);
app.use('/blogs', blogRoute);
app.use('/blogs/:id/comments', commentRoute);

//-----Server------
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is linstening');
});
