/*


  cols = 130, x = 0 to x = 129
  rows = 32, y = 0 to y = 31

TEAM 0 - Neutral (e.g. walls)
TEAM 1 - Enemy or RED
TEAM 2 - Player or BLUE
TEAM 3 - GREEN
TEAM 4 - YELLOW
     5 - "memory" color overlay
*/

const global = {
  waveData: [
    "w,90,14,40,0|t,4,3,3,Move with the WASD or arrow keys|p,2,100,30",
    "e,1,55,20,0|e,2,50,20,0",
    "e,1,5,5,0",""],

    
  fontHeightToWidth: 1.9,
  aspectRatio: 16 / 9,

  width: 0,
  height: 0,
  playerData: [
    {
      hp: 27,
      speed: 0.4,
      cooldownReset: 10,
      projectileType: 4
    }
  ],
  enemyData: [
    {
      name: "tie-1",
      shape: "(=)",
      hp: 3,
      projectileType: 0,
      cooldownReset: 10,
    },
    {
      name: "tie-2",
      shape: "[=]",
      hp: 5,
      projectileType: 1,
      cooldownReset: 15,
    },
  ],
  projectileData: [
    {
      speed: 0.5,
      damage: 1,
      shapes: "—|\\/"
    },
    {
      speed: 0.4,
      damage: 2,
      shapes: "═‖⑊⸗"
    },
    {
      speed: 0.9,
      damage: 5,
      shapes: "━╹🙽🙼"
    },
    {
      speed: 0.3,
      damage: 10,
      shapes: "••••"
    },
    {
      speed: 0.6,
      damage: 1,
      shapes: "◜◝◞◟"
    }
  ],

  numOfTeams: 6,
  teamColors: [
    [192, 192, 192],
    [255, 0, 0],
    [0, 127, 255],
    [0, 255, 0],
    [255, 255, 0],
    [60, 60, 60]
  ],
};
const keys = {};

function preload() {
  global.imgBG = loadImage("./assets/background.jpg");
  global.font = "Consolas";
}

function setup() {
  for (let c of global.teamColors) {
    c = color(c[0], c[1], c[2]);
  }
  createCanvas(
    Math.min(window.innerWidth, 1920),
    Math.min(window.innerHeight, 1080)
  );
  noSmooth();
  textFont(global.font);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textLeading(5);
  onResize();
}
function windowResized() {
  resizeCanvas(
    Math.min(window.innerWidth, 1920),
    Math.min(window.innerHeight, 1080)
  );
  onResize();
}
function keyPressed() {
  terminal.onKeyPressed(key);
  keys[keyCode] = true;
}
function keyReleased() {
  keys[keyCode] = false;
}
function draw() {
  mainLoop();
}

class FloatingText {
  constructor(team, x, y, txt) {
    objs.push(this)
    this.team = team
    this.x = x
    this.y = y
    this.shape = txt
  }
  update() {}
}

class Portal {
  constructor(team, x, y, shape) {
    objs.push(this)
    enemies.push(this)
    this.team = team
    this.x = x
    this.y = y
    this.shape = shape
  }
  update(termi) {
    let s = '123\n4☐5\n678'
    let num = Math.floor(frameCount / 4) % 8
    s = s.replace(num, "•").replace(/\d/g, ' ')
    this.shape = s
  }
}

class Wall {
  constructor(startX, startY, endX, endY) {
    // if (startX > endX) {
    //   [startX, endX] = [endX,startX ] 
    //   [startY, endY] = [endY,startY ] 
    // }
    let nw = (symbol) => {
      new WallFragment(startX, startY, symbol)
    }
    let rightWards = false
    while (startX !== endX) {
      if (startX < endX) {
        rightWards = true
        startX ++
      } else if (startX > endX) {
        startX --
      }
      nw("═")
    }
    let isCorner = true
    while (startY !== endY) {
      if (!isCorner) nw("║")
      if (startY < endY) {
        if (isCorner) nw(rightWards ? "╗" : "╔")
        startY ++
      } else if (startY > endY) {
        if (isCorner) nw(rightWards ? "╝" : "╚")
        startY --
      }
      if (isCorner) isCorner = false
    }
  }
}

class WallFragment {
  lastDamagedBy = -1;

