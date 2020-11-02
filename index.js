'use strict';

const path = require('path');

let GIT = process.env.GIT_SSH_COMMAND || process.env.GIT_SSH || 'git';

if (process.env.GIT_EXEC_PATH) {
  GIT = path.join(process.env.GIT_EXEC_PATH, 'git');
}

exports.GIT = GIT;
exports.common = require('./lib/gitsz/common');
exports.Batch = require('./lib/gitsz/batch');
exports.Hash = require('./lib/gitsz/hash');
exports.LegacyHash = require('./lib/gitsz/legacy-hash');
exports.API = require('./lib/gitsz/api');
