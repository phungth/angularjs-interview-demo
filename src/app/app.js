import angular from 'angular';
import ngInfiniteScroll from 'ng-infinite-scroll';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import '../style/app.css';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor($http) {
    this._$http = $http;
  }

  $onInit() {
    this._initData();
    this._getData();
  }

  _initData() {
    this.busy = false;
    this.data = [];
    this.url = 'https://data.ratp.fr/api/records/1.0/search/';
    this.params = {
      dataset: 'liste-des-commerces-de-proximite-agrees-ratp',
      rows: 20,
      start: 0,
      sort: null,
      q: null
    };
  }

  _httpGet(url, params) {
    return this._$http({
      method: 'GET',
      url,
      params
    });
  }

  _getData() {
    if (this.busy) return;
    this.busy = true;
    this._httpGet(this.url, this.params).then((resp) => {
      if (resp.data && resp.data.records.length) {
        this.data.push(...resp.data.records);
        this.busy = false;
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  addMoreItems() {
    this.params.start += this.params.rows;
    this._getData();
  }

  onSearch() {
    this._reset();
    this.params.q = this.searchValue;
    this._getData();
  }

  onSort() {
    this.sortCodePostalByASC = !this.sortCodePostalByASC;
    this._reset();
    this.params.sort = this.sortCodePostalByASC ? 'code_postal' : '-code_postal';
    this._getData();
  }

  _reset() {
    this.busy = false;
    this.params.start = 0;
    this.data = [];
  }

}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [ngInfiniteScroll])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;
