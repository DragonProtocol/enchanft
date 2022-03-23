export const getLayoutMainScrollBox = ()=> document.getElementById('layoutMainScroll') || window.document.body
export const backToTop =() => {
    getLayoutMainScrollBox()?.scrollTo({ top: 0, behavior: 'smooth' })
}