class Game {
  constructor() {
    this.lastdT = 0;
    this.nodes = new NodeGroup();
    this.nodes.setupTestNodes();
    this.pacman = new Pacman(this.nodes.nodeList[0]);
  }
  
  update = () => {
    // return amount of time passed since last time this line was called
    let wpn = window.performance.now();
    let dt = wpn - this.lastdT;   // milisecs since last time this line called
    this.lastdT = wpn;
    dt /= 1000.00;                // secs since last time this line called
    this.pacman.update(dt);
  }
  
  render = () => {
    background(cc.BLACK);
    this.nodes.render();
    this.pacman.render();
  }
}