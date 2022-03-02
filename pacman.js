class Pacman {
  constructor() {
    this.position = new Vector2(200, 400);
    this.radius = 10;
    this.diam = this.radius*2;
    this.color = cc.YELLOW;
    this.dirVectors = {STOP:new Vector2(), UP:new Vector2(0, -1), DOWN:new Vector2(0, 1), LEFT:new Vector2(-1,0), RIGHT:new Vector2(1,0)};
    this.dirString = "STOP";
    this.dirVector = this.dirVectors[this.dirString]; // or getDirectionVector(this.dirString)
    this.speed = 100;
  }
  
  update = (dt) => {
    let dirVector = this.getDirectionVector(this.dirString);
    let dPos = dirVector.mul(this.speed);
    dPos = dPos.mul(dt);
    this.position = this.position.add(dPos);
    this.dirString = this.getValidKey();
  }

  render = () => {
    let p = this.position.asInt();  // returns object
    fill(this.color);
    circle(p.x, p.y, this.diam);
  }

  getDirectionVector(dirString) {
    return this.dirVectors[dirString];
  }
  
  getValidKey = () => {
    if (keyIsDown(UP_ARROW))    return "UP";
    if (keyIsDown(DOWN_ARROW))  return "DOWN";
    if (keyIsDown(LEFT_ARROW))  return "LEFT";
    if (keyIsDown(RIGHT_ARROW)) return "RIGHT";
    return "STOP";
  }
}