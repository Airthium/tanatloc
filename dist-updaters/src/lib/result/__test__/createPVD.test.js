"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createPVD = _interopRequireDefault(require("../createPVD"));

var mockPath = jest.fn();
jest.mock('path', function () {
  return {
    join: function join() {
      return mockPath();
    }
  };
});
var mockCreateWriteStream = jest.fn();
jest.mock('fs', function () {
  return {
    createWriteStream: function createWriteStream() {
      return mockCreateWriteStream();
    }
  };
});
jest.mock("../../../../config/storage", function () {
  return {
    SIMULATION: 'simulation'
  };
});
describe('lib/download/pvd', function () {
  var simulation = {
    scheme: {
      configuration: {
        run: {}
      }
    }
  };
  var files = ['result_1.vtu', 'result_2.vtu'];
  beforeEach(function () {
    mockPath.mockReset();
    mockPath.mockImplementation(function () {
      return 'path';
    });
    mockCreateWriteStream.mockReset();
    mockCreateWriteStream.mockImplementation(function () {
      return {
        write: jest.fn(),
        end: jest.fn()
      };
    });
  });
  test('call', function () {
    var pvds = (0, _createPVD["default"])(simulation, files);
    expect(pvds).toEqual([]);
  });
  test('full', function () {
    simulation.scheme.configuration = {
      run: {
        resultsFilters: [{
          name: 'Name',
          prefixPattern: 'result_',
          suffixPattern: '.vtu',
          pattern: 'result_\\d+.vtu',
          multiplicator: ['parameters', 'time', 'children', '1']
        }]
      },
      parameters: {
        time: {
          children: [{}, {
            "default": 0.1
          }]
        }
      }
    };
    var pvds = (0, _createPVD["default"])(simulation, files);
    expect(pvds).toEqual([{
      name: 'Name.pvd',
      path: 'path'
    }]); // Without multiplicator

    delete simulation.scheme.configuration.run.resultsFilters[0].multiplicator;
    pvds = (0, _createPVD["default"])(simulation, files);
    expect(pvds).toEqual([{
      name: 'Name.pvd',
      path: 'path'
    }]);
  });
  test('no filtered files', function () {
    simulation.scheme.configuration = {
      run: {
        resultsFilters: [{
          name: 'Name',
          prefixPattern: 'Result_',
          suffixPattern: '.vtu',
          pattern: 'Result_\\d+.vtu',
          multiplicator: ['parameters', 'time', 'children', '1']
        }]
      },
      parameters: {
        time: {
          children: [{}, {
            "default": 0.1
          }]
        }
      }
    };
    var pvds = (0, _createPVD["default"])(simulation, files);
    expect(pvds).toEqual([]);
  });
});