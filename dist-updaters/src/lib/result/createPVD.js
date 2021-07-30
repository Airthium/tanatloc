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
 * Create PVD files
 * @param {Object} simulation Simulation
 * @param {Array} files Files
 */
var createPVD = function createPVD(simulation, files) {
  var PVDs = []; // Results filters

  var resultsFilters = simulation.scheme.configuration.run.resultsFilters;
  resultsFilters === null || resultsFilters === void 0 ? void 0 : resultsFilters.forEach(function (filter) {
    var pattern = new RegExp(filter.pattern);
    var filteredFiles = files.filter(function (file) {
      return pattern.test(file);
    });

    if (filteredFiles.length) {
      // Set iteration numbers
      var vtuFiles = filteredFiles.map(function (file) {
        var number = file.replace(new RegExp(filter.prefixPattern), '').replace(new RegExp(filter.suffixPattern), '');
        return {
          name: file,
          number: +number
        };
      }); // Sort

      vtuFiles.sort(function (a, b) {
        return a.number - b.number;
      }); // Multiplicator

      var multiplicator;
      var multiplicatorPath = filter.multiplicator;

      if (multiplicatorPath) {
        var multiplicatorObject = multiplicatorPath.reduce(function (a, v) {
          return a[v];
        }, simulation.scheme.configuration);
        multiplicator = multiplicatorObject.value || multiplicatorObject["default"];
      } // PVD file


      var pvdName = filter.name + '.pvd';

      var pvdPath = _path["default"].join(_storage["default"].SIMULATION, simulation.id, 'run', filter.name + '.pvd');

      var pvd = _fs["default"].createWriteStream(pvdPath);

      pvd.write('<?xml version="1.0"?>\n');
      pvd.write('<VTKFile type="Collection" version="0.1"\n');
      pvd.write('\tbyte_order="LittleEndian"\n');
      pvd.write('\tcompressor="vtkZLibDataCompressor">\n');
      pvd.write('\t<Collection>\n');
      vtuFiles.forEach(function (file, index) {
        pvd.write('\t\t<DataSet timestep="' + (multiplicator ? file.number * multiplicator : index) + '" group="" part="0"\n');
        pvd.write('\t\t\tfile="result/' + file.name + '"/>\n');
      });
      pvd.write('\t</Collection>\n');
      pvd.write('</VTKFile>');
      pvd.end();
      PVDs.push({
        name: pvdName,
        path: pvdPath
      });
    }
  });
  return PVDs;
};

var _default = createPVD;
exports["default"] = _default;