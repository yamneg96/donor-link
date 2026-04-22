const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

// 1. Find the project and workspace roots
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 2. Monorepo Configuration
// Watch all files within the monorepo (packages/types, etc.)
config.watchFolders = [workspaceRoot];

// Let Metro know where to resolve packages from
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Force Metro to resolve shared packages correctly in a monorepo
config.resolver.disableHierarchicalLookup = true;

// 3. Export with NativeWind
module.exports = withNativeWind(config, {
  input: "./global.css",
  inlineRem: 16
});