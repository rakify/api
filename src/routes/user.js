const cookieParser                                         = require('cookie-parser');
const bcrypt                                               = require('bcrypt');
const jwt                                                  = require('jsonwebtoken');
const UserModel                                            = require('../models/User');
const protected                                            = require('./verifyAuth');
const {
  registerValidation,
  loginValidation
}                                                          = require('./validation');
const express                                              = require('express');
const router                                               = express();
router.use(cookieParser());


router.post('/register', async (req, res, next) => {
  const {
    error
  } = registerValidation(req.body);
  if (error) return res.render('register',{msg:error.details[0].message});
  try {
    const user = req.body.username,
      pw = req.body.password,
      mail = req.body.email;

    const hashedPw = await bcrypt.hash(pw, 10);
    await UserModel.create({
      username: user,
      password: hashedPw,
      email: mail
    });
    res.render('login', {msg: 'Account created. You may login now.'});
  } catch (err) {
    console.log(err);
    res.render('register',{msg:'Username exists!'});
  }
});



router.post('/login', async (req, res, next) => {
  const {
    error
  } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const name = req.body.username,
      pw = req.body.password;
    const user = await UserModel.findOne({
      username: name
    });
    if (user == null) return res.render('login',{msg:'Cannot find user. Remember username is case-sensitive'});
    if (await bcrypt.compare(pw, user.password)) {
      //   ..... further code to maintain verifyAuthentication like jwt or sessions
      const token = jwt.sign({
        username: user.username
      }, process.env.Secret_Key, {
        expiresIn: '1h'
      });
      res.cookie('jwt',token, { httpOnly: true,  expires: new Date(Date.now() + 1 * 3600000) }).redirect('/home');
            
    } else {
      res.render('login',{msg:'Wrong password. Remember password is case-sensitive'});
    }
  } catch (error) {
    console.log(error);
    res.render('login',{msg:'Server is under maintenance. Please come back after a while.'});
  }
});


module.exports = router;