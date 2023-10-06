let ship;
let aliens = [];
let bullets = [];
let shipImg, alienImg, bulletImg, spaceBackground;
let level = 1;
let score = 0;
let highScore = 0;
let gameOver = false;

function preload() {
  shipImg = loadImage('images/ship.png');
  alienImg = loadImage('images/alien.png');
  bulletImg = loadImage('images/bullet.png');
  spaceBackground = loadImage('images/background.png'); // Load space background
}

function setup() {
  createCanvas(800, 600);
  ship = new Ship();
  for (let i = 0; i < 12; i++) {
    aliens[i] = new Alien(i * 60 + 60, 60);
  }
}

function draw() {
  image(spaceBackground, 0, 0, width, height); // Display the space background
  ship.show();
  ship.move();

  for (let bullet of bullets) {
    bullet.show();
    bullet.move();

    for (let i = aliens.length - 1; i >= 0; i--) {
      if (bullet.hits(aliens[i])) {
        aliens.splice(i, 1);
        bullets.splice(bullets.indexOf(bullet), 1);
      }
    }
  }

  for (let alien of aliens) {
    alien.show();
    alien.move();

    if (alien.y >= height - 60) {
      noLoop();
      textSize(48);
      fill(255);
      textAlign(CENTER);
      text("Game Over", width / 2, height / 2);
    }
  }

  if (gameOver) {
    textSize(48);
    fill(255);
    textAlign(CENTER);
    text("Game Over", width / 2, height / 2);

    textSize(24);
    text("Click to Restart", width / 2, height / 2 + 40);
  }

  checkLevelProgress();
  displayScore();
}

function keyPressed() {
  if (key === ' ') {
    let bullet = new Bullet(ship.x, height - 60);
    bullets.push(bullet);
  }

  if (keyCode === RIGHT_ARROW) {
    ship.setDir(1);
  } else if (keyCode === LEFT_ARROW) {
    ship.setDir(-1);
  }
}

function keyReleased() {
  if (key !== ' ') {
    ship.setDir(0);
  }
}

class Ship {
  constructor() {
    this.x = width / 2;
    this.dir = 0;
  }

  show() {
    image(shipImg, this.x, height - 60, 60, 60);
  }

  move() {
    this.x += this.dir * 5;
    this.x = constrain(this.x, 30, width - 30);
  }

  setDir(dir) {
    this.dir = dir;
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    image(bulletImg, this.x, this.y, 10, 30);
  }

  move() {
    this.y -= 5;
  }

  hits(alien) {
    let d = dist(this.x, this.y, alien.x, alien.y);
    if (d < 30) {
      score++; // Increase the score when an alien is hit
      if (score > highScore) {
        highScore = score; // Update the high score if the current score is higher
      }
    }
    return d < 30;
  }
}

class Alien {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dir = 1;
  }

  show() {
    image(alienImg, this.x, this.y, 60, 60);
  }

  move() {
    this.x += this.dir * level; // Increase the alien's speed based on the level

    if (this.x > width - 30 || this.x < 30) {
      this.y += 60;
      this.dir = -this.dir;
    }

    if (this.y >= height - 60) {
      gameOver = true; // Set gameOver to true
    }
  }
}

function checkLevelProgress() {
  if (aliens.length === 0) {
    level++;
    for (let i = 0; i < 12; i++) {
      aliens[i] = new Alien(i * 60 + 60, 60);
    }
  }
}

function displayScore() {
  textSize(18);
  fill(255);
  textAlign(LEFT);
  text(`Level: ${level}`, 10, 30);
  text(`Score: ${score}`, 10, 60);
  textAlign(RIGHT);
  text(`High Score: ${highScore}`, width - 10, 30);
}

function mouse() {
  if (gameOver) {
    // Reset the game state
    gameOver = false;
    level = 1;
    score = 0;

    // Reset aliens
    aliens = [];
    for (let i = 0; i < 12; i++) {
      aliens[i] = new Alien(i * 60 + 60, 60);
    }

    // Reset bullets
    bullets = [];
  }
}
