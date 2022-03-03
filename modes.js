class MainMode {
    constructor() {
        this.timer = 0;
        this.scatter();
    }

    update = (dt) => {
        this.timer += dt;
        if (this.timer >= this.time) {
            if (this.mode == cc.SCATTER) this.chase();
            else if (this.mode == cc.CHASE) this.scatter();
        }
    }

    scatter() {
        this.mode = cc.SCATTER;
        this.time = 7;
        this.timer = 0;
    }

    chase() {
        this.mode = cc.CHASE;
        this.time = 20;
        this.timer = 0;
    }
}

class ModeController {
    constructor(entity) {
        this.timer = 0;
        this.time = null;
        this.mainmode = new MainMode();
        this.current = this.mainmode.mode;
        this.entity = entity;
    }

    update = (dt) => {
        this.mainmode.update(dt);
        this.current = this.mainmode.mode;
    }
}
