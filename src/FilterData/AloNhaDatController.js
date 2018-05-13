const _ = require('lodash');
const cheerio = require('cheerio')
const Controller = require('./Controller');

class AloNhaDatController extends Controller {
  constructor(filter = null) {
    super(filter);

    this.domain = 'alonhadat.com.vn';
    this.apiEndPoint = 'https://alonhadat.com.vn/handler/Handler.ashx?command=14';
    this.method = 'post';

    this.requestData = this.formatFilter();
  }

  getProvince() {
    switch (this.filter.province) {
      case 'Ho Chi Minh': return 2;
    }
  }

  getDistricts() {
    const districts = { "132": "quận 1", "133": "quận 2", "134": "quận 3", "135": "quận 4", "136": "quận 5", "137": "quận 6", "138": "quận 7", "139": "quận 8", "140": "quận 9", "141": "quận 10", "142": "quận 11", "143": "quận 12", "144": "quận bình tân", "145": "quận bình thạnh", "146": "quận gò vấp", "147": "quận phú nhuận", "148": "quận tân bình", "149": "quận tân phú", "150": "quận thủ đức", "151": "huyện bình chánh", "152": "huyện cần giờ", "153": "huyện củ chi", "154": "huyện hóc môn", "155": "huyện nhà bè" };
    return _.filter(_.keys(districts), (key) => this.filter.district.indexOf(districts[key].toLowerCase()) > -1);
  }

  getTradeType() {
    switch (this.filter.tradetype) {
      case 'sell': return 1;
      case 'buy': return 3;
    }
  }

  getDirections() {
    const directions = { "1": "đông", "2": "tây", "3": "nam", "4": "bắc", "5": "đông nam", "6": "đông bắc", "7": "tây nam", "8": "tây bắc" };
    return _.filter(_.keys(directions), (key) => this.filter.direction.indexOf(directions[key].toLowerCase()) > -1);
  }

  getProperties() {
    const properties = { "1": "nhà mặt tiền", "2": "nhà trong hẻm", "3": "biệt thự, nhà liền kề", "4": "căn hộ chung cư", "5": "kho, xưởng", "6": "nhà hàng, khách sạn", "7": "văn phòng", "8": "phòng trọ, nhà trọ", "9": "trang trại", "10": "mặt bằng", "11": "đất thổ cư, đất ở", "12": "đất nền, liền kề, đất dự án", "13": "đất nông, lâm nghiệp", "14": "các loại khác", "15": "shop, kiot, quán" };
    return _.filter(_.keys(properties), (key) => this.filter.property.indexOf(properties[key].toLowerCase()) > -1);
  }

  formatFilter() {
    // Init filter
    let filter = `province=${this.getProvince()}`;
    filter += `&tradetype=${this.getTradeType()}`;

    // format districts
    filter += _.map(this.getDistricts(), item => `&district=${item}`).join('');

    // format directions
    filter += _.map(this.getDirections(), item => `&direct=${item}`).join('');

    // format properties
    filter += _.map(this.getProperties(), item => `&property=${item}`).join('');

    // format price
    filter += `&price1=${this.filter.priceFrom}`;
    filter += `&price2=${this.filter.priceTo}`;

    // format acreage
    filter += `&square1=${this.filter.acreageFrom}`;
    filter += `&square2=${this.filter.acreageTo}`;

    console.log(filter)
    return filter;
  }

  parseResult() {
    const $ = cheerio.load(this.responseData);

    const text = $('.text');

    _.forEach(text, item => {
      const title = $(item).find('.ct_title>a').text();
      const date = $(item).find('.ct_date').text();
      const dimension = $(item).find('.ct_kt').clone().children().remove().end().text()
      const acreage = $(item).find('.ct_dt').clone().children().remove().end().text()
      const direction = $(item).find('.ct_direct').clone().children().remove().end().text()
      const price = $(item).find('.ct_price').clone().children().remove().end().text()
      const district = $(item).find('.ct_dis').clone().children().remove().end().text()

      console.log({
        title,
        date,
        dimension,
        acreage,
        direction,
        price,
        district
      });
    })
  }
}

module.exports = AloNhaDatController;