const mongoose = require('mongoose');
const router = require('express').Router();

const Post = require('../models/post.model');

router.route('/').get((req, res) => {
  Post.find()
    .then((posts) => {
      return res.json(posts);
    })
    .catch((err) => {
      return res.status(404).json(`Error: ${err}`);
    });
});

router.route('/add-post').post((req, res) => {
  const body = req.body.body;
  const likes = Number(req.body.likes);
  const dislikes = Number(req.body.dislikes);
  const comments = req.body.comments;
  const date = Date.parse(req.body.date);

  const newPost = new Post({ body, likes, dislikes, comments, date });
  newPost
    .save()
    .then(() => {
      return res.json('Post added!');
    })
    .catch((err) => {
      return res.json(`Error: ${err}`);
    });
});

router.route('/post/:id').get((req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      return res.json(post);
    })
    .catch((err) => {
      return res.status(404).json(`Error: ${err}`);
    });
});

router.route('/post/delete/:id').delete((req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => {
      return res.json('Post Deleted!');
    })
    .catch((err) => {
      return res.status(404).json(`Error: ${err}`);
    });
});

router.route('/post/:id/like').post((req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      post.likes += 1;

      post
        .save()
        .then(() => {
          return res.json('Post Liked!');
        })
        .catch((err) => {
          return res.status(404).json(`Error: ${err}`);
        });
    })
    .catch((err) => {
      return res.status(404).json(`Error: ${err}`);
    });
});

router.route('/post/:id/dislike').post((req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      post.dislikes += 1;

      post
        .save()
        .then(() => {
          return res.json('Post Disliked!');
        })
        .catch((err) => {
          return res.status(404).json(`Error: ${err}`);
        });
    })
    .catch((err) => {
      return res.status(404).json(`Error: ${err}`);
    });
});

router.route('/post/:id/comment').post((req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      const body = req.body.body;
      const likes = Number(req.body.likes);
      const dislikes = Number(req.body.dislikes);
      const date = Date.parse(req.body.date);
      const newComment = {
        body: body,
        likes: likes,
        dislikes: dislikes,
        date: date,
      };
      post.comments.push(newComment);

      post
        .save()
        .then(() => {
          return res.json('Added New Comment!');
        })
        .catch((err) => {
          return res.status(404).json(`Error: ${err}`);
        });
    })
    .catch((err) => {
      return res.status(404).json(`Error: ${err}`);
    });
});

router.route('/post/:id/comment/:commentId/like').post((req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      const updatedComments = [...post.comments];
      const index = updatedComments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );

      updatedComments[index].likes += 1;

      post.comments = updatedComments;

      post
        .save()
        .then(() => {
          return res.json('Comment Like!');
        })
        .catch((err) => {
          return res.status(404).json(`Error: ${err}`);
        });
    })
    .catch((err) => {
      return res.status(404).json(`Error: ${err}`);
    });
});

router.route('/post/:id/comment/:commentId/dislike').post((req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      const updatedComments = [...post.comments];
      const index = updatedComments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );

      updatedComments[index].dislikes += 1;

      post.comments = updatedComments;

      post
        .save()
        .then(() => {
          return res.json('Comment Dislike!');
        })
        .catch((err) => {
          return res.status(404).json(`Error: ${err}`);
        });
    })
    .catch((err) => {
      return res.status(404).json(`Error: ${err}`);
    });
});

module.exports = router;
