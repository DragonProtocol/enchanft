// eslint-disable-next-line import/prefer-default-export
export const backToTop =() => {
    document.getElementById('layoutMainScroll')?.scrollTo({ top: 0, behavior: 'smooth' })
}