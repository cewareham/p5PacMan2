class Fruit extends Entity {
    constructor(node) {
        super(node);
        this.name = "FRUIT";
        this.color = cc.GREEN;
        this.lifespan = 5;
        this.timer = 0;
        this.destroy = false;
        this.points = 100;
        this.setBetweenNodes("RIGHT");
    }

    update(dt) {
        this.timer += dt;
        if (this.timer >= this.lifespan) this.destroy = true;
    }
}