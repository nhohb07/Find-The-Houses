const _ = require('lodash');

const ChoTot = require('./ChoTot');

var filterConditions = {
  region: 'ho chi minh',
  districts: [
    'quan 9',
    'quan 12',
    'thu duc',
  ],
  tradetype: 'sell',
  property: [
    'nhà mặt tiền',
    'nhà trong hẻm'
  ],
  acreageFrom: 35,
  acreageTo: 55,
  priceFrom: 0,
  priceTo: 1500000000,
  directions: [
    'dong',
    'tay',
    'dong bac',
    'tay bac'
  ]
};

const controllerList = [
  'ChoTot'
];

function start() {
  _.forEach(controllerList, (controllerName) => {
    const controller = eval(controllerName);

    controller.getList(filterConditions);
  })
}

exports.start = start;