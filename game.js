const canvas = document.getElementById("gc");
const ctx = canvas.getContext("2d");

const grid = 20;
let speed = 7;
let running = false;
let score = 0;
let level = 1;
let time = 0;

let gameLoopId, timerId;

const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

let highScore = localStorage.getItem("snakeHigh") || 0;
document.getElementById("highScore").innerText = highScore;

let snake, food;

function initGame(){
  snake = {
    x: 200, y: 200,
    dx: grid, dy: 0,
    cells: [], maxCells: 4
  };
  food = {};
  score = 0;
  level = 1;
  time = 0;
  speed = 7;

  updateUI();
  randomFood();
}

function updateUI(){
  scoreEl.textContent = score;
  levelEl.textContent = level;
  timeEl.textContent = time;
}

const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const timeEl = document.getElementById("time");

function randomFood(){
  food.x = Math.floor(Math.random()*(canvas.width/grid))*grid;
  food.y = Math.floor(Math.random()*(canvas.height/grid))*grid;
}

function startGame(){
  if(running) return;
  initGame();
  running = true;

  gameLoopId = setInterval(gameLoop,1000/speed);
  timerId = setInterval(()=>{ time++; timeEl.textContent=time; },1000);
}

function stopGame(){
  running = false;
  clearInterval(gameLoopId);
  clearInterval(timerId);
}

function gameLoop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if(snake.x<0||snake.y<0||snake.x>=canvas.width||snake.y>=canvas.height){
    endGame();
  }

  snake.cells.unshift({x:snake.x,y:snake.y});
  if(snake.cells.length>snake.maxCells) snake.cells.pop();

  ctx.fillStyle="red";
  ctx.fillRect(food.x,food.y,grid-2,grid-2);

  ctx.fillStyle="lime";
  snake.cells.forEach((cell,i)=>{
    ctx.fillRect(cell.x,cell.y,grid-2,grid-2);

    if(cell.x===food.x && cell.y===food.y){
      eatSound.play();
      snake.maxCells++;
      score++;
      scoreEl.textContent = score;
      randomFood();

      // SPEED + LEVEL SYSTEM
      if(score % 5 === 0){
        level++;
        levelEl.textContent = level;
        speed++;
        clearInterval(gameLoopId);
        gameLoopId = setInterval(gameLoop,1000/speed);
      }
    }

    for(let j=i+1;j<snake.cells.length;j++){
      if(cell.x===snake.cells[j].x && cell.y===snake.cells[j].y){
        endGame();
      }
    }
  });
}

function endGame(){
  gameOverSound.play();
  stopGame();
  if(score>highScore){
    highScore=score;
    localStorage.setItem("snakeHigh",highScore);
    document.getElementById("highScore").innerText=highScore;
  }
  alert("Game Over!");
}

document.addEventListener("keydown",e=>{
  if(!running) return;
  if(e.key==="ArrowUp"&&snake.dy===0){snake.dx=0;snake.dy=-grid}
  if(e.key==="ArrowDown"&&snake.dy===0){snake.dx=0;snake.dy=grid}
  if(e.key==="ArrowLeft"&&snake.dx===0){snake.dx=-grid;snake.dy=0}
  if(e.key==="ArrowRight"&&snake.dx===0){snake.dx=grid;snake.dy=0}
});

const Snake={
  action(dir){
    if(!running) return;
    if(dir==="up"&&snake.dy===0){snake.dx=0;snake.dy=-grid}
    if(dir==="down"&&snake.dy===0){snake.dx=0;snake.dy=grid}
    if(dir==="left"&&snake.dx===0){snake.dx=-grid;snake.dy=0}
    if(dir==="right"&&snake.dx===0){snake.dx=grid;snake.dy=0}
  }
};
