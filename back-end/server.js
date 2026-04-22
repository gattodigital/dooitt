var express       = require('express');
var cors          = require('cors');
var app           = express();
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var rateLimit     = require('express-rate-limit');
var authorization = require('./authorization');
var rateLimit     = require('express-rate-limit');

const port = process.env.PORT || 3000;

const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

var User = require('./models/user.js');
var Task = require('./models/task.js');

var corsOrigin = process.env.CORS_ORIGIN;
var corsOptions = corsOrigin
  ? { origin: corsOrigin }
  : {};
app.use(cors(corsOptions));
app.use(bodyParser.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

app.use(['/tasks', '/tasks/:id', '/users', '/profile/:id'], apiLimiter);

// post tasks to database
app.post('/tasks', async (req, res) => {
  try {
    let task = new Task(req.body);
    await task.save();
    res.sendStatus(200);
  } catch (error) {
    console.error('Error adding task:', error);
    res.sendStatus(500);
  }
});

// get tasks end point
app.get('/tasks', async (req, res) => {
  try {
    let tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// get task details
app.get('/tasks/:id', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.sendStatus(404);
    }
    res.send(task);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// get users end point
app.get('/users', async (req, res) => {
  try {
    let users = await User.find({}, '-password -__v');
    res.send(users);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// get profiles end point
app.get('/profile/:id', profileLimiter, async (req, res) => {
  try {
    let user = await User.findById(req.params.id, '-password -__v');
    if (!user) {
      return res.sendStatus(404);
    }
    res.send(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// connect mongoose to db
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/authorization', authorization);

app.listen(port, () => console.log(`Server running on port ${port}`));