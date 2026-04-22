var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');

var SALT_ROUNDS = 12;

// database schema objects
var userSchema = new mongoose.Schema({
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  firstName:  String,
  lastName:   String
});

userSchema.pre('save', async function(next) {
  var user = this;
  // condition to check if user had been modified
  if (!user.isModified('password'))
    return next();
  try {
    var hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// module export needs reference to schema object
module.exports = mongoose.model('User', userSchema);