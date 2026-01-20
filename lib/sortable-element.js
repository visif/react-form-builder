const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')
const _typeof = require('@babel/runtime/helpers/typeof')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0
const _extends2 = _interopRequireDefault(require('@babel/runtime/helpers/extends'))
const _classCallCheck2 = _interopRequireDefault(
  require('@babel/runtime/helpers/classCallCheck')
)
const _createClass2 = _interopRequireDefault(
  require('@babel/runtime/helpers/createClass')
)
const _inherits2 = _interopRequireDefault(require('@babel/runtime/helpers/inherits'))
const _possibleConstructorReturn2 = _interopRequireDefault(
  require('@babel/runtime/helpers/possibleConstructorReturn')
)
const _getPrototypeOf2 = _interopRequireDefault(
  require('@babel/runtime/helpers/getPrototypeOf')
)
const _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty')
)
const _react = _interopRequireWildcard(require('react'))
const _reactDnd = require('react-dnd')
const _reactDom = require('react-dom')
const _propTypes = _interopRequireDefault(require('prop-types'))
const _ItemTypes = _interopRequireDefault(require('./ItemTypes'))

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null
  const cacheBabelInterop = new WeakMap()
  const cacheNodeInterop = new WeakMap()
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop
  })(nodeInterop)
}
function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj
  }
  if (obj === null || (_typeof(obj) !== 'object' && typeof obj !== 'function')) {
    return { default: obj }
  }
  const cache = _getRequireWildcardCache(nodeInterop)
  if (cache && cache.has(obj)) {
    return cache.get(obj)
  }
  const newObj = {}
  const hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor
  for (const key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      const desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc)
      } else {
        newObj[key] = obj[key]
      }
    }
  }
  newObj.default = obj
  if (cache) {
    cache.set(obj, newObj)
  }
  return newObj
}
function ownKeys(object, enumerableOnly) {
  const keys = Object.keys(object)
  if (Object.getOwnPropertySymbols) {
    let symbols = Object.getOwnPropertySymbols(object)
    enumerableOnly &&
      (symbols = symbols.filter(
        (sym) => Object.getOwnPropertyDescriptor(object, sym).enumerable
      )),
      keys.push.apply(keys, symbols)
  }
  return keys
}
function _objectSpread(target) {
  for (let i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {}
    i % 2
      ? ownKeys(Object(source), !0).forEach((key) => {
          ;(0, _defineProperty2.default)(target, key, source[key])
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
        : ownKeys(Object(source)).forEach((key) => {
            Object.defineProperty(
              target,
              key,
              Object.getOwnPropertyDescriptor(source, key)
            )
          })
  }
  return target
}
function _createSuper(Derived) {
  const hasNativeReflectConstruct = _isNativeReflectConstruct()
  return function _createSuperInternal() {
    const Super = (0, _getPrototypeOf2.default)(Derived)
    let result
    if (hasNativeReflectConstruct) {
      const NewTarget = (0, _getPrototypeOf2.default)(this).constructor
      result = Reflect.construct(Super, arguments, NewTarget)
    } else {
      result = Super.apply(this, arguments)
    }
    return (0, _possibleConstructorReturn2.default)(this, result)
  }
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false
  if (Reflect.construct.sham) return false
  if (typeof Proxy === 'function') return true
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], () => {}))
    return true
  } catch (e) {
    return false
  }
}
const cardStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}
const MULTI_COLUMN_ELEMENTS = new Set([
  'TwoColumnRow',
  'ThreeColumnRow',
  'FourColumnRow',
  'DynamicColumnRow',
])
const shouldUseDragHandle = function shouldUseDragHandle(props) {
  let _props$data
  let _props$data2
  const element =
    ((_props$data = props === null || props === void 0 ? void 0 : props.data) === null ||
    _props$data === void 0
      ? void 0
      : _props$data.element) ||
    ((_props$data2 = props === null || props === void 0 ? void 0 : props.data) === null ||
    _props$data2 === void 0
      ? void 0
      : _props$data2.key)
  if (MULTI_COLUMN_ELEMENTS.has(element)) return true
  return false
}

