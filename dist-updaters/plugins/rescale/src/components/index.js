"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _button = _interopRequireDefault(require("antd/lib/button"));

var _modal = _interopRequireDefault(require("antd/lib/modal"));

var _input = _interopRequireDefault(require("antd/lib/input"));

var _select = _interopRequireDefault(require("antd/lib/select"));

var _inputNumber = _interopRequireDefault(require("antd/lib/input-number"));

var _radio = _interopRequireDefault(require("antd/lib/radio"));

var _card = _interopRequireDefault(require("antd/lib/card"));

var _table = _interopRequireDefault(require("antd/lib/table"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _space = _interopRequireDefault(require("antd/lib/space"));

var _typography = _interopRequireDefault(require("antd/lib/typography"));

var _avatar = _interopRequireDefault(require("antd/lib/avatar"));

var _form = _interopRequireDefault(require("antd/lib/form"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _icons = require("@ant-design/icons");

var _notification = require("../../../../src/components/assets/notification");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var __jsx = _react["default"].createElement;
var errors = {
  validateError: 'Missing values'
};

var Rescale = function Rescale(_ref) {
  var data = _ref.data,
      onSelect = _ref.onSelect;

  // State
  var _useState = (0, _react.useState)(false),
      visible = _useState[0],
      setVisible = _useState[1];

  var _useState2 = (0, _react.useState)(1),
      step = _useState2[0],
      setStep = _useState2[1];

  var _useState3 = (0, _react.useState)(),
      selected = _useState3[0],
      setSelected = _useState3[1];

  var _useState4 = (0, _react.useState)(),
      numberOfCores = _useState4[0],
      setNumberOfCores = _useState4[1];

  var _useState5 = (0, _react.useState)(0),
      price = _useState5[0],
      setPrice = _useState5[1];

  var _useState6 = (0, _react.useState)(false),
      loading = _useState6[0],
      setLoading = _useState6[1]; // Data


  var _Form$useForm = _form["default"].useForm(),
      _Form$useForm2 = (0, _slicedToArray2["default"])(_Form$useForm, 1),
      form = _Form$useForm2[0]; // Set keys


  data.coreTypes.forEach(function (d) {
    d.key = d.name;
  });
  console.log(data); // Get version options

  var options = data.freefem.versions.map(function (v) {
    return {
      label: v.version,
      value: v.id
    };
  }); // Table

  var columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: function render(text, record) {
      return __jsx(_space["default"], null, __jsx(_space["default"], {
        direction: "vertical"
      }, __jsx(_space["default"], null, __jsx(_avatar["default"], {
        style: {
          marginRight: '-20px',
          background: 'linear-gradient(to right,' + record.color + ', rgba(255, 255, 255, 0))',
          opacity: 0.5
        }
      }), __jsx(_typography["default"].Text, {
        strong: true
      }, text)), record.processorInfo));
    }
  }, {
    title: 'Cores',
    dataIndex: 'cores',
    key: 'cores',
    render: function render(cores) {
      return cores.join(', ');
    }
  }, {
    title: 'Memory',
    dataIndex: 'memory',
    key: 'memory',
    render: function render(text) {
      return text / 1000 + ' Go';
    }
  }, {
    title: 'Pro Price',
    dataIndex: 'price',
    key: 'price'
  }, {
    title: 'Price',
    dataIndex: 'lowPriorityPrice',
    key: 'lowPriorityPrice'
  }]; // Extend cores

  (0, _react.useEffect)(function () {
    if (selected !== null && selected !== void 0 && selected.cores) {
      var max = selected.cores[selected.cores.length - 1];
      var more = Math.floor(1000 / max);
      var cores = (0, _toConsumableArray2["default"])(selected.cores);

      for (var i = 0; i < more - 1; ++i) {
        cores.push(max * (i + 2));
      }

      selected.fullCores = cores;
    }
  }, [selected]); // Set price

  (0, _react.useEffect)(function () {
    if (step > 1) computePrice();
  }, [step]);
  /**
   * On row change
   * @param {string} selectedRowKeys key
   * @param {Object} selectedRows Seleced
   */

  var onRowChange = function onRowChange(selectedRowKeys, selectedRows) {
    setSelected(selectedRows[0]);
  };
  /**
   * Get checkbox props
   * @param {Object} record Record
   */


  var getCheckboxProps = function getCheckboxProps(record) {
    return {
      disabled: record.mustBeRequested
    };
  };
  /**
   * Close
   */


  var close = function close() {
    setVisible(false);
    setStep(1);
    setSelected();
    setNumberOfCores();
    setPrice(0);
    setLoading(false);
  };
  /**
   * On ok
   */


  var onOk = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var values, freefem;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(step === 1)) {
                _context.next = 5;
                break;
              }

              setNumberOfCores(selected.fullCores[0]);
              setStep(step + 1);
              _context.next = 21;
              break;

            case 5:
              setLoading(true);
              _context.prev = 6;
              _context.next = 9;
              return form.validateFields();

            case 9:
              values = _context.sent;
              freefem = options.find(function (o) {
                return o.value === values.version;
              });
              onSelect({
                inUseConfiguration: {
                  coreTypes: {
                    value: selected.code
                  },
                  numberOfCores: {
                    value: values.numberOfCores
                  },
                  lowPriority: {
                    value: values.lowPriority
                  },
                  freefemVersion: {
                    value: freefem.label,
                    id: freefem.value
                  }
                }
              });
              close();
              _context.next = 18;
              break;

            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](6);
              (0, _notification.Error)(errors.validateError, _context.t0);

            case 18:
              _context.prev = 18;
              setLoading(false);
              return _context.finish(18);

            case 21:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[6, 15, 18, 21]]);
    }));

    return function onOk() {
      return _ref2.apply(this, arguments);
    };
  }();
  /**
   * On cancel
   */


  var onCancel = function onCancel() {
    close();
  };
  /**
   * On cores step
   * @param {number} value Value
   * @param {string} type Type
   */


  var onCoresStep = function onCoresStep(value, type) {
    if (type === 'up') {
      var sorted = selected.fullCores.filter(function (c) {
        return c >= value;
      });
      return sorted.length ? sorted[0] : selected.fullCores[selected.fullCores.length - 1];
    } else {
      // down
      var _sorted = selected.fullCores.filter(function (c) {
        return c <= value;
      });

      return _sorted.length ? _sorted.pop() : selected.fullCores[0];
    }
  };
  /**
   *
   * @param {Object} changedValues Changed values
   * @param {Object} allValues All values
   */


  var onValuesChange = function onValuesChange(changedValues, allValues) {
    var newNumberOfCores = changedValues.numberOfCores;

    if (newNumberOfCores !== undefined) {
      // Check number of cores
      var correctedNumberOfCores;
      if (newNumberOfCores > numberOfCores) correctedNumberOfCores = onCoresStep(newNumberOfCores, 'up');else correctedNumberOfCores = onCoresStep(newNumberOfCores, 'down'); // Force from

      allValues.numberOfCores = correctedNumberOfCores;
      form.setFieldsValue(allValues);
      setNumberOfCores(correctedNumberOfCores);
    } // Compute price


    computePrice(); // Return number of cores for parser

    if (newNumberOfCores) return allValues.numberOfCores;
  };
  /**
   * Compute price
   */


  var computePrice = function computePrice() {
    var values = form.getFieldsValue(['lowPriority', 'numberOfCores']);
    var currentPrice = values.numberOfCores * (values.lowPriority ? selected === null || selected === void 0 ? void 0 : selected.lowPriorityPrice : selected === null || selected === void 0 ? void 0 : selected.price);
    currentPrice *= 100;
    currentPrice = Math.round(currentPrice);
    currentPrice /= 100;
    setPrice(currentPrice.toFixed(2));
  };
  /**
   * Render
   */


  return __jsx(_react["default"].Fragment, null, __jsx(_modal["default"], {
    title: "Rescale plugin",
    visible: visible,
    onCancel: onCancel,
    okText: step === 1 ? 'Next' : 'Ok',
    okButtonProps: {
      disabled: step === 1 && !selected,
      loading: loading
    },
    onOk: onOk,
    maskClosable: false,
    width: "80%"
  }, step === 1 && __jsx(_space["default"], {
    direction: "vertical",
    style: {
      width: '100%'
    }
  }, __jsx(_typography["default"].Title, {
    level: 5
  }, "Select a coretype"), __jsx(_table["default"], {
    pagination: false,
    size: "small",
    dataSource: data.coreTypes,
    columns: columns,
    rowSelection: {
      type: 'radio',
      onChange: onRowChange,
      getCheckboxProps: getCheckboxProps
    }
  })), step === 2 && __jsx(_space["default"], {
    direction: "vertical",
    style: {
      width: '100%'
    }
  }, __jsx(_card["default"], {
    title: "Informations"
  }, __jsx(_space["default"], {
    direction: "vertical"
  }, __jsx(_typography["default"].Text, null, selected.name, " Core (x", form.getFieldValue('numberOfCores'), ")"), __jsx(_typography["default"].Text, null, "Price: ", price, " / hour"))), __jsx(_form["default"], {
    form: form,
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 8
    },
    initialValues: {
      lowPriority: true,
      numberOfCores: selected.fullCores[0],
      version: options[0].value
    },
    onValuesChange: onValuesChange
  }, __jsx(_form["default"].Item, {
    name: "lowPriority",
    label: "Priority",
    htmlFor: "lowPriority",
    rules: [{
      required: true,
      message: '"Priority" is required'
    }]
  }, __jsx(_radio["default"].Group, {
    id: "lowPriority"
  }, __jsx(_radio["default"], {
    value: false
  }, "On-Demand Pro"), __jsx(_radio["default"], {
    value: true
  }, "On-Demand"))), __jsx(_form["default"].Item, {
    name: "numberOfCores",
    label: "Number of cores",
    htmlFor: "numberOfCores",
    rules: [{
      required: true,
      message: '"Number of cores" is required'
    }]
  }, __jsx(_inputNumber["default"], {
    id: "numberOfCores",
    min: selected.fullCores[0],
    max: selected.fullCores[selected.fullCores.length - 1],
    parser: function parser(value) {
      return onValuesChange({
        numberOfCores: value
      }, form.getFieldsValue());
    }
  })), __jsx(_form["default"].Item, {
    name: "version",
    label: "FreeFEM version",
    htmlFor: "version",
    rules: [{
      required: true,
      message: '"FreeFEM version" is required'
    }]
  }, __jsx(_select["default"], {
    id: "version",
    options: options
  })), __jsx(_form["default"].Item, {
    name: "walltime",
    label: "Walltime",
    htmlFor: "walltime",
    rules: [{
      required: true,
      message: '"FreeFEM version" is required'
    }]
  }, __jsx(_input["default"], {
    id: "walltime"
  }))))), __jsx(_space["default"], null, __jsx(_typography["default"].Text, null, "More information on", ' ', __jsx("a", {
    href: "https://www.rescale.com/infrastructure/",
    target: "_blank"
  }, "Rescale website"), "."), __jsx(_button["default"], {
    onClick: function onClick() {
      return setVisible(true);
    },
    icon: __jsx(_icons.SelectOutlined, null)
  })));
};

var _default = Rescale;
exports["default"] = _default;