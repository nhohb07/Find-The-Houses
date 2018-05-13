const _ = require('lodash');

const AloNhaDatController = require('./AloNhaDatController');

const sources = [
  'AloNhaDat'
];

const start = (filter) => {
  _.forEach(sources, item => {
    let controller = eval(item + 'Controller');
    controller = new controller(filter);

    controller.getList(() => {
      controller.parseResult();
    });
  })
};

module.exports = start;