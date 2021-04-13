const { getMode } = require('./mode');
const { getTarget } = require('./target');
const { getStats } = require('./stats');
const { getEntry } = require('./entry');
const { getDevtool } = require('./devtool');
const { getOutput } = require('./output');
const { getResolve } = require('./resolve');
const { getOptimization } = require('./optimization');
const { getDevServer } = require('./dev-server');

module.exports = {
  getMode,
  getTarget,
  getStats,
  getEntry,
  getDevtool,
  getOutput,
  getResolve,
  getOptimization,
  getDevServer,
};
