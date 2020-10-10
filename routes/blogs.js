const express = require('express');
const router = express.Router();
const Blog = require('../models/blogs');
const middleware = require('../middleware');

// Index Route
router.get('/', (req, res) => {
  Blog.find({}, (err, allBlogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render('blogs/index', { blogs: allBlogs });
    }
  });
});

// Create Route
router.post('/', middleware.isLoggedIn, (req, res) => {
  // console.log(req.body.title);
  // console.log('============');
  // console.log(req.body.title);
  const title = req.body.title;
  const image = req.body.image;
  const body = req.body.body;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newBlog = { title, image, body, author };
  Blog.create(newBlog, (err, newlyBlog) => {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyBlog);
      res.redirect('/blogs');
    }
  });
});

// New Route
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('blogs/new');
});

// Show Route
router.get('/:id', (req, res) => {
  Blog.findById(req.params.id)
    .populate('comments')
    .exec((err, foundBlog) => {
      if (err) {
        console.log(err);
      } else {
        res.render('blogs/show', { blog: foundBlog });
      }
    });
});

// Edit route
router.get('/:id/edit', middleware.checkUserBlog, (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      console.log(err);
    } else {
      res.render('blogs/edit', { blog: foundBlog });
    }
  });
});

/// Update Route
router.put('/:id', middleware.checkUserBlog, (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      req.flash('success', 'Successfully Updated!');
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

// Delete Route
router.delete('/:id', middleware.checkUserBlog, (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});

module.exports = router;