  constructor(x, y, shape) {
    objs.push(this);
    walls.push(this);
    this.team = 0;
    this.isDead = false;
    this.x = x;
    this.y = y;
    this.hp = 10;
    this.shape = shape; //"║╔╗╚╝╠╣╦╩╬".charAt(type); // From 0 to 10
  }

  update() {}

  postUpdate() {
    for (let ship of ships) {
      let rsx = Math.round(ship.x);
      if (rsx >= this.x - 2 && rsx <= this.x && Math.round(ship.y) == this.y) {
        this.lastDamagedBy = ship.team;
        ship.x = ship.wasX;
        ship.y = ship.wasY;
      }
    }
  }
}

class Player {
  //	╲	╳
  shape = "(P)";
  isDead = false;
  lastDamagedBy = -1;
  cooldown = 0;
  wasX = 0;
  wasY = 0;
  level = 0

  constructor(team, x, y) {
    objs.push(this);
    ships.push(this);
    this.team = team;
    this.exp = 0
    this.expJumps = [100, 200, 300, 400, 500]
    this.expNext = this.expJumps[this.level]
    this.x = x;
    this.y = y;
    Object.assign(this, global.playerData[this.level]);
    this.hpMax = this.hp
  }

  displayStats(termi) {
    // wave
    termi.setGroup(0, 2, 0, `WAVE ${wave}`)

    // hp
    let n = 20 * this.hp / this.hpMax
    let betweenSymbol = ' ░▒▓█'.charAt(Math.floor(5*(n%1)))
    n = Math.floor(n) 
    let line = ` HP: |` + '█'.repeat(n) + betweenSymbol + ' '.repeat(20-n)
    line += `| ${this.hp} / ${this.hpMax}`
    termi.setGroup(0, 2, termi.rows-3, line)

    // exp
    n = 20 * this.exp / this.expNext
    betweenSymbol = ' ░▒▓█'.charAt(Math.floor(5*(n%1)))
    n = Math.floor(n) 
    line = `EXP: |` + '█'.repeat(n) + betweenSymbol + ' '.repeat(20-n)
    line += `| ${this.exp} / ${this.expNext}`
    termi.setGroup(this.team, 2, termi.rows-2, line)
  }

  update(termi) {
    // Movement
    this.wasX = this.x;
    this.wasY = this.y;
    if (keys[LEFT_ARROW] || keys[65])
      this.x -= this.speed * global.fontHeightToWidth;
    if (keys[RIGHT_ARROW] || keys[68])
      this.x += this.speed * global.fontHeightToWidth;
    if (keys[UP_ARROW] || keys[87]) this.y -= this.speed;
    if (keys[DOWN_ARROW] || keys[83]) this.y += this.speed;

    // Bounds
    this.x = constrain(this.x, 0, termi.cols-1-Math.ceil(this.shape.length/2))
    this.y = constrain(this.y, 0, termi.rows-1)

    // Click to shoot
    if (mouseIsPressed) {
      if (this.cooldown >= this.cooldownReset) {
        this.cooldown = 0;
        new Projectile(this, { x: termi.mX, y: termi.mY }, 0);
      }
    }
    if (this.cooldown < this.cooldownReset) {
      this.cooldown++;
    }

    // Level up
    if (this.exp >= this.expNext) {
      this.exp -= this.expNext
      this.level ++
      this.expNext = this.expJumps[this.level]
      Object.assign(this, global.playerData[this.level]);
    }
  }
}

class Enemy {
  x = 0;
  y = 0;
  type = 0;
  shape = "";
  isDead = false;
  lastDamagedBy = -1;
  cooldown = 0;
  wasX = 0;
  wasY = 0;

  constructor(team, x, y, type) {
    objs.push(this);
    ships.push(this);
    this.type = type;
    this.team = team;
    this.x = x;
    this.y = y;
    let gpdt = global.enemyData[type];
    Object.assign(this, gpdt);
  }

  update(termi) {
    // Movement
    this.wasX = this.x;
    this.wasY = this.y;

    // Shoot logic
    if (me?.hp > 0 && ++this.cooldown > this.cooldownReset) {
      this.cooldown = 0;
      new Projectile(this, me, this.projectileType);
    }
  }
}

class Projectile {
  team = 0;
  x = 0;
  y = 0;
  target = null;
  type = 0;
  //hp = 1;
  shape = "?";
  introFrames = 0;

