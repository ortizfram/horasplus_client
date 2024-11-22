const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Fallbacks for Node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    process: false,
  };

  return config;
};
