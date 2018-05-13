const express = require('express');
const app = express();

const filter = {
  province: 'Ho Chi Minh',
  district: [
    'quận 9',
    'quận 12',
    'quận thủ đức',
  ],
  tradetype: 'sell',
  property: [
    'nhà mặt tiền',
    'nhà trong hẻm'
  ],
  acreageFrom: 35,
  acreageTo: 55,
  priceFrom: 1000000,
  priceTo: 1500000,
  direction: [
    'đông',
    'tây',
    'đông bắc',
    'tây bắc'
  ]
};

const filterDataStart = require('./FilterData');

filterDataStart(filter);

app.get('/', function (req, res) {
  res.send("Hello world!");
});

module.exports = app;