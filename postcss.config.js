export default {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16,
      propList: ['*'],
      minPixelValue: 3, // 1–2px (border 등)은 변환 제외
    },
  },
}
