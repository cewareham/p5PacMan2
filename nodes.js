class Node {
  constructor(x, y) {
    this.position = new Vector2(x, y);
    this.neighborNodes = {UP:null, DOWN:null, LEFT:null, RIGHT:null, PORTAL:null};
    this.access = {
         UP: ["PACMAN", "BLINKY", "PINKY", "INKY", "CLYDE", "FRUIT"],
       DOWN: ["PACMAN", "BLINKY", "PINKY", "INKY", "CLYDE", "FRUIT"],
       LEFT: ["PACMAN", "BLINKY", "PINKY", "INKY", "CLYDE", "FRUIT"],
      RIGHT: ["PACMAN", "BLINKY", "PINKY", "INKY", "CLYDE", "FRUIT"],
    };
  }

  denyAccess(dirString, entity) {
    if (entity.name == "PACMAN") {
      entity.name = "PACMAN";
      //console.log(dirString);
    }
    let array = this.access[dirString];
    //console.log(array);
    const index = array.indexOf(entity.name);
    //console.log(index);
    if (index > -1) array.splice(index, 1);
    //console.log(array);
  }

  allowAccess(dirString, entity) {
    let array = this.access[dirString];
    if (!array.includes(entity.name)) array.push(entity.name);
  }
  
  render = () => {
    for (let key in this.neighborNodes) {
      if (this.neighborNodes[key] != null) {
        let line_start = this.position.asTuple();                   // draw line from this node to...
        let line_end = this.neighborNodes[key].position.asTuple();  // each neighbor node
        push();
        stroke(cc.WHITE);
        strokeWeight(4);
        line(line_start.x, line_start.y, line_end.x, line_end.y);
        fill(cc.RED);
        noStroke();
        let p = this.position.asInt();  // returns object
        circle(p.x, p.y, 24);
        pop();
      }
    }
  }
}

class NodeGroup {
  constructor(maze) {
    this.maze = maze;
    this.nodesLUT = {};
    this.nodeSymbols = ['+', 'P', 'n'];
    this.pathSymbols = ['.', '-', '|', 'p'];
    this.createNodeTable(this.maze);
    this.connectHorizontally(this.maze);
    this.connectVertically(this.maze);
    this.homekey = null;
  }

  denyAccess(col, row, dirString, entity) {
    const node = this.getNodeFromTiles(col, row);
    if (node != null) node.denyAccess(dirString, entity);
  }

  allowAccess(col, row, dirString, entity) {
    const node = this.getNodeFromTiles(col, row);
    if (node != null) node.allowAccess(dirString, entity);
  }

  denyAccessList(col, row, dirString, entities) {
    for (const entity of entities) this.denyAccess(col, row, dirString, entity);
  }

  allowAccessList(col, row, dirString, entities) {
    for (const entity of entities) this.allowAccess(col, row, dirString, entity);
  }

  denyHomeAccess(entity) {
    this.nodesLUT[this.homekey].denyAccess("DOWN", entity);
  }  

  allowHomeAccess(entity) {
    this.nodesLUT[this.homekey].allowAccess("DOWN", entity);
  }  

  denyHomeAccessList(entities) {
    for (const entity of entities) this.denyHomeAccess(entity);
  }

  allowHomeAccessList(entities) {
    for (const entity of entities) this.allowHomeAccess(entity);
  }

  createHomeNodes(xoffset, yoffset) {
    let homedata = [
      "XX+XX",
      "XX.XX",
      "+X.X+",
      "+.+.+",
      "+XXX+",
    ];
    this.createNodeTable(homedata, xoffset, yoffset);
    this.connectHorizontally(homedata, xoffset, yoffset);
    this.connectVertically(homedata, xoffset, yoffset);
    this.homekey = this.constructKey(xoffset+2, yoffset);
    return this.homekey;
  }

  // returns dash-separated x,y coord key string
  // used in nodesLUT (object with key-value pairs)
  // eg. key might be "22-56" which is x,y dash separated coords of node
  constructKey(x, y) {
    //return {x:x*cc.TILEWIDTH, y:y*cc.TILEHEIGHT};
    let coordx = x*cc.TILEWIDTH;
    let coordy = y*cc.TILEHEIGHT;
    return coordx+"-"+coordy;
  }

