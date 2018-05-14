const path = require('path');

const dateFormat = 'DD/MM/YYYY';
const timeFormat = 'HH:mm:ss';

const config = {
  ROOT_DIR: path.resolve(__dirname, '..'),
  dateFormat,
  timeFormat,
  dateTimeFormat: [dateFormat, timeFormat].join(' '),

  chotot: {
    listLimit: 20,
    listAPI: 'https://gateway.chotot.com/v1/public/ad-listing?',
    listMethod: 'get',

    detailAPI: 'https://gateway.chotot.com/v1/public/ad-listing/',
    detailMethod: 'get'
  }
}

module.exports = config;