class Pellet {
    constructor(row, column) {
        this.name = "PELLET";
        this.position = new Vector2(column*cc.TILEWIDTH, row*cc.TILEHEIGHT);
        this.color = cc.WHITE;
        this.radius = (4 * cc.TILEWIDTH / 16)|0;
        this.diam = this.radius*2;
        this.collideRadius = (4 * cc.TILEWIDTH / 16)|0;
        this.points = 10;
        this.visible = true;
    }

    render = () => {
        if (this.visible) {
            let p = this.position.asInt();
            push();
            fill(this.color);
            noStroke();
            circle(p.x, p.y, this.diam);
            pop();
        }
    }
}

class PowerPellet extends Pellet {
    constructor(row, column) {
        super(row, column);
        this.name = "POWERPELLET";
        this.radius = (8 * cc.TILEWIDTH / 16)|0;
        this.diam = this.radius*2;
        this.points = 50;
        this.flashTime = 0.2;
        this.timer = 0;
    }

    update(dt) {
        this.timer += dt;
        if (this.timer >= this.flashTime) {
            this.visible = !this.visible;
            this.timer = 0;
        }
    }
}

class PelletGroup {
    constructor(theMaze) {
        this.maze = theMaze;
        this.pelletList = [];
        this.powerpellets = [];
        this.createPelletList(this.maze);
        this.numEaten = 0;
    }

    update = (dt) => {
        for (let powerpellet of this.powerpellets) {
            powerpellet.update(dt);
        }
    }

    render = () => {
        for (let pellet of this.pelletList) {
            pellet.render();
        }
    }

    createPelletList(data) {
        let row, col;
        let sym1 = ['.', '+'];
        let sym2 = ['P', 'p'];
        for (row=0; row<data.length; row++) {
            for (col=0; col<data[row].length; col++) {
                // is char from maze in sym1 array?
                if (sym1.indexOf(data[row][col]) != -1) {
                    this.pelletList.push(new Pellet(row, col));
                } else if (sym2.indexOf(data[row][col]) != -1) {
                    let pp = new PowerPellet(row, col);
                    this.pelletList.push(pp);
                    this.powerpellets.push(pp);
                }
            }
        }
    }

    isEmpty() {
        if (this.pelletList.length == 0) return true;
        return false;
    }
}