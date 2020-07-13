const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "bcm",
    projectName: "legacy",
    webpackConfigEnv,
  });

  return webpackMerge.smart(defaultConfig, {
    module: {
      rules: [
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "raw-loader",
        },
        // {
        //   test: /\.css$/,
        //   exclude: /node_modules/,
        //   use: ["style-loader", "css-loader"],
        // },
      ],
    },
  });
};
