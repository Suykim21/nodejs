const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express(); // Init App
let Article = require('./models/article'); // bring in the models
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection; // connobj used to create and retrieve models
db.once('open', () => {
  console.log('Connected to MongoDB');
})
db.on('error', (err) => { // Check for DB errors
  console.log(err);
})

// Load View Engine
app.set('views', path.join(__dirname, 'views')); // app.set('name', value), path.join(currentdirectory, fn)
app.set('view engine', 'pug');

// Parse application/x-www-form-urlencoded - body parser middleware
app.use(bodyParser.urlencoded({extended:false}))
// parse application/json
app.use(bodyParser.json())

// Set Public Folder - static files
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => { // Home Route
  Article.find({}, (err, articles) => { // find all articles
    if(err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      }); 
    } 
  });
});

// GEt single article
app.get('/articles/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if(err) {
      console.log(err);
      return;
    } else {
      res.render('article', {
        article:article
      })
    }
  });
});
// Load Edit Form
app.get('/article/edit/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if(err) {
      console.log(err);
      return;
    } else {
      res.render('edit_article', {
        title: 'Edit Article',
        article:article
      })
    }
  });
});
// Update Submit POST Route
app.post('/article/edit/:id', (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, (err) => {
    if(err) {
      console.log(err);
      return;
    } else {
      res.redirect('/')
    }
  }); 
});
// Delete Article
app.delete('/article/:id', (req, res) => {
  let query = {_id:req.params.id}
  Article.remove(query, (err) => {
    if(err) {
      console.log(err)
    } 
    res.send('Success');
  })
})


app.get('/add', (req, res) => {
  res.render('add_article', {
    title: 'Add Article'
  });
});

app.post('/articles/add', (req, res) => {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  article.save((err) => {
    if(err) {
      console.log(err);
      return;
    } else {
      res.redirect('/')
    }
  }); 
})

app.listen(3000, () => {
  console.log('Server started on port 3000');
});