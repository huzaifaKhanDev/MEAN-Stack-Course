const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
})

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log('new post',post);
  res.status(201).json({
    message: 'Post Added Successfully'
  });
})

app.get('/api/posts',(req, res, next) => {
  const posts = [
    {
      id: '1',
      title: 'first server post',
      content: 'post content'
    },
    {
      id: '2',
      title: 'second server post',
      content: 'post content'
    },
    {
      id: '3',
      title: 'third server post',
      content: 'post content'
    }
  ]
  res.status(200).json({
    message: 'Post fetched successfully!',
    posts: posts
  });
});

module.exports = app;
