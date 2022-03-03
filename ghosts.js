class Ghost extends Entity {
    constructor(node) {
        super(node);
        this.name = "GHOST";
        this.points = 200;
        this.goalVector = new Vector2();
        this.directionMethod = this.goalDirection;
    }
}
