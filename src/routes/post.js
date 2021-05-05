const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
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

        if (!post.length) return res.render('home',{emptyMsg: 'Dont feel shy.. Go ahead write whatever is on your mind', name: req.user.username});
        res.render('home',{post:post, name: req.user.username});
    } catch (err) {
        res.status(400).render('login',{msg:'You need authentication to access the page you are looking for.'});
    }

});

// Get all user posts
router.get('/all', protected, async (req, res, next) => {
  try {
    const posts = await PostModel.find();
    res.render('home',{posts:posts,name:req.user.username});
  } catch (err) {
    res.render('home',{msg: 'No Posts found.',name: req.user.username, postwait:3});
  }
});


// Get single post for edit purpose
router.get('/:id/edit', async (req, res) => {
  try {
      const post = await PostModel.findById(req.params.id);
      if(req.user.username !== post.username) return res.render('index',{errorMsg:'User Mismatch.',name: req.user.username, postwait:3})
      res.render('edit_status',{post:post,name: req.user.username,});
  } catch (err) { 
      res.render('home', {name:req.user.username,errorMsg:'Invalid Id.', postwait:3})
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
  res.render('home', {name:req.user.username,successMsg:'Post updated successfully.', postwait:3})
  } catch (err) { 
  res.render('home', {name:req.user.username,errorMsg:'Invalid Id.', postwait:3})
  
  }
});

// Delete post
router.get('/:id/delete', protected, async (req, res) => {
  const post = await PostModel.findById(req.params.id);
  if(req.user.username !== post.username) return res.render('index',{errorMsg:'User Mismatch', postwait:3,name:req.user.username})
  try { await PostModel.findByIdAndDelete(req.params.id);
      res.render('home',{successMsg:'Blog Deleted SUCCESSFULLY.', name: req.user.username,postwait:3});
  } catch (err) {
    res.render('home',{errorMsg:'Deletion Failed. Please try later.', name: req.user.username,postwait:3});
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
        res.render('home', {successMsg : `New blog CREATED!`, name: req.user.username, postwait:3})
      } catch (err) {
        res.status(500).render('home',{errorMsg:`This blog is already posted.`, name: req.user.username, postwait:3});
      }
    
});


module.exports = router;
