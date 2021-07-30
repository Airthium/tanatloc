"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createSummary = _interopRequireDefault(require("../createSummary"));

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
describe('lib/download/summary', function () {
  var simulation = {
    scheme: {
      algorithm: 'algorithm',
      configuration: {}
    }
  };
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
    var summary = (0, _createSummary["default"])(simulation);
    expect(summary).toEqual({
      path: 'path',
      name: 'summary.txt'
    });
  });
  test('full', function () {
    simulation.scheme.configuration = {
      part: {},
      geometry: {
        file: {
          name: 'name'
        }
      },
      materials: {
        values: [{
          material: {
            label: 'label',
            children: [{
              label: 'label',
              value: 'value',
              symbol: 'symbol'
            }]
          },
          selected: [{
            label: 1
          }]
        }]
      },
      parameters: {
        index: 0,
        parameter: {
          label: 'label',
          children: [{
            label: 'label',
            value: 'value'
          }]
        },
        otherParameter: {
          label: 'label',
          children: [{
            label: 'label',
            "default": 'default'
          }]
        }
      },
      boundaryConditions: {
        index: 0,
        type: {
          values: [{
            name: 'name',
            type: {
              label: 'label'
            },
            values: [{
              value: 'value'
            }, {
              value: 'value',
              checked: true
            }, {
              value: 'value',
              checked: false
            }],
            selected: [{
              label: 1
            }]
          }]
        },
        otherType: {},
        otherOtherType: {
          values: [{
            name: 'undefined',
            type: {
              label: 'undefined'
            },
            selected: []
          }]
        }
      },
      run: {
        cloudServer: {
          name: 'name'
        }
      },
      unknowKey: {}
    };
    var summary = (0, _createSummary["default"])(simulation);
    expect(summary).toEqual({
      path: 'path',
      name: 'summary.txt'
    });
  });
});