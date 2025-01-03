const path = require('path'); // 'path' 모듈 추가

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'], // 확장자 설정
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'), // 절대 경로 설정
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // CSS 로더 설정
      },
    ],
  },
};
