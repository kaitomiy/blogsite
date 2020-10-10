const express = require('express');
const router = express.Router({ mergeParams: true });
const Blog = require('../models/blogs');
const Comment = require('../models/comments');
const middleware = require('../middleware');

// Comments New
router.get('/new', middleware.isLoggedIn, (req, res) => {
  console.log(req.params.id);
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { blog: blog });
    }
  });
});

// Comments Create
router.post('/', middleware.isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
          res.redirect('/blogs');
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          blog.comments.push(comment);
          blog.save();
          console.log(comment);
          req.flash('success', 'Created a comment!');
          res.redirect('/blogs/' + blog._id);
        }
      });
    }
  });
});

// Comments Edit
router.get('/:commentId/edit', middleware.checkUserComment, (req, res) => {
  Comment.findById(req.params.commentId, (err, comment) => {
    if (err) {
      coneolse.log(err);
    } else {
      res.render('comments/edit', { blog_id: req.params.id, comment: comment });
    }
  });
});

// Comment Update
router.put('/:commentId', middleware.checkUserComment, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.commentId,
    req.body.comment,
    (err, comment) => {
      if (err) {
        res.render('edit');
      } else {
        res.redirect('/blogs/' + req.params.id);
      }
    }
  );
});

// Comment Delete
router.delete('/:commentId', middleware.checkUserComment, (req, res) => {
  Comment.findByIdAndRemove(req.params.commentId, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

module.exports = router;
