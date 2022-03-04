class Game {
  constructor() {
    this.lastdT = 0;
    this.nodes = new NodeGroup(maze1);
    this.nodes.setPortalPair({x:0, y:17}, {x:27, y:17});
    let homekey = this.nodes.createHomeNodes(11.5, 14);
    this.nodes.connectHomeNodes(homekey, "12-14", "LEFT");
    this.nodes.connectHomeNodes(homekey, "15-14", "RIGHT");
    this.pacman = new Pacman(this.nodes.getStartTempNode());
    this.pellets = new PelletGroup(maze1);
    this.ghost = new Ghost(this.nodes.getStartTempNode(), this.pacman);
    this.ghost.setSpawnNode(this.nodes.getNodeFromTiles(2+11.5, 3+14));
  }

  checkPelletEvents() {
    let list = this.pellets.pelletList;
    let pellet = this.pacman.eatPellets(list);
    if (pellet) {
      this.pellets.numEaten += 1;
      const idx = list.indexOf(pellet);
      if (idx > -1) list.splice(idx, 1);
      if (pellet.name == "POWERPELLET") this.ghost.startFreight();
    }
  }

  update = () => {
    // return amount of time passed since last time this line was called
    let wpn = window.performance.now();
    let dt = wpn - this.lastdT;   // milisecs since last time this line called
    this.lastdT = wpn;
    dt /= 1000.00;                // secs since last time this line called
    this.pacman.update(dt);
    this.ghost.update(dt);
    this.pellets.update(dt);
    this.checkPelletEvents();
    this.checkGhostEvents();
  }

  checkGhostEvents() {
    if (this.pacman.collideGhost(this.ghost)) {
      if (this.ghost.mode.current == cc.FREIGHT) this.ghost.startSpawn();
    }
  }
  
  render = () => {
    background(cc.BLACK);
    this.nodes.render();
    this.pellets.render();
    this.pacman.render();
    this.ghost.render();
  }
}