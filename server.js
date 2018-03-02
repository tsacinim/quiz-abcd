const  express = require('express');
require('dotenv').config();
// const urlCouchDB = process.env.AD_COOUCH_HOST;
const bodyParser = require('body-parser');
const cradle = require('cradle');

var app = express();

const db = new(cradle.Connection)(
  process.env.AD_COUCH_HOST, {
    auth: { 
      username: process.env.AD_COUCH_USER, 
      password: process.env.AD_COUCH_PASS 
    }
  }).database('raeson_test');

// db.get('001', function (err, doc) {
//   if(err) console.error('error', err);
//   console.log('doc', doc);
// });

db.save('_design/stats', {
  graph: {
    map: function (doc) {
      // if (doc) { emit(doc._id, doc.quizChoice, doc); }
      emit(doc);
    }
  }
});

// db.remove("_design/example", function (err, res) {
//   if(err) console.error('error', err);
//   console.log('res', res);
// });

db.view('stats/graph', function (err, res) {
  if(err) console.error('error', err);
  res.forEach(function (row) {
    console.log("row: %s", JSON.stringify(row));
    // ?include_docs=true
  });
});

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.get("/graph.html", function (request, response) {
  response.sendFile(__dirname + '/views/graph.html');
});

app.post("/answer", function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  db.save(req.body, function (err, data) {
    if(err) console.error('error', err);
    res.json(data);
  });
}); 

app.get("/stats", function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  db.temporaryView({
    map: function (doc) {
      if (doc) emit(doc);
    }
  }, function (err, data) {
    if (err) console.log(err);
    console.log(data);
    res.json(data);
  });  
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
