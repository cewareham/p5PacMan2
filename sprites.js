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