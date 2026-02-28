"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _beedle = _interopRequireDefault(require("beedle"));
var _requests = require("./requests");
var _saveUrl;
var _onPost;
var _onLoad;
var store = new _beedle["default"]({
  actions: {
    setData: function setData(context, data, saveData, action) {
      context.commit('setState', {
        data: data,
        action: action
      });
      if (saveData) this.save(data, action);
    },
    load: function load(context, _ref) {
      var _this = this;
      var loadUrl = _ref.loadUrl,
        saveUrl = _ref.saveUrl,
        data = _ref.data,
        action = _ref.action;
      _saveUrl = saveUrl;
      if (_onLoad) {
        _onLoad().then(function (x) {
          return _this.setData(context, x, false, action);
        });
      } else if (loadUrl) {
        (0, _requests.get)(loadUrl).then(function (x) {
          if (data && data.length > 0 && x.length === 0) {
            data.forEach(function (y) {
              return x.push(y);
            });
          }
          _this.setData(context, x, false, action);
        });
      } else {
        this.setData(context, data, false, action);
      }
    },
    update: function update(context, _ref2) {
      var data = _ref2.data,
        action = _ref2.action;
      this.setData(context, data, false, action);
    },
    create: function create(context, element) {
      var data = context.state.payload.data;
      data.push(element);
      this.setData(context, data, true);
    },
    "delete": function _delete(context, element) {
      var data = context.state.payload.data;
      data.splice(data.indexOf(element), 1);
      this.setData(context, data, true);
    },
    updateOrder: function updateOrder(context, elements) {
      var newData = elements.filter(function (x) {
        return x && !x.parentId;
      });
      elements.filter(function (x) {
        return x && x.parentId;
      }).forEach(function (x) {
        return newData.push(x);
      });
      this.setData(context, newData, true);
    },
    save: function save(data, action) {
      if (_onPost) {
        _onPost({
          task_data: data,
          action: action
        });
      } else if (_saveUrl) {
        (0, _requests.post)(_saveUrl, {
          task_data: data,
          action: action
        });
      }
    }
  },
  mutations: {
    setState: function setState(state, payload) {
      // eslint-disable-next-line no-param-reassign
      state.payload = payload;
      return state;
    }
  },
  initialState: {
    payload: {
      data: [],
      action: undefined
    }
  }
});
store.setExternalHandler = function (onLoad, onPost) {
  _onLoad = onLoad;
  _onPost = onPost;
};
var _default = store;
exports["default"] = _default;