class Game {
  constructor() {
    this.lastdT = 0;
    this.startGame();
    this.fruit = null;
    this.pause = new Pause(true);
    this.level = 0;
    this.lives = 5;
  }

  restartGame() {
    game.lives = 5;
    game.level = 0;
    game.pause.paused = true;
    game.fruit = null;
    game.startGame();
  }

  resetLevel() {
    game.pause.paused = true;
    game.pacman.reset();
    game.ghosts.reset();
    game.fruit = null;
  }

  startGame() {
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
  }

  nextLevel() {
    game.showEntities();
    game.level++;
    game.pause.paused = true;
    game.startGame();
  }

  checkPelletEvents() {
    let list = this.pellets.pelletList;
    let pellet = this.pacman.eatPellets(list);
    if (pellet) {
      this.pellets.numEaten++;
      const idx = list.indexOf(pellet);
      if (idx > -1) list.splice(idx, 1);
      if (pellet.name == "POWERPELLET") this.ghosts.startFreight();
      if (this.pellets.isEmpty()) {
        this.hideEntities();
        this.pause.setPause(false, 3, this.nextLevel);
      }
    }
  }

  update = () => {
    // return amount of time passed since last time this line was called
    let wpn = window.performance.now();
    let dt = wpn - this.lastdT;   // milisecs since last time this line called
    this.lastdT = wpn;
    dt /= 1000.00;                // secs since last time this line called
     this.pellets.update(dt);
    if (!this.pause.paused) {
      this.pacman.update(dt);
      this.ghosts.update(dt);
      if (this.fruit != null) this.fruit.update(dt);
      this.checkPelletEvents();
      this.checkGhostEvents();
      this.checkFruitEvents();
    }
    const afterPauseMethod = this.pause.update(dt);
    if (afterPauseMethod != null) afterPauseMethod(dt);
  }

  checkFruitEvents() {
    if (this.pellets.numEaten == 50 || this.pellets.numEaten == 140) {
      if (this.fruit == null) {
        this.fruit = new Fruit(this.nodes.getNodeFromTiles(9, 20));
      }
    }
    if (this.fruit != null) {
      if (this.pacman.collideCheck(this.fruit)) {
        this.fruit = null;
      } else if (this.fruit.destroy) {
        this.fruit = null;
      }
    }
  }

  keyPressed() {
    if (keyCode == cc.keySpace) {
      console.log(this.lives);
      if (this.pacman.alive) {
        this.pause.setPause(true);
        if (!this.pause.paused) this.showEntities();
        else this.hideEntities();
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
          this.pause.setPause(false, 1, this.showEntities);
          ghost.startSpawn();
        } else if (ghost.mode.current != cc.SPAWN) {
          if (this.pacman.alive) {
            this.lives--;
            this.pacman.die();
            this.ghosts.hide();
            if (this.lives <= 0) this.pause.setPause(false, 3, this.restartGame);
            else this.pause.setPause(false, 3, this.resetLevel);
          }
        }
      }
    }
  }
  
  render = () => {
    background(cc.BLACK);
    this.nodes.render();
    this.pellets.render();
    if (this.fruit !=  null) this.fruit.render();
    this.pacman.render();
    this.ghosts.render();
  }
}