// Drag source specification
const cardSource = {
  beginDrag: function beginDrag(props) {
    return {
      itemType: _ItemTypes.default.CARD,
      id: props.id,
      index: props.index,
    }
  },
}

// Drop target specification
const cardTarget = {
  drop: function drop(props, monitor, component) {
    if (!component) return
    const item = monitor.getItem()
    const dragIndex = item.index
    const hoverIndex = props.index
    if (item.itemType === _ItemTypes.default.CARD) {
      return
    }
    if (item.data && typeof item.setAsChild === 'function' && dragIndex === -1) {
      props.insertCard(item, hoverIndex, item.id)
    }
  },
  hover: function hover(props, monitor, component) {
    const item = monitor.getItem()
    const dragIndex = item.index
    const hoverIndex = props.index
    if (item.data && typeof item.setAsChild === 'function') {
      return
    }
    if (dragIndex === hoverIndex) {
      return
    }
    if (dragIndex === -1) {
      item.index = hoverIndex
      props.insertCard(item.onCreate(item.data), hoverIndex)
    }
    const hoverBoundingRect = (0, _reactDom.findDOMNode)(
      component
    ).getBoundingClientRect()
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    const clientOffset = monitor.getClientOffset()
    const hoverClientY = clientOffset.y - hoverBoundingRect.top
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }
    props.moveCard(dragIndex, hoverIndex)
    item.index = hoverIndex
  },
}
const withDragAndDrop = function withDragAndDrop(ComposedComponent) {
  const Card = /* #__PURE__ */ (function (_Component) {
    ;(0, _inherits2.default)(Card, _Component)
    const _super = _createSuper(Card)
    function Card() {
      ;(0, _classCallCheck2.default)(this, Card)
      return _super.apply(this, arguments)
    }
    ;(0, _createClass2.default)(Card, [
      {
        key: 'render',
        value: function render() {
          const _this$props = this.props
          const { isDragging } = _this$props
          const { connectDragSource } = _this$props
          const { connectDropTarget } = _this$props
          const opacity = isDragging ? 0 : 1
          const useDragHandle =
            this.props.useDragHandle || shouldUseDragHandle(this.props)
          const content = connectDropTarget(
            /* #__PURE__ */ _react.default.createElement(
              'div',
              null,
              /* #__PURE__ */ _react.default.createElement(
                ComposedComponent,
                (0, _extends2.default)({}, this.props, {
                  style: _objectSpread(
                    _objectSpread({}, cardStyle),
                    {},
                    {
                      opacity,
                    }
                  ),
                })
              )
            )
          )
          return useDragHandle ? content : connectDragSource(content)
        },
      },
    ])
    return Card
  })(_react.Component)
  ;(0, _defineProperty2.default)(Card, 'propTypes', {
    connectDragSource: _propTypes.default.func.isRequired,
    connectDropTarget: _propTypes.default.func.isRequired,
    index: _propTypes.default.number.isRequired,
    isDragging: _propTypes.default.bool,
    id: _propTypes.default.any.isRequired,
    moveCard: _propTypes.default.func.isRequired,
    seq: _propTypes.default.number,
  })
  ;(0, _defineProperty2.default)(Card, 'defaultProps', {
    seq: -1,
  })
  const DroppableCard = (0, _reactDnd.DropTarget)(
    [_ItemTypes.default.CARD, _ItemTypes.default.BOX],
    cardTarget,
    (connect) => ({
      connectDropTarget: connect.dropTarget(),
    })
  )(Card)
  return (0, _reactDnd.DragSource)(
    _ItemTypes.default.CARD,
    cardSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  )(DroppableCard)
}
const _default = withDragAndDrop
exports.default = _default
