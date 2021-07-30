"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleter = exports.updater = exports.getter = exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _pg = require("pg");

var _db = _interopRequireDefault(require("../../config/db"));

/** @module database */

/**
 * Start database
 * @returns {Object} Pool
 */
var startdB = function startdB() {
  return new _pg.Pool({
    user: _db["default"].USER,
    host: _db["default"].HOST,
    database: _db["default"].DATABASE,
    password: _db["default"].PASSWORD,
    port: _db["default"].PORT
  });
};

var pool = startdB();
/**
 * PostgreSQL query
 * @param {string} command Command
 * @param {Array} args Arguments
 */

var query = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(command, args) {
    var client, res;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return pool.connect();

          case 2:
            client = _context.sent;
            _context.next = 5;
            return client.query(command, args);

          case 5:
            res = _context.sent;
            client.release();
            return _context.abrupt("return", res);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function query(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Get from dB
 * @param {string} db Database
 * @param {string} id Id, or key
 * @param {Array} data Data
 * @param {string} key Key override id
 */


var getter = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(db, id, data) {
    var key,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            key = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : 'id';
            return _context2.abrupt("return", query('SELECT ' + data.join(',') + ' FROM ' + db + ' WHERE ' + key + ' = $1', [id]));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getter(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Update from dB
 * @param {string} db Database
 * @param {string} id Id
 * @param {Array} data Data [{ type, method, key, path, value }, ...]
 */


exports.getter = getter;

var updater = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(db, id, data) {
    var queryTextBegin, queryTextEnd, args, keys, queryTextMiddle;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            queryTextBegin = 'UPDATE ' + db + ' SET ';
            queryTextEnd = id ? ' WHERE id = $1' : '';
            args = id ? [id] : []; // Check that keys are uniques

            keys = [];
            data.forEach(function (d) {
              if (keys.includes(d.key)) throw new Error('Duplicate key in update query (key=' + d.key + ')');else keys.push(d.key);
            }); // Set query text & args

            queryTextMiddle = [];
            data.forEach(function (d) {
              if (d.type === 'crypt') {
                args.push(d.value);
                queryTextMiddle.push(d.key + ' = crypt($' + args.length + ", gen_salt('bf'))");
              } else if (d.type === 'array') {
                if (d.method === 'append') {
                  args.push(d.value);
                  queryTextMiddle.push(d.key + ' = array_append(' + d.key + ', $' + args.length + ')');
                } else if (d.method === 'remove') {
                  args.push(d.value);
                  queryTextMiddle.push(d.key + ' = array_remove(' + d.key + ', $' + args.length + ')');
                } else {
                  throw new Error('No method specified for array update');
                }
              } else if (d.type === 'json') {
                if (d.method === 'set') {
                  if (!d.value) throw new Error('Empty json value');
                  args.push(d.value);
                  queryTextMiddle.push(d.key + ' = jsonb_set(' + d.key + ", '{" + d.path.join(',') + "}', $" + args.length + ')');
                } else if (d.method === 'erase') {
                  queryTextMiddle.push(d.key + ' = jsonb_set(' + d.key + ", '{" + d.path.join(',') + "}', 'null'" + ')');
                } else {
                  throw new Error('No method specified for json update');
                }
              } else {
                args.push(d.value);
                queryTextMiddle.push(d.key + ' = $' + args.length);
              }
            });
            _context3.next = 9;
            return query(queryTextBegin + queryTextMiddle.join(', ') + queryTextEnd, args);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function updater(_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Delete from dB
 * @param {string} db Database
 * @param {string} id Id
 */


exports.updater = updater;

var deleter = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(db, id) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return query('DELETE FROM ' + db + ' WHERE id = $1', [id]);

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function deleter(_x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();

exports.deleter = deleter;
var _default = query;
exports["default"] = _default;