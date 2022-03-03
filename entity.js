class Entity {
    constructor(node) {
        this.name = null;
        this.dirVectors = {UP:new Vector2(0, -1),DOWN:new Vector2(0, 1),LEFT:new Vector2(-1, 0),RIGHT:new Vector2(1, 0),STOP:new Vector2()};
        this.dirString = "STOP";
        this.setSpeed(100);
        this.radius = 10;
        this.collideRadius = 5;
        this.diam = this.radius*2;
        this.color = cc.WHITE;
        this.node = node;
        this.setPosition();
        this.targetNode = node;
        this.visible = true;
        this.disablePortal = false;
        this.goalVector = null;
        this.directionMethod = this.randomDirection;
    }

    goalDirection(dirVectors) {
        let distances = [];
        for (let dirString of dirVectors) {
            let vec = this.node.position.add(this.dirVectors[dirString].mul(cc.TILEWIDTH));
            vec = vec.sub(this.goalVector);
            distances.push(vec.magnitudeSquared());
        }
        let index = distances.indexOf(min(distances));
        return dirVectors[index];
    }
  
    update = (dt) => {
        let dir = this.dirVectors[this.dirString];
        let dPos = dir.mul(this.speed);
        dPos = dPos.mul(dt);
        this.position = this.position.add(dPos);

        if (this.overshotTarget()) {
            this.node = this.targetNode;
            let directions = this.validDirections();
            let dirString = this.directionMethod(directions);
            if (!this.disablePortal) {
                if (this.node.neighborNodes["PORTAL"] != null) {
                    this.node = this.node.neighborNodes["PORTAL"];
                }
            }
            this.targetNode = this.getNewTarget(dirString);
            if (this.targetNode != this.node) {
                this.dirString = dirString;
            } else {
                this.targetNode = this.getNewTarget(this.dirString);
            }
            this.setPosition();
        }
    }
    
    render = () => {
        if (this.visible) {
            let p = this.position.asInt();  // returns object
            fill(this.color);
            circle(p.x, p.y, this.diam);
        }
      }
          
    setPosition() {
        this.position = this.node.position.cpy();
    }

    getNewTarget(dirString) {
    if (this.validDirection(dirString)) {
        return this.node.neighborNodes[dirString];
    }
    return this.node
    }
  
    overshotTarget() {
        if (this.targetNode != null) {
          let vec1 = (this.targetNode.position).sub(this.node.position);
          let vec2 = (this.position).sub(this.node.position);
          let node2Target = vec1.magnitudeSquared();
          let node2Self = vec2.magnitudeSquared();
          return node2Self >= node2Target;
        }
        return false;
    }

    // get key value from cc.DIR that is
    // opposite direction of direction parameter
    oppDirection(dirString) {
        let dir = cc.DIR[dirString];
        let oppdir = dir * -1;
        // getKeyValue(..) is in sketch.js
        let oppKey = getKeyValue(cc.DIR, oppdir);
        return oppKey;
    }

    reverseDirection() {
        this.dirString = oppDirection(this.dirString);  // oppDirection() in this.file
        let temp = this.node;
        this.node = this.targetNode;
        this.targetNode = temp;
      }
  
    validDirection(dirString) {
        if (dirString != "STOP") {
            if (this.node.neighborNodes[dirString] != null) return true;
        }
        return false;
    }

    validDirections() {
        let directions = [];
        for (let key of ["UP", "DOWN", "LEFT", "RIGHT"]) {
            if (this.validDirection(key)) {
                let dir = cc.DIR[key];
                let thisdir = cc.DIR[this.dirString];
                if (dir != thisdir * -1) {
                    directions.push(key);
                }
            }
        }
        if (directions.length == 0) {
            directions.push(oppDirection(this.dirString));  // oppDirection in this.file
        }
        return directions;
    }

    // python randint(3, 9) -> return number between 3 & 9 (both included)
    // p5.js   random(3, 9) -> return number between 3 (inclusive) & 9 (exclusive)
    randomDirection(directions) {
        return directions[Math.floor(random(0, directions.length))];
    }

    oppositeDirection(dirString) {
        if (direction != "STOP") {
            let dir = cc.DIR[dirString];
            let thisdir = cc.DIR[this.dirString];
            if (dir == thisdir * -1) {
                return true;
            }
        }
        return false;
    }

    setSpeed(speed) {
        this.speed = speed * cc.TILEWIDTH / 16;
    }
}