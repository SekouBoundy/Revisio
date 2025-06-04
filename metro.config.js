// <project root>/metro.config.js

/** @type {import('expo/metro-config').MetroConfig} */
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // If you need to add any extra file extensions (e.g. "json"), you can do so here:
  config.resolver.assetExts.push("json");

  return config;
})();
