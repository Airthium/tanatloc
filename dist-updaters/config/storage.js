/** @module config/storage */
var path = require('path');

var os = require('os'); // DEFAULT STORAGE


var DEFAULT_STORAGE = path.join(os.homedir(), 'tanatloc'); // STORAGE CHECK

if (!process.env.STORAGE_PATH) console.warn(' ⚠ No storage path configured, use default one in: ' + DEFAULT_STORAGE); // STORAGE

var STORAGE = process.env.STORAGE_PATH || DEFAULT_STORAGE; // AVATAR

var AVATAR = path.join(STORAGE, process.env.AVATAR_RELATIVE_PATH || 'avatar'); // GEOMETRY

var GEOMETRY = path.join(STORAGE, process.env.GEOMETRY_RELATIVE_PATH || 'geometry'); // SIMULATION

var SIMULATION = path.join(STORAGE, process.env.SIMULATION_RELATIVE_PATH || 'simulation');
module.exports = {
  STORAGE: STORAGE,
  AVATAR: AVATAR,
  GEOMETRY: GEOMETRY,
  SIMULATION: SIMULATION
};