  constructor(source, target, type) {
    objs.push(this);
    projectiles.push(this);
    this.team = source.team;
    this.x = source.x;
    this.y = source.y;
    this.target = target;
    this.type = type;
    let gpdt = global.projectileData[type];
    Object.assign(this, gpdt);

    if (this.speed) {
      // If arrow-like projectile, calculate velocity at init
      let chX = (target.x - this.x) / global.fontHeightToWidth;
      let chY = target.y - this.y;
      let distance = Math.sqrt(sq(chX) + sq(chY));
      this.velX = ((chX * this.speed) / distance) * global.fontHeightToWidth;
      this.velY = (chY * this.speed) / distance;
    }
  }

  update(termi) {
    // Movement
    let t = this.target;
    if (this.speed) {
        this.x += this.velX;
        this.y += this.velY;
        if (abs(this.velX) > abs(this.velY) * 4) {
          this.shape = this.shapes[0]
        } else if (abs(this.velX) * 4 < abs(this.velY)) {
          this.shape = this.shapes[1]
        } else {
          this.shape = this.velX * this.velY > 0 ? this.shapes[2] : this.shapes[3];
        }
    }

    // Collisions with objects
    for (let obj of objs) {
      if (obj.hp && obj.team !== this.team) {
        let distanceSq = sq(obj.x - this.x) + sq(obj.y - this.y);
        if (distanceSq < 1 * 1) {
          obj.lastDamagedBy = this.team;
          obj.hp -= this.damage;
          this.isDead = true;
          return;
        }
      }
    }

    // Off-screen detection
    if (
      this.x < 0 ||
      this.x > termi.cols ||
      this.y < 0 ||
      this.y > termi.rows
    ) {
      this.isDead = true;
    }
  }
}

class Terminal {
  fullscreen = true;
  x = 0;
  y = 1;
  w = 0;
  h = 0;
  cols = 130;
  rows = 32;
  txt = [];
  mX = 0;
  mY = 0;
  state = "intro";
  userTyped = "";
  favoriteLetter = "";
  introFrames =99999999999///! 0

  constructor() {
    this.onResizeWindow();
    this.clearTxt(true);
  }

  clearTxt(hardClear) {
    if (hardClear) {
      this.txt = [];
      for (let team = 0; team < global.numOfTeams; team++) {
        let txtInner = [];
        for (let i = 0; i < this.rows; i++) {
          txtInner.push(new Array(this.cols).fill(" "));
        }
        this.txt.push(txtInner);
      }
      return
    }

    for (let team = 0; team < global.numOfTeams; team++) {
      for (let i = 0; i < this.rows; i++) {
        let t = this.txt[team][i]
        for (let j = 0; j < this.cols; j ++) {
          let char = t[j]
          if (char !== " ") {
            t[j] = " "
            if (team) {
              this.txt[5][i][j] = char
            }
          }
        }
      }
    }
  }

  setPixel(team, x, y, char) {
    this.txt[team][constrain(y, 0, this.rows - 1)][
      constrain(x, 0, this.cols - 1)
    ] = char;
  }

  setGroup(team, x, y, setText) {
    let yPlus = 0;
    for (let textRow of setText.split("\n")) {
      let xPlus = 0;
      for (let char of textRow.split("")) {
        this.setPixel(team, x + xPlus, y + yPlus, char);
        xPlus++;
      }
      yPlus++;
    }
  }

  onResizeWindow() {
    this.w = global.width * 0.4;
    this.h = global.height * 0.4;
  }

  onKeyPressed(key) {
    if (this.state === "intro") {

      // Type 'space.exe' or 'cd login'
      if (this.introFrames === 0) {
        if (key === "Backspace") {
          this.userTyped = this.userTyped.slice(0, this.userTyped.length - 1);
        } else if (key === "Enter") {
          this.introFrames = 1;
        } else if (key.length === 1) {
          this.userTyped += key;
        }
      } else {
        if (key.length === 1) this.favoriteLetter = key
        else if (key === "Enter") this.favoriteLetter += " "
      }
    } else {
      if (key == "f") {// f key
        this.fullscreen = !this.fullscreen
      }
    }
  }

