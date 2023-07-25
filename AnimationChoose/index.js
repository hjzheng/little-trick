const imgs = document.querySelectorAll('.img')
const pointer = document.querySelector('.pointer')

for (let imgEle of imgs) {
  imgEle.onmouseover = () => {
    const imgSize = imgEle.offsetWidth
    let x = imgEle.offsetLeft
    let y = imgEle.offsetTop

    pointer.style.setProperty('--x', `${x}px`)
    pointer.style.setProperty('--y', `${y}px`)
    pointer.style.setProperty('--imgSize', `${imgSize}px`)
  }
}