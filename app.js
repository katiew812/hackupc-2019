var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var DB_USER = 'admin';
var DB_PASSWORD = 'mosJrPLOO5vAfaak';
var DB_HOST = 'cluster0-tr6sd.mongodb.net';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var Message = mongoose.model("Message",{ name : String, message : String})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://" + DB_USER + ":" + DB_PASSWORD + "@" + DB_HOST + "/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  if (err) {
    throw err;
  }
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log("connected fam")
  client.close();
});

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });

  //Axios HTTP request
  const axios = require('axios')

  const getBreeds = () => {
    try {
      return axios.get('https://dog.ceo/api/breeds/list/all')
    } catch (error) {
      console.error(error)
    }
  }

  const countBreeds = async () => {
    const breeds = getBreeds()
      .then(response => {
        if (response.data.message) {
          console.log(
            `Got ${Object.entries(response.data.message)} breeds`
          )
        }
      })
      .catch(error => {
        console.log(error)
      });
  }

  countBreeds();
  console.log("Here");
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save(err =>{
    if (err) {
      sendStatus(500);
    }
    res.sendStatus(200);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;