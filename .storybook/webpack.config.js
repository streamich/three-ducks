module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    enforceExtension: false,
  },
};
