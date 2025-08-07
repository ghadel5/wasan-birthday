const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balloonImages = {
  blue: new Image(),
  red: new Image(),
  green: new Image(),
  yellow: new Image(),
};

balloonImages.blue.src = "balloon_blue.png";
balloonImages.red.src = "balloon_red.png";
balloonImages.green.src = "balloon_green.png";
balloonImages.yellow.src = "balloon_yellow.png";

const giftImage = new Image();
giftImage.src = "gift.png";
const catImage = new Image();
catImage.src = "cat.gif";
const popSound = new Audio("pop.mp3");

let balloons = [];
let allPopped = false, giftOpened = false;
const colors = ["blue","red","green","yellow"];
const radius = Math.min(window.innerWidth, window.innerHeight) * 0.04;
const giftSize = radius * 3.3;

function generateBalloons(){
  balloons = [];
  for(let i = 0; i < 10; i++){
    let color = colors[i % colors.length];
    balloons.push({
      x: Math.random() * (canvas.width - radius * 2) + radius,
      y: canvas.height + Math.random() * 200,
      color, popped: false,
      speed: Math.random() * 1.5 + 0.5
    });
  }
}
generateBalloons();

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left, y = e.clientY - rect.top;
  balloons.forEach(b => {
    if (!b.popped) {
      const dx = b.x - x, dy = b.y - y;
      if (Math.sqrt(dx*dx + dy*dy) < radius) {
        b.popped = true; popSound.currentTime = 0; popSound.play();
      }
    }
  });
  if (allPopped && !giftOpened) {
    const gx = canvas.width/2 - giftSize/2;
    const gy = canvas.height/2 - giftSize/2;
    if (x > gx && x < gx + giftSize && y > gy && y < gy + giftSize) {
      giftOpened = true;
      document.getElementById("message").style.display = "block";
      document.getElementById("giftHint").style.display = "none";
      document.getElementById("restartBtn").style.display = "block";
    }
  }
});

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  allPopped = balloons.every(b => b.popped);
  balloons.forEach(b => {
    if (!b.popped) {
      let img = balloonImages[b.color];
      ctx.drawImage(img, b.x-radius, b.y-radius, radius*2, radius*2);
      b.y -= b.speed;
      if (b.y < -radius) b.popped = true;
    }
  });
  if (allPopped) {
    ctx.drawImage(giftImage, canvas.width/2 - giftSize/2, canvas.height/2 - giftSize/2, giftSize, giftSize);
    if (!giftOpened) {
      document.getElementById("giftHint").style.display = "block";
    } else {
      const positions = [canvas.width/2 -120, canvas.width/2 -40, canvas.width/2 +40];
      positions.forEach(x => {
        let t = Date.now()/500; let alpha = (Math.sin(t)+1)/2;
        ctx.globalAlpha = alpha;
        ctx.drawImage(catImage, x, canvas.height/2 +60, 80,80);
        ctx.globalAlpha = 1;
      });
    }
  }
  requestAnimationFrame(draw);
}
draw();

function startGame(){
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("bgMusic").play();
}
function restartGame(){ location.reload(); }
document.getElementById("startButton").addEventListener("click", startGame);
