class Game {
  constructor() {
    this.lastdT = 0;
    this.bg = null;   // must come before call to startGame()
    this.fruit = null;
    this.pause = new Pause(true);
    this.level = 0;
    this.lives = 5;
    this.score = 0;
    this.textgroup = new TextGroup();
    this.lifesprites = new LifeSprites(this.lives);
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

    const afterPauseMethod = this.pause.update(dt);
    if (afterPauseMethod != null) afterPauseMethod(dt);
  }

  updateScore(points) {
    this.score += points;
    this.textgroup.updateScore(this.score);
  }
  
  render = () => {
    //background(cc.BLACK);
    image(this.bg, 0, 0);
    //this.nodes.render();
    this.pellets.render();
    if (this.fruit !=  null) this.fruit.render();
    this.pacman.render();
    this.ghosts.render();
    this.textgroup.render();
    // draw lives images
    for (let ii=0; ii<this.lifesprites.images.length; ii++) {
      const x = this.lifesprites.images[ii].width * ii;
      const y = cc.SCREENHEIGHT - this.lifesprites.images[ii].height;
      image(this.lifesprites.images[ii], x, y);
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
    if (this.bg == null)
      this.bg = createGraphics(cc.SCREENWIDTH, cc.SCREENHEIGHT);
    this.bg.background(cc.BLACK);
  }

  startGame() {
    this.setBackground();
    this.mazesprites = new MazeSprites(maze1, maze1_rotation);
    this.bg = this.mazesprites.constructBackground(this.bg, this.level%5);
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
    this.ghosts.pinky.setStartNode(this.nodes.getNodeFromTiles(2+11.5, 3+14))
    this.ghosts.inky.setStartNode(this.nodes.getNodeFromTiles(0+11.5, 3+14))
    this.ghosts.clyde.setStartNode(this.nodes.getNodeFromTiles(4+11.5, 3+14))
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
        this.hideEntities();
        this.pause.setPause(false, 3, this.nextLevel);
      }
    }
  }

  checkFruitEvents() {
    if (this.pellets.numEaten == 50 || this.pellets.numEaten == 140) {
      if (this.fruit == null) {
        this.fruit = new Fruit(this.nodes.getNodeFromTiles(9, 20));
      }
    }
    if (this.fruit != null) {
      if (this.pacman.collideCheck(this.fruit)) {
        this.updateScore(this.fruit.points);
        this.textgroup.addText(this.fruit.points.toString(), cc.WHITE, this.fruit.position.x, this.fruit.position.y, 8, 1);
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
