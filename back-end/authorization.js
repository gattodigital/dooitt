var bcrypt  = require('bcrypt-nodejs');
var jwt     = require('jwt-simple');
var User    = require('./models/user.js');
var express = require('express');
var router  = express.Router();

// post SIGN UP data to web service
router.post('/sign-up', (req, res) => {
  let userData = req.body;
  console.log(userData)
  let user     = new User(userData);

  user.save((err, newUser) => {
    if(err) {
      return res.status(401).send({ message: 'ERROR in registration!' });
    } else {
      // create token
      let payload = { sub: newUser._id };

      // token variable
      let token = jwt.encode(payload, '123');

      res.status(200).send({token});
    }
  })
})

// post SIGN IN data to web service
router.post('/sign-in', async (req, res) => {
  let userData = req.body;
  let user = await User.findOne({ email:userData.email });

  if(!user) {
    return res.status(401).send({ message: 'ALERT: Invalid e-mail or password!' });
  }

  // ecnrypt password and compare to database
  bcrypt.compare(userData.password, user.password, (err, isMatch) => {
    if(!isMatch) {
      return res.status(401).send({ message: 'ALERT: Invalid e-mail or password!' });
    }
    // create token
    let payload = { sub: user._id };

    // token variable
    let token = jwt.encode(payload, '123');

    res.status(200).send({token});
  })
})

module.exports = router;
