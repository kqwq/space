/*


  cols = 130, x = 0 to x = 129
  rows = 32, y = 0 to y = 31

  X MID 65
  Y MID 15

TEAM 0 - Neutral (e.g. walls)
TEAM 1 - Enemy or RED
TEAM 2 - Player or BLUE
TEAM 3 - GREEN
TEAM 4 - YELLOW
     5 - "memory" color overlay
*/

function isWindows() {
  return navigator.platform.indexOf('Win') > -1
}

const global = {
  waveData: [
    "p,60,8|w,90,14,40,-1|t,4,3,3,Move with the WASD or arrow keys\n\n  Reach the (P)ortal",
    "p,5,3|e,1,3,20,0|w,0,27,45,0|t,4,60,3,Shoot with the mouse button\n\n  Destroy all enemies to advance",
    "p,120,27|w,40,0,40,15|w,80,16,80,31|e,1,65,19,0|e,1,115,6,0|e,1,115,21,1",
    "p,10,4|w,45,10,85,20|w,85,20,45,10|e,1,65,15,0|e,1,62,15,0|e,1,65,15,0|e,1,65,15,0|e,1,65,15,2",
    "p,110,15|w,30,0,30,31|w,60,0,60,31|w,90,0,90,31|t,4,2,10,There are too many enemies\nto fight at once.\nPress SPACEBAR to toggle\nfullscreen.|t,4,32,16,Enemies will not shoot\nwhen not in view.\nUse this to your advantage.|\
e,1,105,5,8|e,1,105,15,8|e,1,105,25,8|e,1,75,5,8|e,1,75,15,8|e,1,75,25,8"
  ],

  fontHeightToWidth: 1.9,
  aspectRatio: 16 / 9,

  width: 0,
  height: 0,
  playerData: [
    {
      hp: 10,
      speed: 0.3,
      cooldownReset: 10,
      projectileType: 0,
    },
    {
      hp: 20,
      speed: 0.34,
      cooldownReset: 8,
      projectileType: 0,
    },
    {
      hp: 30,
      speed: 0.34,
      cooldownReset: 6,
      projectileType: 1,
    },
    {
      hp: 40,
      speed: 0.35,
      cooldownReset: 10,
      projectileType: 2,
    },
    {
      hp: 50,
      speed: 0.36,
      cooldownReset: 15,
      projectileType: 2,
    },
    {
      hp: 60,
      speed: 0.36,
      cooldownReset: 10,
      projectileType: 2,
    },
  ],
  enemyData: [
    {
      name: "tie-0",
      shape: "(-)",
      hp: 2,
      speed: 0.2,
      projectileType: 0,
      cooldownReset: 99,
    },
    {
      name: "tie-1",
      shape: "[-]",
      hp: 4,
      speed: 0.3,
      projectileType: 0,
      cooldownReset: 39,
    },
    {
      name: "tie-2",
      shape: "{-}",
      hp: 2,
      speed: 0.4,
      projectileType: 0,
      cooldownReset: 15,
    },
    {//E:3
      name: "bomb-3",
      shape: "(Θ)",
      hp: 2,
      speed: 0.2,
      projectileType: 3,
      cooldownReset: 149,
    },
    {//E:4
      name: "bomb-4",
      shape: "[Θ]",
      hp: 4,
      speed: 0.4,
      projectileType: 3,
      cooldownReset: 109,
    },
    {
      name: "fighter-5",
      shape: "(=)",
      hp: 4,
      speed: 0.2,
      projectileType: 1,
      cooldownReset: 59,
    },
    {
      name: "fighter-6",
      shape: "[=]",
      hp: 4,
      speed: 0.3,
      projectileType: 1,
      cooldownReset: 39,
    },
    {
      name: "fighter-7",
      shape: "(=)",
      hp: 2,
      speed: 0.4,
      projectileType: 1,
      cooldownReset: 19,
    },
    {
      name: "attack-8",
      shape: "(Ξ)",
      hp: 2,
      speed: 0.2,
      projectileType: 2,
      cooldownReset: 19,
    },
    {
      name: "attack-9",
      shape: "[Ξ]",
      hp: 4,
      speed: 0.3,
      projectileType: 2,
      cooldownReset: 14,
    },
    {
      name: "attack-10",
      shape: "{Ξ}",
      hp: 2,
      speed: 0.4,
      projectileType: 2,
      cooldownReset: 9,
    },
    {
      name: "phase-11",
      shape: "(Ψ)",
      hp: 2,
      speed: 0.4,
      projectileType: 4,
      cooldownReset: 7,
    },
  ],
  projectileData: [
    {//0
      speed: 0.5,
      damage: 1,
      shapes: "—|\\/",
    },
    {//1
      speed: 0.3,
      damage: 2,
      shapes: "═‖⑊⸗",
    },
    {//2
      speed: 0.9,
      damage: 5,
      shapes: isWindows() ? "━╹╲╱" : "—|\\/" // 🙽🙼",
    },
    {//3
      speed: 0.3,
      damage: 10,
      shapes: "••••",
    },
    {//4
      speed: 0.6,
      damage: 1,
      shapes: "****",
    },
  ],

  numOfTeams: 6,
  teamColors: [
    [192, 192, 192],
    [255, 0, 0],
    [0, 127, 255],
    [0, 255, 0],
    [255, 255, 0],
    [50, 50, 50],
  ],
};
const keys = {};

