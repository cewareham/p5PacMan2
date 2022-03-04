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
        let ary = [cc.SCATTER, cc.CHASE];
        this.mainmode.update(dt);
        if (this.current == cc.FREIGHT) {
            this.timer += dt;
            if (this.timer >= this.time) {
                this.time = null;
                this.entity.normalMode();
                this.current = this.mainmode.mode;
            }
        } else if (ary.includes(this.current)) {
            this.current = this.mainmode.mode;
        }
        if (this.current == cc.SPAWN) {
            if (this.entity.node == this.entity.spawnNode) {
                this.entity.normalMode();
                this.current = this.mainmode.mode;
            }
        }
    }

    setSpawnMode() {
        if (this.current == cc.FREIGHT) this.current = cc.SPAWN;
    }

    setFreightMode() {
        let ary = [cc.SCATTER, cc.CHASE];
        if (ary.includes(this.current)) {
            this.timer = 0;
            this.time = 7;
            this.current = cc.FREIGHT;
        } else if (this.current == cc.FREIGHT) this.timer = 0;
    }
}