  connectHomeNodes(homekey, otherkey, dirString) {
    let coord = this.keyToCoords(otherkey);
    let key = this.constructKey(coord.x, coord.y);
    this.nodesLUT[homekey].neighborNodes[dirString] = this.nodesLUT[key];
    let oppString = oppDirection(dirString);  // oppDirection(..) in sketch.js
    this.nodesLUT[key].neighborNodes[oppString] = this.nodesLUT[homekey];
  }

  setPortalPair(pair1, pair2) {
    let key1 = this.constructKey(pair1.x, pair1.y);
    let key2 = this.constructKey(pair2.x, pair2.y);
    let keys = Object.keys(this.nodesLUT);
    if ((keys.indexOf(key1) != -1) && (keys.indexOf(key2) != -1)) {
      this.nodesLUT[key1].neighborNodes["PORTAL"] = this.nodesLUT[key2];
      this.nodesLUT[key2].neighborNodes["PORTAL"] = this.nodesLUT[key1];
    }
  }

  createNodeTable(data, xoffset=0, yoffset=0) {
    let row, col;
    for (row=0; row<data.length; row++) {
      for (col=0; col<data[row].length; col++) {
        // is char from maze in this.nodeSymbols array?
        if (this.nodeSymbols.indexOf(data[row][col]) != -1) {
          let key = this.constructKey(col+xoffset, row+yoffset);
          let coords = this.keyToCoords(key);
          this.nodesLUT[key] = new Node(coords.x, coords.y);
        }
      }
    }
  }

  // given key like "36-120" return object {x:36, y:120}
  keyToCoords(key) {
    let coords = key.split("-");
    return {x:parseInt(coords[0]), y:parseInt(coords[1])};
  }

  connectHorizontally(data, xoffset=0, yoffset=0) {
    let row, col, key, otherkey, coord;
    for (row=0; row<data.length; row++) {
      key = null;
      for (col=0; col<data[row].length; col++) {
        // is char from maze in this.nodeSymbols array?
        if (this.nodeSymbols.indexOf(data[row][col]) != -1) {
          if (key == null) {
            key = this.constructKey(col+xoffset, row+yoffset);
          } else {
            otherkey = this.constructKey(col+xoffset, row+yoffset);
            this.nodesLUT[key].neighborNodes["RIGHT"] = this.nodesLUT[otherkey];
            this.nodesLUT[otherkey].neighborNodes["LEFT"] = this.nodesLUT[key];
            key = otherkey;
          }
        } else if (this.pathSymbols.indexOf(data[row][col]) == -1) {
          key = null;
        }
      }
    }
  }

  connectVertically(data, xoffset=0, yoffset=0) {
    let row, col, key, otherkey, coord;
    let dataT = this.transpose(data);
    for (col=0; col<dataT.length; col++) {
      key = null;
      for (row=0; row<dataT[col].length; row++) {
        if (this.nodeSymbols.indexOf(dataT[col][row]) != -1) {
          if (key == null) {
            key = this.constructKey(col+xoffset, row+yoffset);
          } else {
            otherkey = this.constructKey(col+xoffset, row+yoffset);
            this.nodesLUT[key].neighborNodes["DOWN"] = this.nodesLUT[otherkey]
            this.nodesLUT[otherkey].neighborNodes["UP"] = this.nodesLUT[key]
            key = otherkey
          }
        } else if (this.pathSymbols.indexOf(dataT[col][row]) == -1) {
          key = null;
        }
      }
    }
  }

  //src: https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
  transpose(matrix) {
    const rows = matrix.length, cols = matrix[0].length;
    const grid = [];
    for (let j = 0; j < cols; j++) {
      grid[j] = Array(rows);
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[j][i] = matrix[i][j];
      }
    }
    return grid;
  }

  // return 1st node in this.nodesLUT object
  getStartTempNode = () => {
    // convert values in this.nodesLUT to array
    let nodes = Object.values(this.nodesLUT);
    return nodes[0];  // return 1st array entry
  }

  render = () => {
    let nodes = Object.values(this.nodesLUT);
    nodes.forEach(node => node.render());
  }

  getNodeFromTiles(col, row) {
    let xyKey = this.constructKey(col, row);
    if (xyKey in this.nodesLUT) return this.nodesLUT[xyKey];
    return null;
  }
}
