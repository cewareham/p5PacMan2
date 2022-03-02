let game;

function setup() {
  createCanvas(cc.SCREENWIDTH, cc.SCREENHEIGHT);
  game = new Game();
}

function draw() {
  game.update();
  game.render();
}
