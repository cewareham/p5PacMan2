class Fruit extends Entity {
    constructor(node, level=0) {
        super(node);
        this.name = "FRUIT";
        this.color = cc.GREEN;
        this.lifespan = 5;
        this.timer = 0;
        this.destroy = false;
        this.points = 100 + level*20;
        this.setBetweenNodes("RIGHT");
        this.sprites = new FruitSprites(this, level);
    }

    update(dt) {
        this.timer += dt;
        if (this.timer >= this.lifespan) this.destroy = true;
    }
}
