const http = require('http');
const request = require("request");

class Controller {
  constructor(filter = null) {
    this.version = "1.0";
    this.domain = null;
    this.apiEndPoint = null;
    this.method = 'post';
    this.filter = filter;
    this.json = false;
    this.headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };

    this.requestData = {};
    this.responseData = {};
    this.filterResult = [];
  }

  setFilter(filter) {
    this.filter = filter;
  }

  getHeaders() {
    const headers = this.headers;
    headers['Content-Length'] = this.requestData.length;

    if (this.json) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  getList(callback) {
    request(
      {
        method: this.method,
        url: this.apiEndPoint,
        headers: this.getHeaders(),
        body: this.requestData,
        json: this.json
      },
      (error, response, body) => {
        if (!error && response.statusCode == 200) {
          this.responseData = body;
          callback();
        }
      }
    );
  }
}

module.exports = Controller;