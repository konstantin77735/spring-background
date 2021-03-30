var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function Spring(opts) {
  var opts = opts || {};
  
  this.damp = opts.damp;
  this.mass = opts.mass;
  this.k = opts.k;
  
  this.pos = opts.pos || 0;
  this.tempPos = opts.pos || 0;
  this.size = opts.size || 0;
  
  this.max = opts.max;
  this.min = opts.min;
  
  this.vel = 0;
  
  this.update = function() {
    var force = -this.k * (this.tempPos - this.pos);  // f=-ky 
    var accel = force / this.mass;
    this.vel = this.damp * (this.vel + accel); 
    this.tempPos = this.tempPos + this.vel;
  };
}

var w = canvas.getBoundingClientRect().width;
var h = canvas.getBoundingClientRect().height;

var handleHeight = 0.5;

var t = 0;

var mySpring = new Spring({
  pos: 0,
  damp: 0.85,
  mass: 50,
  k: 6,
});

console.log(mySpring.pos);

var mouse = {
  x: 0,
  y: 0,
};

var stretch = 0;

canvas.addEventListener('mousemove', function(e) {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
});

window.addEventListener('mouseout', function(e) {
  if (e.target === document || e.target === canvas) { mouse = {}; }
});

function update() {
  mySpring.update();
  
  if (stretch) {
    mySpring.tempPos = stretch;
  }
  
  // if (mouse.y/h < 0.7 && mouse.y/h > 0.3) {
  //   mySpring.tempPos = mouse.y / h - 0.5;
  // }
  
  handleHeight = 0.5 + mySpring.tempPos;
  //handleHeight = Math.max(Math.min(mySpring.tempPos, 1), 0);
}

function draw() {

  // Set size to what the CSS says
  canvas.setAttribute('width', w);
  canvas.setAttribute('height', h);

  ctx.beginPath();
  ctx.fillStyle='#fff';
  ctx.rect(0,0,w,h);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle='#000';
  ctx.moveTo(0,h/2);
  ctx.bezierCurveTo(w/3, h * handleHeight, w/3*2, h * handleHeight, w, h/2);
  //ctx.bezierCurveTo(mouse.x - 10, h * handleHeight, mouse.x + 10, h * handleHeight, w, h/2);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);

  ctx.fill();
}

function mainLoop() {
  update();
  draw();
  requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);










function checkScroll() {
  const canvasBoundingRect = canvas.getBoundingClientRect();
  const bottomDiff = canvasBoundingRect.bottom - document.documentElement.clientHeight;
  const bottomOfElementIsBelowBottomOfViewport = bottomDiff > 0;
  console.log(bottomDiff / (canvasBoundingRect.bottom - canvasBoundingRect.top));
  const topOfElementIsAboveTopOfViewport = canvasBoundingRect.top < 0;
  
  if (bottomOfElementIsBelowBottomOfViewport) {
    stretch = 0.5 - (bottomDiff / (canvasBoundingRect.bottom - canvasBoundingRect.top));
    //threshold.classList.add('past-bottom');
  } else {
    stretch = 0;
    //threshold.classList.remove('past-bottom');
  }
  
  if (topOfElementIsAboveTopOfViewport) {
    //threshold.classList.add('past-top');
  } else {
    //threshold.classList.remove('past-top');
  }
}

document.addEventListener('scroll', checkScroll);

checkScroll();