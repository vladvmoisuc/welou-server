const path = require('path');
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const db = require('./db');
const fcm = require('./fcm');

db.connect();
fcm.initialize();

// Middlewares
if (process.env.ENVIRONMENT === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use('/api', routes);

if (process.env.ENVIRONMENT === 'production') {
  app.get('/*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
  });
}

const port =
  process.env.ENVIRONMENT === 'production' ? process.env.PORT || 3000 : 5000;

app.listen(port, function () {
  console.log(`Server started to listen on port ${port}.`);
});
