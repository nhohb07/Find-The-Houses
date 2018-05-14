const config = require('config');
const request = require("request");
const _ = require('lodash');

const regions = require(`${config.ROOT_DIR}/src/data/chotot-regions.json`);
const directions = require(`${config.ROOT_DIR}/src/data/chotot-directions.json`);

// GET https://gateway.chotot.com/v1/public/ad-listing?region=13&area=104&cg=1020&direction=1,2,5,7&price=0-1500000000&limit=20&o=0&st=s,k

function getList(filterConditions, callback) {
  let requestParams = getRequestData(filterConditions);
  requestParams = Object.entries(requestParams).map(e => e.join('=')).join('&');

  const list = [];

  request(
    {
      method: config.chotot.listMethod,
      url: config.chotot.listAPI + requestParams,
      json: true
    },
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        // Get each detail of list
        _.forEach(_.get(body, 'ads'), item => {
          getDetail(item.list_id, (itemDetail) => {
            // parse item detail to object
            list.push(parseDetail(itemDetail));
          });
        });

        console.log('list', list);
      }
    }
  );
}

function getDetail(id, callback) {
  request(
    {
      method: config.chotot.detailMethod,
      url: config.chotot.detailAPI + id,
      json: true
    },
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        return callback(body);
      }

      return callback({});
    }
  );
}

function parseDetail(data) {
  const id = _.get(data, 'ad.list_id', '');
  const title = _.get(data, 'ad.subject', '');
  const description = _.get(data, 'ad.body', '');
  const price = _.get(data, 'ad.price', 0);
  const images = _.get(data, 'ad.images', []);
  const timestamp = _.get(data, 'ad.list_time');

  const area = _.get(data, 'ad.area', 0);
  const region = _.get(data, 'ad.region', 0);
  const category = _.get(data, 'ad.category', 0);

  const longitude = _.get(data, 'ad.longitude', 0);
  const latitude = _.get(data, 'ad.latitude', 0);
  const phone = _.get(data, 'ad.phone', 0);
  const accountName = _.get(data, 'ad.account_name', 0);

  const size = _.get(_.find(data.parameters, { id: 'size' }), 'value', null);
  const rooms = _.get(_.find(data.parameters, { id: 'rooms' }), 'value', null);
  const direction = _.get(_.find(data.parameters, { id: 'direction' }), 'value', null);
  const toilets = _.get(_.find(data.parameters, { id: 'toilets' }), 'value', null);
  const propertyLegalDocument = _.get(_.find(data.parameters, { id: 'property_legal_document' }), 'value', null);

  const result = {
    id,
    title,
    description,
    price,
    images,
    direction,
    propertyLegalDocument,
    otherInfo: {
      size,
      rooms,
      toilets,
    },
    area,
    region,
    category,
    longitude,
    latitude,
    contactInfo: {
      phone,
      accountName,
    },
    timestamp
  };

  return result;
}

/**
 * Get request params
 * @param {Object} filterConditions 
 */
function getRequestData(filterConditions) {
  const requestParams = {
    limit: config.chotot.listLimit,
    cg: 1020
  };

  let region = getRegion(filterConditions.region);
  requestParams.area = getAreas(region.area, filterConditions.districts);
  requestParams.region = region.id;

  requestParams.price = `${filterConditions.priceFrom}-${filterConditions.priceTo}`;

  requestParams.direction = getDirections(filterConditions.directions);

  requestParams.st = getTradeType(filterConditions.tradetype);

  return requestParams;
}

/**
 * Get region match with filterConditions.region
 * @param {string} cityName 
 */
function getRegion(cityName) {
  cityName = cityName.replace(/\s+/g, '-');
  return _.head(_.filter(regions, item => new RegExp(`^(\\b(\\w+)+\\b(\\s|-))?(${cityName})`, 'i').test(item.name_url)));
}

/**
 * Get Area base on region and match with filterConditions.district list
 * @param {Array} regionAreas
 * @param {Array} filterDistricts
 */
function getAreas(regionAreas, filterDistricts) {
  const areas = [];

  _.forEach(filterDistricts, district => {
    district = district.replace(/\s+/g, '-');

    const areaItem = _.head(_.filter(regionAreas, item => new RegExp(`^(\\b(\\w+)+\\b(\\s|-))?(${district})`, 'i').test(item.name_url)));
    areas.push(areaItem.id);
  })

  return areas.join(',');
}

/**
 * Get directions match with filterConditions.directions
 * @param {Array} filterDirections
 */
function getDirections(filterDirections) {
  const data = [];

  _.forEach(filterDirections, direction => {
    const item = _.head(_.filter(directions, item => direction === item.name_url));
    data.push(item.id);
  })

  return data.join(',');
}

function getTradeType(type) {
  switch (type) {
    case 'sell': return 's';
    case 'buy': return 'k';
  }
}

exports.regions = regions;
exports.getList = getList;