"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateFormat = exports.getCalendarType = exports.formatDate = void 0;
var _dayjs = _interopRequireDefault(require("dayjs"));
var _utc = _interopRequireDefault(require("dayjs/plugin/utc"));
var _buddhistEra = _interopRequireDefault(require("dayjs/plugin/buddhistEra"));
_dayjs.default.extend(_utc.default);
_dayjs.default.extend(_buddhistEra.default);
var keyDateFormat = "setting_date_format";
var keyCalendarType = "setting_calendar_type";
var dateFormatList = {
  "dd MMMM yyyy": "DD MMMM YYYY",
  "dd-MMM-yyyy": "DD-MMM-YYYY",
  "dd-MMM-yy": "DD-MMM-YY",
  "yyyy-MM-dd": "YYYY-MM-DD",
  "MM/dd/yyyy": "MM/DD/YYYY",
  "dd/MM/yyyy": "DD/MM/YYYY",
  "MMM dd, yyyy": "MMM DD, YYYY"
};
var getDateFormat = function getDateFormat() {
  return dateFormatList[localStorage.getItem(keyDateFormat)] || "DD MMMM YYYY";
};
exports.getDateFormat = getDateFormat;
var getCalendarType = function getCalendarType() {
  return localStorage.getItem(keyCalendarType) || "EN";
};
exports.getCalendarType = getCalendarType;
var formatDate = function formatDate(date) {
  if (!date) return "";
  var format = getDateFormat();
  if (getCalendarType() === "EN") {
    return (0, _dayjs.default)(date).utc(true).format(format);
  } else {
    // Use Buddhist Era (BBBB) formatting
    return (0, _dayjs.default)(date).utc(true).format(format.replace("YYYY", "BBBB"));
  }
};
exports.formatDate = formatDate;