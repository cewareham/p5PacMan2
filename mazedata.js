class MazeBase {
    constructor() {
        this.portalPairs = {};
        this.homeoffset = {x:0, y:0};
        this.ghostNodeDeny = {UP:{}, DOWN:{}, LEFT:{}, RIGHT:{}};
    }

    setPortalPairs(nodes) {
        for (const[key, value] of Object.entries(this.portalPairs)) {
            const pair1 = value[0];
            const pair2 = value[1];
            nodes.setPortalPair(pair1, pair2);
        }
    }

    connectHomeNodes(nodes) {
        const key = nodes.createHomeNodes(this.homeoffset.x, this.homeoffset.y);
        nodes.connectHomeNodes(key, this.homenodeconnectLeft, "LEFT");
        nodes.connectHomeNodes(key, this.homenodeconnectRight, "RIGHT");
    }

    addOffset(x, y) {
        return {x:x+this.homeoffset.x, y:y+this.homeoffset.y};
    }

    denyGhostsAccess(ghosts, nodes) {
        let aof = this.addOffset(2, 3);
        nodes.denyAccessList(aof.x, aof.y, "LEFT", ghosts);
        nodes.denyAccessList(aof.x, aof.y, "RIGHT", ghosts);

        for (const[key, value] of Object.entries(this.ghostNodeDeny)) {
            nodes.denyAccessList(value.x, value.y, key, ghosts);
        }
    }
}

class Maze1 extends MazeBase {
    constructor() {
        super();
        this.name = "maze1";
        this.maze = maze1;
        this.mazeRot = maze1_rotation;
        this.portalPairs = {0:[{x:0, y:17}, {x:27, y:17}]};
        this.homeoffset = {x:11.5, y:14};
        this.homenodeconnectLeft = "12-14";//{x:12, y:14};
        this.homenodeconnectRight = "15-14";//{x:15, y:14};
        this.pacmanStart = {x:15, y:26};
        this.fruitStart = {x:9, y:20};
        let aof = this.addOffset(2, 3);
        this.ghostNodeDeny = {    UP:[{x:12, y:14}, {x:15, y:14}, {x:12, y:26}, {x:15, y:26}],
                                LEFT:[{x:aof.x, y:aof.y}],
                               RIGHT:[{x:aof.x, y:aof.y}]
                            };
    }
}

class Maze2 extends MazeBase {
    constructor() {
        super();
        this.name = "maze2";
        this.maze = maze2;
        this.mazeRot = maze2_rotation;
        this.portalPairs = {0:[{x:0, y:4}, {x:27, y:4}], 1:[{x:0, y:26}, {x:27, y:26}]};
        this.homeoffset = {x:11.5, y:14};
        this.homenodeconnectLeft = "9-14";//{x:9, y:14};
        this.homenodeconnectRight = "18-14";//{x:18, y:14};
        this.pacmanStart = {x:16, y:26};
        this.fruitStart = {x:11, y:20};
        let aof = this.addOffset(2, 3);
        this.ghostNodeDeny = {    UP:[{x:9, y:14}, {x:18, y:14}, {x:11, y:23}, {x:16, y:23}],
                                LEFT:[{x:aof.x, y:aof.y}],
                               RIGHT:[{x:aof.x, y:aof.y}]
                            };
    }
}

class MazeData {
    constructor() {
        this.obj = null;
        this.mazedict = {0:Maze1, 1:Maze2};
    }

    loadMaze(level) {
        const len = Object.keys(this.mazedict).length;  // get length of mazedict object
        this.obj = new this.mazedict[level%len]();      // new Maze1() or new Maze2() class
    }
}
