const Dotenv = require('dotenv-webpack');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add dotenv-webpack plugin
  config.plugins.push(new Dotenv());

  // Fallbacks for Node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    process: false,
  };

  return config;
};
