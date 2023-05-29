window.onload = function () {
  const context = getCanvasContext();
  const canvas = context.canvas;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Partition {
    constructor() {
      this.centerX = canvas.width / 2;
      this.centerY = canvas.height / 2;
      this.r = Math.min(this.centerX, this.centerY) / 2;
      this.radius = getRandom(0, 360) * Math.PI / 180;
      this.x = this.centerX + this.r * Math.cos(this.radius);
      this.y = this.centerY + this.r * Math.sin(this.radius);
      this.size = getRandom(2, 4);
    }

    draw() {
      context.beginPath();
      context.fillStyle = 'rgba(0, 0, 0, 1)';
      context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      context.fill();
    }

    moveTo(tx, ty) {
     const startX = this.x;
     const startY = this.y;

     const duration = 100;

     const speedX = (tx - startX) / duration;
     const speedY = (ty - startY) / duration;
     const startTime = Date.now();

     const _moveTo = () => {
      const t =  Date.now() - startTime;
      const x = startX + speedX * t;
      const y = startY + speedY * t;
      
      this.x = x;
      this.y = y;

      if (t >= duration) {
        this.x = tx;
        this.y = ty;
        return;
      }

      requestAnimationFrame(_moveTo)
     }

     _moveTo();
    }
  }

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawText() {
    const text = getText();
    console.log(text)
    context.fillStyle = 'rgba(0, 0, 0, 1)';
    context.font = '100px Arial';
    context.measureText(text);
    context.fillText(text, (canvas.width - context.measureText(text).width)/ 2, canvas.height / 2 + 10);
  }

  function getPoints() {
    let points = []
    const { width, height, data } = context.getImageData(0, 0, canvas.width, canvas.height);

    let gap = 4;

    for (let i=0; i<width; i+=gap) {
      for (let j=0; j<height; j+=gap) {
        let index = (i + j * width) * 4;
        
        let r = data[index];
        let g = data[index + 1];
        let b = data[index + 2];
        let a = data[index + 3];

        if (r === 0 && g === 0 && b === 0 && a === 255) {
          points.push({
            x: i,
            y: j
          })
        }
      }
    }

    return points;
  }

  let partitions = [];

  function update() {
    drawText();
    let points = getPoints();
    clear();

    for (let i=0; i<points.length; i++) {
      let partition = partitions[i];
      
      if (!partition) {
        partition = new Partition();
        partitions.push(partition);
      }

      partition.moveTo(points[i].x, points[i].y);
    }

    if (points.length < partitions.length) {
      partitions.splice(points.length);
    }
  }

  function draw() {
    clear();
    update();
    partitions.forEach(partition => {
      partition.draw();
    })
    requestAnimationFrame(draw);
  }

  for (let i = 0; i < 400; i++) {
    let partition = new Partition();
    partitions.push(partition);
  }
  
  draw();
}

function getText() {
  return new Date().toTimeString().substring(0, 8)
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}


function getCanvasContext() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d', {
    willReadFrequently: true
  });
  return context;
}