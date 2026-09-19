"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sameFormItemId = sameFormItemId;
exports.serializeSignedDateTime = serializeSignedDateTime;
exports.isSignedSignatureValue = isSignedSignatureValue;
exports.resolveColumnChild = resolveColumnChild;
exports.pickSignatureValue = pickSignatureValue;
exports.flattenColumnChildren = flattenColumnChildren;

function sameFormItemId(a, b) {
  if (a == null || b == null || a === '' || b === '') {
    return false;
  }
  return a === b || String(a) === String(b);
}

function serializeSignedDateTime(value) {
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value.toISOString === 'function') {
    try {
      return value.toISOString();
    } catch (e) {
      return String(value);
    }
  }
  return String(value);
}

function isSignedSignatureValue(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && value.isSigned);
}

function resolveColumnChild(childRef, findById) {
  if (childRef == null || childRef === '') {
    return null;
  }
  if (typeof childRef === 'object') {
    if (childRef.element || childRef.field_name) {
      return (typeof findById === 'function' && childRef.id != null ? findById(childRef.id) : null) || childRef;
    }
    return null;
  }
  return typeof findById === 'function' ? findById(childRef) : null;
}

function pickSignatureValue(refState, storedValue) {
  if (refState && refState.isSigned) {
    return {
      isSigned: true,
      signedPerson: refState.signedPerson,
      signedPersonId: refState.signedPersonId,
      signedDateTime: serializeSignedDateTime(refState.signedDateTime)
    };
  }
  if (isSignedSignatureValue(storedValue)) {
    return {
      isSigned: true,
      signedPerson: storedValue.signedPerson,
      signedPersonId: storedValue.signedPersonId,
      signedDateTime: serializeSignedDateTime(storedValue.signedDateTime)
    };
  }
  return '';
}

function flattenColumnChildren(data, findById) {
  const children = [];
  const seen = new Set();
  (data || []).forEach(item => {
    if (!item || !item.childItems) {
      return;
    }
    const rows = Array.isArray(item.childItems[0]) ? item.childItems : [item.childItems];
    rows.forEach(row => {
      (row || []).forEach(childRef => {
        const child = resolveColumnChild(childRef, findById);
        if (!child) {
          return;
        }
        const key = child.id != null ? String(child.id) : child.field_name;
        if (key && seen.has(key)) {
          return;
        }
        if (key) {
          seen.add(key);
        }
        children.push(child);
      });
    });
  });
  return children;
}
