const express = require('express');
const cookieParser = require('cookie-parser');
const router = express();
router.use(cookieParser());
const {
    postValidation
} = require('./validation');
const protected = require('./verifyAuth');
const PostModel = require('../models/Post');

router.get('/', protected, async (req, res) => {
    try {
        const post = await PostModel.find({
            username: req.user.username
        });

        if (!post.length) return res.render('home',{statusEmpty: 'Dont feel shy.. Go ahead write whatever on your mind', name: req.user.username});
        res.render('home',{post:post, name: req.user.username});
    } catch (err) {
        res.status(400).render('login');
    }

});

// Get all user posts
router.get('/all', protected, async (req, res, next) => {
  try {
    const posts = await PostModel.find();
    res.render('home',{posts:posts,name:req.user.username});
  } catch (err) {
    res.render('home',{status: 'No Posts found',name: req.user.username, postwait:3});
  }
});


// Get single post for edit purpose
router.get('/:id/edit', async (req, res) => {
  try {
      const post = await PostModel.findById(req.params.id);
      if(req.user.username !== post.username) return res.render('index',{status:'User mismatch', postwait:3})
      res.render('edit_status',{post:post});
  } catch (err) { 
      res.render('home', {name:req.user.username,status:'Invalid Id', postwait:3})
  }
});
// Update post using post method
router.post('/:id/edit', protected, async (req, res) => {
  try {
    const post = {
    username: req.user.username,
    title: req.body.title,
    body: req.body.body
    }

  await PostModel.findByIdAndUpdate(req.params.id, post);
  res.render('home', {name:req.user.username,status:'Post updated successfully', postwait:3})
  } catch (err) { 
  res.render('home', {name:req.user.username,status:'Invalid Id', postwait:3})
  
  }
});

// Delete post
router.get('/:id/delete', protected, async (req, res) => {
  const post = await PostModel.findById(req.params.id);
  if(req.user.username !== post.username) return res.render('index',{status:'User mismatch', postwait:3,name:req.user.username})
  try { await PostModel.findByIdAndDelete(req.params.id);
      res.render('home',{status:'blog deleted successfully', name: req.user.username,postwait:3});
  } catch (err) {
      console.log({
          message: err
      });
  }
});

router.post('/add', protected, async (req, res) => {
    const {
        error
      } = postValidation(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      try {
        const user = req.user.username,
          title = req.body.title,
          body = req.body.body;
    
        await PostModel.create({
          username: user,
          title: title,
          body: body
        });
        res.render('home', {status : `New blog created!`, name: req.user.username, postwait:3})
      } catch (err) {
        res.status(500).render('home',{status:`This blog already posted`, name: req.user.username, postwait:3});
      }
    
});


module.exports = router;