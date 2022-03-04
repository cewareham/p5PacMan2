class Ghost extends Entity {
    constructor(node, pacman=null) {
        super(node);
        this.name = "GHOST";
        this.points = 200;
        this.goalVector = new Vector2();
        this.directionMethod = this.goalDirection;
        this.pacman = pacman;
        this.mode = new ModeController(this);
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
        this.goalVector = this.pacman.positionVector;
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
    }
}
