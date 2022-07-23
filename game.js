class Game {
  constructor() {
    this.lastdT = 0;
    this.bg = null;
    this.bg_norm = null;
    this.bg_flash = null;
    this.fruit = null;
    this.pause = new Pause(true);
    this.level = 0;
    this.lives = 5;
    this.score = 0;
    this.textgroup = new TextGroup();
    this.lifesprites = new LifeSprites(this.lives);
    this.flashBG = false;
    this.flashTime = 0.2;
    this.flashTimer = 0;
    this.fruitCaptured = [];
    this.mazedata = new MazeData();
  }

  startGame() {
    this.mazedata.loadMaze(this.level);   // create instance->new Maze1 or new Maze2 class
    const obj = this.mazedata.obj;
    const maze = obj.maze;
    const mazeRot = obj.mazeRot;
    this.mazesprites = new MazeSprites(maze, mazeRot);
    this.setBackground();
    // BEGIN GameController class startGame() code (in python version)
    this.nodes = new NodeGroup(maze);
    obj.setPortalPairs(this.nodes);
    obj.connectHomeNodes(this.nodes);
    const pms = obj.pacmanStart;
    this.pacman = new Pacman(this.nodes.getNodeFromTiles(pms.x, pms.y));
    this.pellets = new PelletGroup(maze);
    this.ghosts = new GhostGroup(this.nodes.getStartTempNode(), this.pacman);
    let aof = obj.addOffset(2,3);
    this.ghosts.pinky.setStartNode(this.nodes.getNodeFromTiles(aof.x, aof.y));
    aof = obj.addOffset(0, 3);
    this.ghosts.inky.setStartNode(this.nodes.getNodeFromTiles(aof.x, aof.y));
    aof = obj.addOffset(4, 3);
    this.ghosts.clyde.setStartNode(this.nodes.getNodeFromTiles(aof.x, aof.y));
    aof = obj.addOffset(2,3);
    this.ghosts.setSpawnNode(this.nodes.getNodeFromTiles(aof.x, aof.y));
    aof = obj.addOffset(2, 0);
    this.ghosts.blinky.setStartNode(this.nodes.getNodeFromTiles(aof.x, aof.y));
    // END GameController class startGame() code (in python version)
    this.nodes.denyHomeAccess(this.pacman);
    this.nodes.denyHomeAccessList(this.ghosts.ghosts);
    this.ghosts.inky.startNode.denyAccess("RIGHT", this.ghosts.inky);
    this.ghosts.clyde.startNode.denyAccess("LEFT", this.ghosts.clyde);
    obj.denyGhostsAccess(this.ghosts.ghosts, this.nodes);
  }

  startGameOLD() {
    this.mazesprites = new MazeSprites(maze1, maze1_rotation);
    this.setBackground();
    // BEGIN GameController class startGame() code (in python version)
    this.nodes = new NodeGroup(maze1);
    this.nodes.setPortalPair({x:0, y:17}, {x:27, y:17});
    let homekey = this.nodes.createHomeNodes(11.5, 14);
    this.nodes.connectHomeNodes(homekey, "12-14", "LEFT");
    this.nodes.connectHomeNodes(homekey, "15-14", "RIGHT");
    this.pacman = new Pacman(this.nodes.getNodeFromTiles(15, 26));
    this.pellets = new PelletGroup(maze1);
    this.ghosts = new GhostGroup(this.nodes.getStartTempNode(), this.pacman);
    this.ghosts.blinky.setStartNode(this.nodes.getNodeFromTiles(2+11.5, 0+14));
    this.ghosts.pinky.setStartNode(this.nodes.getNodeFromTiles(2+11.5, 3+14));
    this.ghosts.inky.setStartNode(this.nodes.getNodeFromTiles(0+11.5, 3+14));
    this.ghosts.clyde.setStartNode(this.nodes.getNodeFromTiles(4+11.5, 3+14));
    this.ghosts.setSpawnNode(this.nodes.getNodeFromTiles(2+11.5, 3+14));
    // END GameController class startGame() code (in python version)
    this.nodes.denyHomeAccess(this.pacman);
    this.nodes.denyHomeAccessList(this.ghosts.ghosts);
    this.nodes.denyAccessList(2+11.5, 3+14, "LEFT", this.ghosts.ghosts);
    this.nodes.denyAccessList(2+11.5, 3+14, "RIGHT", this.ghosts.ghosts);
    this.ghosts.inky.startNode.denyAccess("RIGHT", this.ghosts.inky);
    this.ghosts.clyde.startNode.denyAccess("LEFT", this.ghosts.clyde);
    this.nodes.denyAccessList(12, 14, "UP", this.ghosts.ghosts);
    this.nodes.denyAccessList(15, 14, "UP", this.ghosts.ghosts);
    this.nodes.denyAccessList(12, 26, "UP", this.ghosts.ghosts);
    this.nodes.denyAccessList(15, 26, "UP", this.ghosts.ghosts);
  }

  update = () => {
    // return amount of time passed since last time this line was called
    let wpn = window.performance.now();
    let dt = wpn - this.lastdT;   // milisecs since last time this line called
    this.lastdT = wpn;
    dt /= 1000.00;                // secs since last time this line called
    this.textgroup.update(dt);
    this.pellets.update(dt);
    if (!this.pause.paused) {
      this.ghosts.update(dt);
      if (this.fruit != null) this.fruit.update(dt);
      this.checkPelletEvents();
      this.checkGhostEvents();
      this.checkFruitEvents();
    }

    if (this.pacman.alive) {
      if (!this.pause.paused) this.pacman.update(dt);
    } else {
      this.pacman.update(dt);
    }

    if (this.flashBG) {
      this.flashTimer += dt;
      if (this.flashTimer >= this.flashTime) {
        this.flashTimer = 0;
        if (this.bg == this.bg_norm) this.bg = this.bg_flash;
        else this.bg = this.bg_norm;
      }
    }

    const afterPauseMethod = this.pause.update(dt);
    if (afterPauseMethod != null) afterPauseMethod(dt);
  }

  updateScore(points) {
    this.score += points;
    this.textgroup.updateScore(this.score);
  }
  
  render = () => {
    image(this.bg, 0, 0);
    this.pellets.render();
    if (this.fruit !=  null) this.fruit.render();
    this.pacman.render();
    this.ghosts.render();
    this.textgroup.render();
    // draw lives images (bottom left)
    for (let ii=0; ii<this.lifesprites.images.length; ii++) {
      const x = this.lifesprites.images[ii].width * ii;
      const y = cc.SCREENHEIGHT - this.lifesprites.images[ii].height;
      image(this.lifesprites.images[ii], x, y);
    }
    // draw fruit captured images (bottom right)
    for (let ii=0; ii<this.fruitCaptured.length; ii++) {
      const img = this.fruitCaptured[ii].image;
      const x = cc.SCREENWIDTH - img.width * (ii+1);
      const y = cc.SCREENHEIGHT - img.height;
      image(img, x, y);
    }
  }

  restartGame() {
    game.lives = 5;
    game.level = 0;
    game.pause.paused = true;
    game.fruit = null;
    game.startGame();
    game.score = 0;
    game.textgroup.updateScore(game.score);
    game.textgroup.updateLevel(game.level);
    game.textgroup.showText(cc.READYTXT);
    game.lifesprites.resetLives(game.lives);
    game.fruitCaptured = [];
  }

  resetLevel() {
    game.pause.paused = true;
    game.pacman.reset();
    game.ghosts.reset();
    game.fruit = null;
    game.textgroup.showText(cc.READYTXT);
  }

  setBackground() {
    // create offscreen buffer the size of the maze
    if (this.bg_norm == null) {
      this.bg_norm = createGraphics(cc.SCREENWIDTH, cc.SCREENHEIGHT);
    }
    if (this.bg_flash == null) {
      this.bg_flash = createGraphics(cc.SCREENWIDTH, cc.SCREENHEIGHT);
      this.bg_flash.background(cc.BLACK);
      this.bg_flash = this.mazesprites.constructBackground(this.bg_flash, 5);
    }
    this.bg_norm.background(cc.BLACK);
    this.bg_norm = this.mazesprites.constructBackground(this.bg_norm, this.level%5);
    this.flashBG = false;
    this.bg = this.bg_norm;
  }

  nextLevel() {
    game.showEntities();
    game.level++;
    game.pause.paused = true;
    game.startGame();
    game.textgroup.updateLevel(game.level);
    game.textgroup.showText(cc.READYTXT);
  }

  checkPelletEvents() {
    let list = this.pellets.pelletList;
    let pellet = this.pacman.eatPellets(list);
    if (pellet) {
      this.pellets.numEaten++;
      this.updateScore(pellet.points);
      if (this.pellets.numEaten == 30)
        this.ghosts.inky.startNode.allowAccess("RIGHT", this.ghosts.inky);
      if (this.pellets.numEaten == 70)
        this.ghosts.clyde.startNode.allowAccess("LEFT", this.ghosts.clyde);
      const idx = list.indexOf(pellet);
      if (idx > -1) list.splice(idx, 1);
      if (pellet.name == "POWERPELLET") this.ghosts.startFreight();
      if (this.pellets.isEmpty()) {
        this.flashBG = true;
        this.hideEntities();
        this.pause.setPause(false, 3, this.nextLevel);
      }
    }
  }

  checkFruitEvents() {
    if (this.pellets.numEaten == 50 || this.pellets.numEaten == 140) {
      if (this.fruit == null) {
        this.fruit = new Fruit(this.nodes.getNodeFromTiles(9, 20), this.level);
      }
    }
    if (this.fruit != null) {
      if (this.pacman.collideCheck(this.fruit)) {
        this.updateScore(this.fruit.points);
        this.textgroup.addText(this.fruit.points.toString(), cc.WHITE, this.fruit.position.x, this.fruit.position.y, 8, 1);
        let fruitCaptured = false;
        for (const fruit of this.fruitCaptured) {
          if (fruit.sprites.imgNum == this.fruit.sprites.imgNum) {
            fruitCaptured = true;
            break;
          }
        }
        if (!fruitCaptured) this.fruitCaptured.push(this.fruit);
        this.fruit = null;
      } else if (this.fruit.destroy) {
        this.fruit = null;
      }
    }
  }

  keyPressed() {
    if (keyCode == cc.keySpace) {
      if (this.pacman.alive) {
        this.pause.setPause(true);
        if (!this.pause.paused) {
          this.textgroup.hideText();
          this.showEntities();
        }
        else {
          this.textgroup.showText(cc.PAUSETXT);
          this.hideEntities();
        }
      }
    }
  }

  showEntities() {
    game.pacman.visible = true;
    game.ghosts.show();
  }

  hideEntities() {
    this.pacman.visible = false;
    this.ghosts.hide();
  }

  checkGhostEvents() {
    let theGhosts = this.ghosts.ghosts;   // returns array of the 4 ghosts
    for (let ghost of theGhosts) {
      if (this.pacman.collideGhost(ghost)) {
        if (ghost.mode.current == cc.FREIGHT) {
          this.pacman.visible = false;
          ghost.visible = false;
          this.updateScore(ghost.points);
          this.textgroup.addText(ghost.points.toString(), cc.WHITE, ghost.position.x, ghost.position.y, 8, 1);
          this.ghosts.updatePoints();
          this.pause.setPause(false, 1, this.showEntities);
          ghost.startSpawn();
          this.nodes.allowHomeAccess(ghost);
        } else if (ghost.mode.current != cc.SPAWN) {
          if (this.pacman.alive) {
            this.lives--;
            this.lifesprites.removeImage();
            this.pacman.die();
            this.ghosts.hide();
            if (this.lives <= 0) {
              this.textgroup.showText(cc.GAMEOVERTXT);
              this.pause.setPause(false, 3, this.restartGame);
            }
            else this.pause.setPause(false, 3, this.resetLevel);
          }
        }
      }
    }
  }
}
