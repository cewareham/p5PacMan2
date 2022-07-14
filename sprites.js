class Spritesheet {
    constructor() {
        this.sheet = cc.spritesheet;
        const ww = parseInt(this.sheet.width/cc.BASETILEWIDTH * cc.TILEWIDTH);
        const hh = parseInt(this.sheet.height/cc.BASETILEHEIGHT * cc.TILEHEIGHT);
        this.sheet.resize(ww, hh);
    }

    getImage(x, y, w, h) {
        return (this.sheet.get(x*cc.TILEWIDTH, y*cc.TILEHEIGHT, w, h));
    }
}

class PacmanSprites extends Spritesheet {
    constructor(entity) {
        super();
        this.entity = entity;
        this.entity.image = this.getStartImage();
    }

    getStartImage() {
        return this.getImage(8, 0);
    }

    getImage(x, y) {
        return super.getImage(x, y, 2*cc.TILEWIDTH, 2*cc.TILEHEIGHT);
    }
}

class GhostSprites extends Spritesheet {
    constructor(entity) {
        super();
        this.x = {"BLINKY":0, "PINKY":2, "INKY":4, "CLYDE":6};
        this.entity = entity;
        this.entity.image = this.getStartImage();
    }

    getStartImage() {
        return this.getImage(this.x[this.entity.name], 4);
    }

    getImage(x, y) {
        return super.getImage(x, y, 2*cc.TILEWIDTH, 2*cc.TILEHEIGHT);
    }
}

class FruitSprites extends Spritesheet {
    constructor(entity) {
        super();
        this.entity = entity;
        this.entity.image = this.getStartImage();
    }

    getStartImage() {
        return this.getImage(16, 8);
    }

    getImage(x, y) {
        return super.getImage(x, y, 2*cc.TILEWIDTH, 2*cc.TILEHEIGHT);
    }
}

class LifeSprites extends Spritesheet {
    constructor(numlives) {
        super();
        this.images = [];
        this.resetLives(numlives);
    }

    removeImage() {
        if (this.images.length > 0)
            this.images.pop();
    }

    resetLives(numlives) {
        this.images = [];
        for (let ii=0; ii<numlives; ii++)
            this.images.push(this.getImage(0,0));
    }

    getImage(x, y) {
        return super.getImage(x, y, 2*cc.TILEWIDTH, 2*cc.TILEHEIGHT);
    }
}

class MazeSprites extends Spritesheet {
    constructor(maze, rotationArray) {
        super();
        this.data = maze;
        this.rotdata = rotationArray;
    }

    getImage(x, y) {
        return super.getImage(x, y, cc.TILEWIDTH, cc.TILEHEIGHT);
    }

    constructBackground(bg, y) {
        let isdigit = function(char) {
            return !isNaN(char);
        }
        // rotate image in offscreen buffer & return it
        let getRotatedImage = function(img, angle) {
            const ww = img.width;
            const hh = img.height;
            let bufr = createGraphics(ww, hh);
            bufr.push();
            bufr.angleMode(DEGREES);
            bufr.imageMode(CENTER)
            bufr.translate(ww/2, hh/2);
            bufr.rotate(angle);
            bufr.image(img, 0, 0);
            bufr.pop();
            let rotImg = bufr.get(0, 0, ww, hh);
            return rotImg;
        }
        for (let row=0; row<this.data.length; row++) {
            const mazeRow = this.data[row];
            const rotRow = this.rotdata[row];
            let sprite;
            for (let col=0; col<this.data[0].length; col++) {
                const char = mazeRow.charAt(col);
                if (isdigit(char)) {
                    const x = parseInt(char) + 12;
                    sprite = this.getImage(x, y);
                    const rotval = parseInt(rotRow.charAt(col));
                    if (rotval != 0) sprite = getRotatedImage(sprite, -rotval*90);
                    bg.image(sprite, col*cc.TILEWIDTH, row*cc.TILEHEIGHT);
                } else if (char == '=') {
                    sprite = this.getImage(10, 8);
                    bg.image(sprite, col*cc.TILEWIDTH, row*cc.TILEHEIGHT);
                }
            }
        }
        return bg;
    }
}
