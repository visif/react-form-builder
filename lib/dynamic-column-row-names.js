"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyAutoCellName = applyAutoCellName;
exports.applyAutoCellNamesAfterSwap = applyAutoCellNamesAfterSwap;
exports.defaultCellName = defaultCellName;
exports.isAutoCellName = isAutoCellName;
exports.isUniqueNameTaken = isUniqueNameTaken;
exports.nextDynamicColumnRowUniqueName = nextDynamicColumnRowUniqueName;
exports.sanitizeUniqueName = sanitizeUniqueName;
exports.templateTagPreview = templateTagPreview;
/**
 * Unique names for Dynamic Column Row export tags: #tableName_cellName#
 */

function sanitizeUniqueName(text) {
  if (text == null) {
    return '';
  }
  var stripped = "".concat(text).replace(/<[^>]*>/g, ' ').replace(/#/g, '').replace(/&nbsp;/gi, ' ');
  return stripped.replace(/[^A-Za-z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}
function defaultCellName(row, col) {
  var rowIndex = Number(row);
  var colIndex = Number(col);
  var rowNum = Number.isFinite(rowIndex) ? rowIndex + 1 : 1;
  var colNum = Number.isFinite(colIndex) ? colIndex + 1 : 1;
  return "r".concat(rowNum, "c").concat(colNum);
}
function isAutoCellName(name, row, col) {
  return name === defaultCellName(row, col);
}
function applyAutoCellName(child, row, col) {
  if (!child) {
    return child;
  }
  if (child.cellNameCustom && child.cellName) {
    return child;
  }
  child.cellName = defaultCellName(row, col);
  child.cellNameCustom = false;
  return child;
}
function applyAutoCellNamesAfterSwap(movingChild, newRow, newCol, displacedChild, displacedRow, displacedCol) {
  applyAutoCellName(movingChild, newRow, newCol);
  applyAutoCellName(displacedChild, displacedRow, displacedCol);
}
function nextDynamicColumnRowUniqueName(data) {
  var used = new Set();
  (Array.isArray(data) ? data : []).forEach(function (item) {
    if (item && item.element === 'DynamicColumnRow') {
      var name = sanitizeUniqueName(item.uniqueName);
      if (name) {
        used.add(name);
      }
    }
  });
  var i = 1;
  var candidate = "DynamicColumnRow".concat(i);
  while (used.has(candidate)) {
    i += 1;
    candidate = "DynamicColumnRow".concat(i);
  }
  return candidate;
}
function isUniqueNameTaken(data, uniqueName, exceptId) {
  var wanted = sanitizeUniqueName(uniqueName);
  if (!wanted) {
    return false;
  }
  return (Array.isArray(data) ? data : []).some(function (item) {
    return item && item.element === 'DynamicColumnRow' && item.id !== exceptId && sanitizeUniqueName(item.uniqueName) === wanted;
  });
}
function templateTagPreview(tableUniqueName, cellName) {
  var table = sanitizeUniqueName(tableUniqueName) || 'DynamicColumnRow1';
  var cell = sanitizeUniqueName(cellName) || 'r1c1';
  return "#".concat(table, "_").concat(cell, "#");
}
