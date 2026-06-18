// inline style에서 px 값을 rem으로 변환할 때 사용. Tailwind 클래스로 표현 불가능한 동적 값에만 사용할 것.
// 예: <div style={{ height: pxr(headerHeight) }}>
const pxr = (px: number) => `${px / 16}rem`

export default pxr
