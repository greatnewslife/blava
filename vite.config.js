const path = require('path');

export default {
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'Blava',
    },
  },
};
