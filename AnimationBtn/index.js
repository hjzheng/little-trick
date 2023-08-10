const feTurbulence = document.querySelector('feTurbulence')
const val = {
  freq: 0.00001,
}

const tl = gsap.timeline({
  paused: true,
  onUpdate() {
    feTurbulence.setAttribute('baseFrequency', `0 ${val.freq}`)
  }
})

const btn = document.querySelector('.btn')

btn.addEventListener('mouseover', () => {
  tl.restart()
}, false)


tl.to(val, {
  freq: 0.4,
  duration: 0.1
})

tl.to(val, {
  freq: 0.00001,
  duration: 0.1
})