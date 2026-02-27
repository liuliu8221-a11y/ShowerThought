let allThoughts = [];
let currentThought = {"title": "Loading data...", "ups": 0};

let alphaValue = 255;
let isFadingOut = false;
let isFadingIn = false;
let nextThoughtIndex = 0;

let yDrift = 30;//text location

function preload() {
  loadJSON('assets/showerthoughts.json', gotData);
}

function gotData(data) {
  allThoughts = Object.values(data).filter(item => item && item.title);
  if (allThoughts.length > 0) {
    pickThoughtInstantly();
  } else {
    currentThought = {"title": "No data found.", "ups": 0};
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cursor(HAND); 
}

function draw() {
  background(10, 10, 12); 

  //web
  if (isFadingOut) {
    alphaValue -= 15;
    if (alphaValue <= 0) {
      alphaValue = 0;
      isFadingOut = false;
      currentThought = allThoughts[nextThoughtIndex];
      yDrift = 40; 
      isFadingIn = true;
    }
  } else if (isFadingIn) {
    alphaValue += 10;
    if (alphaValue >= 255) {
      alphaValue = 255;
      isFadingIn = false;
    }
  }

  //text flow
  if (!isFadingOut && alphaValue > 0) {
    yDrift = lerp(yDrift, -15, 0.03); 
  }

  //look
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  //background
  textFont('Georgia'); 
  textStyle(BOLD);
  fill(255, 255, 255, alphaValue * 0.08); 
  textSize(min(width, height) * 0.9);
  text('“', width / 2, height / 2 + yDrift - 40);

  //text
  textFont('Helvetica Neue, Helvetica, Arial, sans-serif');
  textStyle(NORMAL);
  fill(255, 255, 255, alphaValue);
  let mainTextSize = min(width * 0.04, 32);
  textSize(mainTextSize);
  
  textLeading(mainTextSize * 1.5); 
  text(currentThought.title, width / 2, height / 2 + yDrift, width * 0.75);

  //upvotes
  fill(150, 150, 150, alphaValue);
  textSize(12);
  let formattedUps = formatUpvotes(currentThought.ups);
  
  text(`—  ${formattedUps} UPVOTES  —`, width / 2, height - 90); 

  
  let breathAlpha = map(sin(frameCount * 0.04), -1, 1, 30, 100);
  fill(255, 255, 255, breathAlpha);
  textSize(10);
  textStyle(NORMAL);
  
  text('CLICK ANYWHERE TO REFRESH', width / 2, height - 40);
}

function mousePressed() {
  if (allThoughts.length > 0 && !isFadingOut && !isFadingIn) {
    nextThoughtIndex = floor(random(allThoughts.length));
    isFadingOut = true;
  }
}

function formatUpvotes(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num;
}

function pickThoughtInstantly() {
  let randomIndex = floor(random(allThoughts.length));
  currentThought = allThoughts[randomIndex];
  yDrift = 40;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}