"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _beedle = _interopRequireDefault(require("beedle"));
var _requests = require("./requests");
let _saveUrl;
let _onPost;
let _onLoad;
const store = new _beedle.default({
  actions: {
    setData(context, data, saveData, action) {
      context.commit('setState', {
        data,
        action
      });
      if (saveData) this.save(data, action);
    },
    load(context, _ref) {
      let {
        loadUrl,
        saveUrl,
        data,
        action
      } = _ref;
      _saveUrl = saveUrl;
      if (_onLoad) {
        _onLoad().then(x => this.setData(context, x, false, action));
      } else if (loadUrl) {
        (0, _requests.get)(loadUrl).then(x => {
          if (data && data.length > 0 && x.length === 0) {
            data.forEach(y => x.push(y));
          }
          this.setData(context, x, false, action);
        });
      } else {
        this.setData(context, data, false, action);
      }
    },
    update(context, _ref2) {
      let {
        data,
        action
      } = _ref2;
      this.setData(context, data, false, action);
    },
    create(context, element) {
      const {
        payload: {
          data
        }
      } = context.state;
      data.push(element);
      this.setData(context, data, true);
    },
    delete(context, element) {
      const {
        payload: {
          data
        }
      } = context.state;
      data.splice(data.indexOf(element), 1);
      this.setData(context, data, true);
    },
    updateOrder(context, elements) {
      const newData = elements.filter(x => x && !x.parentId);
      elements.filter(x => x && x.parentId).forEach(x => newData.push(x));
      this.setData(context, newData, true);
    },
    save(data, action) {
      if (_onPost) {
        _onPost({
          task_data: data,
          action
        });
      } else if (_saveUrl) {
        (0, _requests.post)(_saveUrl, {
          task_data: data,
          action
        });
      }
    }
  },
  mutations: {
    setState(state, payload) {
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
store.setExternalHandler = (onLoad, onPost) => {
  _onLoad = onLoad;
  _onPost = onPost;
};
var _default = exports.default = store;