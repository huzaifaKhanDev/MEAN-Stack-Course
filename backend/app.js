const express = require('express');

const app = express();

app.use('/api/posts',(req, res, next) => {
  const posts = [
    {
      id: '123',
      title: 'first server post',
      content: 'post content'
    },
    {
      id: '124',
      title: '124 server post',
      content: 'post content'
    },
    {
      id: '125',
      title: '125 server post',
      content: 'post content'
    }
  ]
  res.status(200).json({
    message: 'Post fetched succesfully!',
    posts: posts
  });
});

module.exports = app;
