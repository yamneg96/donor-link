const { withProjectBuildGradle } = require("@expo/config-plugins");

module.exports = function withGradleRepositoriesFix(config) {
  return withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    const jitpackRepo = `maven { url 'https://jitpack.io' }`;

    // Ensure JitPack exists in ALL repository blocks
    if (!contents.includes("https://jitpack.io")) {
      contents = contents.replace(
        /allprojects\s*{\s*repositories\s*{/g,
        (match) => `${match}\n        ${jitpackRepo}`
      );

      contents = contents.replace(
        /repositories\s*{/g,
        (match) => `${match}\n        ${jitpackRepo}`
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};