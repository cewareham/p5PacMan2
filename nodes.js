class Node {
  constructor(x, y) {
    this.position = new Vector2(x, y);
    this.neighborNodes = {UP:null, DOWN:null, LEFT:null, RIGHT:null, PORTAL:null};
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
    this.nodeList = [];
    this.nodesLUT = {};
    this.nodeSymbols = ['+'];
    this.pathSymbols = ['.'];
    this.createNodeTable(this.maze);
    this.connectHorizontally(this.maze);
    this.connectVertically(this.maze);
  }

  setPortalPair(pair1, pair2) {
    let coord1 = this.constructKey(pair1.x, pair1.y);
    let key1 = coord1.x+"-"+coord1.y;
    let coord2 = this.constructKey(pair2.x, pair2.y);
    let key2 = coord2.x+"-"+coord2.y;
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
          let coord = this.constructKey(col+xoffset, row+yoffset);
          this.nodesLUT[coord.x+"-"+coord.y] = new Node(coord.x, coord.y);
        }
      }
    }
  }

  connectHorizontally(data, xoffset=0, yoffset=0) {
    let row, col, key, otherkey, coord;
    for (row=0; row<data.length; row++) {
      key = null;
      for (col=0; col<data[row].length; col++) {
        // is char from maze in this.nodeSymbols array?
        if (this.nodeSymbols.indexOf(data[row][col]) != -1) {
          if (key == null) {
            coord = this.constructKey(col+xoffset, row+yoffset);
            key = coord.x+"-"+coord.y;
          } else {
            coord = this.constructKey(col+xoffset, row+yoffset);
            otherkey = coord.x+"-"+coord.y;
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
            coord = this.constructKey(col+xoffset, row+yoffset);
            key = coord.x+"-"+coord.y;
          } else {
            coord = this.constructKey(col+xoffset, row+yoffset);
            otherkey = coord.x+"-"+coord.y;
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

  constructKey(x, y) {
    return {x:x*cc.TILEWIDTH, y:y*cc.TILEHEIGHT};
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
}
