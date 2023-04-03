const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function init() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

init()

const fontSize = 10 * devicePixelRatio

const columnCount = Math.floor(canvas.width/fontSize)
const charIndex = new Array(columnCount).fill(0)

function draw() {
  ctx.font = `${fontSize}px Arial`
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#76EE00' // '#4169E1'
  ctx.textBaseline = 'top'
  
  for (let i=0; i<columnCount; i++) {
    let text = getRandomChar()
    let x = i*fontSize
    let y = charIndex[i] * fontSize
    
    ctx.fillText(text, x, y)
    
    if (y > canvas.height && Math.random() > 0.9) {
      charIndex[i] = 0
    } else {
      charIndex[i]++
    }
  }
}

function getRandomChar() {
  // let str = '0123456789abcdefghijklmnopqrstuvwxyz'
  let str = '皇帝二载秋闰八月初吉杜子将北征苍茫问家室维时遭艰虞朝野无暇日顾惭恩私被诏许归蓬筚拜辞诣阙下怵惕久未出'
  return str[Math.floor(Math.random() * str.length)]
}

draw()

// setInterval(draw, 1000/60)
// setInterval(draw, 1000)
setInterval(draw, 1000/9)
