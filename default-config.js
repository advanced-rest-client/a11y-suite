/* eslint-disable import/no-extraneous-dependencies */
const createDefaultConfig = require('@open-wc/testing-karma/default-config');
const merge = require('webpack-merge');

module.exports = function createEsmConfig(config) {
  config.set(
      merge(createDefaultConfig(config), {
        files: [
          'node_modules/axe-core/axe.min.js'
        ]
      }),
  );
  return config;
};
