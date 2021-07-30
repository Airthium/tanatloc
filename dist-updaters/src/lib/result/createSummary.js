"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _storage = _interopRequireDefault(require("../../../config/storage"));

/**
 * Create summary
 * @param {Object} simulation Simulation
 */
var createSummary = function createSummary(simulation) {
  // Name
  var summaryName = 'summary.txt';

  var summaryPath = _path["default"].join(_storage["default"].SIMULATION, simulation.id, 'run', summaryName); // Stream


  var summary = _fs["default"].createWriteStream(summaryPath); // Header


  summary.write(simulation.name + '\n');
  summary.write('algorithm: ' + simulation.scheme.algorithm + '\n\n'); // Keys

  Object.keys(simulation.scheme.configuration).forEach(function (key) {
    var config = simulation.scheme.configuration[key];

    if (key === 'geometry') {
      geometrySummary(summary, config);
    } else if (key === 'materials') {
      materialsSummary(summary, config);
    } else if (key === 'parameters') {
      parametersSummary(summary, config);
    } else if (key === 'boundaryConditions') {
      boundaryConditionsSummary(summary, config);
    } else if (key === 'run') {
      runSummary(summary, config);
    }
  });
  summary.end();
  return {
    name: summaryName,
    path: summaryPath
  };
};
/**
 * Geometry summary
 * @param {Object} stream Write stream
 * @param {Object} configuration Configuration
 */


var geometrySummary = function geometrySummary(stream, configuration) {
  stream.write('Geometry:\n');
  stream.write(' - ' + configuration.value + '\n\n');
};
/**
 * Materials summary
 * @param {Object} stream Write stream
 * @param {Object} configuration Configuration
 */


var materialsSummary = function materialsSummary(stream, configuration) {
  stream.write('Materials:\n');
  configuration.values.forEach(function (value) {
    stream.write(' - ' + value.material.label + ':\n');
    value.material.children.forEach(function (child) {
      stream.write('  - ' + child.label + ', ' + child.symbol + ' = ' + child.value + '\n');
    });
    stream.write('  - Selected: [');
    stream.write(value.selected.map(function (select) {
      return select.label;
    }).join(', '));
    stream.write(']\n');
  });
  stream.write('\n');
};
/**
 * Parameters summary
 * @param {Object} stream Write stream
 * @param {Object} configuration Configuration
 */


var parametersSummary = function parametersSummary(stream, configuration) {
  stream.write('Parameters:\n');
  Object.keys(configuration).forEach(function (subKey) {
    if (subKey === 'index' || subKey === 'title' || subKey === 'done') return;
    var subConfiguration = configuration[subKey];
    stream.write('- ' + subConfiguration.label + ':\n');
    subConfiguration.children.forEach(function (child) {
      stream.write('  - ' + child.label + ': ' + (child.value || child["default"]) + '\n');
    });
  });
  stream.write('\n');
};
/**
 * Boundary conditions summary
 * @param {Object} stream Write stream
 * @param {Object} configuration Configuration
 */


var boundaryConditionsSummary = function boundaryConditionsSummary(stream, configuration) {
  stream.write('Boundary conditions:\n');
  Object.keys(configuration).forEach(function (subKey) {
    if (subKey === 'index' || subKey === 'title' || subKey === 'done') return;
    var subConfiguration = configuration[subKey];

    if (subConfiguration.values) {
      subConfiguration.values.forEach(function (value) {
        stream.write(' - ' + value.name + ' (' + value.type.label + '):\n');
        if (value.values) value.values.forEach(function (subValue) {
          stream.write('  - ' + subValue.value);
          if (subValue.checked !== undefined) stream.write(' (' + (subValue.checked ? 'active' : 'unactive') + ')');
          stream.write('\n');
        });
        stream.write('  - Selected: [');
        stream.write(value.selected.map(function (select) {
          return select.label;
        }).join(', '));
        stream.write(']\n');
      });
    }
  });
  stream.write('\n');
};
/**
 * Run
 * @param {Object} stream Write stream
 * @param {Object} configuration Configuration
 */


var runSummary = function runSummary(stream, configuration) {
  stream.write('Run:\n');
  stream.write(' - Server: ' + configuration.cloudServer.name + '\n\n');
};

var _default = createSummary;
exports["default"] = _default;