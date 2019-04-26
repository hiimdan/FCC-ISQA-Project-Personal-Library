'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const db = require('./db.js');
const fccTesting = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');
const apiRoutes = require('./routes/api');

const app = express();

app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({setTo: 'PHP 4.2.0'}))

app.use(express.static('public'));

app.use(cors({origin: '*'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.route('/')
  .get((req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

fccTesting(app);

// Route handlers for API
apiRoutes(app);

// 404 not found middleware
app.use((req, res, next) => {
  res.status(404)
  .type('text')
  .send('Not found');
})


// Start Listening for requests once connected to database
db.connectDb((err) => {
  if (err) {
    throw err;
  }
  
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port ' + process.env.PORT);
    if (process.env.NODE_ENV === 'test') {
      console.log('running tests...');
      setTimeout(() => {
        try {
          runner.run();
        } catch(e) {
          let error = e;
          console.log('tests are not valid');
          console.log(error);
        }
      }, 1500)
    }
  })
})

module.exports = app;
