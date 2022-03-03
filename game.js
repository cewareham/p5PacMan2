class Game {
  constructor() {
    this.lastdT = 0;
    this.nodes = new NodeGroup(maze1);
    this.nodes.setPortalPair({x:0, y:17}, {x:27, y:17});
    this.pacman = new Pacman(this.nodes.getStartTempNode());
    this.pellets = new PelletGroup(maze1);
  }

  update = () => {
    // return amount of time passed since last time this line was called
    let wpn = window.performance.now();
    let dt = wpn - this.lastdT;   // milisecs since last time this line called
    this.lastdT = wpn;
    dt /= 1000.00;                // secs since last time this line called
    this.pacman.update(dt);
    this.pellets.update(dt);
  }
  
  render = () => {
    background(cc.BLACK);
    this.nodes.render();
    this.pellets.render();
    this.pacman.render();
  }
}