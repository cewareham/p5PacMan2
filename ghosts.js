class Ghost extends Entity {
    constructor(node, pacman=null, blinky=null) {
        super(node);
        this.name = "GHOST";
        this.points = 200;
        this.goalVector = new Vector2();
        this.directionMethod = this.goalDirection;
        this.pacman = pacman;
        this.mode = new ModeController(this);
        this.blinky = blinky;
        this.homeNode = node;
    }

    reset() {
        super.reset();
        this.points = 200;
        this.directionMethod = this.goalDirection;
    }

    update = (dt) => {
        this.mode.update(dt);
        if (this.mode.current == cc.SCATTER) this.scatter();
        else if (this.mode.current == cc.CHASE) this.chase();
        super.update(dt);
    }

    scatter() {
        this.goalVector = new Vector2();
    }

    chase() {
        this.goalVector = this.pacman.position;
    }

    startFreight() {
        this.mode.setFreightMode();
        if (this.mode.current == cc.FREIGHT) {
            this.setSpeed(50);
            this.directionMethod = this.goalDirection;
        }
    }

    normalMode() {
        this.setSpeed(100);
        this.directionMethod = this.goalDirection;
        this.homeNode.denyAccess("DOWN", this);
    }

    spawn() {
        this.goalVector = this.spawnNode.position;
    }

    setSpawnNode(node) {
        this.spawnNode = node;
    }

    startSpawn() {
        this.mode.setSpawnMode();
        if (this.mode.current == cc.SPAWN) {
            this.setSpeed(150);
            this.directionMethod = this.goalDirection;
            this.spawn();
        }
    }
}

class Blinky extends Ghost {
    constructor(node, pacman=null, blinky=null) {
        super(node, pacman, blinky);
        this.name = "BLINKY";
        this.color = cc.RED;
        this.sprites = new GhostSprites(this);
    }
}

class Pinky extends Ghost {
    constructor(node, pacman=null, blinky=null) {
        super(node, pacman, blinky);
        this.name = "PINKY";
        this.color = cc.PINK;
        this.sprites = new GhostSprites(this);
    }

    scatter() {
        this.goalVector = new Vector2(cc.TILEWIDTH*cc.NCOLS, 0);
    }

    chase() {
        this.goalVector = this.pacman.position.add(this.pacman.dirVectors[this.pacman.dirString]);
        this.goalVector = this.goalVector.mul(cc.TILEWIDTH * 4);
    }
}

class Inky extends Ghost {
    constructor(node, pacman=null, blinky=null) {
        super(node, pacman, blinky);
        this.name = "INKY";
        this.color = cc.TEAL;
        this.sprites = new GhostSprites(this);
    }

    scatter() {
        this.goalVector = new Vector2(cc.TILEWIDTH*cc.NCOLS, cc.TILEHEIGHT*cc.NROWS);
    }

    chase() {
        let vec1 = this.pacman.position.add(this.pacman.dirVectors[this.pacman.dirString]);
        vec1 = vec1.mul(cc.TILEWIDTH * 2);
        let bPos = this.blinky.position;
        let vec2 = vec1.sub(bPos);
        vec2 = vec2.mul(2);
        this.goalVector = bPos.add(vec2);
    }
}

class Clyde extends Ghost {
    constructor(node, pacman=null, blinky=null) {
        super(node, pacman, blinky);
        this.name = "CLYDE";
        this.color = cc.ORANGE;
        this.sprites = new GhostSprites(this);
    }

    scatter() {
        this.goalVector = new Vector2(0, cc.TILEHEIGHT*cc.NROWS);
    }

    chase() {
        let d = this.pacman.position.sub(this.position);
        let ds = d.magnitudeSquared();
        if (ds <= Math.pow(cc.TILEWIDTH*8, 2)) {
            this.scatter()
        } else {
            this.goalVector = this.pacman.position.add(this.pacman.dirVectors[this.pacman.dirString]);
            this.goalVector = this.goalVector.mul(cc.TILEWIDTH * 4);    
        }
    }
}

class GhostGroup {
    constructor(node, pacman) {
        this.blinky = new Blinky(node, pacman);
        this.pinky = new Pinky(node, pacman);
        this.inky = new Inky(node, pacman, this.blinky);
        this.clyde = new Clyde(node, pacman);
        this.ghosts = [this.blinky, this.pinky, this.inky, this.clyde];
    }

    update = (dt) => {
        for (const ghost of this.ghosts) {
            ghost.update(dt)
        }
    }

    startFreight() {
        for (const ghost of this.ghosts) {
            ghost.startFreight()
        }
        this.resetPoints();
    }

    setSpawnNode(node) {
        for (const ghost of this.ghosts) {
            ghost.setSpawnNode(node);
        }
    }

    updatePoints() {
        for (const ghost of this.ghosts) {
            ghost.points *= 2;
        }
    }

    resetPoints() {
        for (const ghost of this.ghosts) {
            ghost.points = 200;
        }
    }

    reset() {
        for (const ghost of this.ghosts) {
            ghost.reset();
        }
    }

    hide() {
        for (const ghost of this.ghosts) {
            ghost.visible = false;
        }
    }

    show() {
        for (const ghost of this.ghosts) {
            ghost.visible = true;
        }
    }

    render = () => {
        for (const ghost of this.ghosts) {
            ghost.render();
        }
    }
}
