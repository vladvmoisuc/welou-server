require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const routes = require('./routes');
const db = require('./db');
const fcm = require('./fcm');

db.connect();
fcm.initialize();

// Middlewares
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'something with cheese',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use('/api', routes);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || 3000;
// const port = 5000;

app.listen(port, function () {
  console.log(`Server started to listen on port ${port}.`);
});