  drawCommandPromptFrame() {
    // Sides
    strokeCap(SQUARE);
    stroke(228, 223, 220);
    strokeWeight(global.width * 0.004);
    line(this.x, this.y, this.x, this.y + this.h);
    line(this.x + this.w, this.y, this.x + this.w, this.y + this.h);
    strokeWeight(global.width * 0.001);
    stroke(146, 143, 134);
    let ww = this.w * 0.005;
    line(this.x + ww, this.y, this.x + ww, this.y + this.h);
    line(this.x + this.w - ww, this.y, this.x + this.w - ww, this.y + this.h);

    // Bottom
    stroke(228, 223, 220);
    strokeWeight(global.width * 0.004);
    line(
      this.x - ww,
      this.y + this.h - ww,
      this.x + this.w + ww,
      this.y + this.h - ww
    );
    strokeWeight(global.width * 0.001);
    stroke(146, 143, 134);
    ww = this.w * 0.005;
    line(
      this.x + ww,
      this.y + this.h - ww * 2,
      this.x + this.w - ww,
      this.y + this.h - ww * 2
    );

    // Top
    strokeWeight(global.width * 0.004);
    stroke(228, 223, 220);
    fill(15, 86, 215);
    rect(this.x, this.y - this.w * 0.03, this.w, this.w * 0.06);
    stroke(15, 86, 215);
    line(this.x + ww, this.y + ww * 5, this.x + this.w - ww, this.y + ww * 5);
    noStroke();

    // Text
    fill(255);
    text("C:\\WINDOWS\\system32\\cmd.exe", this.x + ww * 3, this.y - ww * 3);

    // bUTTONS
    for (var i = 0; i < 3; i++) {
      fill(209, 208, 194);
      let btnX = this.x + this.w - ww * 7 * (3.1 - i);
      let btnY = this.y - ww * 4;
      rect(btnX, btnY, ww * 5.5, ww * 8, 0.5);
      stroke(0);
      if (i === 0) {
        strokeWeight(ww);
        line(btnX + ww * 1.3, btnY + ww * 5.4, btnX + ww * 4, btnY + ww * 5.4);
      } else if (i === 1) {
        strokeWeight(ww * 0.5);
        noFill();
        rect(btnX + ww, btnY + ww * 2.6, ww * 3, ww * 2.5);
      } else {
        strokeWeight(ww * 0.7);
        line(btnX + ww * 1.5, btnY + ww * 5, btnX + ww * 4, btnY + ww * 2.5);
        line(btnX + ww * 1.5, btnY + ww * 2.5, btnX + ww * 4, btnY + ww * 5);
      }
      noStroke();
    }
  }

  introState() {
    this.setGroup(
      0,
      0,
      0,
      "Welcome. Type the command '         ' to begin singleplayer mode.\nType '        ' to pick a username and join an open multiplayer game."
    );
    this.setGroup(
      3,
      0,
      0,
      "                           space.exe\n      cd login"
    );
    this.setGroup(
      0,
      0,
      3,
      "C:\\Documents and Settings> " +
        " ".repeat(this.userTyped.length) +
        "_".repeat(frameCount % 60 < 30 && this.introFrames === 0)
    );
    this.setGroup(3, 0, 3, "                           " + this.userTyped);

    if (this.introFrames === 0) {
    } else if (this.introFrames <= 60) {
      this.setGroup(
        0,
        0,
        5,
        "Loading" + ".".repeat(Math.floor(this.introFrames / 10) % 4)
      );
      this.introFrames++;
    } else  {
      this.setGroup(
        0,
        0,
        7,
        "Enter any letter or symbol > " +
          "_".repeat(frameCount % 60 < 30 && this.favoriteLetter.length === 0)
      );
      this.setGroup(
        2,
        0,
        7,
        "                             " + this.favoriteLetter
      );
      if (this.favoriteLetter.length >= 2) {
        console.log(this.introFrames)
        this.introFrames ++
        if (this.introFrames > 180) {
          console.log('START')
          this.state = "singleplayer"
          generateWave(0)
        }
      }
    }
  }

