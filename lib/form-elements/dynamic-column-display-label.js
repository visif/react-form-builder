"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParentElement = getParentElement;
exports.isDynamicColumnChild = isDynamicColumnChild;
exports.resolveGetDataById = resolveGetDataById;
exports.shouldHideColumnDisplayLabel = shouldHideColumnDisplayLabel;
// Parent lookup for a column cell. The builder preview passes getDataById as
// its own prop (mutable is a boolean). The filled form may pass it the same
// way, or on a mutable object.
function resolveGetDataById(props) {
  if (!props) return null;
  if (typeof props.getDataById === 'function') return props.getDataById;
  if (props.mutable && typeof props.mutable.getDataById === 'function') {
    return props.mutable.getDataById;
  }
  return null;
}
function getParentElement(props) {
  var _props$data;
  if (!(props !== null && props !== void 0 && (_props$data = props.data) !== null && _props$data !== void 0 && _props$data.parentId)) return null;
  const getDataById = resolveGetDataById(props);
  return getDataById ? getDataById(props.data.parentId) : null;
}
function isDynamicColumnChild(data, props) {
  if (!(data !== null && data !== void 0 && data.parentId) || data.row === undefined || data.col === undefined) {
    return false;
  }
  const parent = getParentElement(props);
  if (parent !== null && parent !== void 0 && parent.element) {
    return parent.element === 'DynamicColumnRow';
  }
  return data.hideLabel === true;
}

// Hide a cell's display label unless the Dynamic Column Row opts in, or the
// cell itself opts in. A row-level opt-in overrides the hideLabel flag stamped
// on children when they are dropped. An explicit isShowLabel: false still hides.
function shouldHideColumnDisplayLabel(data, parentElement) {
  const parentDynamicColumnRow = parentElement && parentElement.element === 'DynamicColumnRow' ? parentElement : null;
  const rowShowsLabels = (parentDynamicColumnRow === null || parentDynamicColumnRow === void 0 ? void 0 : parentDynamicColumnRow.showDisplayLabel) === true;
  const hideLabelSetting = (data === null || data === void 0 ? void 0 : data.isShowLabel) !== undefined && data.isShowLabel === false || data && data.hideLabel === true && !rowShowsLabels;
  const hideBecauseDynamicColumn = parentDynamicColumnRow !== null && !rowShowsLabels && (data === null || data === void 0 ? void 0 : data.displayLabelInColumn) !== true;
  return hideLabelSetting || hideBecauseDynamicColumn;
}
