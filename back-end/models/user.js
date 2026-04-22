var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');

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
    // hash user password with salt rounds of 10
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// module export needs reference to schema object
module.exports = mongoose.model('User', userSchema);