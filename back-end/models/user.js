var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

const SALT_ROUNDS = 12;

// database schema objects
var userSchema = new mongoose.Schema({
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  firstName:  String,
  lastName:   String,
  resetToken: String,
  resetTokenExpiry: Date
});

userSchema.pre('save', async function(next) {
  var user = this;
  // condition to check if user had been modified
  if (!user.isModified('password'))
    return next();
  // hash user password with modern bcrypt
  try {
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

// method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// module export needs reference to schema object
module.exports = mongoose.model('User', userSchema);