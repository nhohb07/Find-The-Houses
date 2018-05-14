const config = require('config');
const path = require('path');

const ChoTotController = require('./ChoTot');

function getList(who) {
  switch (who) {
    case 'chotot':
      return ChoTotController.regions;
      break;
  }
}

function getCity(cityName) {

}

exports.getList = getList;