const _ = require('lodash');

const AloNhaDatController = require('./AloNhaDatController');
const ChoTotController = require('./ChoTotController');

const sources = [
  // 'AloNhaDat',
  'ChoTot',
];

const start = (filter) => {
  _.forEach(sources, item => {
    let controller = eval(item + 'Controller');
    controller = new controller(filter);

    controller.getList(() => {
      // controller.parseResult();
      // controller.insertToDB();
    });
  })
};

module.exports = start;