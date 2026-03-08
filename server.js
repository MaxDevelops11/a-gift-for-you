// library imports
const express = require("express");
const nedb = require("@seald-io/nedb");
const bodyParser = require("body-parser");

// app setting
const app = express()
const urlEncodedParser = bodyParser.urlencoded({extended: true})

// db setup
let db = new nedb({
  filename: "database.txt", 
  autoload: true
});

// middleware setup for express application
app.use(express.static('public'));
app.use(urlEncodedParser);
app.set("view engine", "ejs");


// ***************************
// app.get functions
// ***************************
app.get('/', (req, res) => {
    res.render('greeting.ejs');
});

app.get('/home', (req, res) => {
    res.render('index.ejs');
});

app.get('/hyped', (req, res) => {
    res.render('hyped.ejs');
});

app.get('/reward-hyped', (req, res) => {
    res.render('reward-hyped.ejs');
});

app.get('/loved', (req, res) => {
    res.render('loved.ejs');
});

app.get('/memory', (req, res) => {
  res.render('memory.ejs');
});

app.get('/reward-loved', (req, res) => {
  res.render('reward-loved.ejs');
});

app.get('/self-love', (req, res) => {  // Randomly pull a self-love message
    // return all objects in the database
    db.find({}, (err, docs) => {
      if (err) {
        console.error(err);
    } else if (docs.length > 0) {
        const randomDoc = docs[Math.floor(Math.random() * docs.length)];
        res.render('self-love.ejs', { message: randomDoc.message });
      } else {
        res.render('self-love.ejs', { message: "You haven't written anything yet... but you are still loved!" });
      }
    });
  });


// Handle submission (saving self-love message)
app.post('/hyped', (req, res) => {
    const message = req.body.message;
    if (message && message.trim() !== "") {
      db.insert({message}, (err, newDoc) => {
        if (err) console.error(err);
        res.redirect('/reward-hyped'); // go to reward
      });
    } else {
      res.redirect('/hyped'); // If no message typed
    }
});


//app listening
app.listen(6001, () => {
    console.log("http://127.0.0.1:6001/");
})