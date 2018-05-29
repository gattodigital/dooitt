// required plugins
var express    = require('express');
var cors       = require('cors');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var jwt        = require('jwt-simple');
var authorization = require('./authorization');

// listen on port 3000
const port = 3000;

// require users.js + post.js
var User = require('./models/user.js');
var Post = require('./models/post.js');


// communicate backend - frontend
app.use(cors());
// exposes various factories to create middlewares
app.use(bodyParser.json());


// get and send posts to frontend
app.get('/posts/:id',  async(req, res) =>{
  var author = req.params.id
  var posts = await Post.find({author})
  res.send(posts);
});

// create messages end point
app.post('/post', (req, res) => {

  var postData = req.body
  postData.author = '5b0c540b4811ef095e29c7b1'
  var post = new Post(postData);

  post.save((err, result) => {
    if(err) {
      console.error('Saving Post Error!');
      return res.status(500).send({message: ' Saving Post causing an error!'});
    }
    res.sendStatus(200);
  })
});

// get users end point
app.get('/users', async (req, res) => {
  try {
    let users = await User.find({}, '-password -__v');
    res.send(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
  
});

// get user profiles end point
app.get('/profile/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id, '-password -__v');
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// app.post('/sign-up', authorization.signUp);

// app.post('/sign-in', authorization.signIn);

// connect mongoose to db
mongoose.connect('mongodb://dooitt-admin:QaZsEdC123456@ds235850.mlab.com:35850/dooitt',(err) => {
    if(!err) {
      console.log('connected to MongoDB');
    }
})

app.use('/authorization', authorization);

app.listen(port);