function preload() {
  global.imgBG = loadImage("./assets/background.jpg");
  global.font = isWindows() ? "Consolas" : "monospace"
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
    objs.push(this);
    this.team = team;
    this.x = x;
    this.y = y;
    this.shape = txt;
  }
  update() {}
}

class Portal {
  constructor(x, y) {
    this.isDead = false;
    objs.push(this);
    ships.push(this);
    this.team = 2;
    this.x = x;
    this.y = y;
    this.shape = "";
  }
  update(termi) {
    if (ships.length === 2) {
      let s = "212\n3P3\n212";
      let num = 1 + (Math.floor(frameCount / 30) % 3);
      s = s.replaceAll(num, "•").replace(/\d/g, " ");
      this.shape = s;
      if (Math.abs(this.x - me.x) < 2 && Math.abs(this.y - me.y) < 2) {
        for (let s of ships) {
          s.isDead = true;
        }
        me.isDead = false;
      }
    }
  }
}

class Wall {
  constructor(startX, startY, endX, endY) {
    // if (startX > endX) {
    //   [startX, endX] = [endX,startX ]
    //   [startY, endY] = [endY,startY ]
    // }
    let nw = (symbol) => {
      new WallFragment(startX, startY, symbol);
    };
    let rightWards = false;
    let timeout = 100
    while (startX !== endX) {
      if (startX < endX) {
        rightWards = true;
        startX++;
      } else if (startX > endX) {
        startX--;
      }
      nw("═");
      if (--timeout <= 0) {
        break
      }
    }
    let isCorner = true;
    timeout = 100
    while (startY !== endY) {
      if (!isCorner) nw("║");
      if (startY < endY) {
        if (isCorner) nw(rightWards ? "╗" : "╔");
        startY++;
      } else if (startY > endY) {
        if (isCorner) nw(rightWards ? "╝" : "╚");
        startY--;
      }
      if (isCorner) isCorner = false;
      if (--timeout <= 0) {
        break
      }
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
  level = 0;

  constructor(team, x, y) {
    objs.push(this);
    ships.push(this);
    this.team = team;
    this.exp = 0;
    this.expJumps = [10, 20, 30, 40, 50, 9999];
    this.expNext = this.expJumps[this.level];
    this.x = x;
    this.y = y;
    Object.assign(this, global.playerData[this.level]);
    this.hpMax = this.hp;
  }

  displayStats(termi) {
    // wave
    termi.setGroup(0, 2, 1, `WAVE ${termi.wave}`);

    let xOffset = 0
    if (me.x <= 37 && me.y >= termi.rows - 4) {
      xOffset = termi.cols - 40
    }
    // hp
    let n = (20 * this.hp) / this.hpMax;
    let betweenSymbol = " ░▒▓█".charAt(Math.floor(5 * (n % 1)));
    n = constrain(Math.floor(n), 0, 20);
    let line = ` HP: |` + "█".repeat(n) + betweenSymbol + " ".repeat(20 - n);
    line += `| ${this.hp} / ${this.hpMax}`;
    termi.setGroup(0, 2 + xOffset, termi.rows - 3, line);

    // exp
    n = (20 * this.exp) / this.expNext;
    betweenSymbol = " ░▒▓█".charAt(Math.floor(5 * (n % 1)));
    n = constrain(Math.floor(n), 0, 20);
    line = `EXP: |` + "█".repeat(n) + betweenSymbol + " ".repeat(20 - n);
    line += `| ${this.exp} / ${this.expNext}`;
    termi.setGroup(this.team, 2 + xOffset, termi.rows - 2, line);
    
  }

  gainExp(fromEnemy) {
    // Assume fromEnemy's lastDamagedBy prop is 2 (player)
    this.exp += fromEnemy.hpMax || 1
    while (this.exp >= this.expNext) {
      // Level up
      this.exp -= this.expNext
      this.level ++
      this.expNext = this.expJumps[this.level];
      Object.assign(this, global.playerData[this.level]);
      this.hpMax = this.hp;
    }
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
    this.x = constrain(
      this.x,
      0,
      termi.cols - 1 - Math.ceil(this.shape.length / 2)
    );
    this.y = constrain(this.y, 0, termi.rows - 1);

    // Click to shoot
    if (mouseIsPressed && termi.mouseInTerminal) {
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
      this.exp -= this.expNext;
      this.level++;
      this.expNext = this.expJumps[this.level];
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
  ai = {}

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

    if (this.ai.step) {
      this.ai.step ++
      if (this.ai.step >= 60) this.ai.step = 1
    } else {
      this.ai.step = (Math.random() * 60 + frameCount) % 60 + 1
    }
    if (this.ai.step === 1 || !this.ai.randX) {
      this.ai.randX = constrain(this.x + random(-50, 50), 2, termi.cols - 3)
      this.ai.randY = constrain(this.y + random(-5, 5), 2, termi.rows - 3)
    } else if (this.ai.step <= 30) {
      if (this.x < this.ai.randX - this.speed) {
        this.x += this.speed
      } else if (this.x > this.ai.randX + this.speed) {
        this.x -= this.speed
      }
      if (this.y < this.ai.randY - this.speed) {
        this.y += this.speed
      } else if (this.y > this.ai.randY + this.speed) {
        this.y -= this.speed
      }
    }
    

    // Shoot logic
    if (me?.hp > 0 && ++this.cooldown > this.cooldownReset) {
      this.cooldown = 0;
      new Projectile(this, me, this.projectileType);
      if (this.projectileType == 2 && Math.random() < 0.3) {
        this.cooldown = -200
      }
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
        this.shape = this.shapes[0];
      } else if (abs(this.velX) * 4 < abs(this.velY)) {
        this.shape = this.shapes[1];
      } else {
        this.shape =
          this.velX * this.velY > 0 ? this.shapes[2] : this.shapes[3];
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
  wave = 0
  fullscreen = true;
  mouseInTerminal = true;
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
  introFrames = 0;//99999999999; ///! 0
  openingTxt = `\
  ███████╗██████╗  █████╗  ██████╗███████╗   ███████╗██╗  ██╗███████╗
  ██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝   ██╔════╝╚██╗██╔╝██╔════╝
  ███████╗██████╔╝███████║██║     █████╗     █████╗   ╚███╔╝ █████╗  
  ╚════██║██╔═══╝ ██╔══██║██║     ██╔══╝     ██╔══╝   ██╔██╗ ██╔══╝  
  ███████║██║     ██║  ██║╚██████╗███████╗██╗███████╗██╔╝ ██╗███████╗
  ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝╚═╝╚══════╝╚═╝  ╚═╝╚══════╝`;

  constructor() {
    this.onResizeWindow();
    this.clearTxt(true);
  }

  gameover() {
    this.wave = 0;
    this.fullscreen = true
    this.whiteWashTxt();
    this.userTyped = "";
    this.introFrames = 0;
    this.state = "gameover";
    document.getElementById("gameover").style.display = "block"
  }

  whiteWashTxt() {
    for (let team = 0; team < global.numOfTeams; team++) {
      for (let i = 0; i < this.rows; i++) {
        let t = this.txt[team][i];
        for (let j = 0; j < this.cols; j++) {
          let char = t[j];
          if (char !== " ") {
            if (team) {
              this.txt[team][i][j] = " ";
              this.txt[0][i][j] = char;
            }
          }
          if (i === this.rows - 1) {
            this.txt[0][i][j] = " "; // Clear bottom row
          }
        }
      }
    }
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
      return;
    }

    for (let team = 0; team < global.numOfTeams; team++) {
      for (let i = 0; i < this.rows; i++) {
        let t = this.txt[team][i];
        for (let j = 0; j < this.cols; j++) {
          let char = t[j];
          if (char !== " ") {
            t[j] = " ";
            if (team) {
              this.txt[5][i][j] = char;
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
          if (this.userTyped.includes("space")) {
            this.introFrames = 1;
          } else {
            this.userTyped = ""
          }
        } else if (key.length === 1) {
          this.userTyped += key;
        }
      } else {
        if (key.length === 1) this.favoriteLetter = key;
        else if (key === "Enter") this.favoriteLetter += " ";
      }
    } else if (this.state === "gameover") {
      if (key === "Backspace") {
        this.userTyped = this.userTyped.slice(0, this.userTyped.length - 1);
      } else if (key === "Enter") {
        if (this.userTyped[0].toLowerCase() == "y") {
          generateWave(this.wave, true);
          this.state = "singleplayer";
        } else {
          this.favoriteLetter = ""; // don't remember favorite letter
          this.state = "intro";
        }
        this.userTyped = "";
        document.getElementById("gameover").style.display = "none"
      } else if (key.length === 1) {
        this.userTyped += key;
      }
    } else if (this.state === "singleplayer") {
      if (this.wave >= 4 && keyCode === 32) {
        // spacebar key
        this.fullscreen = !this.fullscreen;
        this.x = (me.x / this.cols) * global.width - this.w / 2;
        this.x = Math.max(0, this.x)
        this.y = (me.y / this.rows) * global.height - this.h / 2;
        this.y = Math.max(0, this.y)
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
      "\nWelcome. Type the command '         ' to begin singleplayer mode."
    );
    this.setGroup(
      3,
      0,
      0,
      "\n                           space.exe"
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
    } else {
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
        let ind = this.openingTxt.length * (this.introFrames - 60) / 90
        let display = this.openingTxt.slice(0, ind)
        this.setGroup(0, 40, 12, display)
        this.introFrames++;
        if (this.introFrames > 180) {
          console.log("START");
          this.state = "singleplayer";
          generateWave(this.wave, true);
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
    let renderOrder = [5, 1, 2, 3, 4, 0];
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
    
      this.windowedX1 = startX
      this.windowedY1 = startY
      this.windowedX2 = startX + printCharsX
      this.windowedY2 = startY + printCharsY
    }

    // Move terminal window
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

    

    // If mouse inside terminal window
    if (this.fullscreen) {
      this.mouseInTerminal = true
    } else {
      this.mouseInTerminal = mouseX > this.x && mouseX  < this.x + this.w && mouseY > this.y + this.w * 0.038 && mouseY < this.y + this.h
    }

    // States
    switch (this.state) {
      case "intro": {
        this.clearTxt();
        this.introState();
        break;
      }

      case "singleplayer": {
        this.clearTxt();
        this.setGroup(0, this.cols - 6, 0, frameRate().toFixed(0) + " FPS");
        break;
      }

      case "gameover": {
        this.setGroup(
          2,
          0,
          this.rows - 1,
          "Continue? (Y/N) " +
            this.userTyped +
            ["_", "                "][Number(frameCount % 60 < 30)]
        );
        break;
      }
    }
  }
}

const terminal = new Terminal();
let objs = [];
let ships = [];
let walls = [];
let projectiles = [];
let me;

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randX() {
  return randInt(3, terminal.cols - 4)
}
function randY() {
  return randInt(3, terminal.rows - 4)
}

function generateWave(wave, initPlayer) {
  // Hard clear background
  terminal.clearTxt(true);

  if (initPlayer) {
    me = new Player(2, 28, 7);
    me.shape = `(${terminal.favoriteLetter.charAt(0)})`;
  }
  ships = [me];
  walls = [];
  projectiles = [];
  objs = [me];

  let data = global.waveData[wave];
  if (!data) {
    data = `p,${randX()},${randY()}|`
    for (let i = 0; i < wave; i ++) {
      console.log(i, data)
      if (i%5 === 0 || Math.random() < 0.3) {
        data += "w," + randInt(0, terminal.cols-1) + ","  + randInt(0, terminal.rows-1) + "," + randInt(0, terminal.cols-1) + ","  + randInt(0, terminal.rows-1) + "|"
      } else {
        // enemy ship
        data += "e,1," + randX() + "," + randY() + "," + randInt(0, Math.min(11, wave)) + "|"
      }
    }
    data = data.slice(0, data.length - 1)
    
  }
  console.log('LASSSS',data)
  let classes = {
    e: Enemy,
    w: Wall,
    f: WallFragment,
    t: FloatingText,
    p: Portal,
  };
  for (let d of data.split("|")) {
    let entityData = d.split(",");
    console.log("new", entityData);
    let args = entityData
      .slice(1)
      .map((val) => (isNaN(val) ? val : parseInt(val)));
    new classes[entityData[0]](...args);
  }
}

function mainLoop() {
  // Background image
  background(32);
  if (!terminal.fullscreen) {
    image(global.imgBG, 0, 0, global.width, global.height);
  }

  if (terminal.state === "singleplayer" || terminal.state === "multiplayer") {
    for (let i = objs.length - 1; i >= 0; i--) {
      let obj = objs[i];

      // Update object
    if (obj !== me && !terminal.fullscreen &&
        (
          obj.x < terminal.windowedX1 ||
          obj.y < terminal.windowedY1 ||
          obj.x > terminal.windowedX2 ||
          obj.y > terminal.windowedY2
        )) {
          continue
        }


      obj.update(terminal);

      // Handle HP/death
      if (obj.isDead) {
        objs.splice(i, 1);
      } else if (obj?.hp <= 0) {
        if (obj.lastDamagedBy === 2) {
          me.gainExp(obj)
        }
        obj.isDead = true; // Live for 1 more frame
      }

      // Clear damaged-by status
      if (frameCount % 13 === 3) {
        if (obj.lastDamagedBy >= 0) obj.lastDamagedBy = -1;
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
      me.displayStats(terminal);
    }

    // Lose wave
    if (me?.hp <= 0) {
      terminal.gameover();
    }

    // Advance wave
    else if (terminal.state === "singleplayer" && ships.length <= 1) {
      terminal.wave++;
      generateWave(terminal.wave);
    }
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
