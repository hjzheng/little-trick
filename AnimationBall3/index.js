const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const points = [];
const ballElement = document.getElementById('ball');

function drawPoints(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 1, 0, 2 * Math.PI);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();
}

function draw() {

  const rect = ballElement.getBoundingClientRect();

  if (points.length > 1000) points.shift();

  points.push({
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2
  })

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points.forEach(point => {
    drawPoints(point.x, point.y);
  });
  requestAnimationFrame(draw);
}

draw();