  update() {
    // Mouse positions update
    this.mX = (mouseX * this.cols) / global.width;
    this.mY = (mouseY * this.rows) / global.height;

    // Background
    if (this.fullscreen) {
      fill(0);
      rect(0, 0, global.width, global.height);
    } else {
      fill(0);
      rect(this.x, this.y, this.w, this.h);
    }

    // Display text
    let renderOrder = [5, 1, 2, 3, 4, 0]
    let snapX = 0;
    let snapY = 0;
    if (this.fullscreen) {
      for (let i of renderOrder) {
        let displayText = "";
        fill(global.teamColors[i]);
        for (let line of this.txt[i]) {
          displayText += line.join("") + "\n";
        }
        text(displayText, snapX, snapY);
      }
    } else {
      let incrementX = global.width / this.cols;
      let incrementY = global.height / this.rows;
      let startX = Math.round(this.x / incrementX);
      let startY = Math.round(this.y / incrementY);
      let printCharsX = Math.round(this.w / incrementX);
      let printCharsY = Math.round(this.h / incrementY);
      snapX = startX * incrementX;
      snapY = startY * incrementY;
      startX = Math.max(0, startX);
      startY = Math.max(0, startY);

      for (let i of renderOrder) {
        let displayText = "";
        fill(global.teamColors[i]);
        for (let line of this.txt[i].slice(startY, startY + printCharsY)) {
          displayText +=
            line.slice(startX, startX + printCharsX).join("") + "\n";
        }
        text(displayText, snapX, snapY);
      }
    }

    if (!this.fullscreen) {
      this.drawCommandPromptFrame();
      if (
        mouseIsPressed &&
        pmouseX >= this.x &&
        pmouseX <= this.x + this.w &&
        abs(pmouseY - this.y) < this.w * 0.038
      ) {
        this.x -= pmouseX - mouseX;
        this.y -= pmouseY - mouseY;
      }
    }

    this.clearTxt();

    switch (this.state) {
      case "intro": {
        this.introState()
        break;
      }

      case "singleplayer": {
        // 

        // FPS indicator
        this.setGroup(0, this.cols - 6, 0, frameRate().toFixed(0) + " FPS");
        break;
      }

      case "upgrade": {
        this.setGroup(0, )
        break;
      }
    }
  }
}

const terminal = new Terminal();
let wave = 0;
let objs = [];
let ships = [];
let walls = [];
let projectiles = [];
let me;

function generateWave(wave) {
  // Hard clear background
  terminal.clearTxt(true)


  if (wave === 0) {
    me = new Player(2, 28, 7);
    me.shape = `(${terminal.favoriteLetter.charAt(0)})`
  }
  enemies = [me]
  walls = []
  projectiles = []
  objs = [me]

  let data = global.waveData[wave]
  let classes = {
    "e": Enemy,
    "w": Wall,
    "f": WallFragment,
    "t": FloatingText,
    "p": Portal
  }
  for (let d of data.split("|")) {
    let entityData = d.split(',')
    let args = entityData.slice(1).map(val => isNaN(val) ? val : parseInt(val))
    new classes[entityData[0]](...args)
  }

}

function mainLoop() {
  // Background image
  background(32);
  if (!terminal.fullscreen) {
    image(global.imgBG, 0, 0, global.width, global.height);
  }

  for (let i = objs.length - 1; i >= 0; i--) {
    let obj = objs[i];

    // Update object
    obj.update(terminal);
    if (obj.lastDamagedBy >= 0) obj.lastDamagedBy = -1;

    // Handle HP/death
    if (obj.isDead) {
      objs.splice(i, 1);
    } else if (obj?.hp <= 0) {
      obj.isDead = true; // Live for 1 more frame
    }
  }

  // Empty dead objects from arrays
  ships = ships.filter((s) => !s.isDead);
  walls.forEach((s) => s.postUpdate());
  walls = walls.filter((s) => !s.isDead);

  // Draw objects
  for (let obj of objs) {
    terminal.setGroup(
      obj.lastDamagedBy >= 0 ? obj.lastDamagedBy : obj.team,
      Math.round(obj.x),
      Math.round(obj.y),
      obj.shape
    );
  }

  // Show player stats (hp and exp)
  if (me) {
    me.displayStats(terminal)
  }

  // Advance wave
  if (terminal.state === "singleplayer" && ships.length <= 1) {
    wave ++
    generateWave(wave)
  }

  // Lose wave
  else if (me?.hp <= 10) {
    me.hp = 10///////////////////wip
  }

  terminal.update();
}

function onResize() {
  // Set global width/height to match 16:9 aspect ratio
  if (width / height > global.aspectRatio) {
    global.height = Math.min(height, 1080);
    global.width = global.height * global.aspectRatio;
  } else {
    global.width = Math.min(width, 1920);
    global.height = global.width / global.aspectRatio;
  }
  global.fontSize = global.width * 0.014;
  terminal.onResizeWindow();
  textSize(global.fontSize);
}
