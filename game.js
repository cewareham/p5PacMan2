class Game {
  constructor() {
    this.lastdT = 0;
    this.nodes = new NodeGroup(maze1);
    this.nodes.setPortalPair({x:0, y:17}, {x:27, y:17});
    let homekey = this.nodes.createHomeNodes(11.5, 14);
    this.nodes.connectHomeNodes(homekey, "12-14", "LEFT");
    this.nodes.connectHomeNodes(homekey, "15-14", "RIGHT");
    //this.pacman = new Pacman(this.nodes.getStartTempNode());
    this.pacman = new Pacman(this.nodes.getNodeFromTiles(15, 26));
    this.pellets = new PelletGroup(maze1);
    this.ghosts = new GhostGroup(this.nodes.getStartTempNode(), this.pacman);
    this.ghosts.blinky.setStartNode(this.nodes.getNodeFromTiles(2+11.5, 0+14));
    this.ghosts.pinky.setStartNode(this.nodes.getNodeFromTiles(2+11.5, 3+14))
    this.ghosts.inky.setStartNode(this.nodes.getNodeFromTiles(0+11.5, 3+14))
    this.ghosts.clyde.setStartNode(this.nodes.getNodeFromTiles(4+11.5, 3+14))
    this.ghosts.setSpawnNode(this.nodes.getNodeFromTiles(2+11.5, 3+14));
  }

  checkPelletEvents() {
    let list = this.pellets.pelletList;
    let pellet = this.pacman.eatPellets(list);
    if (pellet) {
      const idx = list.indexOf(pellet);
      if (idx > -1) list.splice(idx, 1);
      if (pellet.name == "POWERPELLET") this.ghosts.startFreight();
    }
  }

  update = () => {
    // return amount of time passed since last time this line was called
    let wpn = window.performance.now();
    let dt = wpn - this.lastdT;   // milisecs since last time this line called
    this.lastdT = wpn;
    dt /= 1000.00;                // secs since last time this line called
    this.pacman.update(dt);
    this.ghosts.update(dt);
    this.pellets.update(dt);
    this.checkPelletEvents();
    this.checkGhostEvents();
  }

  checkGhostEvents() {
    let theGhosts = this.ghosts.ghosts;   // returns array of the 4 ghosts
    for (let ghost of theGhosts) {
      if (this.pacman.collideGhost(ghost)) {
        if (ghost.mode.current == cc.FREIGHT) {
          ghost.startSpawn();
        }
      }
    }
  }
  
  render = () => {
    background(cc.BLACK);
    this.nodes.render();
    this.pellets.render();
    this.pacman.render();
    this.ghosts.render();
  }
}