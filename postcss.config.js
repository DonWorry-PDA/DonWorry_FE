export default {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16,
      // border-radius 제외: Tailwind v4가 rounded-full에 3.40282e+38px(과학적 표기법)을
      // 사용하는데, pxtorem 정규식이 e+38px에서 38px만 변환해 값을 깨뜨림
      propList: ['*', '!border-radius', '!border-top-left-radius', '!border-top-right-radius', '!border-bottom-left-radius', '!border-bottom-right-radius'],
      minPixelValue: 3, // 1–2px (border 등)은 변환 제외
    },
  },
}
