const _ = require('lodash');
const moment = require('moment');
const cheerio = require('cheerio');
var SHA256 = require("crypto-js/sha256");

const Controller = require('./Controller');

class ChoTotController extends Controller {
  constructor(filter = null) {
    super(filter);

    this.domain = 'https://chotot.vn';
    this.apiEndPoint = 'https://gateway.chotot.com/v1/public/ad-listing?';
    this.method = 'get';

    this.requestData = this.formatFilter();
  }

  getProvince() {
    switch (this.filter.province) {
      case 'Ho Chi Minh': return 13;
    }
  }

  getDistricts() {
    const districts = {
      "96": "quận 1",
      "97": "quận 2",
      "98": "quận 3",
      "99": "quận 4",
      "100": "quận 5",
      "101": "quận 6",
      "102": "quận 7",
      "103": "quận 8",
      "104": "quận 9",
      "105": "quận 10",
      "106": "quận 11",
      "107": "quận 12",
      "108": "quận bình tân",
      "109": "quận bình thạnh",
      "110": "quận gò vấp",
      "111": "quận phú nhuận",
      "112": "quận tân bình",
      "113": "quận tân phú",
      "114": "quận thủ đức",
      "115": "huyện bình chánh",
      "116": "huyện củ chi",
      "117": "huyện hóc môn",
      "118": "huyện nhà bè",
      "119": "quận huyện khác",
      "120": "huyện cần giờ",
    };
    return _.filter(_.keys(districts), (key) => this.filter.district.indexOf(districts[key].toLowerCase()) > -1);
  }

  getTradeType() {
    switch (this.filter.tradetype) {
      case 'sell': return 's';
      case 'buy': return 'k';
    }
  }

  getDirections() {
    const directions = {
      "1": "đông",
      "2": "tây",
      "3": "nam",
      "4": "bắc",
      "5": "đông bắc",
      "6": "đông nam",
      "7": "tây bắc",
      "8": "tây nam",
    };
    return _.filter(_.keys(directions), (key) => this.filter.direction.indexOf(directions[key].toLowerCase()) > -1);
  }

  getProperties() {
  }

  formatFilter() {
    // Init filter
    let filter = `region=${this.getProvince()}`;
    filter += `&st=${this.getTradeType()}`;

    // format districts
    filter += `&area=${this.getDistricts().join(',')}`;

    // format directions
    filter += `&direction=${this.getDirections().join(',')}`;

    // format properties
    // filter += _.map(this.getProperties(), item => `&property=${item}`).join('');

    // format price
    filter += `&price=${this.filter.priceFrom}-${this.filter.priceTo}`;

    // format acreage
    filter += `&size=${this.filter.acreageFrom}-${this.filter.acreageTo}`;

    this.apiEndPoint += filter;

    return filter;
  }

  parseResult() {
    const title = _.get(this.responseData, 'ads.subject');
    const image = _.get(this.responseData, 'ads.image', '').replace('\\u0026', '&');
    const link = '';
    const dimension = '';
    const acreage = '';
    const direction = '';
    const price = '';
    const district = '';

    let date = '';
    // if (date === 'Hôm nay') {
    //   date = new Date();
    // } else if (date === 'Hôm qua') {
    //   date = moment().subtract(1, 'day').format('DD/MM/YYYY');
    // }
    // date = moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY');

    const dataItem = {
      domain: this.domain.replace('https://', ''),
      title,
      image,
      link,
      dimension,
      acreage,
      direction,
      price,
      district,
      date,
      timestamp: moment(date, 'DD/MM/YYYY').unix(),
    };

    dataItem.id = SHA256(dataItem.link).toString();

    this.filterResult.push(dataItem);
  }
}

module.exports = ChoTotController;