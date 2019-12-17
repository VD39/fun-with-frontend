module.exports = {
  devServer: {
    proxy: {
      '': {
        target: 'https://xkcd.com',
        secure: false,
      },
    },
  },
};
