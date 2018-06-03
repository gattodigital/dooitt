var express       = require('express');
var cors          = require('cors');
var app           = express();
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var jwt           = require('jwt-simple');
var authorization = require('./authorization');

const port = 3000;

var User = require('./models/user.js');
var Task = require('./models/task.js');

app.use(cors());
app.use(bodyParser.json());

// post tasks to database
app.post('/tasks', (req, res) => {
  let taskData = req.body;
  let task = new Task(taskData);

  task.save((err, result) => {
    if(err) {
      console.log("trouble adding task");
    } else {
      res.sendStatus(200);
    }
  });
});
// get tasks end point
app.get('/tasks', async (req, res) => {
  try {
    let tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
// get task details 
app.get('/tasks/:id', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    res.send(task);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

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

// get profiles end point
app.get('/profile/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id, '-password -__v');
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// connect mongoose to db
mongoose.connect('mongodb://dooitt-admin:QaZsEdC123456@ds235850.mlab.com:35850/dooitt',(err) => {
    if(!err) {
      console.log('connected to MongoDB');
    }
})

app.use('/authorization', authorization);

app.listen(port);