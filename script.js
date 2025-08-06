const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const images = {
  blue: createImage("balloon_blue.png"),
  red: createImage("balloon_red.png"),
  green: createImage("balloon_green.png"),
  yellow: createImage("balloon_yellow.png"),
};
const giftImage = createImage("gift.png");
const catImage = createImage("cat.gif");
const popSound = new Audio("pop.mp3");

function createImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

let balloons = [];
let allPopped = false;
let giftOpened = false;
const colors = ["blue","red","green","yellow"];
const radius = Math.min(window.innerWidth, window.innerHeight) * 0.04;
const giftSize = radius * 3.3;

function generateBalloons() {
  balloons = [];
  for (let i = 0; i < 8; i++) {
    balloons.push({
      x: Math.random() * (canvas.width - radius*2) + radius,
      y: canvas.height + Math.random() * 200,
      color: colors[i % colors.length],
      popped: false,
      speed: Math.random() * 1.5 + 0.5
    });
  }
}
generateBalloons();

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  balloons.forEach(b => {
    if (!b.popped) {
      const dx = b.x - x, dy = b.y - y;
      if (Math.sqrt(dx*dx + dy*dy) < radius) {
        b.popped = true;
        popSound.currentTime = 0;
        popSound.play();
      }
    }
  });

  if (allPopped && !giftOpened) {
    const gx = canvas.width / 2 - giftSize / 2;
    const gy = canvas.height / 2 - giftSize / 2;
    console.log("Click:", x,y, "Gift zone:", gx,gy, giftSize);
    if (x >= gx && x <= gx + giftSize && y >= gy && y <= gy + giftSize) {
      giftOpened = true;
      document.getElementById("message").style.display = "block";
      document.getElementById("giftHint").style.display = "none";
      document.getElementById("restartBtn").style.display = "block";
      // الخطوة اللي طالبها: إظهار الصورة البكسلية
      const pixel = document.getElementById("pixelMessage");
      if (pixel) pixel.style.display = "block";
    }
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  allPopped = balloons.every(b => b.popped);
  balloons.forEach(b => {
    if (!b.popped) {
      ctx.drawImage(images[b.color], b.x - radius, b.y - radius, radius*2, radius*2);
      b.y -= b.speed;
      if (b.y < -radius) {
        b.y = canvas.height + Math.random() * 100;
      }
    }
  });

  if (allPopped) {
    ctx.drawImage(giftImage, canvas.width/2 - giftSize/2, canvas.height/2 - giftSize/2, giftSize, giftSize);
  }

  if (giftOpened) {
    [ -80, 0, 80 ].forEach(offset => {
      let t = Date.now() / 500;
      let alpha = (Math.sin(t) + 1) / 2;
      ctx.globalAlpha = alpha;
      ctx.drawImage(catImage, canvas.width/2 + offset, canvas.height/2 + 60, 80, 80);
      ctx.globalAlpha = 1;
    });
  }

  requestAnimationFrame(draw);
}

draw();

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("bgMusic").play();
}

function restartGame() {
  location.reload();
}

document.getElementById("startButton").addEventListener("click", startGame);
