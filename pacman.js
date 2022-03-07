class Pacman extends Entity {
  constructor(node) {
    super(node);
    this.name = "PACMAN";
    // previously this.directions
    this.dirVectors = {UP:new Vector2(0, -1), DOWN:new Vector2(0, 1), LEFT:new Vector2(-1,0), RIGHT:new Vector2(1,0), STOP:new Vector2()};
    // previously this.direction
    this.dirString = "STOP";
    this.speed = 100;
    this.radius = 10;
    this.collideRadius = 5;
    this.diam = this.radius*2;
    this.color = cc.YELLOW;
    this.node = node;
    this.setPosition();
    // previously this.target
    this.targetNode = node;
    this.dirString = "LEFT";
    this.setBetweenNodes("LEFT");

    //this.dirVector = this.dirVectors[this.dirString]; // or getDirectionVector(this.dirString)
  }

  eatPellets(pelletList) {
    for (let pellet of pelletList) {
      if (this.collideCheck(pellet)) {
        return pellet;
      }
    }
    return null;
  }

  collideGhost(ghost) {
    return this.collideCheck(ghost);
  }

  collideCheck(other) {
    let d = this.positionVector.sub(other.position);
    let dSquared = d.magnitudeSquared();
    let rSquared = Math.pow(this.collideRadius + other.collideRadius, 2);
    if (dSquared <= rSquared) return true;
    return false;
  }

  setPosition() {
    this.positionVector = this.node.position.cpy();
  }

  getDirectionVector(dirString) {
    return this.dirVectors[dirString];
  }
  
  update = (dt) => {
    let dirVector = this.getDirectionVector(this.dirString);
    let dPos = dirVector.mul(this.speed);
    dPos = dPos.mul(dt);
    this.positionVector = this.positionVector.add(dPos);
    let dirString = this.getValidKey();
    if (this.overshotTarget()) {
      this.node = this.targetNode;
      if (this.node.neighborNodes["PORTAL"] != null) {
        this.node = this.node.neighborNodes["PORTAL"];
      }
      this.targetNode = this.getNewTarget(dirString);
      if (this.targetNode != this.node) {
        this.dirString = dirString;
      } else {
        this.targetNode = this.getNewTarget(this.dirString);
      }
      if (this.targetNode == this.node) this.dirString = "STOP";
      this.setPosition();
    } else {
      if (this.oppositeDirection(dirString)) this.reverseDirection();
    }
  }

  reverseDirection() {
    this.dirString = oppDirection(this.dirString);
    let temp = this.node;
    this.node = this.targetNode;
    this.targetNode = temp;
  }

  // is pacman's direction opposite of a specified direction?
  oppositeDirection(dirString) {
    if (dirString != "STOP") {
      let dir = cc.DIR[dirString];
      let thisdir = cc.DIR[this.dirString];
      if (dir == thisdir * -1) {
        return true;
      }
    }
    return false;
  }
  
  overshotTarget() {
    if (this.targetNode != null) {
      let vec1 = (this.targetNode.position).sub(this.node.position);
      let vec2 = (this.positionVector).sub(this.node.position);
      let node2Target = vec1.magnitudeSquared();
      let node2Self = vec2.magnitudeSquared();
      return node2Self >= node2Target;
    }
    return false;
  }

  validDirection(dirString) {
    if (dirString != "STOP") {
      if (this.node.neighborNodes[dirString] != null) {
        return true;
      }
    }
    return false;
  }

  getNewTarget(dirString) {
    if (this.validDirection(dirString)) return this.node.neighborNodes[dirString];
    return this.node;
  }

  render = () => {
    let p = this.positionVector.asInt();  // returns object
    fill(this.color);
    circle(p.x, p.y, this.diam);
  }
  
  getValidKey = () => {
    if (keyIsDown(UP_ARROW))    return "UP";
    if (keyIsDown(DOWN_ARROW))  return "DOWN";
    if (keyIsDown(LEFT_ARROW))  return "LEFT";
    if (keyIsDown(RIGHT_ARROW)) return "RIGHT";
    return "STOP";
  }
}
