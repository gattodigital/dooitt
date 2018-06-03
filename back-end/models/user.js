var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// database schema objects
var userSchema = new mongoose.Schema({
  email:      String,
  password:   String,
  firstName:  String,
  lastName:   String
});

userSchema.pre('save', function(next) {
  var user = this
  // condition to check if user had been modified
  if(!user.isModified('password'))
    return next()
  // hash user password
  bcrypt.hash(user.password, null, null, (err, hash) => {
  user.password = hash
  next();
  });
});

// module export needs reference to schema object
module.exports = mongoose.model('User', userSchema);