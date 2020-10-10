const Comment = require('../models/comments');
const Blog = require('../models/blogs');

module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'You must be signed in to do that!');
    res.redirect('/login');
  },
  checkUserBlog: (req, res, next) => {
    if (req.isAuthenticated()) {
      Blog.findById(req.params.id, (err, blog) => {
        if (blog.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have permission to do that!');
          console.log('BADD!!!');
          res.redirect('/blogs/' + req.params.id);
        }
      });
    } else {
      req.flash('error', 'You need to be signed in to do that!');
      res.redirect('/login');
    }
  },
  checkUserComment: (req, res, next) => {
    console.log('YOU MADE IT!');
    if (req.isAuthenticated()) {
      Comment.findById(req.params.commentId, (err, comment) => {
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have permission to do that!');
          res.redirect('/blogs/' + req.params.id);
        }
      });
    } else {
      req.flash('error', 'You need to be signed in to do that!');
      res.redirect('login');
    }
  },
};
