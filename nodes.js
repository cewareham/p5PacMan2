class Node {
  constructor(x, y) {
    this.position = new Vector2(x, y);
    this.neighborNodes = {UP:null, DOWN:null, LEFT:null, RIGHT:null};
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
  constructor() {
    this.nodeList = [];
  }
  
  setupTestNodes() {
    let nodeA = new Node(80 ,80);
    let nodeB = new Node(160, 80);
    let nodeC = new Node(80, 160);
    let nodeD = new Node(160, 160);
    let nodeE = new Node(208, 160);
    let nodeF = new Node(80, 320);
    let nodeG = new Node(208, 320);
    nodeA.neighborNodes["RIGHT"] = nodeB; // neighbor node to right
    nodeA.neighborNodes["DOWN"] = nodeC;  // neighbor node down
    nodeB.neighborNodes["LEFT"] = nodeA;  // neighbor node to left, etc.
    nodeB.neighborNodes["DOWN"] = nodeD;
    nodeC.neighborNodes["UP"] = nodeA;
    nodeC.neighborNodes["RIGHT"] = nodeD;
    nodeC.neighborNodes["DOWN"] = nodeF;
    nodeD.neighborNodes["UP"] = nodeB;
    nodeD.neighborNodes["LEFT"] = nodeC;
    nodeD.neighborNodes["RIGHT"] = nodeE;
    nodeE.neighborNodes["LEFT"] = nodeD;
    nodeE.neighborNodes["DOWN"] = nodeG;
    nodeF.neighborNodes["UP"] = nodeC;
    nodeF.neighborNodes["RIGHT"] = nodeG;
    nodeG.neighborNodes["UP"] = nodeE;
    nodeG.neighborNodes["LEFT"] = nodeF;
    this.nodeList = [nodeA, nodeB, nodeC, nodeD, nodeE, nodeF, nodeG];
  }
  
  render = () => {
    this.nodeList.forEach(node => node.render());
  }
}
