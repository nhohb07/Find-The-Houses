const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const app = express();
const routers = require('./src/routers');

// Config
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '5mb'
}));

// Routers
app.use('/', routers);

app.listen(app.get('port'), () => {
  console.log(`Starting the system on the link: http://localhost:${app.get('port')}`);
});
